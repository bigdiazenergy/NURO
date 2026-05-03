import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../lib/theme';

const BPM = 110;
const INTERVAL_MS = Math.round((60 / BPM) * 1000); // ~545 ms per beat

/**
 * CprMetronome — a self-contained visual metronome for the CPR compressions step.
 *
 * Shows a pulsing circle that beats at 110 BPM (center of the 100–120 BPM range)
 * with a Play/Stop button. Includes a reminder for 30:2 ratio.
 */
export function CprMetronome() {
  const [isRunning, setIsRunning] = useState(false);
  const [beatCount, setBeatCount] = useState(0);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animRef = useRef<Animated.CompositeAnimation | null>(null);

  // Pulse animation — quick scale-up then settle back down
  function triggerPulse() {
    if (animRef.current) {
      animRef.current.stop();
    }
    scaleAnim.setValue(1);
    animRef.current = Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.35,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: INTERVAL_MS - 80,
        useNativeDriver: true,
      }),
    ]);
    animRef.current.start();
  }

  useEffect(() => {
    if (isRunning) {
      // Fire immediately on start so there's no initial delay
      triggerPulse();
      setBeatCount(1);

      intervalRef.current = setInterval(() => {
        triggerPulse();
        setBeatCount((prev) => (prev % 30) + 1);
      }, INTERVAL_MS);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (animRef.current) {
        animRef.current.stop();
      }
      scaleAnim.setValue(1);
      setBeatCount(0);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (animRef.current) animRef.current.stop();
    };
  }, []);

  const compressionNumber = isRunning && beatCount > 0 ? beatCount : null;
  const isThirty = compressionNumber === 30;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>CPR Metronome</Text>
      <Text style={styles.bpmLabel}>{BPM} BPM — compress on each beat</Text>

      {/* Pulsing circle */}
      <View style={styles.circleWrap}>
        <Animated.View
          style={[
            styles.circle,
            isRunning && styles.circleActive,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <Text style={styles.circleText}>
            {isRunning
              ? compressionNumber !== null
                ? String(compressionNumber)
                : '❤️'
              : '❤️'}
          </Text>
        </Animated.View>
      </View>

      {/* Breath reminder */}
      {isRunning && isThirty && (
        <View style={styles.breathBanner}>
          <Text style={styles.breathBannerText}>💨 Give 2 rescue breaths now!</Text>
        </View>
      )}
      {isRunning && !isThirty && (
        <Text style={styles.countLabel}>
          Compression {compressionNumber} of 30
        </Text>
      )}
      {!isRunning && (
        <Text style={styles.countLabel}>Press Play to start</Text>
      )}

      {/* Play / Stop button */}
      <TouchableOpacity
        style={[styles.button, isRunning && styles.buttonStop]}
        onPress={() => setIsRunning((v) => !v)}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={isRunning ? 'Stop metronome' : 'Start metronome'}
      >
        <Text style={[styles.buttonText, isRunning && styles.buttonTextStop]}>
          {isRunning ? '⏹  Stop' : '▶  Start'}
        </Text>
      </TouchableOpacity>

      {/* Ratio reminder */}
      <View style={styles.ratioReminder}>
        <Text style={styles.ratioText}>30 compressions → 2 rescue breaths → repeat</Text>
      </View>
    </View>
  );
}

const EMERGENCY_RED = '#DC2626';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: EMERGENCY_RED + '30',
    padding: SPACING.lg,
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  heading: {
    ...TYPOGRAPHY.subtitle,
    fontSize: 16,
    marginBottom: SPACING.xs,
  },
  bpmLabel: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
    marginBottom: SPACING.lg,
  },
  circleWrap: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: EMERGENCY_RED + '18',
    borderWidth: 3,
    borderColor: EMERGENCY_RED + '50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleActive: {
    backgroundColor: EMERGENCY_RED + '25',
    borderColor: EMERGENCY_RED,
  },
  circleText: {
    fontSize: 32,
  },
  countLabel: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
    minHeight: 20,
  },
  breathBanner: {
    backgroundColor: COLORS.primary + '15',
    borderRadius: RADIUS.sm,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  breathBannerText: {
    ...TYPOGRAPHY.label,
    color: COLORS.primary,
    fontWeight: '700',
  },
  button: {
    paddingVertical: SPACING.sm + 4,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.full,
    backgroundColor: EMERGENCY_RED,
    marginBottom: SPACING.md,
  },
  buttonStop: {
    backgroundColor: COLORS.textMuted,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  buttonTextStop: {
    color: COLORS.white,
  },
  ratioReminder: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.sm,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
  },
  ratioText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
