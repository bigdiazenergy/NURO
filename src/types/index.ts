export type Category = 'appointments' | 'money' | 'daily-living' | 'communication';

export interface Step {
  id: string;
  text: string;
  detail?: string;
}

export interface Script {
  id: string;
  title: string;
  context: string;
  lines: string[];
  alternates?: string[];
}

export interface ChecklistItem {
  id: string;
  text: string;
  detail?: string;
}

export interface Lesson {
  id: string;
  category: Category;
  title: string;
  summary: string;
  estimatedMinutes: number;
  steps: Step[];
  checklist: ChecklistItem[];
  scripts: Script[];
  tags: string[];
}

export interface Reminder {
  id: string;
  title: string;
  category: Category;
  dueAt: string;
  repeatRule: 'none' | 'daily' | 'weekly' | 'monthly';
  completed: boolean;
}

export interface SavedTool {
  id: string;
  type: 'checklist' | 'script' | 'note';
  title: string;
  content: string;
  category: Category;
  savedAt: string;
  sourceKey?: string;
}

export interface UserProgress {
  completedLessonIds: string[];
  streak: number;
  lastActiveDate: string;
  focusAreas: Category[];
}

export type RootStackParamList = {
  Welcome: undefined;
  FocusArea: undefined;
  VoiceSetup: undefined;
  Main: undefined;
  LessonList: { category: Category; title: string };
  LessonDetail: { lessonId: string };
  Checklist: { lessonId: string };
  Script: { lessonId: string; scriptId: string };
  ReminderSetup: { lessonId?: string };
  // Emergency
  EmergencyTopicPicker: undefined;
  EmergencyRightNow: { lessonId: string };
  EmergencyLesson: { lessonId: string };
  EmergencyContacts: undefined;
};
