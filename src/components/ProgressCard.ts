import { User } from '../types/user';
import { ProgressService } from '../services/progress';

export function renderProgressCard(user: User): HTMLElement {
  const levelInfo = ProgressService.calculateLevel(user.xp);
  const targetMinutes = user.dailyGoal || 30;
  const currentMinutes = user.todayStudyMinutes || 0;
  const timePercentage = Math.min(100, Math.round((currentMinutes / targetMinutes) * 100));

  const card = document.createElement('div');
  card.className = 'card';
  card.style.background = 'linear-gradient(135deg, var(--bg-surface), var(--bg-secondary))';

  card.innerHTML = `
    <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 20px;">
      <div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="badge badge-${user.currentLevel.toLowerCase()}">${user.currentLevel}</span>
          <span style="color: var(--text-muted); font-size: 0.85rem;">→</span>
          <span class="badge badge-${user.targetLevel.toLowerCase()}">${user.targetLevel}</span>
          <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); margin-left: 6px;">Goal: ${user.mainGoal}</span>
        </div>
        <h2 style="font-size: 1.4rem; font-weight: 800; color: var(--text-primary); margin-top: 6px;">
          Level ${levelInfo.level} Learner
        </h2>
      </div>

      <div style="display: flex; gap: 12px; flex-wrap: wrap;">
        <div class="stat-chip streak" title="Current streak">
          🔥 ${user.streak} ${user.streak === 1 ? 'day' : 'days'}
        </div>
        <div class="stat-chip xp" title="Total experience points">
          ⚡ ${user.xp.toLocaleString()} XP
        </div>
      </div>
    </div>

    <!-- Dual Progress Trackers -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px;">
      <!-- Level XP Tracker -->
      <div>
        <div style="display: flex; justify-content: space-between; font-size: 0.82rem; font-weight: 600; margin-bottom: 6px;">
          <span style="color: var(--text-secondary);">XP to Level ${levelInfo.level + 1}</span>
          <span style="color: var(--accent-primary); font-family: var(--font-mono);">${levelInfo.currentXpInLevel} / ${levelInfo.nextLevelXpRequired} XP</span>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill" style="width: ${levelInfo.progressPercentage}%;"></div>
        </div>
      </div>

      <!-- Today Study Time Tracker -->
      <div>
        <div style="display: flex; justify-content: space-between; font-size: 0.82rem; font-weight: 600; margin-bottom: 6px;">
          <span style="color: var(--text-secondary);">Today's Goal</span>
          <span style="color: var(--accent-emerald); font-family: var(--font-mono);">${currentMinutes} / ${targetMinutes} min (${timePercentage}%)</span>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill progress-bar-emerald" style="width: ${timePercentage}%;"></div>
        </div>
      </div>
    </div>
  `;

  return card;
}
