export interface GrammarRule {
  rule: string;
  detail?: string;
}

export interface GrammarExample {
  en: string;
  ru: string;
}

export interface GrammarMistake {
  wrong: string;
  right: string;
  why: string;
}

export interface GrammarExercise {
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface GrammarLesson {
  id: string;
  title: string;
  level: 'A1' | 'A2' | 'B1';
  category: string;
  description: string;
  explanation: string;
  rules: string[];
  examples: GrammarExample[];
  commonMistakes: GrammarMistake[];
  miniExercise: GrammarExercise;
  completed: boolean;
  lastStudied?: string;
}

export interface ReadingQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ReadingArticle {
  id: string;
  title: string;
  level: 'A1' | 'A2' | 'B1';
  readingTime: number; // in minutes
  category: string;
  text: string;
  vocabularyHints: Array<{ word: string; meaning: string }>;
  questions: ReadingQuestion[];
  completed?: boolean;
  bestScore?: number;
}
