import { useState, useEffect, useCallback } from 'react';
import { Category } from '../types';
import {
  getOnboardingComplete,
  setOnboardingComplete,
  loadFocusAreas,
  saveFocusAreas,
  loadProgress,
  saveProgress,
} from '../lib/storage';

interface UseOnboardingResult {
  onboardingComplete: boolean;
  loading: boolean;
  focusAreas: Category[];
  completeOnboarding: () => Promise<void>;
  updateFocusAreas: (areas: Category[]) => Promise<void>;
}

export function useOnboarding(): UseOnboardingResult {
  const [onboardingComplete, setComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [focusAreas, setFocusAreas] = useState<Category[]>([]);

  useEffect(() => {
    let mounted = true;
    async function init() {
      try {
        const [complete, areas] = await Promise.all([
          getOnboardingComplete(),
          loadFocusAreas(),
        ]);
        if (mounted) {
          setComplete(complete);
          setFocusAreas(areas);
        }
      } catch (error) {
        console.warn('useOnboarding init error:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    init();
    return () => {
      mounted = false;
    };
  }, []);

  const completeOnboarding = useCallback(async () => {
    try {
      await setOnboardingComplete();
      setComplete(true);
    } catch (error) {
      console.warn('completeOnboarding error:', error);
    }
  }, []);

  const updateFocusAreas = useCallback(async (areas: Category[]) => {
    try {
      setFocusAreas(areas);
      await saveFocusAreas(areas);
      // Also persist focus areas into progress
      const existing = await loadProgress();
      const progress = existing ?? {
        completedLessonIds: [],
        streak: 0,
        lastActiveDate: '',
        focusAreas: [],
      };
      progress.focusAreas = areas;
      await saveProgress(progress);
    } catch (error) {
      console.warn('updateFocusAreas error:', error);
    }
  }, []);

  return { onboardingComplete, loading, focusAreas, completeOnboarding, updateFocusAreas };
}
