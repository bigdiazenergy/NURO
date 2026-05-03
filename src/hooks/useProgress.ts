import { useState, useEffect, useCallback } from 'react';
import { UserProgress } from '../types';
import { loadProgress, markLessonComplete as storageMarkComplete, DEFAULT_PROGRESS } from '../lib/storage';
import { isLessonComplete as checkComplete } from '../lib/progress';

interface UseProgressResult {
  progress: UserProgress;
  loading: boolean;
  markComplete: (lessonId: string) => Promise<void>;
  isComplete: (lessonId: string) => boolean;
  refresh: () => Promise<void>;
}

export function useProgress(): UseProgressResult {
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const loaded = await loadProgress();
      setProgress(loaded ?? DEFAULT_PROGRESS);
    } catch (error) {
      console.warn('useProgress refresh error:', error);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    async function init() {
      try {
        const loaded = await loadProgress();
        if (mounted) {
          setProgress(loaded ?? DEFAULT_PROGRESS);
        }
      } catch (error) {
        console.warn('useProgress init error:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    init();
    return () => {
      mounted = false;
    };
  }, []);

  const markComplete = useCallback(async (lessonId: string) => {
    try {
      await storageMarkComplete(lessonId);
      const updated = await loadProgress();
      setProgress(updated ?? DEFAULT_PROGRESS);
    } catch (error) {
      console.warn('markComplete error:', error);
    }
  }, []);

  const isComplete = useCallback(
    (lessonId: string) => checkComplete(lessonId, progress),
    [progress]
  );

  return { progress, loading, markComplete, isComplete, refresh };
}
