import { User } from '../types/user';
import { StorageService } from '../services/storage';
import { I18n } from '../services/i18n';
import { AudioService } from '../services/audio';

export function renderOnboarding(onComplete: (user: User) => void): HTMLElement {
  const container = document.createElement('div');
  container.className = 'onboarding-wrapper';
  container.style.cssText = `
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: var(--bg-primary);
  `;

  const isRu = I18n.getLang() === 'ru';

  container.innerHTML = `
    <div class="card" style="max-width: 540px; width: 100%; padding: 36px 32px; border-radius: var(--radius-xl); box-shadow: var(--shadow-lg); border: 2px solid var(--border-strong);">
      <div style="text-align: center; margin-bottom: 28px;">
        <div style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-green), #10b981); color: #fff; font-size: 1.8rem; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 14px; box-shadow: 0 4px 14px rgba(34, 197, 94, 0.35);">
          🦉
        </div>
        <h1 style="font-size: 1.85rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em;">
          ${I18n.t('onboard.welcome')}
        </h1>
        <p style="font-size: 1.05rem; font-weight: 700; color: var(--accent-green-hover); margin-top: 4px;">
          ${I18n.t('onboard.tagline')}
        </p>
        <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 8px; line-height: 1.5;">
          ${I18n.t('onboard.subtitle')}
        </p>
      </div>

      <form id="onboarding-form" style="display: flex; flex-direction: column; gap: 18px;">
        <div>
          <label class="input-label" for="onboarding-name">${I18n.t('onboard.name_label')}</label>
          <input 
            type="text" 
            id="onboarding-name" 
            class="input-text" 
            placeholder="${I18n.t('onboard.name_placeholder')}" 
            required 
            autocomplete="name"
            style="font-size: 1rem; padding: 12px 14px;"
          />
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
          <div>
            <label class="input-label" for="onboarding-current-level">${I18n.t('onboard.current_lvl')}</label>
            <select id="onboarding-current-level" class="input-select" style="padding: 10px 12px;">
              <option value="A1" selected>A1 (${isRu ? 'Начальный' : 'Beginner'})</option>
              <option value="A2">A2 (${isRu ? 'Базовый' : 'Elementary'})</option>
              <option value="B1">B1 (${isRu ? 'Средний' : 'Intermediate'})</option>
            </select>
          </div>

          <div>
            <label class="input-label" for="onboarding-target-level">${I18n.t('onboard.target_lvl')}</label>
            <select id="onboarding-target-level" class="input-select" style="padding: 10px 12px;">
              <option value="A2">A2 (${isRu ? 'Базовый разговорный' : 'Elementary'})</option>
              <option value="B1" selected>B1 (${isRu ? 'Уверенный разговорный' : 'Intermediate'})</option>
            </select>
          </div>
        </div>

        <div>
          <label class="input-label" for="onboarding-daily-goal">${I18n.t('onboard.daily_goal')}</label>
          <select id="onboarding-daily-goal" class="input-select" style="padding: 10px 12px;">
            <option value="15">${I18n.t('onboard.min_15')}</option>
            <option value="30" selected>${I18n.t('onboard.min_30')}</option>
            <option value="45">${I18n.t('onboard.min_45')}</option>
          </select>
        </div>

        <div>
          <label class="input-label" for="onboarding-main-goal">${I18n.t('onboard.main_goal')}</label>
          <select id="onboarding-main-goal" class="input-select" style="padding: 10px 12px;">
            <option value="Work" selected>${I18n.t('onboard.goal_work')}</option>
            <option value="IT">${I18n.t('onboard.goal_it')}</option>
            <option value="Travel">${I18n.t('onboard.goal_travel')}</option>
            <option value="Communication">${I18n.t('onboard.goal_friends')}</option>
            <option value="University">${I18n.t('onboard.goal_study')}</option>
          </select>
        </div>

        <button type="submit" class="btn btn-duo btn-lg" style="margin-top: 10px; width: 100%; font-size: 1.05rem;">
          ${I18n.t('onboard.start_btn')}
        </button>
      </form>
    </div>
  `;

  const form = container.querySelector('#onboarding-form') as HTMLFormElement;
  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    AudioService.playSuccess();

    const nameInput = container.querySelector('#onboarding-name') as HTMLInputElement;
    const currentLvl = (container.querySelector('#onboarding-current-level') as HTMLSelectElement).value as 'A1' | 'A2' | 'B1';
    const targetLvl = (container.querySelector('#onboarding-target-level') as HTMLSelectElement).value as 'A2' | 'B1';
    const dailyGoalMinutes = parseInt((container.querySelector('#onboarding-daily-goal') as HTMLSelectElement).value, 10);
    const mainGoal = (container.querySelector('#onboarding-main-goal') as HTMLSelectElement).value;

    const newUser: User = {
      id: 'usr-' + Date.now(),
      name: nameInput.value.trim() || (isRu ? 'Ученик' : 'Learner'),
      currentLevel: currentLvl,
      targetLevel: targetLvl,
      dailyGoal: dailyGoalMinutes,
      mainGoal,
      streak: 1, // Start with 1st day streak!
      longestStreak: 1,
      createdAt: new Date().toISOString(),
      lastActivityDate: new Date().toISOString().split('T')[0],
      xp: 50, // Welcome bonus
      totalStudyMinutes: 0,
      todayStudyMinutes: 0
    };

    StorageService.saveUser(newUser);

    // Save language setting to Russian by default
    const settings = StorageService.getSettings();
    settings.language = 'Russian';
    StorageService.saveSettings(settings);

    onComplete(newUser);
  });

  return container;
}
