import { User } from '../types/user';
import { I18n } from '../services/i18n';

export interface NavItem {
  id: string;
  route: string;
  icon: string;
  labelRu: string;
  labelEn: string;
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  {
    id: 'nav.learn',
    route: '/dashboard',
    icon: '🗺️',
    labelRu: 'Сегодня',
    labelEn: 'Today'
  },
  {
    id: 'nav.tracker',
    route: '/progress',
    icon: '🔥',
    labelRu: 'Прогресс',
    labelEn: 'Progress'
  },
  {
    id: 'nav.practice',
    route: '/practice',
    icon: '💬',
    labelRu: 'Практика',
    labelEn: 'Practice'
  },
  {
    id: 'nav.settings',
    route: '/settings',
    icon: '⚙️',
    labelRu: 'Настройки',
    labelEn: 'Settings'
  }
];

export function renderSidebar(
  currentRoute: string,
  user: User | null,
  onNavigate: (route: string) => void,
  onLanguageToggle?: () => void
): HTMLElement {
  const sidebar = document.createElement('aside');
  sidebar.className = 'app-sidebar';
  sidebar.id = 'app-sidebar';

  const currentLang = I18n.getLang();

  // Route matching
  const isRouteActive = (route: string) => {
    if (route === '/dashboard' && (currentRoute === '/' || currentRoute === '/dashboard')) return true;
    if (route === '/practice' && (currentRoute === '/practice' || currentRoute === '/phrases' || currentRoute === '/listening' || currentRoute === '/speaking' || currentRoute === '/tests')) return true;
    if (route === '/progress' && (currentRoute === '/tracker' || currentRoute === '/calendar' || currentRoute === '/achievements' || currentRoute === '/progress')) return true;
    return currentRoute === route;
  };

  sidebar.innerHTML = `
    <div class="sidebar-header">
      <div class="brand-badge" id="brand-home-link" style="cursor: pointer;">
        <div class="brand-icon" style="background: linear-gradient(135deg, var(--accent-green), #10b981);">EJ</div>
        <div class="brand-name">
          <span style="font-weight: 800; font-size: 1.15rem; color: var(--text-primary);">English Journey</span>
          <span class="brand-tagline" style="color: var(--accent-green-hover); font-weight: 700; font-size: 0.78rem;">
            ${currentLang === 'ru' ? 'Английский от A1 до B1' : 'A1 → B1 Mastery'}
          </span>
        </div>
      </div>
      <button class="sidebar-close-btn" id="sidebar-close-btn" aria-label="Close sidebar">✕</button>
    </div>

    <!-- Main Navigation Links -->
    <nav class="sidebar-nav" style="gap: 8px; padding: 20px 14px;">
      ${MAIN_NAV_ITEMS.map(
        (item) => `
        <div 
          class="nav-item ${isRouteActive(item.route) ? 'active' : ''}" 
          data-route="${item.route}"
          role="button"
          tabindex="0"
          style="padding: 12px 16px; border-radius: var(--radius-lg); font-size: 0.95rem; font-weight: 700;"
        >
          <span style="font-size: 1.35rem; line-height: 1;">${item.icon}</span>
          <span>${currentLang === 'ru' ? item.labelRu : item.labelEn}</span>
        </div>
      `
      ).join('')}
    </nav>

    <!-- Sidebar Footer with User info & language -->
    ${
      user
        ? `
      <div class="sidebar-footer" style="padding: 16px; border-top: 1px solid var(--border-subtle);">
        <div class="user-snippet" id="sidebar-user-snippet" title="${currentLang === 'ru' ? 'Открыть настройки' : 'Settings & Profile'}" style="padding: 10px 14px; border-radius: var(--radius-lg); cursor: pointer;">
          <div class="user-avatar-sm" style="background: linear-gradient(135deg, var(--accent-green), #059669); font-weight: 800; color: #fff;">${user.name.charAt(0).toUpperCase()}</div>
          <div class="user-info-sm">
            <span class="user-name-sm" style="font-weight: 700; font-size: 0.9rem;">${user.name}</span>
            <span class="user-level-badge-sm" style="color: var(--accent-green-hover); font-weight: 700; font-size: 0.75rem;">${user.currentLevel} → ${user.targetLevel}</span>
          </div>
        </div>

        <button class="sidebar-lang-btn" id="sidebar-lang-switch-btn" title="Переключить язык" style="margin-top: 12px; border-radius: var(--radius-md); padding: 8px 12px; width: 100%; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-weight: 600; font-size: 0.85rem;">${currentLang === 'ru' ? '🇷🇺 Русский' : '🇬🇧 English'}</span>
          <span style="font-size: 0.78rem; font-weight: 700; color: var(--accent-primary);">${currentLang === 'ru' ? 'Сменить ⇄' : 'Switch ⇄'}</span>
        </button>
      </div>
    `
        : ''
    }
  `;

  sidebar.querySelector('#sidebar-close-btn')?.addEventListener('click', () => {
    sidebar.classList.remove('open');
    document.getElementById('sidebar-backdrop')?.classList.remove('open');
  });

  sidebar.querySelector('#brand-home-link')?.addEventListener('click', () => {
    onNavigate('/dashboard');
  });

  sidebar.querySelectorAll('.nav-item').forEach((item) => {
    item.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const route = target.getAttribute('data-route') || '/dashboard';
      onNavigate(route);
      sidebar.classList.remove('open');
      document.getElementById('sidebar-backdrop')?.classList.remove('open');
    });
  });

  sidebar.querySelector('#sidebar-user-snippet')?.addEventListener('click', () => {
    onNavigate('/settings');
    sidebar.classList.remove('open');
    document.getElementById('sidebar-backdrop')?.classList.remove('open');
  });

  sidebar.querySelector('#sidebar-lang-switch-btn')?.addEventListener('click', () => {
    I18n.toggleLang();
    onLanguageToggle?.();
  });

  return sidebar;
}

export function renderBottomNav(
  currentRoute: string,
  onNavigate: (route: string) => void
): HTMLElement {
  const bottomNav = document.createElement('nav');
  bottomNav.className = 'mobile-bottom-nav';

  const currentLang = I18n.getLang();

  const isRouteActive = (route: string) => {
    if (route === '/dashboard' && (currentRoute === '/' || currentRoute === '/dashboard')) return true;
    if (route === '/practice' && (currentRoute === '/practice' || currentRoute === '/phrases' || currentRoute === '/listening' || currentRoute === '/speaking' || currentRoute === '/tests')) return true;
    if (route === '/progress' && (currentRoute === '/tracker' || currentRoute === '/calendar' || currentRoute === '/achievements' || currentRoute === '/progress')) return true;
    return currentRoute === route;
  };

  bottomNav.innerHTML = MAIN_NAV_ITEMS
    .map(
      (m) => `
    <button class="mobile-nav-btn ${isRouteActive(m.route) ? 'active' : ''}" data-route="${m.route}">
      <span class="mobile-nav-icon">${m.icon}</span>
      <span class="mobile-nav-label" style="font-size: 0.68rem; font-weight: 700;">${currentLang === 'ru' ? m.labelRu : m.labelEn}</span>
    </button>
  `
    )
    .join('');

  bottomNav.querySelectorAll('.mobile-nav-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const route = target.getAttribute('data-route') || '/dashboard';
      onNavigate(route);
    });
  });

  return bottomNav;
}
