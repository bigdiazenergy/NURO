import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { COLORS, SPACING, RADIUS, SHADOW, TYPOGRAPHY } from '../lib/theme';
import { EMERGENCY_LESSONS, EmergencyLesson } from '../sample-data/emergencyLessons';

// ─── Constants ────────────────────────────────────────────────────────────────
const EMERGENCY_RED = '#DC2626';
const SEVERITY_COLORS: Record<EmergencyLesson['severity'], string> = {
  critical: EMERGENCY_RED,
  serious: '#EA580C',
  moderate: '#CA8A04',
};
const SEVERITY_LABELS: Record<EmergencyLesson['severity'], string> = {
  critical: 'Critical',
  serious: 'Serious',
  moderate: 'Moderate',
};

// Sort order: critical first, then serious, then moderate
const SORTED_LESSONS = [...EMERGENCY_LESSONS].sort((a, b) => {
  const order = { critical: 0, serious: 1, moderate: 2 };
  return order[a.severity] - order[b.severity];
});

// ─── Types ────────────────────────────────────────────────────────────────────
type Props = NativeStackScreenProps<RootStackParamList, 'EmergencyTopicPicker'>;

// ─── Component ────────────────────────────────────────────────────────────────
export function EmergencyTopicPickerScreen({ navigation }: Props) {
  function handleSelect(lessonId: string) {
    navigation.replace('EmergencyRightNow', { lessonId });
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Fixed header — always visible */}
      <View style={styles.header}>
        <Text style={styles.callBadge}>🚨  EMERGENCY MODE</Text>
        <Text style={styles.heading}>What's happening?</Text>
        <Text style={styles.subheading}>Tap the situation to get step-by-step help right now</Text>
      </View>

      {/* Scrollable list of topics */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        bounces
      >
        {SORTED_LESSONS.map((lesson) => (
          <TouchableOpacity
            key={lesson.id}
            style={[
              styles.row,
              lesson.severity === 'critical' && styles.rowCritical,
            ]}
            onPress={() => handleSelect(lesson.id)}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel={`${lesson.title} — ${SEVERITY_LABELS[lesson.severity]}`}
          >
            <Text style={styles.rowIcon}>{lesson.icon}</Text>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>{lesson.title}</Text>
              <View
                style={[
                  styles.severityBadge,
                  { backgroundColor: SEVERITY_COLORS[lesson.severity] + '18' },
                ]}
              >
                <Text
                  style={[
                    styles.severityText,
                    { color: SEVERITY_COLORS[lesson.severity] },
                  ]}
                >
                  {SEVERITY_LABELS[lesson.severity]}
                </Text>
              </View>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.footer}>
          Always call 911 in a life-threatening emergency.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // ── Header ──
  header: {
    backgroundColor: EMERGENCY_RED,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  callBadge: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.white,
    opacity: 0.85,
    letterSpacing: 1.5,
    marginBottom: SPACING.sm,
  },
  heading: {
    fontSize: 30,
    fontWeight: '900',
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  subheading: {
    fontSize: 15,
    color: COLORS.white,
    opacity: 0.9,
    lineHeight: 21,
  },

  // ── List ──
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xxl,
    gap: SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.card,
  },
  rowCritical: {
    borderColor: EMERGENCY_RED + '40',
    borderWidth: 1.5,
  },
  rowIcon: {
    fontSize: 38,
    marginRight: SPACING.md,
    width: 50,
    textAlign: 'center',
  },
  rowText: {
    flex: 1,
    gap: SPACING.xs,
  },
  rowTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    lineHeight: 26,
  },
  severityBadge: {
    alignSelf: 'flex-start',
    borderRadius: RADIUS.full,
    paddingVertical: 3,
    paddingHorizontal: SPACING.sm,
  },
  severityText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  arrow: {
    fontSize: 28,
    color: COLORS.textMuted,
    fontWeight: '300',
    marginLeft: SPACING.sm,
  },

  footer: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SPACING.lg,
  },
});
