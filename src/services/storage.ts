import { User } from '../types/user';
import { Phrase } from '../types/phrase';
import { GrammarLesson, ReadingArticle } from '../types/lesson';
import { Achievement, AppSettings, CalendarDay, DailyPlan } from '../types/progress';
import { TestResult } from '../types/test';
import { INITIAL_PHRASES } from '../data/phrases';
import { INITIAL_GRAMMAR_LESSONS } from '../data/grammar';
import { INITIAL_ACHIEVEMENTS } from '../data/achievements';
import { INITIAL_READING_ARTICLES } from '../data/reading';

const KEYS = {
  USER: 'englishJourney_user',
  PROGRESS: 'englishJourney_progress',
  PHRASES: 'englishJourney_phrases',
  GRAMMAR: 'englishJourney_grammar',
  READING: 'englishJourney_reading',
  HISTORY: 'englishJourney_history',
  TESTS: 'englishJourney_tests',
  SETTINGS: 'englishJourney_settings',
  ACHIEVEMENTS: 'englishJourney_achievements',
  DAILY_PLAN: 'englishJourney_dailyPlan',
  COMPLETED_LESSONS: 'englishJourney_completedLessons'
};

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  language: 'English',
  dailyGoal: 30,
  targetLevel: 'B1',
  preferredStudyTime: 'Evening (18:00 - 21:00)',
  voiceEnabled: true,
  demoMode: true
};

