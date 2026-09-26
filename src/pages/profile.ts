import { User } from '../types/user';
import { StorageService } from '../services/storage';
import { ProgressService } from '../services/progress';
import { Toast } from '../components/Toast';

export function renderProfilePage(
  user: User,
  onNavigate: (route: string) => void,
  onUserUpdated: (updatedUser: User) => void
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'page-container';

  const levelInfo = ProgressService.calculateLevel(user.xp);
  const phrases = StorageService.getPhrases();
  const grammar = StorageService.getGrammar();
  const tests = StorageService.getTestResults();

  const learnedCount = phrases.filter((p) => p.status === 'learned').length;
  const completedGrammar = grammar.filter((g) => g.completed).length;

  container.innerHTML = `
    <!-- Header -->
    <div style="margin-bottom: 28px;">
      <h1 style="font-size: 1.85rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em;">
        User Profile & Goals
      </h1>
      <p style="font-size: 0.95rem; color: var(--text-secondary); margin-top: 4px;">
        Manage your personal target proficiency, daily study time, and track your account milestones.
      </p>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; max-width: 960px; margin: 0 auto;">
      <!-- Profile Overview Card -->
      <div class="card" style="padding: 32px; display: flex; flex-direction: column; align-items: center; text-align: center;">
        <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-primary), #8b5cf6); color: #fff; font-size: 2.2rem; font-weight: 800; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4);">
          ${user.name.charAt(0).toUpperCase()}
        </div>

        <h2 style="font-size: 1.45rem; font-weight: 800; color: var(--text-primary);">${user.name}</h2>
        
        <div style="display: flex; align-items: center; gap: 8px; margin: 8px 0 16px;">
          <span class="badge badge-${user.currentLevel.toLowerCase()}">${user.currentLevel}</span>
          <span style="color: var(--text-muted);">→</span>
          <span class="badge badge-${user.targetLevel.toLowerCase()}">${user.targetLevel}</span>
        </div>

        <div style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 20px;">
          Primary Goal: <strong>${user.mainGoal}</strong> • Member since ${user.createdAt.split('T')[0]}
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; width: 100%; border-top: 1px solid var(--border-subtle); padding-top: 20px; text-align: left;">
          <div>
            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Level Rank</div>
            <div style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary);">Level ${levelInfo.level}</div>
          </div>
          <div>
            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Total XP</div>
            <div style="font-size: 1.1rem; font-weight: 700; color: var(--accent-primary); font-family: var(--font-mono);">${user.xp.toLocaleString()}</div>
          </div>
          <div>
            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Current Streak</div>
            <div style="font-size: 1.1rem; font-weight: 700; color: var(--accent-amber);">🔥 ${user.streak} days</div>
          </div>
          <div>
            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Total Time</div>
            <div style="font-size: 1.1rem; font-weight: 700; color: var(--accent-emerald); font-family: var(--font-mono);">${user.totalStudyMinutes}m</div>
          </div>
        </div>
      </div>

      <!-- Edit Goals & Preferences Form -->
      <div class="card" style="padding: 28px;">
        <h3 style="font-size: 1.2rem; font-weight: 700; color: var(--text-primary); margin-bottom: 20px;">
          Target Settings
        </h3>

        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div>
            <label class="input-label">Display Name:</label>
            <input type="text" id="profile-name-input" class="input-text" value="${user.name}" />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
              <label class="input-label">Current Level:</label>
              <select id="profile-curr-level" class="input-select">
                <option value="A1" ${user.currentLevel === 'A1' ? 'selected' : ''}>A1 Beginner</option>
                <option value="A2" ${user.currentLevel === 'A2' ? 'selected' : ''}>A2 Elementary</option>
                <option value="B1" ${user.currentLevel === 'B1' ? 'selected' : ''}>B1 Intermediate</option>
              </select>
            </div>

            <div>
              <label class="input-label">Target Level:</label>
              <select id="profile-target-level" class="input-select">
                <option value="A2" ${user.targetLevel === 'A2' ? 'selected' : ''}>A2 Elementary</option>
                <option value="B1" ${user.targetLevel === 'B1' ? 'selected' : ''}>B1 Intermediate</option>
              </select>
            </div>
          </div>

          <div>
            <label class="input-label">Daily Goal (Minutes per day):</label>
            <select id="profile-daily-goal" class="input-select">
              <option value="15" ${user.dailyGoal === 15 ? 'selected' : ''}>15 minutes (Quick & Steady)</option>
              <option value="30" ${user.dailyGoal === 30 ? 'selected' : ''}>30 minutes (Standard Recommended)</option>
              <option value="45" ${user.dailyGoal === 45 ? 'selected' : ''}>45 minutes (Accelerated)</option>
              <option value="60" ${user.dailyGoal === 60 ? 'selected' : ''}>60 minutes (Intensive Immersion)</option>
            </select>
          </div>

          <div>
            <label class="input-label">Main Motivation / Domain:</label>
            <select id="profile-main-goal" class="input-select">
              <option value="Work" ${user.mainGoal === 'Work' ? 'selected' : ''}>Work & Career</option>
              <option value="University" ${user.mainGoal === 'University' ? 'selected' : ''}>University & Academic Studies</option>
              <option value="IT" ${user.mainGoal === 'IT' ? 'selected' : ''}>IT & Software Engineering</option>
              <option value="Travel" ${user.mainGoal === 'Travel' ? 'selected' : ''}>Travel & Living Abroad</option>
              <option value="Communication" ${user.mainGoal === 'Communication' ? 'selected' : ''}>Daily Communication & Friends</option>
              <option value="Personal development" ${user.mainGoal === 'Personal development' ? 'selected' : ''}>Personal Development</option>
            </select>
          </div>

          <div style="display: flex; justify-content: flex-end; margin-top: 12px;">
            <button class="btn btn-primary" id="save-profile-btn">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  container.querySelector('#save-profile-btn')?.addEventListener('click', () => {
    const nameVal = (container.querySelector('#profile-name-input') as HTMLInputElement).value.trim();
    const currLevelVal = (container.querySelector('#profile-curr-level') as HTMLSelectElement).value as any;
    const targetLevelVal = (container.querySelector('#profile-target-level') as HTMLSelectElement).value as any;
    const goalVal = parseInt((container.querySelector('#profile-daily-goal') as HTMLSelectElement).value, 10);
    const mainGoalVal = (container.querySelector('#profile-main-goal') as HTMLSelectElement).value;

    if (!nameVal) {
      Toast.show({ type: 'error', title: 'Name Required', message: 'Please provide a valid display name.' });
      return;
    }

    user.name = nameVal;
    user.currentLevel = currLevelVal;
    user.targetLevel = targetLevelVal;
    user.dailyGoal = goalVal;
    user.mainGoal = mainGoalVal;

    StorageService.saveUser(user);
    Toast.show({ type: 'success', title: 'Profile Updated', message: 'Your learning goals have been saved.' });
    onUserUpdated(user);
  });

  return container;
}
