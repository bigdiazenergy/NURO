import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../lib/theme';
import { getLessonById } from '../sample-data/lessons';
import { ChecklistItem } from '../components/ChecklistItem';
import { ProgressBar } from '../components/ProgressBar';

type Props = NativeStackScreenProps<RootStackParamList, 'Checklist'>;

export function ChecklistScreen({ route, navigation }: Props) {
  const { lessonId } = route.params;
  const lesson = getLessonById(lessonId);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  if (!lesson) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Checklist not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  function handleToggle(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  const total = lesson.checklist.length;
  const current = checked.size;
  const allDone = current === total;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>{lesson.title}</Text>
        <Text style={styles.subtitle}>Checklist</Text>
        <View style={styles.progressWrap}>
          <ProgressBar current={current} total={total} />
        </View>
      </View>

      {allDone && (
        <View style={styles.allDoneBanner}>
          <Text style={styles.allDoneText}>All done.</Text>
          <Text style={styles.allDoneSubText}>Tap any item to uncheck it if you need to go back.</Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {lesson.checklist.map((item) => (
          <ChecklistItem
            key={item.id}
            item={item}
            checked={checked.has(item.id)}
            onToggle={handleToggle}
          />
        ))}
        <View style={styles.bottomPad} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => {
            if (current === 0) return;
            Alert.alert('Clear all checkmarks?', 'This will uncheck everything so you can start over.', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Clear', style: 'destructive', onPress: () => setChecked(new Set()) },
            ]);
          }}
          activeOpacity={0.8}
          disabled={current === 0}
        >
          <Text style={[styles.resetButtonText, current === 0 && styles.resetButtonTextDisabled]}>
            Start over
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
        >
          <Text style={styles.doneButtonText}>Back to lesson</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    ...TYPOGRAPHY.bodyMuted,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  title: {
    ...TYPOGRAPHY.subtitle,
    fontSize: 16,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  subtitle: {
    ...TYPOGRAPHY.title,
    marginTop: 2,
    marginBottom: SPACING.md,
  },
  progressWrap: {
    marginBottom: SPACING.xs,
  },
  allDoneBanner: {
    backgroundColor: COLORS.success + '18',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.success + '30',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  allDoneText: {
    ...TYPOGRAPHY.body,
    color: COLORS.success,
    fontWeight: '600',
  },
  allDoneSubText: {
    ...TYPOGRAPHY.small,
    color: COLORS.success,
    marginTop: 2,
  },
  list: {
    backgroundColor: COLORS.card,
    marginTop: SPACING.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  bottomPad: {
    height: SPACING.xl,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.background,
    gap: SPACING.sm,
  },
  resetButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  resetButtonText: {
    ...TYPOGRAPHY.label,
    color: COLORS.text,
  },
  resetButtonTextDisabled: {
    color: COLORS.border,
  },
  doneButton: {
    flex: 2,
    backgroundColor: COLORS.accent,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  doneButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 16,
  },
});
