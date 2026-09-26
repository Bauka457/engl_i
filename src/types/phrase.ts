export type PhraseStatus = 'new' | 'learning' | 'difficult' | 'learned';

export type PhraseCategory =
  | 'Everyday English'
  | 'University'
  | 'Work'
  | 'IT'
  | 'Communication'
  | 'Travel'
  | 'Feelings'
  | 'Time'
  | 'Money'
  | 'Relationships'
  | 'Technology';

export interface SentenceFeedback {
  isGood: boolean;
  correctedSentence?: string;
  grammarChecked: boolean;
  phraseUsageChecked: boolean;
  naturalnessChecked: boolean;
  comment: string;
  suggestions?: string[];
}

export interface UserSentenceRecord {
  id: string;
  sentence: string;
  feedback: SentenceFeedback;
  createdAt: string;
}

export interface Phrase {
  id: string;
  phrase: string;
  translation: string;
  pronunciation: string;
  example: string;
  exampleTranslation?: string;
  explanation: string;
  commonUsage: string;
  level: 'A1' | 'A2' | 'B1';
  category: PhraseCategory;
  status: PhraseStatus;
  lastReviewed?: string;
  reviewCount: number;
  userSentences?: UserSentenceRecord[];
}
