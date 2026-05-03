import React, { useMemo, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { COLORS, SPACING, RADIUS, SHADOW, TYPOGRAPHY } from '../lib/theme';
import { getEmergencyLessonById, EmergencyLesson } from '../sample-data/emergencyLessons';
import { AudioBar } from '../components/AudioBar';
import { CprMetronome } from '../components/CprMetronome';
import { useAudio } from '../hooks/useAudio';

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
const CATEGORY_LABELS: Record<EmergencyLesson['category'], string> = {
  cardiac: 'Cardiac',
  breathing: 'Breathing',
  neurological: 'Neurological',
  trauma: 'Trauma',
  environmental: 'Environmental',
  mental: 'Mental Health',
};

// ─── Types ────────────────────────────────────────────────────────────────────
type Props = NativeStackScreenProps<RootStackParamList, 'EmergencyLesson'>;

// ─── Component ────────────────────────────────────────────────────────────────
export function EmergencyLessonScreen({ route, navigation }: Props) {
  const { lessonId } = route.params;
  const lesson = getEmergencyLessonById(lessonId);
  const audio = useAudio();

  // Stop audio when navigating away
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', audio.stop);
    return unsubscribe;
  }, [navigation, audio.stop]);

  // Build audio chunks: intro + steps + doNotDo
  const audioChunks = useMemo(() => {
    if (!lesson) return [];
    const intro = `${lesson.title}. ${CATEGORY_LABELS[lesson.category]} emergency. Severity: ${SEVERITY_LABELS[lesson.severity]}.`;
    const steps = lesson.steps.map(
      (s, i) => `Step ${i + 1}. ${s.text}.${s.detail ? ' ' + s.detail : ''}`
    );
    const doNots = lesson.doNotDo?.map((d) => `Do not: ${d}`) ?? [];
    return [intro, ...steps, ...doNots];
  }, [lesson]);

  if (!lesson) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Guide not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const severityColor = SEVERITY_COLORS[lesson.severity];

  // Determine which step indices contain compressions (for showing metronome)
  const compressionStepIndices = lesson.id === 'cpr-adult'
    ? lesson.steps.reduce<number[]>((acc, s, i) => {
        if (s.text.toLowerCase().includes('compress')) acc.push(i);
        return acc;
      }, [])
    : [];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.headerIcon}>{lesson.icon}</Text>
          <Text style={styles.title}>{lesson.title}</Text>

          <View style={styles.badgeRow}>
            {/* Severity badge */}
            <View style={[styles.badge, { backgroundColor: severityColor + '18' }]}>
              <Text style={[styles.badgeText, { color: severityColor }]}>
                {SEVERITY_LABELS[lesson.severity]}
              </Text>
            </View>
            {/* Category badge */}
            <View style={[styles.badge, { backgroundColor: COLORS.primary + '15' }]}>
              <Text style={[styles.badgeText, { color: COLORS.primary }]}>
                {CATEGORY_LABELS[lesson.category]}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Audio bar ── */}
        <AudioBar
          audio={audio}
          chunks={audioChunks}
          totalItems={lesson.steps.length}
          itemLabel="step"
        />

        {/* ── Steps ── */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>What to do</Text>
          {lesson.steps.map((step, index) => {
            const isHighlighted =
              audio.currentIndex > 0 && audio.currentIndex - 1 === index;
            const showMetronome = compressionStepIndices.includes(index);

            return (
              <View key={step.id}>
                <View
                  style={[
                    styles.stepRow,
                    isHighlighted && styles.stepRowHighlighted,
                  ]}
                >
                  <View
                    style={[
                      styles.stepNum,
                      isHighlighted && styles.stepNumHighlighted,
                    ]}
                  >
                    <Text
                      style={[
                        styles.stepNumText,
                        isHighlighted && styles.stepNumTextHighlighted,
                      ]}
                    >
                      {index + 1}
                    </Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text
                      style={[
                        styles.stepText,
                        isHighlighted && styles.stepTextHighlighted,
                      ]}
                    >
                      {step.text}
                    </Text>
                    {step.detail ? (
                      <Text style={styles.stepDetail}>{step.detail}</Text>
                    ) : null}
                  </View>
                </View>
                {/* Insert CPR Metronome after compressions step */}
                {showMetronome && <CprMetronome />}
              </View>
            );
          })}
        </View>

        {/* ── Do Not Do section ── */}
        {lesson.doNotDo && lesson.doNotDo.length > 0 && (
          <View style={styles.doNotDoSection}>
            <Text style={styles.doNotDoHeading}>🚫  Common mistakes to avoid</Text>
            {lesson.doNotDo.map((item, i) => (
              <View key={i} style={styles.doNotDoRow}>
                <Text style={styles.doNotDoBullet}>✕</Text>
                <Text style={styles.doNotDoText}>{item}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ── Disclaimer ── */}
        {lesson.disclaimer && (
          <View style={styles.disclaimerBox}>
            <Text style={styles.disclaimerText}>⚠️  {lesson.disclaimer}</Text>
          </View>
        )}

        {/* ── Practice button ── */}
        <TouchableOpacity
          style={styles.practiceButton}
          onPress={() => {
            audio.stop();
            navigation.navigate('EmergencyRightNow', { lessonId: lesson.id });
          }}
          activeOpacity={0.85}
          accessibilityRole="button"
        >
          <Text style={styles.practiceButtonText}>🚨  Practice this step-by-step</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          Always call 911 in a real emergency. This guide is for reference only.
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
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
  },
  container: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },

  // ── Header ──
  header: {
    marginBottom: SPACING.lg,
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 52,
    marginBottom: SPACING.sm,
  },
  title: {
    ...TYPOGRAPHY.title,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  badge: {
    borderRadius: RADIUS.full,
    paddingVertical: 4,
    paddingHorizontal: SPACING.md,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // ── Section ──
  section: {
    marginBottom: SPACING.lg,
  },
  sectionHeading: {
    ...TYPOGRAPHY.subtitle,
    marginBottom: SPACING.md,
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
  stepNum: {
    width: 30,
    height: 30,
    borderRadius: RADIUS.full,
    backgroundColor: EMERGENCY_RED + '15',
    borderWidth: 1.5,
    borderColor: EMERGENCY_RED + '40',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
    flexShrink: 0,
    marginTop: 2,
  },
  stepNumHighlighted: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  stepNumText: {
    fontSize: 13,
    fontWeight: '800',
    color: EMERGENCY_RED,
  },
  stepNumTextHighlighted: {
    color: COLORS.white,
  },
  stepContent: {
    flex: 1,
  },
  stepText: {
    ...TYPOGRAPHY.body,
    fontWeight: '700',
    fontSize: 17,
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

  // ── Do Not Do ──
  doNotDoSection: {
    backgroundColor: EMERGENCY_RED + '06',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderLeftWidth: 4,
    borderColor: EMERGENCY_RED + '20',
    borderLeftColor: EMERGENCY_RED,
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  doNotDoHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: EMERGENCY_RED,
    marginBottom: SPACING.sm,
  },
  doNotDoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
  },
  doNotDoBullet: {
    fontSize: 13,
    fontWeight: '800',
    color: EMERGENCY_RED,
    width: 14,
    marginTop: 2,
  },
  doNotDoText: {
    flex: 1,
    ...TYPOGRAPHY.body,
    fontSize: 15,
    lineHeight: 22,
  },

  // ── Disclaimer ──
  disclaimerBox: {
    backgroundColor: '#FEF9C3',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#FDE047',
    marginBottom: SPACING.lg,
  },
  disclaimerText: {
    fontSize: 13,
    color: '#713F12',
    lineHeight: 19,
  },

  // ── Practice button ──
  practiceButton: {
    backgroundColor: EMERGENCY_RED,
    paddingVertical: SPACING.md + 4,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
    shadowColor: EMERGENCY_RED,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  practiceButtonText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '800',
  },

  footer: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: SPACING.sm,
  },
});
