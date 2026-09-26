import { User } from '../types/user';
import { StorageService } from '../services/storage';
import { I18n } from '../services/i18n';

export function renderHeader(
  pageTitle: string,
  user: User | null,
  onToggleSidebar: () => void,
  onLanguageChanged?: () => void
): HTMLElement {
  const header = document.createElement('header');
  header.className = 'app-header';

  const settings = StorageService.getSettings();
  const isDark = settings.theme === 'dark';
  const currentLang = I18n.getLang();
  const isRu = currentLang === 'ru';

  header.innerHTML = `
    <div class="header-left">
      <button class="mobile-menu-btn" id="mobile-menu-toggle-btn" aria-label="Открыть меню">
        <span style="font-size: 1.35rem; line-height: 1;">☰</span>
      </button>
      <h1 class="page-title-badge" style="font-size: 1.1rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.01em;">
        ${pageTitle}
      </h1>
    </div>

    <div class="header-right" style="display: flex; align-items: center; gap: 8px;">
      ${
        user
          ? `
        <div class="stat-chip streak" title="${isRu ? 'Серия дней занятий подряд' : 'Daily study streak'}" style="display: flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: var(--radius-full); background-color: var(--accent-amber-light); border: 1.5px solid var(--accent-amber-border);">
          <span style="font-size: 1.1rem;">🔥</span>
          <span class="stat-val" style="font-weight: 800; font-size: 0.9rem; color: var(--accent-amber-hover);">${user.streak} ${isRu ? 'дн' : 'd'}</span>
        </div>
        <div class="stat-chip xp" title="${isRu ? 'Накопленные очки опыта' : 'Experience points'}" style="display: flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: var(--radius-full); background-color: var(--accent-green-light); border: 1.5px solid var(--accent-green-border);">
          <span style="font-size: 1.1rem;">⚡</span>
          <span class="stat-val" style="font-weight: 800; font-size: 0.9rem; color: var(--accent-green-hover);">${user.xp.toLocaleString()} XP</span>
        </div>
      `
          : ''
      }

      <!-- Quick Language Switcher Button -->
      <button 
        class="lang-toggle-btn" 
        id="header-lang-toggle-btn" 
        aria-label="Сменить язык интерфейса" 
        title="${isRu ? 'Switch to English' : 'Переключить на русский'}"
        style="display: flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: var(--radius-full); border: 1.5px solid var(--border-strong); background-color: var(--bg-surface); cursor: pointer; font-weight: 700; font-size: 0.85rem;"
      >
        <span class="lang-flag">${currentLang === 'ru' ? '🇷🇺' : '🇬🇧'}</span>
        <span class="lang-code" style="color: var(--text-primary);">${currentLang.toUpperCase()}</span>
      </button>

      <!-- Theme Switcher -->
      <button 
        class="theme-toggle-btn" 
        id="theme-toggle-btn" 
        aria-label="Переключить тему оформления" 
        title="${isRu ? 'Сменить тему' : 'Toggle theme'}"
        style="width: 38px; height: 38px; border-radius: 50%; border: 1.5px solid var(--border-strong); background-color: var(--bg-surface); display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 1.1rem;"
      >
        <span id="theme-icon">${isDark ? '☀️' : '🌙'}</span>
      </button>
    </div>
  `;

  header.querySelector('#mobile-menu-toggle-btn')?.addEventListener('click', () => {
    onToggleSidebar();
  });

  header.querySelector('#header-lang-toggle-btn')?.addEventListener('click', () => {
    I18n.toggleLang();
    onLanguageChanged?.();
  });

  header.querySelector('#theme-toggle-btn')?.addEventListener('click', () => {
    const current = StorageService.getSettings();
    const newTheme = current.theme === 'dark' ? 'light' : 'dark';
    current.theme = newTheme;
    StorageService.saveSettings(current);

    document.documentElement.setAttribute('data-theme', newTheme);
    const icon = header.querySelector('#theme-icon');
    if (icon) icon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
  });

  return header;
}
