export interface User {
  id: string;
  name: string;
  currentLevel: 'A1' | 'A2' | 'B1';
  targetLevel: 'A2' | 'B1';
  dailyGoal: number; // 15, 30, 45, 60 minutes
  mainGoal: string;  // 'Work' | 'University' | 'IT' | 'Travel' | 'Communication' | 'Personal development'
  xp: number;
  streak: number;
  longestStreak: number;
  totalStudyMinutes: number;
  createdAt: string;
  lastActivityDate?: string;
  todayStudyMinutes: number;
}

export interface UserState {
  mood?: string;
  availableTime: number;
  currentLevel: 'A1' | 'A2' | 'B1';
  targetLevel: 'A2' | 'B1';
  mainGoal: string;
  recentProgress?: string;
  weakSkills?: string[];
  streak: number;
  learnedPhrasesCount?: number;
  previousSessionsSummary?: string;
  userPrompt?: string;
}
