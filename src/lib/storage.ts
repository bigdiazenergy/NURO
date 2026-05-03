import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProgress, Category, SavedTool, Reminder } from '../types';

// ─── Emergency Contacts ──────────────────────────────────────────────────────

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  isSystem?: boolean; // system contacts (911, Poison Control) cannot be deleted
}

const SYSTEM_CONTACTS: EmergencyContact[] = [
  { id: 'system-911', name: '911 — Emergency Services', phone: '911', isSystem: true },
  { id: 'system-poison', name: 'Poison Control', phone: '18002221222', isSystem: true },
];

export async function saveEmergencyContacts(contacts: EmergencyContact[]): Promise<void> {
  try {
    // Only persist non-system contacts; system ones are always injected at load time
    const userContacts = contacts.filter((c) => !c.isSystem);
    await AsyncStorage.setItem('@nuro:emergency_contacts', JSON.stringify(userContacts));
  } catch (error) {
    console.warn('Failed to save emergency contacts:', error);
  }
}

export async function loadEmergencyContacts(): Promise<EmergencyContact[]> {
  try {
    const raw = await AsyncStorage.getItem('@nuro:emergency_contacts');
    const userContacts: EmergencyContact[] = raw ? JSON.parse(raw) : [];
    return [...SYSTEM_CONTACTS, ...userContacts];
  } catch (error) {
    console.warn('Failed to load emergency contacts:', error);
    return [...SYSTEM_CONTACTS];
  }
}

const KEYS = {
  PROGRESS: '@nuro:progress',
  FOCUS_AREAS: '@nuro:focus_areas',
  SAVED_TOOLS: '@nuro:saved_tools',
  REMINDERS: '@nuro:reminders',
  ONBOARDING_COMPLETE: '@nuro:onboarding_complete',
  VOICE_MODE: '@nuro:voice_mode',
};

export const DEFAULT_PROGRESS: UserProgress = {
  completedLessonIds: [],
  streak: 0,
  lastActiveDate: '',
  focusAreas: [],
};

export async function saveProgress(progress: UserProgress): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.PROGRESS, JSON.stringify(progress));
  } catch (error) {
    console.warn('Failed to save progress:', error);
  }
}

export async function loadProgress(): Promise<UserProgress | null> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.PROGRESS);
    if (!raw) return null;
    return JSON.parse(raw) as UserProgress;
  } catch (error) {
    console.warn('Failed to load progress:', error);
    return null;
  }
}

export async function saveFocusAreas(areas: Category[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.FOCUS_AREAS, JSON.stringify(areas));
  } catch (error) {
    console.warn('Failed to save focus areas:', error);
  }
}

export async function loadFocusAreas(): Promise<Category[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.FOCUS_AREAS);
    if (!raw) return [];
    return JSON.parse(raw) as Category[];
  } catch (error) {
    console.warn('Failed to load focus areas:', error);
    return [];
  }
}

export async function saveTool(tool: SavedTool): Promise<void> {
  try {
    const existing = await loadSavedTools();
    const updated = [tool, ...existing.filter((t) => t.id !== tool.id)];
    await AsyncStorage.setItem(KEYS.SAVED_TOOLS, JSON.stringify(updated));
  } catch (error) {
    console.warn('Failed to save tool:', error);
  }
}

export async function removeSavedTool(toolId: string): Promise<void> {
  try {
    const existing = await loadSavedTools();
    const updated = existing.filter((t) => t.id !== toolId);
    await AsyncStorage.setItem(KEYS.SAVED_TOOLS, JSON.stringify(updated));
  } catch (error) {
    console.warn('Failed to remove saved tool:', error);
  }
}

export async function loadSavedTools(): Promise<SavedTool[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.SAVED_TOOLS);
    if (!raw) return [];
    return JSON.parse(raw) as SavedTool[];
  } catch (error) {
    console.warn('Failed to load saved tools:', error);
    return [];
  }
}

export async function saveReminders(reminders: Reminder[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.REMINDERS, JSON.stringify(reminders));
  } catch (error) {
    console.warn('Failed to save reminders:', error);
  }
}

export async function loadReminders(): Promise<Reminder[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.REMINDERS);
    if (!raw) return [];
    return JSON.parse(raw) as Reminder[];
  } catch (error) {
    console.warn('Failed to load reminders:', error);
    return [];
  }
}

export async function markLessonComplete(lessonId: string): Promise<void> {
  try {
    const existing = await loadProgress();
    const progress = existing ?? { ...DEFAULT_PROGRESS };
    if (!progress.completedLessonIds.includes(lessonId)) {
      progress.completedLessonIds = [...progress.completedLessonIds, lessonId];
    }

    const today = new Date().toISOString().split('T')[0];
    const lastDate = progress.lastActiveDate;

    if (lastDate === today) {
      // same day — no streak change
    } else if (lastDate === getPreviousDay(today)) {
      progress.streak = progress.streak + 1;
    } else {
      progress.streak = 1;
    }
    progress.lastActiveDate = today;

    await saveProgress(progress);
  } catch (error) {
    console.warn('Failed to mark lesson complete:', error);
  }
}

export async function setOnboardingComplete(): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.ONBOARDING_COMPLETE, 'true');
  } catch (error) {
    console.warn('Failed to set onboarding complete:', error);
  }
}

export async function getOnboardingComplete(): Promise<boolean> {
  try {
    const val = await AsyncStorage.getItem(KEYS.ONBOARDING_COMPLETE);
    return val === 'true';
  } catch (error) {
    console.warn('Failed to get onboarding status:', error);
    return false;
  }
}

export type VoiceMode = 'tap' | 'handsfree' | null;

export async function saveVoiceMode(mode: VoiceMode): Promise<void> {
  try {
    if (mode === null) {
      await AsyncStorage.removeItem(KEYS.VOICE_MODE);
    } else {
      await AsyncStorage.setItem(KEYS.VOICE_MODE, mode);
    }
  } catch (error) {
    console.warn('Failed to save voice mode:', error);
  }
}

export async function getVoiceMode(): Promise<VoiceMode> {
  try {
    const val = await AsyncStorage.getItem(KEYS.VOICE_MODE);
    if (val === 'tap' || val === 'handsfree') return val;
    return null;
  } catch (error) {
    console.warn('Failed to get voice mode:', error);
    return null;
  }
}

function getPreviousDay(dateStr: string): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}
