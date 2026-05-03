import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Reminder, Category } from '../types';
import { COLORS, SPACING, RADIUS, SHADOW, TYPOGRAPHY } from '../lib/theme';
import { getLessonById } from '../sample-data/lessons';
import { CategoryBadge } from '../components/CategoryBadge';
import { useReminders } from '../hooks/useReminders';

type Props = NativeStackScreenProps<RootStackParamList, 'ReminderSetup'>;
type RepeatRule = 'none' | 'daily' | 'weekly' | 'monthly';

const REPEAT_OPTIONS: { value: RepeatRule; label: string }[] = [
  { value: 'none', label: 'No repeat' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

export function ReminderSetupScreen({ route, navigation }: Props) {
  const lessonId = route.params?.lessonId;
  const lesson = lessonId ? getLessonById(lessonId) : undefined;

  const { reminders, loading, addReminder, removeReminder, toggleComplete } = useReminders();
  const [label, setLabel] = useState(lesson ? lesson.title : '');
  const [repeatRule, setRepeatRule] = useState<RepeatRule>('none');

  async function handleSave() {
    if (!label.trim()) {
      Alert.alert('Add a label', 'Enter a short description for this reminder.', [{ text: 'OK' }]);
      return;
    }
    const newReminder: Reminder = {
      id: `reminder-${Date.now()}`,
      title: label.trim(),
      category: (lesson?.category ?? 'daily-living') as Category,
      dueAt: new Date().toISOString(),
      repeatRule,
      completed: false,
    };
    await addReminder(newReminder);
    setLabel(lesson ? lesson.title : '');
    setRepeatRule('none');
    Alert.alert('Reminder saved', `"${newReminder.title}" added to your reminders.`, [
      { text: 'OK' },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            style={styles.backLink}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.backLinkText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Set a reminder</Text>
          {lesson && (
            <Text style={styles.subtitle}>For: {lesson.title}</Text>
          )}
        </View>

        <View style={styles.formCard}>
          <Text style={styles.fieldLabel}>Label</Text>
          <TextInput
            style={styles.input}
            value={label}
            onChangeText={setLabel}
            placeholder="What do you want to remember?"
            placeholderTextColor={COLORS.border}
            returnKeyType="done"
            accessibilityLabel="Reminder label"
          />

          <Text style={styles.fieldLabel}>Repeat</Text>
          <View style={styles.repeatOptions}>
            {REPEAT_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.repeatOption,
                  repeatRule === opt.value && styles.repeatOptionActive,
                ]}
                onPress={() => setRepeatRule(opt.value)}
                activeOpacity={0.8}
                accessibilityRole="radio"
                accessibilityState={{ checked: repeatRule === opt.value }}
              >
                <Text
                  style={[
                    styles.repeatOptionText,
                    repeatRule === opt.value && styles.repeatOptionTextActive,
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.noteRow}>
            <Text style={styles.noteText}>
              Reminders are saved here for reference. Push notifications will be added in a future update.
            </Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.85}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.85}>
              <Text style={styles.saveButtonText}>Save reminder</Text>
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="small" color={COLORS.primary} style={styles.spinner} />
        ) : reminders.length > 0 ? (
          <View style={styles.listSection}>
            <Text style={styles.listSectionLabel}>Your reminders</Text>
            {reminders.map((reminder) => (
              <View key={reminder.id} style={[styles.reminderCard, reminder.completed && styles.reminderCardDone]}>
                <View style={styles.reminderCardLeft}>
                  <Text style={[styles.reminderTitle, reminder.completed && styles.reminderTitleDone]}>
                    {reminder.title}
                  </Text>
                  <View style={styles.reminderMeta}>
                    <CategoryBadge category={reminder.category} />
                    {reminder.repeatRule !== 'none' && (
                      <Text style={styles.reminderRepeat}>{reminder.repeatRule}</Text>
                    )}
                  </View>
                </View>
                <View style={styles.reminderActions}>
                  <TouchableOpacity
                    onPress={() => toggleComplete(reminder.id)}
                    style={styles.reminderAction}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.reminderActionText}>
                      {reminder.completed ? 'Undo' : 'Done'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => removeReminder(reminder.id)}
                    style={styles.reminderAction}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.reminderActionText, { color: COLORS.textMuted }]}>
                      Remove
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptySection}>
            <Text style={styles.emptyText}>No reminders saved yet.</Text>
          </View>
        )}
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
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  backLink: {
    alignSelf: 'flex-start',
    paddingVertical: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  backLinkText: {
    ...TYPOGRAPHY.label,
    color: COLORS.primary,
    fontWeight: '600',
  },
  title: {
    ...TYPOGRAPHY.title,
  },
  subtitle: {
    ...TYPOGRAPHY.bodyMuted,
    marginTop: SPACING.xs,
  },
  formCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
    ...SHADOW.card,
  },
  fieldLabel: {
    ...TYPOGRAPHY.smallBold,
    color: COLORS.textMuted,
    letterSpacing: 0.5,
    marginBottom: SPACING.xs,
    marginTop: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.md,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  repeatOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  repeatOption: {
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  repeatOptionActive: {
    backgroundColor: COLORS.primary + '18',
    borderColor: COLORS.primary,
  },
  repeatOptionText: {
    ...TYPOGRAPHY.label,
    color: COLORS.textMuted,
    fontSize: 14,
  },
  repeatOptionTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  noteRow: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
  },
  noteText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    flex: 2,
    backgroundColor: COLORS.accent,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  spinner: {
    paddingVertical: SPACING.lg,
  },
  listSection: {
    marginBottom: SPACING.lg,
  },
  listSectionLabel: {
    ...TYPOGRAPHY.smallBold,
    color: COLORS.textMuted,
    letterSpacing: 0.8,
    marginBottom: SPACING.sm,
  },
  reminderCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'flex-start',
    ...SHADOW.card,
  },
  reminderCardDone: {
    opacity: 0.6,
  },
  reminderCardLeft: {
    flex: 1,
  },
  reminderTitle: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  reminderTitleDone: {
    textDecorationLine: 'line-through',
    color: COLORS.textMuted,
  },
  reminderMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  reminderRepeat: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
    textTransform: 'capitalize',
  },
  reminderActions: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: SPACING.xs,
    marginLeft: SPACING.sm,
  },
  reminderAction: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
  },
  reminderActionText: {
    ...TYPOGRAPHY.small,
    color: COLORS.primary,
    fontWeight: '600',
  },
  emptySection: {
    paddingVertical: SPACING.lg,
    alignItems: 'center',
  },
  emptyText: {
    ...TYPOGRAPHY.bodyMuted,
  },
});
