import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { COLORS, SPACING, RADIUS, SHADOW, TYPOGRAPHY } from '../lib/theme';
import { LESSONS } from '../sample-data/lessons';
import { CATEGORIES } from '../sample-data/categories';
import { useProgress } from '../hooks/useProgress';
import { getCategoryProgress } from '../lib/progress';
import { ProgressBar } from '../components/ProgressBar';
import { CategoryBadge } from '../components/CategoryBadge';
import { getLessonById } from '../sample-data/lessons';

type Props = CompositeScreenProps<
  BottomTabScreenProps<{ Home: undefined; Progress: undefined; Saved: undefined }, 'Progress'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function ProgressScreen({ navigation }: Props) {
  const { progress, loading, refresh } = useProgress();

  useEffect(() => {
    const unsubscribe = (navigation as any).addListener?.('focus', () => {
      refresh();
    });
    return unsubscribe;
  }, [navigation, refresh]);

  const completedCount = progress.completedLessonIds.length;
  const totalCount = LESSONS.length;
  const streak = progress.streak;

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Your progress</Text>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{completedCount}</Text>
            <Text style={styles.statLabel}>of {totalCount}{'\n'}lessons done</Text>
          </View>
          {streak > 0 && (
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{streak}</Text>
              <Text style={styles.statLabel}>{streak === 1 ? 'day\nstreak' : 'day\nstreak'}</Text>
            </View>
          )}
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{progress.focusAreas.length}</Text>
            <Text style={styles.statLabel}>{progress.focusAreas.length === 1 ? 'topic\nselected' : 'topics\nselected'}</Text>
          </View>
        </View>

        {/* Overall progress */}
        <View style={styles.overallCard}>
          <Text style={styles.overallLabel}>Overall</Text>
          <ProgressBar current={completedCount} total={totalCount} />
        </View>

        {/* Per-category progress */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>By topic</Text>
          {CATEGORIES.map((cat) => {
            const { completed, total } = getCategoryProgress(cat.id, progress, LESSONS);
            return (
              <View key={cat.id} style={styles.categoryRow}>
                <View style={styles.categoryRowTop}>
                  <Text style={styles.categoryRowEmoji}>{cat.icon}</Text>
                  <Text style={styles.categoryRowTitle}>{cat.title}</Text>
                  <Text style={styles.categoryRowCount}>{completed}/{total}</Text>
                </View>
                <ProgressBar current={completed} total={total} showLabel={false} />
              </View>
            );
          })}
        </View>

        {/* Completed lessons list */}
        {completedCount > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Completed</Text>
            {progress.completedLessonIds.map((id) => {
              const lesson = getLessonById(id);
              if (!lesson) return null;
              return (
                <View key={id} style={styles.completedItem}>
                  <View style={styles.completedCheck}>
                    <Text style={styles.completedCheckIcon}>✓</Text>
                  </View>
                  <View style={styles.completedItemText}>
                    <Text style={styles.completedTitle}>{lesson.title}</Text>
                    <CategoryBadge category={lesson.category} />
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {completedCount === 0 && (
          <View style={styles.emptySection}>
            <Text style={styles.emptyText}>No lessons completed yet.</Text>
            <Text style={styles.emptySubText}>
              Go to a topic on the Home tab and open any lesson to get started.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  title: {
    ...TYPOGRAPHY.title,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    ...SHADOW.card,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 2,
  },
  statLabel: {
    ...TYPOGRAPHY.small,
    textAlign: 'center',
  },
  overallCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
    ...SHADOW.card,
  },
  overallLabel: {
    ...TYPOGRAPHY.smallBold,
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
    letterSpacing: 0.5,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionLabel: {
    ...TYPOGRAPHY.smallBold,
    color: COLORS.textMuted,
    letterSpacing: 0.8,
    marginBottom: SPACING.sm,
  },
  categoryRow: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
    ...SHADOW.card,
  },
  categoryRowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  categoryRowEmoji: {
    fontSize: 16,
    marginRight: SPACING.sm,
  },
  categoryRowTitle: {
    ...TYPOGRAPHY.label,
    flex: 1,
  },
  categoryRowCount: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
  },
  completedItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
    ...SHADOW.card,
  },
  completedCheck: {
    width: 24,
    height: 24,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
    flexShrink: 0,
    marginTop: 2,
  },
  completedCheckIcon: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 13,
  },
  completedItemText: {
    flex: 1,
  },
  completedTitle: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  emptySection: {
    paddingVertical: SPACING.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
    marginBottom: SPACING.xs,
  },
  emptySubText: {
    ...TYPOGRAPHY.small,
    textAlign: 'center',
    color: COLORS.textMuted,
  },
});
