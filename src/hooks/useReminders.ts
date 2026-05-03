import { useState, useEffect, useCallback } from 'react';
import { Reminder } from '../types';
import { loadReminders, saveReminders } from '../lib/storage';

interface UseRemindersResult {
  reminders: Reminder[];
  loading: boolean;
  addReminder: (reminder: Reminder) => Promise<void>;
  removeReminder: (id: string) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useReminders(): UseRemindersResult {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const loaded = await loadReminders();
      setReminders(loaded);
    } catch (error) {
      console.warn('useReminders refresh error:', error);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    async function init() {
      try {
        const loaded = await loadReminders();
        if (mounted) setReminders(loaded);
      } catch (error) {
        console.warn('useReminders init error:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    init();
    return () => {
      mounted = false;
    };
  }, []);

  const addReminder = useCallback(async (reminder: Reminder) => {
    try {
      const existing = await loadReminders();
      const updated = [reminder, ...existing];
      await saveReminders(updated);
      setReminders(updated);
    } catch (error) {
      console.warn('addReminder error:', error);
    }
  }, []);

  const removeReminder = useCallback(async (id: string) => {
    try {
      const existing = await loadReminders();
      const updated = existing.filter((r) => r.id !== id);
      await saveReminders(updated);
      setReminders(updated);
    } catch (error) {
      console.warn('removeReminder error:', error);
    }
  }, []);

  const toggleComplete = useCallback(async (id: string) => {
    try {
      const existing = await loadReminders();
      const updated = existing.map((r) =>
        r.id === id ? { ...r, completed: !r.completed } : r
      );
      await saveReminders(updated);
      setReminders(updated);
    } catch (error) {
      console.warn('toggleComplete error:', error);
    }
  }, []);

  return { reminders, loading, addReminder, removeReminder, toggleComplete, refresh };
}
