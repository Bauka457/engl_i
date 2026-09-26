import { User } from '../types/user';
import { I18n } from '../services/i18n';
import { AudioService } from '../services/audio';
import { renderCalendarPage } from './calendar';
import { renderAchievementsPage } from './achievements';
import { renderProgressPage } from './progress';

export type TrackerTab = 'calendar' | 'achievements' | 'stats';

export function renderTrackerHub(
  user: User,
  onNavigate: (route: string) => void,
  initialTab: TrackerTab = 'calendar'
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'page-container';

  let currentTab: TrackerTab = initialTab;
  const currentLang = I18n.getLang();
  const isRu = currentLang === 'ru';

  const render = () => {
    container.innerHTML = `
      <!-- Header -->
      <div style="margin-bottom: 22px;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
          <span class="badge" style="background-color: var(--accent-amber-light); color: var(--accent-amber-hover); font-weight: 800; font-size: 0.85rem; padding: 4px 10px;">
            ${isRu ? 'Трекер привычки' : 'Habit Tracker'}
          </span>
          <span style="font-size: 0.88rem; font-weight: 800; color: var(--accent-amber);">
            🔥 ${user.streak} ${I18n.t('tracker.days_streak')}
          </span>
        </div>
        <h1 style="font-size: 1.85rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em;">
          ${I18n.t('tracker.title')}
        </h1>
        <p style="font-size: 0.95rem; color: var(--text-secondary); margin-top: 4px; max-width: 680px; line-height: 1.5;">
          ${I18n.t('tracker.subtitle')}
        </p>
      </div>

      <!-- Tracker Tabs Bar -->
      <div class="tracker-tabs-bar" style="display: flex; gap: 10px; margin-bottom: 24px; overflow-x: auto; padding-bottom: 6px; border-bottom: 2px solid var(--border-subtle);">
        <button class="btn ${currentTab === 'calendar' ? 'btn-primary' : 'btn-secondary'} t-tab-btn" data-tab="calendar" style="font-weight: 700; border-radius: var(--radius-lg); padding: 10px 18px;">
          <span>🔥</span> ${I18n.t('tracker.tab_calendar')}
        </button>
        <button class="btn ${currentTab === 'achievements' ? 'btn-primary' : 'btn-secondary'} t-tab-btn" data-tab="achievements" style="font-weight: 700; border-radius: var(--radius-lg); padding: 10px 18px;">
          <span>🏆</span> ${I18n.t('tracker.tab_achievements')}
        </button>
        <button class="btn ${currentTab === 'stats' ? 'btn-primary' : 'btn-secondary'} t-tab-btn" data-tab="stats" style="font-weight: 700; border-radius: var(--radius-lg); padding: 10px 18px;">
          <span>📊</span> ${I18n.t('tracker.tab_stats')}
        </button>
      </div>

      <!-- Tab Slot -->
      <div id="tracker-tab-content-slot"></div>
    `;

    const slot = container.querySelector('#tracker-tab-content-slot') as HTMLElement;
    if (slot) {
      if (currentTab === 'calendar') {
        slot.appendChild(renderCalendarPage(user, onNavigate));
      } else if (currentTab === 'achievements') {
        slot.appendChild(renderAchievementsPage(user, onNavigate));
      } else if (currentTab === 'stats') {
        slot.appendChild(renderProgressPage(user, onNavigate));
      }
    }

    container.querySelectorAll('.t-tab-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const tab = (e.currentTarget as HTMLElement).getAttribute('data-tab') as TrackerTab;
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
