import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { COLORS, SPACING, RADIUS, SHADOW, TYPOGRAPHY } from '../lib/theme';
import { getLessonById } from '../sample-data/lessons';
import { CategoryBadge } from '../components/CategoryBadge';
import { AudioBar } from '../components/AudioBar';
import { useProgress } from '../hooks/useProgress';
import { useSaved } from '../hooks/useSaved';
import { useAudio } from '../hooks/useAudio';

type Props = NativeStackScreenProps<RootStackParamList, 'LessonDetail'>;
type TabKey = 'overview' | 'checklist' | 'scripts';

export function LessonDetailScreen({ route, navigation }: Props) {
  const { lessonId } = route.params;
  const lesson = getLessonById(lessonId);
  const { isComplete, markComplete, refresh } = useProgress();
  const { saveTool, savedTools } = useSaved();
  const audio = useAudio();
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  // Refresh progress when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', refresh);
    return unsubscribe;
  }, [navigation, refresh]);

  // Stop audio when navigating away
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', audio.stop);
    return unsubscribe;
  }, [navigation, audio.stop]);

  // Stop audio when switching tabs (content changes)
  useEffect(() => {
    audio.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  if (!lesson) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Lesson not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const completed = isComplete(lesson.id);
  const checklistSourceKey = useMemo(() => `checklist-${lesson.id}`, [lesson.id]);
  const checklistSaved = savedTools.some(
    (tool) => tool.type === 'checklist' && tool.sourceKey === checklistSourceKey
  );

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'checklist', label: 'Checklist' },
    ...(lesson.scripts.length > 0 ? [{ key: 'scripts' as TabKey, label: 'Scripts' }] : []),
  ];

  // ─── Audio chunks ────────────────────────────────────────────────────────────
  // We build a chunk per step so currentIndex maps 1:1 to step index.
  // The title+summary is read as an intro before step 0.
  const overviewChunks = useMemo(() => {
    const intro = `${lesson.title}. ${lesson.summary}.`;
    const steps = lesson.steps.map(
      (s, i) =>
        `Step ${i + 1}. ${s.text}.${s.detail ? ' ' + s.detail : ''}`
    );
    return [intro, ...steps];
  }, [lesson]);

  const checklistChunks = useMemo(
    () =>
      lesson.checklist.map(
        (item, i) =>
          `Item ${i + 1}. ${item.text}.${item.detail ? ' ' + item.detail : ''}`
      ),
    [lesson]
  );

  const scriptChunks = useMemo(
    () =>
      lesson.scripts.flatMap((script) => [
        `Script: ${script.title}. ${script.context}.`,
        ...script.lines,
      ]),
    [lesson]
  );

  function getActiveChunks(): string[] {
    if (activeTab === 'overview') return overviewChunks;
    if (activeTab === 'checklist') return checklistChunks;
    return scriptChunks;
  }

  function getActiveTotal(): number {
    if (activeTab === 'overview') return lesson.steps.length;
    if (activeTab === 'checklist') return lesson.checklist.length;
    return scriptChunks.length;
  }

  function getItemLabel(): string {
    if (activeTab === 'checklist') return 'item';
    if (activeTab === 'scripts') return 'line';
    return 'step';
  }

  // For the overview tab, step highlighting:
  // chunk 0 = intro (no step highlighted), chunk 1 = step[0], chunk 2 = step[1], …
  const highlightedStepIndex =
    activeTab === 'overview' && audio.currentIndex > 0
      ? audio.currentIndex - 1
      : -1;

  // ─── Handlers ────────────────────────────────────────────────────────────────
  async function handleMarkComplete() {
    await markComplete(lesson!.id);
    refresh();
  }

  async function handleSaveChecklist() {
    const content = lesson!.checklist.map((item) => `• ${item.text}`).join('\n');
    await saveTool({
      id: checklistSourceKey,
      sourceKey: checklistSourceKey,
      type: 'checklist',
      title: `${lesson!.title} — Checklist`,
      content,
      category: lesson!.category,
      savedAt: new Date().toISOString(),
    });
    Alert.alert(
      checklistSaved ? 'Checklist already saved' : 'Checklist saved',
      checklistSaved
        ? 'This checklist is already in your Saved tab.'
        : 'Saved. You can find it in the Saved tab.',
      [{ text: 'OK' }]
    );
  }

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <CategoryBadge category={lesson.category} />
          <Text style={styles.title}>{lesson.title}</Text>
          <Text style={styles.summary}>{lesson.summary}</Text>
          <Text style={styles.meta}>{lesson.estimatedMinutes} min</Text>
        </View>

        {/* Tab bar */}
        <View style={styles.tabBar}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.8}
              accessibilityRole="tab"
              accessibilityState={{ selected: activeTab === tab.key }}
            >
              <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Audio bar — sits between the tab bar and content */}
        <AudioBar
          audio={audio}
          chunks={getActiveChunks()}
          totalItems={getActiveTotal()}
          itemLabel={getItemLabel()}
        />

        {/* Tab content */}
        {activeTab === 'overview' && (
          <View style={styles.tabContent}>
            {lesson.steps.map((step, index) => {
              const isHighlighted = index === highlightedStepIndex;
              return (
                <View
                  key={step.id}
                  style={[styles.stepRow, isHighlighted && styles.stepRowHighlighted]}
                >
                  <View
                    style={[
                      styles.stepNumberWrap,
                      isHighlighted && styles.stepNumberWrapHighlighted,
                    ]}
                  >
                    <Text
                      style={[
                        styles.stepNumber,
                        isHighlighted && styles.stepNumberHighlighted,
                      ]}
                    >
                      {index + 1}
                    </Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text
                      style={[styles.stepText, isHighlighted && styles.stepTextHighlighted]}
                    >
                      {step.text}
                    </Text>
                    {step.detail ? (
                      <Text style={styles.stepDetail}>{step.detail}</Text>
                    ) : null}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {activeTab === 'checklist' && (
          <View style={styles.tabContent}>
            <TouchableOpacity
              style={styles.openFullButton}
              onPress={() => navigation.navigate('Checklist', { lessonId: lesson.id })}
              activeOpacity={0.8}
            >
              <Text style={styles.openFullButtonText}>Check items off as you go →</Text>
            </TouchableOpacity>
            {lesson.checklist.map((item, index) => {
              const isHighlighted = audio.currentIndex === index && activeTab === 'checklist';
              return (
                <View
                  key={item.id}
                  style={[styles.checkPreviewRow, isHighlighted && styles.checkRowHighlighted]}
                >
                  <View style={styles.checkPreviewDot} />
                  <View style={styles.checkPreviewText}>
                    <Text style={styles.checkPreviewTitle}>{item.text}</Text>
                    {item.detail ? (
                      <Text style={styles.checkPreviewDetail}>{item.detail}</Text>
                    ) : null}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {activeTab === 'scripts' && (
          <View style={styles.tabContent}>
            {lesson.scripts.map((script) => (
              <TouchableOpacity
                key={script.id}
                style={styles.scriptPreviewCard}
                onPress={() =>
                  navigation.navigate('Script', { lessonId: lesson.id, scriptId: script.id })
                }
                activeOpacity={0.8}
              >
                <Text style={styles.scriptPreviewTitle}>{script.title}</Text>
                <Text style={styles.scriptPreviewContext} numberOfLines={2}>
                  {script.context}
                </Text>
                <Text style={styles.scriptPreviewLines}>
                  {script.lines.length} lines — tap to view
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Action buttons */}
        <View style={styles.actions}>
          {completed ? (
            <View style={styles.completedBanner}>
              <Text style={styles.completedBannerText}>✓ Lesson complete</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.completeButton}
              onPress={handleMarkComplete}
              activeOpacity={0.85}
            >
              <Text style={styles.completeButtonText}>Mark as complete</Text>
            </TouchableOpacity>
          )}
          <View style={styles.secondaryActions}>
            <TouchableOpacity
              style={[styles.secondaryButton, checklistSaved && styles.secondaryButtonSaved]}
              onPress={handleSaveChecklist}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.secondaryButtonText,
                  checklistSaved && styles.secondaryButtonTextSaved,
                ]}
              >
                {checklistSaved ? 'Saved to Saved tab' : 'Save checklist'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('ReminderSetup', { lessonId: lesson.id })}
              activeOpacity={0.85}
            >
              <Text style={styles.secondaryButtonText}>Set reminder</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  title: {
    ...TYPOGRAPHY.title,
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  summary: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
    marginBottom: SPACING.xs,
  },
  meta: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  tab: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    marginRight: SPACING.xs,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    ...TYPOGRAPHY.label,
    color: COLORS.textMuted,
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  tabContent: {
    marginBottom: SPACING.lg,
  },

  // ── Step rows ──
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
    borderRadius: RADIUS.md,
    padding: SPACING.xs,
    marginHorizontal: -SPACING.xs,
  },
  stepRowHighlighted: {
    backgroundColor: COLORS.primary + '12',
  },
  stepNumberWrap: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary + '18',
    borderWidth: 1,
    borderColor: COLORS.primary + '40',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
    flexShrink: 0,
    marginTop: 2,
  },
  stepNumberWrapHighlighted: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  stepNumber: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  stepNumberHighlighted: {
    color: COLORS.white,
  },
  stepContent: {
    flex: 1,
  },
  stepText: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
  },
  stepTextHighlighted: {
    color: COLORS.primary,
  },
  stepDetail: {
    ...TYPOGRAPHY.small,
    marginTop: SPACING.xs,
    lineHeight: 18,
    color: COLORS.textMuted,
  },

  // ── Checklist preview ──
  openFullButton: {
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.md,
  },
  openFullButtonText: {
    ...TYPOGRAPHY.label,
    color: COLORS.primary,
    fontWeight: '600',
  },
  checkPreviewRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
    borderRadius: RADIUS.sm,
    padding: SPACING.xs,
    marginHorizontal: -SPACING.xs,
  },
  checkRowHighlighted: {
    backgroundColor: COLORS.primary + '12',
  },
  checkPreviewDot: {
    width: 6,
    height: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.border,
    marginTop: 8,
    marginRight: SPACING.sm,
    flexShrink: 0,
  },
  checkPreviewText: {
    flex: 1,
  },
  checkPreviewTitle: {
    ...TYPOGRAPHY.body,
  },
  checkPreviewDetail: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
    marginTop: 2,
  },

  // ── Script preview ──
  scriptPreviewCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
    ...SHADOW.card,
  },
  scriptPreviewTitle: {
    ...TYPOGRAPHY.subtitle,
    fontSize: 16,
    marginBottom: SPACING.xs,
  },
  scriptPreviewContext: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
    lineHeight: 18,
    marginBottom: SPACING.xs,
  },
  scriptPreviewLines: {
    ...TYPOGRAPHY.small,
    color: COLORS.primary,
    fontWeight: '600',
  },

  // ── Action buttons ──
  actions: {
    marginTop: SPACING.sm,
  },
  completeButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  completeButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  completedBanner: {
    backgroundColor: COLORS.success + '18',
    borderWidth: 1,
    borderColor: COLORS.success + '40',
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  completedBannerText: {
    color: COLORS.success,
    fontWeight: '600',
    fontSize: 15,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: SPACING.sm + 4,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  secondaryButtonSaved: {
    backgroundColor: COLORS.success + '14',
    borderColor: COLORS.success + '55',
  },
  secondaryButtonText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '500',
  },
  secondaryButtonTextSaved: {
    color: COLORS.success,
    fontWeight: '600',
  },
});
