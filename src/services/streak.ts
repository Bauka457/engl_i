import { User } from '../types/user';
import { StorageService } from './storage';

export const StreakService = {
  getTodayDateString(): string {
    const now = new Date();
    return now.toISOString().split('T')[0];
  },

  getYesterdayDateString(): string {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  },

  checkAndUpdateStreak(user: User): { updatedUser: User; streakIncremented: boolean } {
    const today = this.getTodayDateString();
    const yesterday = this.getYesterdayDateString();
    const lastActive = user.lastActivityDate;

    let streakIncremented = false;

    if (!lastActive) {
      user.streak = 1;
      user.longestStreak = Math.max(user.longestStreak || 1, 1);
      user.lastActivityDate = today;
      user.todayStudyMinutes = user.todayStudyMinutes || 0;
      streakIncremented = true;
    } else if (lastActive === today) {
      // Already active today, streak doesn't increase multiple times on same day
      streakIncremented = false;
    } else if (lastActive === yesterday) {
      // Kept streak alive!
      user.streak += 1;
      if (user.streak > user.longestStreak) {
        user.longestStreak = user.streak;
      }
      user.lastActivityDate = today;
      user.todayStudyMinutes = 0; // Reset today's study minutes for new day
      streakIncremented = true;
    } else {
      // Missed more than 1 day
      user.streak = 1;
      user.lastActivityDate = today;
      user.todayStudyMinutes = 0;
      streakIncremented = true;
    }

    StorageService.saveUser(user);
    return { updatedUser: user, streakIncremented };
  },

  recordStudyTime(minutes: number): User | null {
    const user = StorageService.getUser();
    if (!user) return null;

    const today = this.getTodayDateString();
    if (user.lastActivityDate !== today) {
      this.checkAndUpdateStreak(user);
    }

    user.todayStudyMinutes = (user.todayStudyMinutes || 0) + minutes;
    user.totalStudyMinutes = (user.totalStudyMinutes || 0) + minutes;
    user.lastActivityDate = today;

    StorageService.saveUser(user);
    return user;
  }
};
