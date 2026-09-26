import { User, UserState } from '../types/user';
import { StorageService } from '../services/storage';
import { AIService } from '../services/ai';
import { AudioService } from '../services/audio';
import { I18n } from '../services/i18n';
import { renderProgressCard } from '../components/ProgressCard';
import { Toast } from '../components/Toast';
import { INITIAL_PHRASES } from '../data/phrases';

export function renderDashboard(
  user: User,
  onNavigate: (route: string) => void
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'page-container';

  // Determine dynamic time greeting
  const hour = new Date().getHours();
  let greetingKey = 'dash.good_afternoon';
  if (hour >= 5 && hour < 12) greetingKey = 'dash.good_morning';
  else if (hour >= 18 || hour < 5) greetingKey = 'dash.good_evening';

  const dailyPlan = StorageService.getDailyPlan();
  const phrases = StorageService.getPhrases();
  const featuredPhrase = phrases && phrases.length > 0
    ? phrases[Math.floor(Math.random() * phrases.length)]
    : INITIAL_PHRASES[0];

  container.innerHTML = `
    <!-- Top Welcome Banner -->
    <div style="margin-bottom: 24px;">
      <h1 style="font-size: 1.85rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em;">
        ${I18n.t(greetingKey)}, ${user.name} 👋
      </h1>
      <p style="font-size: 1rem; color: var(--text-secondary); margin-top: 4px;">
        ${I18n.t('dash.ready_sub')} <strong>${user.currentLevel}</strong> ${I18n.t('dash.to')} <strong>${user.targetLevel}</strong>.
      </p>
    </div>

    <!-- Progress Card -->
    <div id="dashboard-progress-slot" style="margin-bottom: 28px;"></div>

    <!-- Today's State - Main AI Input Card -->
    <div class="card" style="margin-bottom: 28px; border-color: rgba(99, 102, 241, 0.3); background: linear-gradient(180deg, var(--bg-surface), var(--bg-secondary));">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
        <div>
          <h2 class="card-title" style="font-size: 1.3rem;">
            <span>✨</span> ${I18n.t('dash.state_title')}
          </h2>
          <p class="card-subtitle">
            ${I18n.t('dash.state_subtitle')}
          </p>
        </div>
        <span class="badge" style="background-color: var(--accent-primary-light); color: var(--accent-primary);">
          ${I18n.t('dash.ai_engine')}
        </span>
      </div>

      <!-- Quick Mood / Time Presets -->
      <div class="preset-buttons-row" style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px;">
        <button class="btn btn-secondary btn-sm preset-btn" data-preset="I'm tired today. I had a long day and only have 15 minutes. Keep it light and gentle.">
          ${I18n.t('dash.preset_tired')}
        </button>
        <button class="btn btn-secondary btn-sm preset-btn" data-preset="I have 30 minutes. I want to improve my speaking and learn practical phrases.">
          ${I18n.t('dash.preset_speaking')}
        </button>
        <button class="btn btn-secondary btn-sm preset-btn" data-preset="I feel energized! I have 45 minutes to master grammar rules and practice writing.">
          ${I18n.t('dash.preset_energized')}
        </button>
        <button class="btn btn-secondary btn-sm preset-btn" data-preset="I have university exams soon. Give me a 30-minute balanced session with test practice.">
          ${I18n.t('dash.preset_exam')}
        </button>
      </div>

      <!-- Textarea Input -->
      <div style="margin-bottom: 16px;">
        <textarea 
          id="user-state-input" 
          class="textarea-custom" 
          placeholder="Tell me how you feel today, how much time you have, what you want to improve...&#10;&#10;Example: I had university until 18:00. I only have 20 minutes today. I want to practice speaking and everyday phrases."
          style="font-size: 16px; min-height: 100px;"
        >${dailyPlan ? dailyPlan.userStateText : ''}</textarea>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
        <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
          <label style="font-size: 0.85rem; font-weight: 600; color: var(--text-secondary);">${I18n.t('dash.time_available')}</label>
          <select id="user-time-select" class="input-select" style="width: auto; padding: 6px 12px; font-size: 0.85rem;">
            <option value="15" ${user.dailyGoal === 15 ? 'selected' : ''}>15 min</option>
            <option value="30" ${user.dailyGoal === 30 || !user.dailyGoal ? 'selected' : ''}>30 min</option>
            <option value="45" ${user.dailyGoal === 45 ? 'selected' : ''}>45 min</option>
            <option value="60" ${user.dailyGoal === 60 ? 'selected' : ''}>60 min</option>
          </select>
        </div>

        <button class="btn btn-primary" id="create-plan-btn" style="min-width: 180px;">
          <span>⚡</span> ${I18n.t('dash.create_plan_btn')}
        </button>
      </div>
    </div>

    <!-- Active Daily Plan Section -->
    <div id="daily-plan-preview-container" style="margin-bottom: 28px;"></div>

    <!-- Quick Exploration Grid -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
      <!-- Featured Phrase of the Day -->
      <div class="card card-interactive" id="card-featured-phrase">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <span style="font-size: 0.75rem; font-weight: 700; color: var(--accent-primary); text-transform: uppercase;">
            💬 ${I18n.t('dash.phrase_of_day')}
          </span>
          <div style="display: flex; align-items: center; gap: 6px;">
            <button class="btn btn-sm btn-ghost" id="listen-featured-phrase-btn" title="Listen" style="padding: 2px 6px;">
              🔊
            </button>
            <span class="badge badge-${featuredPhrase.level.toLowerCase()}">${featuredPhrase.level}</span>
          </div>
        </div>
        <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin-bottom: 4px;">
          ${featuredPhrase.phrase}
        </h3>
        <div style="font-size: 0.95rem; color: var(--accent-emerald); font-weight: 600; margin-bottom: 10px;">
          ${featuredPhrase.translation}
        </div>
        <div style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 14px;">
          "${featuredPhrase.example}"
        </div>
        <div style="display: flex; justify-content: flex-end;">
          <span style="font-size: 0.82rem; font-weight: 600; color: var(--accent-primary);">${I18n.t('dash.practice_phrases')}</span>
        </div>
      </div>

      <!-- Quick Speaking Hub -->
      <div class="card card-interactive" id="card-speaking-quick">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <span style="font-size: 0.75rem; font-weight: 700; color: var(--accent-amber); text-transform: uppercase;">
            🎙️ ${I18n.t('dash.speaking_lab')}
          </span>
          <span class="badge" style="background-color: var(--accent-amber-light); color: var(--accent-amber);">AI Tutor</span>
        </div>
        <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin-bottom: 6px;">
          Practice Spoken English
        </h3>
        <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 14px;">
          ${I18n.t('dash.speaking_desc')}
        </p>
        <div style="display: flex; justify-content: flex-end;">
          <span style="font-size: 0.82rem; font-weight: 600; color: var(--accent-amber);">${I18n.t('dash.launch_speaking')}</span>
        </div>
      </div>
    </div>
  `;

  // Render Progress Card
  const progressSlot = container.querySelector('#dashboard-progress-slot');
  if (progressSlot) {
    progressSlot.appendChild(renderProgressCard(user));
  }

  // Audio for Featured Phrase
  container.querySelector('#listen-featured-phrase-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    AudioService.playPop();
    AudioService.speak(featuredPhrase.phrase);
  });

  // Preset Buttons
  container.querySelectorAll('.preset-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const text = target.getAttribute('data-preset') || '';
      const input = container.querySelector('#user-state-input') as HTMLTextAreaElement;
      if (input) {
        input.value = text;
        AudioService.playPop();
        input.focus();
      }
    });
  });

  // Render Daily Plan Preview if available
  const planContainer = container.querySelector('#daily-plan-preview-container');
  if (planContainer && dailyPlan) {
    const isCompleted = dailyPlan.tasks.every((t) => t.completed);
    planContainer.innerHTML = `
      <div class="card" style="padding: 24px; border-left: 4px solid var(--accent-primary);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
          <div>
            <span style="font-size: 0.75rem; font-weight: 700; color: var(--accent-primary); text-transform: uppercase;">
              Active Daily Plan
            </span>
            <h3 style="font-size: 1.2rem; font-weight: 700; color: var(--text-primary);">${dailyPlan.motivation || 'Daily Plan'}</h3>
          </div>
          <button class="btn btn-secondary btn-sm" id="view-full-plan-btn">
            Open Plan (${dailyPlan.totalMinutes} min) →
          </button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${dailyPlan.tasks
            .map(
              (task) => `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-radius: var(--radius-md); background-color: var(--bg-surface); border: 1px solid var(--border-subtle);">
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="color: ${task.completed ? 'var(--accent-emerald)' : 'var(--text-muted)'}; font-size: 1.1rem;">
                  ${task.completed ? '✅' : '⚪'}
                </span>
                <span style="font-size: 0.9rem; font-weight: 600; color: var(--text-primary); ${task.completed ? 'text-decoration: line-through; opacity: 0.7;' : ''}">
                  ${task.title}
                </span>
              </div>
              <span style="font-size: 0.8rem; color: var(--text-muted);">${task.duration} min</span>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `;

    planContainer.querySelector('#view-full-plan-btn')?.addEventListener('click', () => {
      onNavigate('/daily-plan');
    });
  }

  // Create Plan Button Click
  const createBtn = container.querySelector('#create-plan-btn') as HTMLButtonElement;
  createBtn?.addEventListener('click', async () => {
    const textInput = container.querySelector('#user-state-input') as HTMLTextAreaElement;
    const timeSelect = container.querySelector('#user-time-select') as HTMLSelectElement;

    const promptText = textInput.value.trim() || 'I am ready to learn English today with a balanced session.';
    const timeMinutes = parseInt(timeSelect.value, 10) || 30;

    createBtn.disabled = true;
    createBtn.textContent = 'Generating...';
    AudioService.playPop();

    try {
      const userState: UserState = {
        mood: 'Adaptive',
        availableTime: timeMinutes,
        currentLevel: user.currentLevel,
        targetLevel: user.targetLevel,
        mainGoal: user.mainGoal,
        streak: user.streak,
        learnedPhrasesCount: StorageService.getLearnedPhrasesCount(),
        userPrompt: promptText
      };

      const newPlan = await AIService.generateDailyPlan(userState);
      StorageService.saveDailyPlan(newPlan);

      AudioService.playSuccess();
      Toast.show({
        type: 'success',
        title: 'Plan Generated!',
        message: `Your custom ${timeMinutes}-minute session is ready.`
      });

      onNavigate('/daily-plan');
    } catch (err) {
      console.error(err);
      AudioService.playError();
      Toast.show({
        type: 'error',
        title: 'Failed to create plan',
        message: 'Could not generate plan. Please try again.'
      });
    } finally {
      createBtn.disabled = false;
      createBtn.innerHTML = '<span>⚡</span> Create Today\'s Plan';
    }
  });

  // Featured phrase card click
  container.querySelector('#card-featured-phrase')?.addEventListener('click', () => {
    onNavigate('/phrases');
  });

  // Speaking card click
  container.querySelector('#card-speaking-quick')?.addEventListener('click', () => {
    onNavigate('/speaking');
  });

  return container;
}
