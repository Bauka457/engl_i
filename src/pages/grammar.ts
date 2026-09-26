import { User } from '../types/user';
import { GrammarLesson } from '../types/lesson';
import { StorageService } from '../services/storage';
import { I18n } from '../services/i18n';
import { AudioService } from '../services/audio';
import { renderGrammarCard } from '../components/GrammarCard';

export function renderGrammarPage(
  _user: User,
  _onNavigate: (route: string) => void
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'page-container';

  let lessons = StorageService.getGrammar();
  let currentLevelFilter: 'All' | 'A1' | 'A2' | 'B1' = 'All';
  const isRu = I18n.getLang() === 'ru';

  container.innerHTML = `
    <!-- Header -->
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
      <div>
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
          <span class="badge" style="background-color: var(--accent-green-light); color: var(--accent-green-hover); font-weight: 800;">
            ${isRu ? 'Грамматический путь' : 'Grammar Roadmap'}
          </span>
          <span style="font-size: 0.88rem; font-weight: 700; color: var(--text-muted);" id="grammar-stats-badge"></span>
        </div>
        <h2 style="font-size: 1.6rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em;">
          ${isRu ? 'Грамматика от A1 до B1' : 'A1 → B1 Grammar Roadmap'}
        </h2>
        <p style="font-size: 0.92rem; color: var(--text-secondary); max-width: 650px; margin-top: 4px; line-height: 1.5;">
          ${isRu ? 'Ключевые правила без заумных терминов: понятная логика построения предложений, живые примеры, типичные ошибки и быстрые упражнения.' : 'Understand core mechanics without tedious academic jargon. Every topic features practical rules, real examples, common traps, and mini-exercises.'}
        </p>
      </div>

      <!-- Level Tab Buttons -->
      <div style="display: flex; gap: 6px; background-color: var(--bg-surface); padding: 4px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);" id="grammar-level-tabs">
        <button class="btn btn-sm btn-primary level-tab" data-level="All" style="font-weight: 700;">${isRu ? 'Все темы' : 'All Topics'}</button>
        <button class="btn btn-sm btn-secondary level-tab" data-level="A1" style="font-weight: 700;">A1</button>
        <button class="btn btn-sm btn-secondary level-tab" data-level="A2" style="font-weight: 700;">A2</button>
        <button class="btn btn-sm btn-secondary level-tab" data-level="B1" style="font-weight: 700;">B1</button>
      </div>
    </div>

    <!-- Lessons List -->
    <div id="grammar-lessons-list" style="display: flex; flex-direction: column; gap: 24px;"></div>
  `;

  const listContainer = container.querySelector('#grammar-lessons-list') as HTMLElement;
  const statsBadge = container.querySelector('#grammar-stats-badge') as HTMLElement;

  const renderLessons = () => {
    listContainer.innerHTML = '';

    const filtered = lessons.filter(
      (l) => currentLevelFilter === 'All' || l.level === currentLevelFilter
    );

    const completedTotal = lessons.filter((l) => l.completed).length;
    statsBadge.textContent = isRu
      ? `${completedTotal} из ${lessons.length} тем пройдено (${Math.round((completedTotal / lessons.length) * 100)}%)`
      : `${completedTotal} of ${lessons.length} topics completed (${Math.round((completedTotal / lessons.length) * 100)}%)`;

    filtered.forEach((lesson) => {
      const card = renderGrammarCard(lesson, (updated) => {
        const idx = lessons.findIndex((l) => l.id === updated.id);
        if (idx !== -1) {
          lessons[idx] = updated;
          renderLessons();
        }
      });
      listContainer.appendChild(card);
    });
  };

  renderLessons();

  // Tab Switching
  container.querySelectorAll('.level-tab').forEach((tab) => {
    tab.addEventListener('click', (e) => {
      AudioService.playPop();
      const target = e.currentTarget as HTMLButtonElement;
      currentLevelFilter = (target.getAttribute('data-level') as any) || 'All';

      container.querySelectorAll('.level-tab').forEach((t) => {
        t.className = 'btn btn-sm btn-secondary level-tab';
      });
      target.className = 'btn btn-sm btn-primary level-tab';

      renderLessons();
    });
  });

  return container;
}
