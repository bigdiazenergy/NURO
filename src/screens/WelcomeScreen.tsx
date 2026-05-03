import React from 'react';
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
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../lib/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export function WelcomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} bounces={false}>
        <View style={styles.logoArea}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>📖</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.appName}>Nuro</Text>
          <Text style={styles.tagline}>Step-by-step help for real life.</Text>

          <Text style={styles.description}>
            This app breaks down everyday tasks — appointments, money, errands, and routines — into
            clear, manageable steps.
          </Text>
          <Text style={styles.description}>
            Everything is written plainly — no jargon, no guesswork. Go at your own pace and come
            back to any lesson whenever you need it.
          </Text>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('FocusArea')}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Get started"
          >
            <Text style={styles.buttonText}>Get started</Text>
          </TouchableOpacity>
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
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.xl,
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary + '18',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
  },
  logoEmoji: {
    fontSize: 36,
  },
  content: {
    flex: 1,
  },
  appName: {
    ...TYPOGRAPHY.largeTitle,
    fontSize: 34,
    marginBottom: SPACING.sm,
  },
  tagline: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.primary,
    marginBottom: SPACING.lg,
    fontWeight: '500',
  },
  description: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
    lineHeight: 26,
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
  buttonText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '600',
  },
});
