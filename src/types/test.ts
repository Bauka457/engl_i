export type QuestionType =
  | 'multiple_choice'
  | 'true_false'
  | 'sentence_completion'
  | 'phrase_selection';

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'A1' | 'A2' | 'B1';
  category: 'phrases' | 'grammar' | 'sentence_building' | 'reading';
}

export interface QuestionResult {
  questionId: string;
  questionText: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
  category: 'phrases' | 'grammar' | 'sentence_building' | 'reading';
}

export interface TestResult {
  id: string;
  date: string;
  score: number;
  total: number;
  percentage: number;
  breakdown: {
    grammar: { correct: number; total: number };
    phrases: { correct: number; total: number };
    sentenceBuilding: { correct: number; total: number };
  };
  details: QuestionResult[];
}
