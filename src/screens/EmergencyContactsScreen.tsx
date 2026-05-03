import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Linking,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { COLORS, SPACING, RADIUS, SHADOW, TYPOGRAPHY } from '../lib/theme';
import {
  EmergencyContact,
  loadEmergencyContacts,
  saveEmergencyContacts,
} from '../lib/storage';

// ─── Constants ────────────────────────────────────────────────────────────────
const EMERGENCY_RED = '#DC2626';

// ─── Types ────────────────────────────────────────────────────────────────────
type Props = NativeStackScreenProps<RootStackParamList, 'EmergencyContacts'>;

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatPhone(phone: string): string {
  // Format 10-digit US numbers as (555) 123-4567
  const digits = phone.replace(/\D/g, '');
  if (digits === '911') return '911';
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone;
}

function dialContact(contact: EmergencyContact) {
  const digits = contact.phone.replace(/\D/g, '');
  Linking.openURL(`tel:${digits}`).catch(() =>
    Alert.alert('Cannot call', `Please call ${contact.phone} manually.`, [{ text: 'OK' }])
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export function EmergencyContactsScreen({ navigation }: Props) {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [saving, setSaving] = useState(false);

  // Load contacts on mount
  const loadContacts = useCallback(async () => {
    const loaded = await loadEmergencyContacts();
    setContacts(loaded);
  }, []);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  async function handleAddContact() {
    const trimName = newName.trim();
    const trimPhone = newPhone.trim().replace(/\D/g, '');

    if (!trimName) {
      Alert.alert('Name required', 'Please enter a name for this contact.', [{ text: 'OK' }]);
      return;
    }
    if (trimPhone.length < 3) {
      Alert.alert('Phone required', 'Please enter a valid phone number.', [{ text: 'OK' }]);
      return;
    }

    setSaving(true);
    const newContact: EmergencyContact = {
      id: `user-${Date.now()}`,
      name: trimName,
      phone: trimPhone,
    };

    const userContacts = contacts.filter((c) => !c.isSystem);
    const updated = [...userContacts, newContact];
    await saveEmergencyContacts(updated);
    await loadContacts();

    setNewName('');
    setNewPhone('');
    setShowForm(false);
    setSaving(false);
  }

  async function handleDelete(contactId: string) {
    Alert.alert(
      'Remove contact',
      'Remove this contact from your emergency list?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            const userContacts = contacts.filter(
              (c) => !c.isSystem && c.id !== contactId
            );
            await saveEmergencyContacts(userContacts);
            await loadContacts();
          },
        },
      ]
    );
  }

  function handleCancelForm() {
    setNewName('');
    setNewPhone('');
    setShowForm(false);
  }

  const systemContacts = contacts.filter((c) => c.isSystem);
  const userContacts = contacts.filter((c) => !c.isSystem);

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Header ── */}
          <View style={styles.header}>
            <Text style={styles.heading}>Emergency Contacts</Text>
            <Text style={styles.subheading}>
              Tap any contact to call them instantly.
            </Text>
          </View>

          {/* ── System contacts ── */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Always available</Text>
            {systemContacts.map((contact) => (
              <ContactRow
                key={contact.id}
                contact={contact}
                onPress={() => dialContact(contact)}
                isSystem
              />
            ))}
          </View>

          {/* ── Personal contacts ── */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionLabel}>Your contacts</Text>
              {!showForm && (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => setShowForm(true)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.addButtonText}>＋ Add</Text>
                </TouchableOpacity>
              )}
            </View>

            {userContacts.length === 0 && !showForm && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>👤</Text>
                <Text style={styles.emptyText}>
                  No personal contacts yet.{'\n'}Add a family member, friend, or doctor.
                </Text>
                <TouchableOpacity
                  style={styles.emptyAddButton}
                  onPress={() => setShowForm(true)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.emptyAddButtonText}>＋ Add a contact</Text>
                </TouchableOpacity>
              </View>
            )}

            {userContacts.map((contact) => (
              <ContactRow
                key={contact.id}
                contact={contact}
                onPress={() => dialContact(contact)}
                onDelete={() => handleDelete(contact.id)}
              />
            ))}

            {/* ── Inline add form ── */}
            {showForm && (
              <View style={styles.formCard}>
                <Text style={styles.formHeading}>New contact</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Name (e.g. Mom, Dr. Smith)"
                  placeholderTextColor={COLORS.textMuted}
                  value={newName}
                  onChangeText={setNewName}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Phone number"
                  placeholderTextColor={COLORS.textMuted}
                  value={newPhone}
                  onChangeText={setNewPhone}
                  keyboardType="phone-pad"
                  returnKeyType="done"
                  onSubmitEditing={handleAddContact}
                />
                <View style={styles.formButtons}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleCancelForm}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                    onPress={handleAddContact}
                    activeOpacity={0.8}
                    disabled={saving}
                  >
                    <Text style={styles.saveButtonText}>
                      {saving ? 'Saving…' : 'Save contact'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* ── Footer ── */}
          <Text style={styles.footer}>
            Tap a contact to open your phone's dialer.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── ContactRow sub-component ─────────────────────────────────────────────────
interface ContactRowProps {
  contact: EmergencyContact;
  onPress: () => void;
  isSystem?: boolean;
  onDelete?: () => void;
}

function ContactRow({ contact, onPress, isSystem, onDelete }: ContactRowProps) {
  return (
    <TouchableOpacity
      style={[styles.contactRow, isSystem && styles.contactRowSystem]}
      onPress={onPress}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={`Call ${contact.name}: ${contact.phone}`}
    >
      <View
        style={[
          styles.contactIcon,
          isSystem && styles.contactIconSystem,
        ]}
      >
        <Text style={styles.contactIconText}>{isSystem ? '🆘' : '👤'}</Text>
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{contact.name}</Text>
        <Text style={styles.contactPhone}>{formatPhone(contact.phone)}</Text>
      </View>
      <View style={styles.contactActions}>
        <View style={styles.callBadge}>
          <Text style={styles.callBadgeText}>📞 Call</Text>
        </View>
        {!isSystem && onDelete && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={onDelete}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel={`Remove ${contact.name}`}
          >
            <Text style={styles.deleteButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flex: {
    flex: 1,
  },
  container: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },

  // ── Header ──
  header: {
    marginBottom: SPACING.xl,
  },
  heading: {
    ...TYPOGRAPHY.title,
    marginBottom: SPACING.xs,
  },
  subheading: {
    ...TYPOGRAPHY.bodyMuted,
  },

  // ── Sections ──
  section: {
    marginBottom: SPACING.xl,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  sectionLabel: {
    ...TYPOGRAPHY.smallBold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: SPACING.md,
  },

  // ── Add button ──
  addButton: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary + '15',
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
  },
  addButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },

  // ── Contact row ──
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.card,
  },
  contactRowSystem: {
    borderColor: EMERGENCY_RED + '30',
    borderWidth: 1.5,
  },
  contactIcon: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  contactIconSystem: {
    backgroundColor: EMERGENCY_RED + '12',
    borderColor: EMERGENCY_RED + '30',
  },
  contactIconText: {
    fontSize: 22,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    ...TYPOGRAPHY.label,
    fontWeight: '700',
    fontSize: 16,
  },
  contactPhone: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  contactActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  callBadge: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: EMERGENCY_RED + '12',
    borderWidth: 1,
    borderColor: EMERGENCY_RED + '30',
  },
  callBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: EMERGENCY_RED,
  },
  deleteButton: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.xs + 2,
  },
  deleteButtonText: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontWeight: '600',
  },

  // ── Empty state ──
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    ...TYPOGRAPHY.bodyMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  emptyAddButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
  },
  emptyAddButtonText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 14,
  },

  // ── Add form ──
  formCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.card,
    marginTop: SPACING.sm,
  },
  formHeading: {
    ...TYPOGRAPHY.subtitle,
    fontSize: 16,
    marginBottom: SPACING.md,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  formButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  cancelButtonText: {
    ...TYPOGRAPHY.label,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  saveButton: {
    flex: 2,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },

  footer: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
});
