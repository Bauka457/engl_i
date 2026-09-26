import { User } from '../types/user';
import { I18n } from '../services/i18n';
import { AudioService } from '../services/audio';
import { renderPhrasesPage } from './phrases';
import { renderListeningPage } from './listening';
import { renderSpeakingPage } from './speaking';
import { renderTestsPage } from './tests';

export type PracticeTab = 'phrases' | 'listening' | 'speaking' | 'tests';

export function renderPracticeHub(
  user: User,
  onNavigate: (route: string) => void,
  initialTab: PracticeTab = 'phrases'
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'page-container';

  let currentTab: PracticeTab = initialTab;
  const currentLang = I18n.getLang();
  const isRu = currentLang === 'ru';

  const render = () => {
    container.innerHTML = `
      <!-- Header -->
      <div style="margin-bottom: 22px;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
          <span class="badge" style="background-color: var(--accent-green-light); color: var(--accent-green-hover); font-weight: 800; font-size: 0.85rem; padding: 4px 10px;">
            ${isRu ? 'Тренажер навыков' : 'Practice Gym'}
          </span>
          <span style="font-size: 0.88rem; font-weight: 700; color: var(--text-muted);">
            ${user.currentLevel} → ${user.targetLevel}
          </span>
        </div>
        <h1 style="font-size: 1.85rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em;">
          ${I18n.t('practice.title')}
        </h1>
        <p style="font-size: 0.95rem; color: var(--text-secondary); margin-top: 4px; max-width: 680px; line-height: 1.5;">
          ${I18n.t('practice.subtitle')}
        </p>
      </div>

      <!-- Practice Navigation Tabs (Like Duolingo / Modern Habit Trackers) -->
      <div class="practice-tabs-bar" style="display: flex; gap: 10px; margin-bottom: 24px; overflow-x: auto; padding-bottom: 6px; border-bottom: 2px solid var(--border-subtle);">
        <button class="btn ${currentTab === 'phrases' ? 'btn-primary' : 'btn-secondary'} p-tab-btn" data-tab="phrases" style="font-weight: 700; border-radius: var(--radius-lg); padding: 10px 18px;">
          <span>💬</span> ${I18n.t('practice.tab_phrases')}
        </button>
        <button class="btn ${currentTab === 'listening' ? 'btn-primary' : 'btn-secondary'} p-tab-btn" data-tab="listening" style="font-weight: 700; border-radius: var(--radius-lg); padding: 10px 18px;">
          <span>🎧</span> ${I18n.t('practice.tab_listening')}
        </button>
        <button class="btn ${currentTab === 'speaking' ? 'btn-primary' : 'btn-secondary'} p-tab-btn" data-tab="speaking" style="font-weight: 700; border-radius: var(--radius-lg); padding: 10px 18px;">
          <span>🎙️</span> ${I18n.t('practice.tab_speaking')}
        </button>
        <button class="btn ${currentTab === 'tests' ? 'btn-primary' : 'btn-secondary'} p-tab-btn" data-tab="tests" style="font-weight: 700; border-radius: var(--radius-lg); padding: 10px 18px;">
          <span>📝</span> ${I18n.t('practice.tab_tests')}
        </button>
      </div>

      <!-- Tab Content Area -->
      <div id="practice-tab-content-slot"></div>
    `;

    // Render active tab content
    const slot = container.querySelector('#practice-tab-content-slot') as HTMLElement;
    if (slot) {
      if (currentTab === 'phrases') {
        slot.appendChild(renderPhrasesPage(user, onNavigate));
      } else if (currentTab === 'listening') {
        slot.appendChild(renderListeningPage(user, onNavigate));
      } else if (currentTab === 'speaking') {
        slot.appendChild(renderSpeakingPage(user, onNavigate));
      } else if (currentTab === 'tests') {
        slot.appendChild(renderTestsPage(user, onNavigate));
      }
    }

    // Tab buttons click
    container.querySelectorAll('.p-tab-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const tab = (e.currentTarget as HTMLElement).getAttribute('data-tab') as PracticeTab;
        if (tab && tab !== currentTab) {
          AudioService.playPop();
          currentTab = tab;
          render();
        }
      });
    });
  };

  render();
  return container;
}
