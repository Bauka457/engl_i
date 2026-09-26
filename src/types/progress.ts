export interface DailyTask {
  id: string;
  type:
    | 'phrases'
    | 'grammar'
    | 'reading'
    | 'listening'
    | 'speaking'
    | 'writing'
    | 'test';
  title: string;
  description: string;
  duration: number; // in minutes
  completed: boolean;
  linkRoute: string;
}

export interface DailyPlan {
  id: string;
  date: string; // YYYY-MM-DD
  source?: 'ai' | 'local';
  userStateText: string;
  totalMinutes: number;
  motivation: string;
  tasks: DailyTask[];
  completed: boolean;
  completedAt?: string;
  bonusXpAwarded?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  titleRu?: string;
  descriptionRu?: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  category: 'streak' | 'phrases' | 'tests' | 'study_time' | 'skills';
}

export interface CalendarDay {
  date: string; // YYYY-MM-DD
  status: 'completed' | 'partial' | 'missed' | 'empty';
  minutes: number;
  tasksCompleted: number;
  totalTasks: number;
  xpEarned: number;
}

export interface AppSettings {
  theme: 'dark' | 'light';
  language: 'English' | 'Russian';
  dailyGoal: number; // 15, 30, 45, 60
  targetLevel: 'A2' | 'B1';
  preferredStudyTime: string;
  voiceEnabled: boolean;
  demoMode: boolean;
}
