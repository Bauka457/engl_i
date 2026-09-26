import { User } from '../types/user';
import { StorageService } from './storage';
import { StreakService } from './streak';
import { Toast } from '../components/Toast';

export interface LevelInfo {
  level: number;
  currentXpInLevel: number;
  nextLevelXpRequired: number;
  totalXp: number;
  progressPercentage: number;
}

const LEVEL_THRESHOLDS = [0, 250, 500, 800, 1200, 1700, 2300, 3000, 4000, 5500, 7500, 10000];

export const ProgressService = {
  calculateLevel(xp: number): LevelInfo {
    let level = 1;
    for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
      if (xp >= LEVEL_THRESHOLDS[i]) {
        level = i + 1;
      } else {
        break;
      }
    }

    const currentLevelBase = LEVEL_THRESHOLDS[level - 1] || 0;
    const nextLevelTarget = LEVEL_THRESHOLDS[level] || (currentLevelBase + 1000);
    const xpIntoLevel = xp - currentLevelBase;
    const levelSpan = nextLevelTarget - currentLevelBase;
    const percentage = Math.min(100, Math.max(0, Math.round((xpIntoLevel / levelSpan) * 100)));

    return {
      level,
      currentXpInLevel: xpIntoLevel,
      nextLevelXpRequired: levelSpan,
      totalXp: xp,
      progressPercentage: percentage
    };
  },

  addXp(amount: number, reason: string): { user: User; leveledUp: boolean; newLevel: number } | null {
    const user = StorageService.getUser();
    if (!user) return null;

    const oldLevel = this.calculateLevel(user.xp).level;
    user.xp = (user.xp || 0) + amount;
    const newLevelInfo = this.calculateLevel(user.xp);

    StorageService.saveUser(user);

    // Update calendar day with XP
    this.updateCalendarEntry(0, 0, amount);

    let leveledUp = false;
    if (newLevelInfo.level > oldLevel) {
      leveledUp = true;
      Toast.show({
        type: 'achievement',
        title: `Level Up! 🎉`,
        message: `Congratulations! You reached Level ${newLevelInfo.level}!`
      });
    } else {
      Toast.show({
        type: 'success',
        title: `+${amount} XP Earned`,
        message: reason
      });
    }

    this.checkAchievements();
    return { user, leveledUp, newLevel: newLevelInfo.level };
  },

  updateCalendarEntry(minutes: number, tasksCount: number, xp: number): void {
    const today = StreakService.getTodayDateString();
    const history = StorageService.getHistory();
    const existing = history.find(h => h.date === today);

    if (existing) {
      existing.minutes += minutes;
      existing.tasksCompleted += tasksCount;
      existing.xpEarned += xp;
      if (existing.tasksCompleted >= 3 || existing.minutes >= 15) {
        existing.status = 'completed';
      } else if (existing.tasksCompleted > 0 || existing.minutes > 0) {
        existing.status = 'partial';
      }
    } else {
      history.push({
        date: today,
        status: tasksCount >= 3 || minutes >= 15 ? 'completed' : 'partial',
        minutes,
        tasksCompleted: tasksCount,
        totalTasks: 5,
        xpEarned: xp
      });
    }

    StorageService.saveHistory(history);
  },

  checkAchievements(): void {
    const user = StorageService.getUser();
    if (!user) return;

    const achievements = StorageService.getAchievements();
    const phrases = StorageService.getPhrases();
    const grammar = StorageService.getGrammar();
    const testResults = StorageService.getTestResults();

    const learnedPhrasesCount = phrases.filter(p => p.status === 'learned' || (p.reviewCount && p.reviewCount >= 2)).length;
    const completedGrammarCount = grammar.filter(g => g.completed).length;
    const perfectTests = testResults.filter(t => t.score === t.total && t.total > 0).length;

    let anyUnlocked = false;

    achievements.forEach(ach => {
      if (ach.unlocked) return;

      let currentVal = 0;
      switch (ach.id) {
        case 'ach-first-day':
          currentVal = user.totalStudyMinutes > 0 ? 1 : 0;
          break;
        case 'ach-streak-3':
          currentVal = user.streak;
          break;
        case 'ach-streak-7':
          currentVal = user.streak;
          break;
        case 'ach-streak-30':
          currentVal = user.streak;
          break;
        case 'ach-phrases-10':
          currentVal = learnedPhrasesCount;
          break;
        case 'ach-phrases-50':
          currentVal = learnedPhrasesCount;
          break;
        case 'ach-perfect-test':
          currentVal = perfectTests;
          break;
        case 'ach-tests-10':
          currentVal = testResults.length;
          break;
        case 'ach-grammar-5':
          currentVal = completedGrammarCount;
          break;
        case 'ach-hours-10':
          currentVal = user.totalStudyMinutes;
          break;
        default:
          break;
      }

      ach.progress = Math.min(ach.maxProgress, currentVal);

      if (ach.progress >= ach.maxProgress) {
        ach.unlocked = true;
        ach.unlockedAt = new Date().toISOString();
        anyUnlocked = true;

        Toast.show({
          type: 'achievement',
          title: `Achievement Unlocked! ${ach.icon}`,
          message: `${ach.title}: ${ach.description}`
        });
      }
    });

    if (anyUnlocked) {
      StorageService.saveAchievements(achievements);
    }
  }
};
