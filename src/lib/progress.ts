import { UserProgress, Category, Lesson } from '../types';

export function getStreakDays(progress: UserProgress): number {
  return progress.streak;
}

export function isLessonComplete(lessonId: string, progress: UserProgress): boolean {
  return progress.completedLessonIds.includes(lessonId);
}

export function getCompletedCount(progress: UserProgress): number {
  return progress.completedLessonIds.length;
}

export function getCategoryProgress(
  category: Category,
  progress: UserProgress,
  lessons: Lesson[]
): { completed: number; total: number } {
  const categoryLessons = lessons.filter((l) => l.category === category);
  const completed = categoryLessons.filter((l) =>
    progress.completedLessonIds.includes(l.id)
  ).length;
  return { completed, total: categoryLessons.length };
}

export function getLastCompletedLesson(
  progress: UserProgress,
  lessons: Lesson[]
): Lesson | undefined {
  if (progress.completedLessonIds.length === 0) return undefined;
  const lastId = progress.completedLessonIds[progress.completedLessonIds.length - 1];
  return lessons.find((l) => l.id === lastId);
}

export function getNextSuggestedLesson(
  progress: UserProgress,
  lessons: Lesson[]
): Lesson | undefined {
  const focusAreas = progress.focusAreas;
  const incomplete = lessons.filter((l) => !progress.completedLessonIds.includes(l.id));
  if (focusAreas.length > 0) {
    const focusIncomplete = incomplete.filter((l) => focusAreas.includes(l.category));
    if (focusIncomplete.length > 0) return focusIncomplete[0];
  }
  return incomplete[0];
}
