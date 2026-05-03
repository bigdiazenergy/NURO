import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Lesson } from '../types';
import { COLORS, SPACING, RADIUS, SHADOW, TYPOGRAPHY } from '../lib/theme';
import { CategoryBadge } from './CategoryBadge';

interface LessonCardProps {
  lesson: Lesson;
  onPress: () => void;
  completed: boolean;
}

export function LessonCard({ lesson, onPress, completed }: LessonCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, completed && styles.cardCompleted]}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`${lesson.title}${completed ? ', completed' : ''}`}
    >
      <View style={styles.topRow}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {lesson.title}
          </Text>
        </View>
        {completed && (
          <View style={styles.completedBadge}>
            <Text style={styles.completedIcon}>✓</Text>
          </View>
        )}
      </View>

      <Text style={styles.summary} numberOfLines={2}>
        {lesson.summary}
      </Text>

      <View style={styles.footer}>
        <CategoryBadge category={lesson.category} />
        <Text style={styles.time}>{lesson.estimatedMinutes} min</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.card,
  },
  cardCompleted: {
    borderColor: COLORS.success + '40',
    backgroundColor: '#FAFFFE',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    ...TYPOGRAPHY.subtitle,
    fontSize: 16,
  },
  completedBadge: {
    width: 24,
    height: 24,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.sm,
    flexShrink: 0,
  },
  completedIcon: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
  summary: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
    lineHeight: 18,
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  time: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
  },
});
