import { User } from '../types/user';
import { StorageService } from '../services/storage';
import { I18n } from '../services/i18n';

export function renderAchievementsPage(
  _user: User,
  _onNavigate: (route: string) => void
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'achievements-page-wrapper';

  const achievements = StorageService.getAchievements();
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const currentLang = I18n.getLang();
  const isRu = currentLang === 'ru';

  container.innerHTML = `
    <!-- Header -->
    <div style="margin-bottom: 24px;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
        <span class="badge" style="background-color: var(--accent-amber-light); color: var(--accent-amber-hover); font-weight: 800;">
          ${isRu ? 'Награды и вехи' : 'Milestones'}
        </span>
        <span style="font-size: 0.88rem; font-weight: 800; color: var(--accent-amber);">
          ${isRu ? `Открыто ${unlockedCount} из ${achievements.length}` : `${unlockedCount} of ${achievements.length} Unlocked`}
        </span>
      </div>
      <h2 style="font-size: 1.6rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em;">
        ${I18n.t('ach.title')}
      </h2>
      <p style="font-size: 0.92rem; color: var(--text-secondary); max-width: 650px; margin-top: 4px;">
        ${isRu ? 'Каждый день непрерывной серии, пройденный тест и выученная фраза приносят награды. Следите за достижениями по мере продвижения к B1.' : 'Every consistent habit, completed test, and speaking session earns recognition. Track your milestones as you advance to B1.'}
      </p>
    </div>

    <!-- Overall Progress Card -->
    <div class="card" style="margin-bottom: 28px; padding: 20px 24px; border: 2px solid var(--border-strong);">
      <div style="display: flex; justify-content: space-between; font-size: 0.95rem; font-weight: 800; margin-bottom: 8px;">
        <span>${isRu ? 'Коллекция наград' : 'Trophy Room Progress'}</span>
        <span style="color: var(--accent-amber);">${Math.round((unlockedCount / achievements.length) * 100)}%</span>
      </div>
      <div class="progress-bar-track" style="height: 10px;">
        <div class="progress-bar-fill" style="width: ${(unlockedCount / achievements.length) * 100}%; background: linear-gradient(90deg, var(--accent-amber), #f59e0b);"></div>
      </div>
    </div>

    <!-- Achievements Grid -->
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 18px;">
      ${achievements
        .map((ach) => {
          const progressPct = Math.min(100, Math.round((ach.progress / ach.maxProgress) * 100));
          const achTitle = isRu && ach.titleRu ? ach.titleRu : ach.title;
          const achDesc = isRu && ach.descriptionRu ? ach.descriptionRu : ach.description;

          return `
            <div 
              class="card" 
              style="padding: 22px; opacity: ${ach.unlocked ? '1' : '0.8'}; border-color: ${
            ach.unlocked ? 'var(--accent-amber-border)' : 'var(--border-strong)'
          }; border-width: 2px; background: ${
            ach.unlocked
              ? 'linear-gradient(135deg, var(--bg-surface), var(--bg-surface-hover))'
              : 'var(--bg-surface)'
          };"
            >
              <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 12px;">
                <div style="font-size: 2.4rem; line-height: 1;">${ach.icon}</div>
                <span class="badge" style="background-color: ${
                  ach.unlocked ? 'var(--accent-green-light)' : 'var(--bg-secondary)'
                }; color: ${ach.unlocked ? 'var(--accent-green-hover)' : 'var(--text-muted)'}; font-weight: 800;">
                  ${ach.unlocked ? I18n.t('ach.unlocked_badge') : I18n.t('ach.in_progress')}
                </span>
              </div>

              <h3 style="font-size: 1.1rem; font-weight: 800; color: var(--text-primary); margin-bottom: 4px;">
                ${achTitle}
              </h3>
              <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.45; margin-bottom: 16px;">
                ${achDesc}
              </p>

              <!-- Progress bar per achievement -->
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 4px;">
                  <span>${I18n.t('ach.progress_label')}</span>
                  <span style="font-family: var(--font-mono);">${ach.progress} / ${ach.maxProgress}</span>
                </div>
                <div class="progress-bar-track" style="height: 6px;">
                  <div class="progress-bar-fill ${ach.unlocked ? 'progress-bar-emerald' : ''}" style="width: ${progressPct}%;"></div>
                </div>
              </div>

              ${
                ach.unlockedAt
                  ? `<div style="font-size: 0.75rem; color: var(--accent-green-hover); font-weight: 700; margin-top: 10px;">${isRu ? 'Получено: ' : 'Unlocked: '}${ach.unlockedAt.split('T')[0]}</div>`
                  : ''
              }
            </div>
          `;
        })
        .join('')}
    </div>
  `;

  return container;
}
