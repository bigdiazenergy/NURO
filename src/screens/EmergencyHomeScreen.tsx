import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Animated,
  useWindowDimensions,
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

// ─── Types ────────────────────────────────────────────────────────────────────
type Props = NativeStackScreenProps<RootStackParamList, 'Main'>;

// ─── Component ────────────────────────────────────────────────────────────────
export function EmergencyHomeScreen({ navigation }: Props) {
  const { height } = useWindowDimensions();
  const pressAnim = useRef(new Animated.Value(1)).current;

  function handlePressIn() {
    Animated.spring(pressAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 40,
    }).start();
  }

  function handlePressOut() {
    Animated.spring(pressAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
    }).start();
  }

  function handleRightNow() {
    navigation.navigate('EmergencyTopicPicker');
  }

  function handleLessonCard(lessonId: string) {
    navigation.navigate('EmergencyLesson', { lessonId });
  }

  function handleContacts() {
    navigation.navigate('EmergencyContacts');
  }

  // RIGHT NOW button takes ~40% of the screen height
  const rightNowHeight = Math.round(height * 0.38);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces
      >
        {/* ── RIGHT NOW section ── */}
        <View style={[styles.rightNowSection, { minHeight: rightNowHeight }]}>
          <Animated.View style={[styles.rightNowButtonWrap, { transform: [{ scale: pressAnim }] }]}>
            <TouchableOpacity
              style={styles.rightNowButton}
              onPress={handleRightNow}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={1}
              accessibilityRole="button"
              accessibilityLabel="Right Now — get step-by-step emergency help immediately"
            >
              <Text style={styles.rightNowEmoji}>🚨</Text>
              <Text style={styles.rightNowTitle}>RIGHT NOW</Text>
              <Text style={styles.rightNowSubtitle}>
                Step-by-step help for what is happening right now
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Emergency Contacts shortcut */}
          <TouchableOpacity
            style={styles.contactsButton}
            onPress={handleContacts}
            activeOpacity={0.8}
            accessibilityRole="button"
          >
            <Text style={styles.contactsButtonText}>📞  Emergency Contacts</Text>
          </TouchableOpacity>
        </View>

        {/* ── Divider ── */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Or learn what to do before it happens</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* ── Learn Mode cards ── */}
        <View style={styles.learnSection}>
          <Text style={styles.learnHeading}>Emergency Guides</Text>
          <View style={styles.grid}>
            {EMERGENCY_LESSONS.map((lesson) => (
              <TouchableOpacity
                key={lesson.id}
                style={styles.card}
                onPress={() => handleLessonCard(lesson.id)}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={`${lesson.title} — ${SEVERITY_LABELS[lesson.severity]}`}
              >
                <Text style={styles.cardIcon}>{lesson.icon}</Text>
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {lesson.title}
                </Text>
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
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Bottom disclaimer ── */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            ⚠️  These guides are for reference only. Always call 911 in a life-threatening emergency.
            For hands-on training, take a certified first-aid class.
          </Text>
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
  scrollContent: {
    paddingBottom: SPACING.xxl,
  },

  // ── RIGHT NOW ──
  rightNowSection: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    justifyContent: 'center',
  },
  rightNowButtonWrap: {
    marginBottom: SPACING.sm,
  },
  rightNowButton: {
    backgroundColor: EMERGENCY_RED,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    // Glow / shadow
    shadowColor: EMERGENCY_RED,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  rightNowEmoji: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  rightNowTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: 2,
    marginBottom: SPACING.sm,
  },
  rightNowSubtitle: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 22,
  },
  contactsButton: {
    alignSelf: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
    ...SHADOW.card,
  },
  contactsButtonText: {
    ...TYPOGRAPHY.label,
    color: COLORS.text,
    fontWeight: '600',
  },

  // ── Divider ──
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.lg,
    gap: SPACING.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
    textAlign: 'center',
    flexShrink: 1,
  },

  // ── Learn section ──
  learnSection: {
    paddingHorizontal: SPACING.lg,
  },
  learnHeading: {
    ...TYPOGRAPHY.subtitle,
    marginBottom: SPACING.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  card: {
    width: '47.5%',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'flex-start',
    ...SHADOW.card,
  },
  cardIcon: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  cardTitle: {
    ...TYPOGRAPHY.label,
    fontWeight: '700',
    marginBottom: SPACING.sm,
    color: COLORS.text,
    lineHeight: 20,
  },
  severityBadge: {
    borderRadius: RADIUS.full,
    paddingVertical: 3,
    paddingHorizontal: SPACING.sm,
  },
  severityText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // ── Disclaimer ──
  disclaimer: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
    padding: SPACING.md,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  disclaimerText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
    lineHeight: 18,
    textAlign: 'center',
  },
});