export const StorageService = {
  // USER
  getUser(): User | null {
    try {
      const data = localStorage.getItem(KEYS.USER);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error loading user from localStorage', e);
      return null;
    }
  },

  saveUser(user: User): void {
    try {
      localStorage.setItem(KEYS.USER, JSON.stringify(user));
    } catch (e) {
      console.error('Error saving user to localStorage', e);
    }
  },

  // PHRASES
  getPhrases(): Phrase[] {
    try {
      const data = localStorage.getItem(KEYS.PHRASES);
      if (data) {
        return JSON.parse(data);
      }
      this.savePhrases(INITIAL_PHRASES);
      return INITIAL_PHRASES;
    } catch (e) {
      console.error('Error loading phrases', e);
      return INITIAL_PHRASES;
    }
  },

  savePhrases(phrases: Phrase[]): void {
    try {
      localStorage.setItem(KEYS.PHRASES, JSON.stringify(phrases));
    } catch (e) {
      console.error('Error saving phrases', e);
    }
  },

  updatePhrase(phrase: Phrase): void {
    const list = this.getPhrases();
    const idx = list.findIndex((p) => p.id === phrase.id);
    if (idx !== -1) {
      list[idx] = phrase;
      this.savePhrases(list);
    }
  },

  addPhrase(phrase: Phrase): void {
    const list = this.getPhrases();
    list.unshift(phrase);
    this.savePhrases(list);
  },

  getLearnedPhrasesCount(): number {
    return this.getPhrases().filter((p) => p.status === 'learned').length;
  },

  // GRAMMAR
  getGrammar(): GrammarLesson[] {
    try {
      const data = localStorage.getItem(KEYS.GRAMMAR);
      if (data) {
        return JSON.parse(data);
      }
      this.saveGrammar(INITIAL_GRAMMAR_LESSONS);
      return INITIAL_GRAMMAR_LESSONS;
    } catch (e) {
      console.error('Error loading grammar', e);
      return INITIAL_GRAMMAR_LESSONS;
    }
  },

  saveGrammar(lessons: GrammarLesson[]): void {
    try {
      localStorage.setItem(KEYS.GRAMMAR, JSON.stringify(lessons));
    } catch (e) {
      console.error('Error saving grammar', e);
    }
  },

  // READING
  getReading(): ReadingArticle[] {
    try {
      const data = localStorage.getItem(KEYS.READING);
      if (data) {
        return JSON.parse(data);
      }
      this.saveReading(INITIAL_READING_ARTICLES);
      return INITIAL_READING_ARTICLES;
    } catch (e) {
      console.error('Error loading reading', e);
      return INITIAL_READING_ARTICLES;
    }
  },

  saveReading(articles: ReadingArticle[]): void {
    try {
      localStorage.setItem(KEYS.READING, JSON.stringify(articles));
    } catch (e) {
      console.error('Error saving reading', e);
    }
  },

  // DAILY PLAN
  getDailyPlan(): DailyPlan | null {
    try {
      const data = localStorage.getItem(KEYS.DAILY_PLAN);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error loading daily plan', e);
      return null;
    }
  },

  saveDailyPlan(plan: DailyPlan | null): void {
    try {
      if (plan === null) {
        localStorage.removeItem(KEYS.DAILY_PLAN);
      } else {
        localStorage.setItem(KEYS.DAILY_PLAN, JSON.stringify(plan));
      }
    } catch (e) {
      console.error('Error saving daily plan', e);
    }
  },

  // ACHIEVEMENTS
  getAchievements(): Achievement[] {
    try {
      const data = localStorage.getItem(KEYS.ACHIEVEMENTS);
      if (data) {
        return JSON.parse(data);
      }
      this.saveAchievements(INITIAL_ACHIEVEMENTS);
      return INITIAL_ACHIEVEMENTS;
    } catch (e) {
      console.error('Error loading achievements', e);
      return INITIAL_ACHIEVEMENTS;
    }
  },

  saveAchievements(achievements: Achievement[]): void {
    try {
      localStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    } catch (e) {
      console.error('Error saving achievements', e);
    }
  },

  // SETTINGS
  getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch (e) {
      console.error('Error loading settings', e);
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving settings', e);
    }
  },

  // CALENDAR / STUDY HISTORY
  getHistory(): CalendarDay[] {
    try {
      const data = localStorage.getItem(KEYS.HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error loading history', e);
      return [];
    }
  },

  saveHistory(history: CalendarDay[]): void {
    try {
      localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
    } catch (e) {
      console.error('Error saving history', e);
    }
  },

  // TESTS HISTORY
  getTestResults(): TestResult[] {
    try {
      const data = localStorage.getItem(KEYS.TESTS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error loading tests', e);
      return [];
    }
  },

  saveTestResult(result: TestResult): void {
    try {
      const list = this.getTestResults();
      list.unshift(result);
      // Keep last 50 tests
      localStorage.setItem(KEYS.TESTS, JSON.stringify(list.slice(0, 50)));
    } catch (e) {
      console.error('Error saving test result', e);
    }
  },

  // FULL EXPORT / IMPORT / RESET
  exportAllData(): string {
    const backup = {
      version: 1,
      exportedAt: new Date().toISOString(),
      user: this.getUser(),
      phrases: this.getPhrases(),
      grammar: this.getGrammar(),
      reading: this.getReading(),
      dailyPlan: this.getDailyPlan(),
      achievements: this.getAchievements(),
      settings: this.getSettings(),
      history: this.getHistory(),
      testResults: this.getTestResults()
    };
    return JSON.stringify(backup, null, 2);
  },

  importAllData(jsonString: string): boolean {
    try {
      const backup = JSON.parse(jsonString);
      if (!backup || typeof backup !== 'object') return false;
      if (!backup.user && !backup.phrases && !backup.settings) return false;

      if (backup.user) this.saveUser(backup.user);
      if (backup.phrases) this.savePhrases(backup.phrases);
      if (backup.grammar) this.saveGrammar(backup.grammar);
      if (backup.reading) this.saveReading(backup.reading);
      if (backup.dailyPlan) this.saveDailyPlan(backup.dailyPlan);
      if (backup.achievements) this.saveAchievements(backup.achievements);
      if (backup.settings) this.saveSettings(backup.settings);
      if (backup.history) this.saveHistory(backup.history);
      if (backup.testResults) {
        localStorage.setItem(KEYS.TESTS, JSON.stringify(backup.testResults));
      }
      return true;
    } catch (e) {
      console.error('Invalid JSON in importAllData', e);
      return false;
    }
  },

  resetProgress(): void {
    try {
      const user = this.getUser();
      if (user) {
        user.xp = 0;
        user.streak = 1;
        user.longestStreak = 1;
        user.totalStudyMinutes = 0;
        user.todayStudyMinutes = 0;
        user.lastActivityDate = new Date().toISOString().split('T')[0];
        this.saveUser(user);
      }
      this.savePhrases(INITIAL_PHRASES);
      this.saveGrammar(INITIAL_GRAMMAR_LESSONS);
      this.saveReading(INITIAL_READING_ARTICLES);
      this.saveAchievements(INITIAL_ACHIEVEMENTS);
      this.saveDailyPlan(null);
      this.saveHistory([]);
      localStorage.removeItem(KEYS.TESTS);
    } catch (e) {
      console.error('Error resetting progress', e);
    }
  },

  resetAllProgress(): void {
    this.resetProgress();
  },

  // JOURNEY LESSONS
  getCompletedLessons(): string[] {
    try {
      const data = localStorage.getItem(KEYS.COMPLETED_LESSONS);
      return data ? JSON.parse(data) : ['les-1']; // first lesson completed by default or start
    } catch (e) {
      return ['les-1'];
    }
  },

  completeLesson(id: string): void {
    try {
      const list = this.getCompletedLessons();
      if (!list.includes(id)) {
        list.push(id);
        localStorage.setItem(KEYS.COMPLETED_LESSONS, JSON.stringify(list));
      }
    } catch (e) {
      console.error('Error completing lesson', e);
    }
  },

  isLessonCompleted(id: string): boolean {
    return this.getCompletedLessons().includes(id);
  }
};
