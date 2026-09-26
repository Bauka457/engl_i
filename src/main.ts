import './index.css';
import { User } from './types/user';
import { StorageService } from './services/storage';
import { StreakService } from './services/streak';
import { ProgressService } from './services/progress';
import { I18n } from './services/i18n';
import { renderSidebar, renderBottomNav } from './components/Sidebar';
import { renderHeader } from './components/Header';
import { renderOnboarding } from './pages/onboarding';
import { renderJourneyRoadmap } from './pages/journey-roadmap';
import { renderDailyPlanPage } from './pages/daily-plan';
import { renderPracticeHub } from './pages/practice';
import { renderTrackerHub } from './pages/tracker';
import { renderSettingsPage } from './pages/settings';
import { renderTodayPage } from './pages/today';
import { renderLevelCheckPage } from './pages/level-check';

class App {
  private user: User | null = null;
  private currentRoute: string = '/dashboard';
  private rootElement: HTMLElement;

  constructor() {
    this.rootElement = document.getElementById('app') || document.body;
    this.init();
  }

  private init(): void {
    // Apply user theme (default to clean light or saved theme)
    const settings = StorageService.getSettings();
    document.documentElement.setAttribute('data-theme', settings.theme || 'light');

    // Listen for language changes to re-render UI immediately
    I18n.onLanguageChange(() => {
      this.renderAppShell();
    });

    // Retrieve or initialize user
    this.user = StorageService.getUser();

    // Setup routing listener
    window.addEventListener('popstate', () => {
      this.handleRouteFromUrl();
    });

    if (!this.user) {
      this.renderOnboardingScreen();
    } else {
      // Check streak & achievements
      const { updatedUser } = StreakService.checkAndUpdateStreak(this.user);
      this.user = updatedUser;
      ProgressService.checkAchievements();

      this.handleRouteFromUrl();
    }
  }

  private renderOnboardingScreen(): void {
    this.rootElement.innerHTML = '';
    const onboardingEl = renderOnboarding((newUser) => {
      this.user = newUser;
      this.navigate('/dashboard');
    });
    this.rootElement.appendChild(onboardingEl);
  }

  private handleRouteFromUrl(): void {
    let path = window.location.hash.replace(/^#/, '') || window.location.pathname;
    if (!path || path === '/' || path === '/index.html') {
      path = '/dashboard';
    }
    this.currentRoute = path;
    this.renderAppShell();
  }

  public navigate(route: string): void {
    this.currentRoute = route;
    window.history.pushState(null, '', `#${route}`);
    this.renderAppShell();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private getPageTitle(route: string): string {
    const isRu = I18n.getLang() === 'ru';
    switch (route) {
      case '/dashboard':
      case '/':
        return isRu ? 'Сегодня' : 'Today';
      case '/daily-plan':
        return isRu ? 'План на день' : 'Daily Plan';
      case '/practice':
      case '/phrases':
      case '/listening':
      case '/speaking':
      case '/tests':
      case '/writing':
      case '/reading':
      case '/grammar':
        return isRu ? 'Практика' : 'Practice Gym';
      case '/tracker':
      case '/calendar':
      case '/achievements':
      case '/progress':
        return isRu ? 'Трекер привычки' : 'Habit Tracker';
      case '/settings':
      case '/profile':
        return isRu ? 'Настройки' : 'Settings';
      default:
        return 'English Journey';
    }
  }

  private renderCurrentPage(user: User): HTMLElement {
    const route = this.currentRoute;

    if (route === '/dashboard' || route === '/') {
      return renderTodayPage(user, (r) => this.navigate(r));
    }

    if (route === '/tests') {
      return renderLevelCheckPage(user, () => this.renderAppShell());
    }

    if (route === '/daily-plan') {
      return renderDailyPlanPage(user, (r) => this.navigate(r));
    }

    if (route === '/practice') {
      return renderPracticeHub(user, (r) => this.navigate(r), 'phrases');
    }
    if (route === '/phrases') {
      return renderPracticeHub(user, (r) => this.navigate(r), 'phrases');
    }
    if (route === '/listening') {
      return renderPracticeHub(user, (r) => this.navigate(r), 'listening');
    }
    if (route === '/speaking') {
      return renderPracticeHub(user, (r) => this.navigate(r), 'speaking');
    }
    if (route === '/tracker' || route === '/calendar') {
      return renderTrackerHub(user, (r) => this.navigate(r), 'calendar');
    }
    if (route === '/achievements') {
      return renderTrackerHub(user, (r) => this.navigate(r), 'achievements');
    }
    if (route === '/progress') {
      return renderTrackerHub(user, (r) => this.navigate(r), 'stats');
    }

    if (route === '/settings' || route === '/profile') {
      return renderSettingsPage(
        user,
        (r) => this.navigate(r),
        () => {
          this.user = StorageService.getUser();
          this.navigate('/dashboard');
        }
      );
    }

    // Default fallback
    return renderJourneyRoadmap(
      user,
      (r) => this.navigate(r),
      () => {
        this.user = StorageService.getUser();
        this.renderAppShell();
      }
    );
  }

  private renderAppShell(): void {
    if (!this.user) {
      this.renderOnboardingScreen();
      return;
    }

    // Refresh user state from storage
    this.user = StorageService.getUser() || this.user;

    this.rootElement.innerHTML = '';

    const appContainer = document.createElement('div');
    appContainer.className = 'app-container';

    // Mobile Backdrop
    const backdrop = document.createElement('div');
    backdrop.id = 'sidebar-backdrop';
    backdrop.className = 'sidebar-backdrop';
    backdrop.addEventListener('click', () => {
      sidebar.classList.remove('open');
      backdrop.classList.remove('open');
    });
    appContainer.appendChild(backdrop);

    // Sidebar
    const sidebar = renderSidebar(
      this.currentRoute,
      this.user,
      (r) => this.navigate(r),
      () => this.renderAppShell()
    );
    appContainer.appendChild(sidebar);

    // Main Content
    const mainWrapper = document.createElement('main');
    mainWrapper.className = 'app-main';

    // Header with language change callback
    const pageTitle = this.getPageTitle(this.currentRoute);
    const header = renderHeader(
      pageTitle,
      this.user,
      () => {
        sidebar.classList.toggle('open');
        backdrop.classList.toggle('open');
      },
      () => {
        this.renderAppShell();
      }
    );
    mainWrapper.appendChild(header);

    // Page Content Slot
    const pageContent = this.renderCurrentPage(this.user);
    mainWrapper.appendChild(pageContent);

    // Mobile Bottom Nav
    const bottomNav = renderBottomNav(this.currentRoute, (r) => this.navigate(r));
    mainWrapper.appendChild(bottomNav);

    appContainer.appendChild(mainWrapper);
    this.rootElement.appendChild(appContainer);
  }
}

// Bootstrap Application
new App();
