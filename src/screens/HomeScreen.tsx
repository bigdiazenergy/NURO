import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootStackParamList } from '../types';
import { COLORS, SPACING, RADIUS, SHADOW, TYPOGRAPHY } from '../lib/theme';
import { CATEGORIES } from '../sample-data/categories';
import { LESSONS } from '../sample-data/lessons';
import { useProgress } from '../hooks/useProgress';
import { useReminders } from '../hooks/useReminders';
import { getNextSuggestedLesson } from '../lib/progress';

type Props = CompositeScreenProps<
  BottomTabScreenProps<{ Home: undefined; Progress: undefined; Saved: undefined }, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function HomeScreen({ navigation }: Props) {
  const { progress, loading: progressLoading, refresh: refreshProgress } = useProgress();
  const { reminders, loading: remindersLoading, toggleComplete, refresh: refreshReminders } = useReminders();

  useEffect(() => {
    const unsubscribe = (navigation as any).addListener?.('focus', () => {
      refreshProgress();
      refreshReminders();
    });
    return unsubscribe;
  }, [navigation, refreshProgress, refreshReminders]);

  const nextLesson = getNextSuggestedLesson(progress, LESSONS);
  const completedCount = progress.completedLessonIds.length;
  const activeReminders = reminders.filter((r) => !r.completed);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <Text style={styles.greeting}>
            {completedCount > 0 ? 'Welcome back.' : 'Here’s where to start.'}
          </Text>
          {completedCount > 0 && (
            <Text style={styles.subGreeting}>
              {completedCount} {completedCount === 1 ? 'lesson' : 'lessons'} completed.
            </Text>
          )}
        </View>

        {nextLesson && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Continue where you left off</Text>
            <TouchableOpacity
              style={styles.nextCard}
              onPress={() =>
                (navigation as any).navigate('LessonDetail', { lessonId: nextLesson.id })
              }
              activeOpacity={0.8}
            >
              <Text style={styles.nextCardTitle}>{nextLesson.title}</Text>
              <Text style={styles.nextCardSummary} numberOfLines={2}>
                {nextLesson.summary}
              </Text>
              <Text style={styles.nextCardLink}>Open lesson →</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Topics</Text>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryCard}
              onPress={() =>
                (navigation as any).navigate('LessonList', {
                  category: cat.id,
                  title: cat.title,
                })
              }
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={`${cat.title} — ${cat.description}`}
            >
              <View style={[styles.categoryIcon, { backgroundColor: cat.color + '18' }]}>
                <Text style={styles.categoryEmoji}>{cat.icon}</Text>
              </View>
              <View style={styles.categoryText}>
                <Text style={styles.categoryTitle}>{cat.title}</Text>
                <Text style={styles.categoryDesc} numberOfLines={1}>
                  {cat.description}
                </Text>
              </View>
              <Text style={styles.categoryArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionLabel}>Reminders</Text>
            <TouchableOpacity
              onPress={() => (navigation as any).navigate('ReminderSetup', {})}
              activeOpacity={0.7}
            >
              <Text style={styles.sectionAction}>Add</Text>
            </TouchableOpacity>
          </View>

          {!remindersLoading && activeReminders.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No reminders set yet.</Text>
              <Text style={styles.emptySubText}>
                Open any lesson to set a reminder, or tap Add above.
              </Text>
            </View>
          ) : (
            activeReminders.map((reminder) => (
              <View key={reminder.id} style={styles.reminderRow}>
                <View style={styles.reminderRowText}>
                  <Text style={styles.reminderRowTitle} numberOfLines={1}>
                    {reminder.title}
                  </Text>
                  {reminder.repeatRule !== 'none' && (
                    <Text style={styles.reminderRowRepeat}>{reminder.repeatRule}</Text>
                  )}
                </View>
                <TouchableOpacity
                  onPress={() => toggleComplete(reminder.id)}
                  style={styles.reminderDoneButton}
                  activeOpacity={0.7}
                  accessibilityLabel={`Mark ${reminder.title} as done`}
                >
                  <Text style={styles.reminderDoneText}>Done</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
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
  headerSection: {
    marginBottom: SPACING.lg,
  },
  greeting: {
    ...TYPOGRAPHY.title,
  },
  subGreeting: {
    ...TYPOGRAPHY.bodyMuted,
    marginTop: SPACING.xs,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  sectionLabel: {
    ...TYPOGRAPHY.smallBold,
    color: COLORS.textMuted,
    letterSpacing: 0.8,
  },
  sectionAction: {
    ...TYPOGRAPHY.small,
    color: COLORS.primary,
    fontWeight: '600',
  },
  nextCard: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    ...SHADOW.card,
  },
  nextCardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  nextCardSummary: {
    fontSize: 14,
    color: COLORS.white + 'CC',
    lineHeight: 20,
    marginBottom: SPACING.sm,
  },
  nextCardLink: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 15,
  },
  categoryCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOW.card,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
    flexShrink: 0,
  },
  categoryEmoji: {
    fontSize: 20,
  },
  categoryText: {
    flex: 1,
  },
  categoryTitle: {
    ...TYPOGRAPHY.label,
    fontSize: 15,
    fontWeight: '600',
  },
  categoryDesc: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  categoryArrow: {
    fontSize: 22,
    color: COLORS.textMuted,
    marginLeft: SPACING.sm,
  },
  emptyCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.card,
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  emptySubText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
  },
  reminderRow: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOW.card,
  },
  reminderRowText: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  reminderRowTitle: {
    ...TYPOGRAPHY.body,
    fontWeight: '500',
  },
  reminderRowRepeat: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
    textTransform: 'capitalize',
    marginTop: 2,
  },
  reminderDoneButton: {
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  reminderDoneText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
});
