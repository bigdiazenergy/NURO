import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { COLORS, SPACING, RADIUS, SHADOW, TYPOGRAPHY } from '../lib/theme';
import { saveVoiceMode, VoiceMode, setOnboardingComplete } from '../lib/storage';

type Props = NativeStackScreenProps<RootStackParamList, 'VoiceSetup'>;

const OPTIONS: { mode: VoiceMode; icon: string; title: string; description: string }[] = [
  {
    mode: 'tap',
    icon: '🎤',
    title: 'Tap to speak',
    description:
      'Tap a microphone button next to any text area. Speak your response, then confirm or pick from up to 3 interpretations.',
  },
  {
    mode: 'handsfree',
    icon: '🗣️',
    title: 'Hands-free',
    description:
      'Say commands like "open appointments" or "go back" at any time. Great if typing is difficult.',
  },
];

export function VoiceSetupScreen({ navigation }: Props) {
  const [selected, setSelected] = useState<VoiceMode>(null);
  const [saving, setSaving] = useState(false);

  async function handleContinue() {
    if (saving) return;
    setSaving(true);
    await saveVoiceMode(selected);
    await setOnboardingComplete();
    navigation.replace('Main');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.emoji}>🎙️</Text>
          <Text style={styles.title}>How would you like to respond?</Text>
          <Text style={styles.subtitle}>
            You can type, or use your voice. Choose what works best for you — you can change
            this later in Settings.
          </Text>
        </View>

        <View style={styles.options}>
          {OPTIONS.map((opt) => {
            const isSelected = selected === opt.mode;
            return (
              <TouchableOpacity
                key={opt.mode}
                style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                onPress={() => setSelected(opt.mode)}
                activeOpacity={0.8}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
              >
                <View style={styles.optionTop}>
                  <Text style={styles.optionIcon}>{opt.icon}</Text>
                  <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                </View>
                <Text style={[styles.optionTitle, isSelected && styles.optionTitleSelected]}>
                  {opt.title}
                </Text>
                <Text style={styles.optionDescription}>{opt.description}</Text>
              </TouchableOpacity>
            );
          })}

          {/* Skip / type only option */}
          <TouchableOpacity
            style={[styles.optionCard, selected === null && styles.optionCardNeutral]}
            onPress={() => setSelected(null)}
            activeOpacity={0.8}
          >
            <View style={styles.optionTop}>
              <Text style={styles.optionIcon}>⌨️</Text>
              <View style={[styles.radioOuter, selected === null && styles.radioOuterSelected]}>
                {selected === null && <View style={styles.radioInner} />}
              </View>
            </View>
            <Text style={[styles.optionTitle, selected === null && styles.optionTitleSelected]}>
              Just typing is fine
            </Text>
            <Text style={styles.optionDescription}>
              No voice features. You can always turn them on later.
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.continueButton, saving && styles.continueButtonDisabled]}
          onPress={handleContinue}
          activeOpacity={0.85}
          disabled={saving}
        >
          <Text style={styles.continueButtonText}>
            {saving ? 'Setting up…' : 'Continue'}
          </Text>
        </TouchableOpacity>
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
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  emoji: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  title: {
    ...TYPOGRAPHY.title,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 24,
  },
  options: {
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  optionCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.border,
    ...SHADOW.card,
  },
  optionCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '08',
  },
  optionCardNeutral: {
    borderColor: COLORS.border,
  },
  optionTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  optionIcon: {
    fontSize: 28,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: RADIUS.full,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: COLORS.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
  },
  optionTitle: {
    ...TYPOGRAPHY.body,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  optionTitleSelected: {
    color: COLORS.primary,
  },
  optionDescription: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
    fontSize: 14,
    lineHeight: 22,
  },
  continueButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    opacity: 0.6,
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
