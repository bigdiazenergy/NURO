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
import { RootStackParamList, Category } from '../types';
import { COLORS, SPACING, RADIUS, SHADOW, TYPOGRAPHY } from '../lib/theme';
import { CATEGORIES } from '../sample-data/categories';
import { useOnboarding } from '../hooks/useOnboarding';

type Props = NativeStackScreenProps<RootStackParamList, 'FocusArea'>;

export function FocusAreaScreen({ navigation }: Props) {
  const { updateFocusAreas } = useOnboarding();
  const [selected, setSelected] = useState<Category[]>([]);

  function toggleCategory(id: Category) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  async function handleContinue() {
    await updateFocusAreas(selected);
    navigation.replace('VoiceSetup');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>What do you want to work on?</Text>
          <Text style={styles.subtitle}>
            Choose one or more areas. You can change this later.
          </Text>
        </View>

        <View style={styles.list}>
          {CATEGORIES.map((cat) => {
            const isSelected = selected.includes(cat.id);
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.card,
                  isSelected && { borderColor: cat.color, borderWidth: 2 },
                ]}
                onPress={() => toggleCategory(cat.id)}
                activeOpacity={0.8}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isSelected }}
                accessibilityLabel={cat.title}
              >
                <View style={styles.cardLeft}>
                  <View style={[styles.iconWrap, { backgroundColor: cat.color + '18' }]}>
                    <Text style={styles.icon}>{cat.icon}</Text>
                  </View>
                  <View style={styles.cardText}>
                    <Text style={styles.cardTitle}>{cat.title}</Text>
                    <Text style={styles.cardDesc}>{cat.description}</Text>
                  </View>
                </View>
                <View style={[styles.selectDot, isSelected && { backgroundColor: cat.color }]}>
                  {isSelected && <Text style={styles.checkmark}>✓</Text>}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, selected.length === 0 && styles.buttonDisabled]}
            onPress={handleContinue}
            disabled={selected.length === 0}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Continue"
            accessibilityState={{ disabled: selected.length === 0 }}
          >
            <Text style={[styles.buttonText, selected.length === 0 && styles.buttonTextDisabled]}>
              Continue
            </Text>
          </TouchableOpacity>
          {selected.length === 0 && (
            <Text style={styles.buttonHint}>Pick at least one area above to continue.</Text>
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
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xl,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  title: {
    ...TYPOGRAPHY.title,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    ...TYPOGRAPHY.bodyMuted,
  },
  list: {
    flex: 1,
  },
  card: {
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
  cardLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
    flexShrink: 0,
  },
  icon: {
    fontSize: 22,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    ...TYPOGRAPHY.subtitle,
    fontSize: 16,
    marginBottom: 2,
  },
  cardDesc: {
    ...TYPOGRAPHY.small,
    lineHeight: 18,
  },
  selectDot: {
    width: 24,
    height: 24,
    borderRadius: RADIUS.full,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.sm,
    flexShrink: 0,
  },
  checkmark: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
  footer: {
    marginTop: SPACING.xl,
  },
  button: {
    backgroundColor: COLORS.accent,
    paddingVertical: SPACING.md + 2,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: COLORS.border,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '600',
  },
  buttonTextDisabled: {
    color: COLORS.textMuted,
  },
  buttonHint: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
});
