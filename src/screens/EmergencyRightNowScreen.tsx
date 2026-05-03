import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Linking,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../lib/theme';
import { getEmergencyLessonById } from '../sample-data/emergencyLessons';
import { useAudio } from '../hooks/useAudio';
import { CprMetronome } from '../components/CprMetronome';

// ─── Constants ────────────────────────────────────────────────────────────────
const EMERGENCY_RED = '#DC2626';

// ─── Types ────────────────────────────────────────────────────────────────────
type Props = NativeStackScreenProps<RootStackParamList, 'EmergencyRightNow'>;

// ─── Helpers ─────────────────────────────────────────────────────────────────
function isCompressionsStep(text: string): boolean {
  const lower = text.toLowerCase();
  return lower.includes('compressions') || lower.includes('compress');
}

function call911() {
  Linking.openURL('tel:911').catch(() =>
    Alert.alert('Call 911', 'Please call 911 immediately.', [{ text: 'OK' }])
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export function EmergencyRightNowScreen({ route, navigation }: Props) {
  const { lessonId } = route.params;
  const lesson = getEmergencyLessonById(lessonId);
  const audio = useAudio();
  const [stepIndex, setStepIndex] = useState(0);

  // Stop audio when navigating away
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', audio.stop);
    return unsubscribe;
  }, [navigation, audio.stop]);

  // Auto-read current step aloud whenever step changes
  const currentStep = lesson?.steps[stepIndex];
  const stepAudioText = useMemo(() => {
    if (!currentStep) return [];
    const chunks: string[] = [`Step ${stepIndex + 1}. ${currentStep.text}.`];
    if (currentStep.detail) chunks.push(currentStep.detail);
    return chunks;
  }, [currentStep, stepIndex]);

  // Read aloud when step changes (auto-read)
  const speakStep = useCallback(() => {
    if (stepAudioText.length > 0 && !audio.isMuted) {
      audio.speak(stepAudioText);
    }
  }, [stepAudioText, audio]);

  useEffect(() => {
    speakStep();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex]);

  // Also read on mount
  useEffect(() => {
    speakStep();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!lesson) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Emergency guide not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const totalSteps = lesson.steps.length;
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === totalSteps - 1;
  const showDisclaimer = isFirst && !!lesson.disclaimer;
  const showMetronome =
    lesson.id === 'cpr-adult' && currentStep && isCompressionsStep(currentStep.text);

  function handlePrev() {
    if (!isFirst) {
      audio.stop();
      setStepIndex((i) => i - 1);
    }
  }

  function handleNext() {
    if (!isLast) {
      audio.stop();
      setStepIndex((i) => i + 1);
    }
  }

  function handleRestart() {
    audio.stop();
    setStepIndex(0);
  }

  function handleToggleAudio() {
    if (audio.isPlaying) {
      audio.stop();
    } else {
      audio.speak(stepAudioText);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── CALL 911 bar — always visible at top ── */}
      <TouchableOpacity
        style={styles.call911Bar}
        onPress={call911}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Call 911"
      >
        <Text style={styles.call911Text}>📞  CALL 911</Text>
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* ── Lesson title + progress ── */}
        <View style={styles.progressRow}>
          <Text style={styles.lessonTitle} numberOfLines={1}>
            {lesson.icon}  {lesson.title}
          </Text>
          <Text style={styles.stepCounter}>
            {stepIndex + 1} / {totalSteps}
          </Text>
        </View>

        {/* ── Progress bar ── */}
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((stepIndex + 1) / totalSteps) * 100}%` },
            ]}
          />
        </View>

        {/* ── Step card ── */}
        <View style={styles.stepCard}>
          {/* Step number label */}
          <View style={styles.stepNumberPill}>
            <Text style={styles.stepNumberText}>Step {stepIndex + 1} of {totalSteps}</Text>
          </View>

          {/* Main step text — large for panic readability */}
          <Text style={styles.stepText}>{currentStep?.text}</Text>

          {/* Detail text */}
          {currentStep?.detail ? (
            <Text style={styles.stepDetail}>{currentStep.detail}</Text>
          ) : null}

          {/* Disclaimer on step 1 */}
          {showDisclaimer && (
            <View style={styles.disclaimerBox}>
              <Text style={styles.disclaimerText}>⚠️  {lesson.disclaimer}</Text>
            </View>
          )}

          {/* CPR Metronome on compressions step */}
          {showMetronome && <CprMetronome />}
        </View>

        {/* ── Audio toggle ── */}
        {audio.isAvailable && (
          <TouchableOpacity
            style={styles.audioToggle}
            onPress={audio.isMuted ? audio.toggleMute : handleToggleAudio}
            activeOpacity={0.75}
            accessibilityRole="button"
          >
            <Text style={styles.audioToggleText}>
              {audio.isMuted
                ? '🔇  Audio is off — tap to turn on'
                : audio.isPlaying
                ? '⏹  Stop reading'
                : '🔊  Read this step aloud'}
            </Text>
          </TouchableOpacity>
        )}

        {/* ── doNotDo list on last step ── */}
        {isLast && lesson.doNotDo && lesson.doNotDo.length > 0 && (
          <View style={styles.doNotDoSection}>
            <Text style={styles.doNotDoHeading}>🚫  Do NOT do these</Text>
            {lesson.doNotDo.map((item, i) => (
              <View key={i} style={styles.doNotDoRow}>
                <Text style={styles.doNotDoBullet}>✕</Text>
                <Text style={styles.doNotDoText}>{item}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ── Final message on last step ── */}
        {isLast && (
          <View style={styles.helpOnWayBox}>
            <Text style={styles.helpOnWayEmoji}>🚑</Text>
            <Text style={styles.helpOnWayText}>Help is on the way.</Text>
            <Text style={styles.helpOnWaySubtext}>
              Stay with the person and keep them calm until paramedics arrive.
            </Text>
            <TouchableOpacity
              style={styles.restartButton}
              onPress={handleRestart}
              activeOpacity={0.8}
            >
              <Text style={styles.restartButtonText}>↩  Start Over</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* ── PREV / NEXT navigation — fixed at bottom ── */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={[styles.navButton, isFirst && styles.navButtonDisabled]}
          onPress={handlePrev}
          disabled={isFirst}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Previous step"
        >
          <Text style={[styles.navButtonText, isFirst && styles.navButtonTextDisabled]}>
            ← Prev
          </Text>
        </TouchableOpacity>

        <View style={styles.navStepDots}>
          {lesson.steps.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === stepIndex && styles.dotActive]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.navButton, styles.navButtonNext, isLast && styles.navButtonDisabled]}
          onPress={handleNext}
          disabled={isLast}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Next step"
        >
          <Text style={[styles.navButtonTextNext, isLast && styles.navButtonTextDisabled]}>
            Next →
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FAFAFA',
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

  // ── 911 bar ──
  call911Bar: {
    backgroundColor: EMERGENCY_RED,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  call911Text: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: 1,
  },

  // ── Scroll content ──
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
  },

  // ── Progress ──
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  lessonTitle: {
    ...TYPOGRAPHY.label,
    fontSize: 15,
    color: COLORS.textMuted,
    flex: 1,
    marginRight: SPACING.sm,
  },
  stepCounter: {
    ...TYPOGRAPHY.label,
    fontWeight: '700',
    color: COLORS.text,
    fontSize: 15,
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.full,
    marginBottom: SPACING.lg,
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    backgroundColor: EMERGENCY_RED,
    borderRadius: RADIUS.full,
  },

  // ── Step card ──
  stepCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  stepNumberPill: {
    alignSelf: 'flex-start',
    backgroundColor: EMERGENCY_RED + '15',
    borderRadius: RADIUS.full,
    paddingVertical: 4,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  stepNumberText: {
    fontSize: 13,
    fontWeight: '700',
    color: EMERGENCY_RED,
  },
  stepText: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
    lineHeight: 32,
    marginBottom: SPACING.md,
  },
  stepDetail: {
    fontSize: 17,
    color: COLORS.textMuted,
    lineHeight: 26,
    fontWeight: '400',
  },
  disclaimerBox: {
    marginTop: SPACING.lg,
    backgroundColor: '#FEF9C3',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#FDE047',
  },
  disclaimerText: {
    fontSize: 13,
    color: '#713F12',
    lineHeight: 19,
  },

  // ── Audio ──
  audioToggle: {
    alignSelf: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
    marginBottom: SPACING.md,
  },
  audioToggleText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
    fontWeight: '600',
  },

  // ── Do Not Do ──
  doNotDoSection: {
    backgroundColor: EMERGENCY_RED + '08',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderLeftWidth: 4,
    borderColor: EMERGENCY_RED + '25',
    borderLeftColor: EMERGENCY_RED,
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  doNotDoHeading: {
    fontSize: 16,
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
    fontSize: 14,
    fontWeight: '800',
    color: EMERGENCY_RED,
    width: 16,
    marginTop: 2,
  },
  doNotDoText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
  },

  // ── Help on way ──
  helpOnWayBox: {
    backgroundColor: COLORS.success + '12',
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.success + '40',
    marginBottom: SPACING.lg,
  },
  helpOnWayEmoji: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  helpOnWayText: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.success,
    marginBottom: SPACING.sm,
  },
  helpOnWaySubtext: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: 22,
  },
  restartButton: {
    paddingVertical: SPACING.sm + 4,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  restartButtonText: {
    ...TYPOGRAPHY.label,
    fontWeight: '600',
  },

  // ── Nav bar ──
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  navButton: {
    paddingVertical: SPACING.sm + 4,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
    minWidth: 90,
    alignItems: 'center',
  },
  navButtonNext: {
    backgroundColor: EMERGENCY_RED,
    borderColor: EMERGENCY_RED,
  },
  navButtonDisabled: {
    opacity: 0.35,
  },
  navButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  navButtonTextNext: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.white,
  },
  navButtonTextDisabled: {
    color: COLORS.textMuted,
  },
  navStepDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flexWrap: 'wrap',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.border,
  },
  dotActive: {
    backgroundColor: EMERGENCY_RED,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
