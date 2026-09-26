import { User } from '../types/user';
import { Phrase, PhraseCategory, PhraseStatus } from '../types/phrase';
import { StorageService } from '../services/storage';
import { AudioService } from '../services/audio';
import { I18n } from '../services/i18n';
import { renderPhraseCard } from '../components/PhraseCard';
import { Modal } from '../components/Modal';
import { Toast } from '../components/Toast';

export function renderPhrasesPage(
  _user: User,
  _onNavigate: (route: string) => void
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'phrases-page-wrapper';

  let phrases = StorageService.getPhrases();
  let selectedCategory: string = 'All';
  let selectedLevel: string = 'All';
  let selectedStatus: string = 'All';
  let searchQuery: string = '';

  const isRu = I18n.getLang() === 'ru';

  const categories = [
    { id: 'All', ru: 'Все', en: 'All' },
    { id: 'Everyday English', ru: 'Повседневный', en: 'Everyday' },
    { id: 'Work', ru: 'Работа', en: 'Work' },
    { id: 'University', ru: 'Учеба', en: 'University' },
    { id: 'IT', ru: 'IT и разработка', en: 'IT' },
    { id: 'Communication', ru: 'Общение', en: 'Communication' },
    { id: 'Travel', ru: 'Путешествия', en: 'Travel' },
    { id: 'Feelings', ru: 'Эмоции', en: 'Feelings' },
    { id: 'Time', ru: 'Время', en: 'Time' },
    { id: 'Money', ru: 'Деньги', en: 'Money' },
    { id: 'Relationships', ru: 'Отношения', en: 'Relationships' }
  ];

  container.innerHTML = `
    <!-- Page Header -->
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
      <div>
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
          <span class="badge" style="background-color: var(--accent-green-light); color: var(--accent-green-hover); font-weight: 800;">
            ${I18n.t('phrases.badge')}
          </span>
          <span style="font-size: 0.88rem; font-weight: 700; color: var(--text-muted);" id="phrases-counter"></span>
        </div>
        <h2 style="font-size: 1.6rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em;">
          ${I18n.t('phrases.title')}
        </h2>
        <p style="font-size: 0.92rem; color: var(--text-secondary); max-width: 680px; margin-top: 4px; line-height: 1.5;">
          ${I18n.t('phrases.subtitle')}
        </p>
      </div>

      <button class="btn btn-primary" id="add-phrase-modal-btn" style="font-weight: 700;">
        <span>+</span> ${I18n.t('phrases.add_btn')}
      </button>
    </div>

    <!-- Filter & Search Toolbar -->
    <div class="card" style="padding: 16px 20px; margin-bottom: 24px; border: 2px solid var(--border-strong);">
      <div style="display: flex; flex-direction: column; gap: 14px;">
        <!-- Search and Selects Row -->
        <div class="phrases-filter-grid">
          <input 
            type="text" 
            id="phrases-search-input" 
            class="input-text" 
            placeholder="${I18n.t('phrases.search_placeholder')}" 
            style="font-size: 15px; padding: 10px 14px;"
          />

          <select id="level-filter-select" class="input-select" style="padding: 10px 12px; font-weight: 600;">
            <option value="All">${I18n.t('phrases.all_levels')}</option>
            <option value="A1">A1 (${isRu ? 'Начальный' : 'Beginner'})</option>
            <option value="A2">A2 (${isRu ? 'Базовый' : 'Elementary'})</option>
            <option value="B1">B1 (${isRu ? 'Средний' : 'Intermediate'})</option>
          </select>

          <select id="status-filter-select" class="input-select" style="padding: 10px 12px; font-weight: 600;">
            <option value="All">${I18n.t('phrases.all_statuses')}</option>
            <option value="new">${I18n.t('phrases.status_new')}</option>
            <option value="learning">${I18n.t('phrases.status_learning')}</option>
            <option value="difficult">${I18n.t('phrases.status_difficult')}</option>
            <option value="learned">${I18n.t('phrases.status_learned')}</option>
          </select>
        </div>

        <!-- Category Filter Pills -->
        <div class="category-pills-scroll" style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px;" id="category-pills-row">
          ${categories
            .map(
              (cat) => `
            <button 
              class="btn btn-sm ${cat.id === 'All' ? 'btn-primary' : 'btn-secondary'} category-filter-btn" 
              data-category="${cat.id}"
              style="font-weight: 700; border-radius: var(--radius-full); padding: 6px 14px; white-space: nowrap;"
            >
              ${isRu ? cat.ru : cat.en}
            </button>
          `
            )
            .join('')}
        </div>
      </div>
    </div>

    <!-- Phrases Grid Container -->
    <div id="phrases-cards-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px;"></div>
  `;

  const cardsGrid = container.querySelector('#phrases-cards-grid') as HTMLElement;
  const counterBadge = container.querySelector('#phrases-counter') as HTMLElement;
  const searchInput = container.querySelector('#phrases-search-input') as HTMLInputElement;
  const levelSelect = container.querySelector('#level-filter-select') as HTMLSelectElement;
  const statusSelect = container.querySelector('#status-filter-select') as HTMLSelectElement;

  const renderList = () => {
    cardsGrid.innerHTML = '';

    const filtered = phrases.filter((p) => {
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
      if (selectedLevel !== 'All' && p.level !== selectedLevel) return false;
      if (selectedStatus !== 'All' && p.status !== selectedStatus) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesPhrase = p.phrase.toLowerCase().includes(q);
        const matchesTrans = p.translation.toLowerCase().includes(q);
        const matchesExample = p.example.toLowerCase().includes(q);
        if (!matchesPhrase && !matchesTrans && !matchesExample) return false;
      }
      return true;
    });

    counterBadge.textContent = isRu
      ? `Показано ${filtered.length} из ${phrases.length} фраз`
      : `Showing ${filtered.length} of ${phrases.length} phrases`;

    if (filtered.length === 0) {
      cardsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; background-color: var(--bg-surface); border-radius: var(--radius-xl); border: 2px dashed var(--border-strong);">
          <div style="font-size: 2.5rem; margin-bottom: 8px;">🔍</div>
          <h3 style="font-size: 1.2rem; font-weight: 800; color: var(--text-primary); margin-bottom: 6px;">
            ${isRu ? 'Фразы не найдены' : 'No phrases match criteria'}
          </h3>
          <p style="font-size: 0.9rem; color: var(--text-muted); max-width: 420px; margin: 0 auto;">
            ${isRu ? 'Попробуйте изменить поисковый запрос или сбросить фильтры категорий.' : 'Try changing your search term or selecting another category filter.'}
          </p>
        </div>
      `;
      return;
    }

    filtered.forEach((phrase) => {
      const card = renderPhraseCard(phrase, (updated) => {
        const idx = phrases.findIndex((p) => p.id === updated.id);
        if (idx !== -1) {
          phrases[idx] = updated;
        }
      });
      cardsGrid.appendChild(card);
    });
  };

  renderList();

  // Search input
  searchInput?.addEventListener('input', (e) => {
    searchQuery = (e.target as HTMLInputElement).value.trim();
    renderList();
  });

  // Level filter
  levelSelect?.addEventListener('change', (e) => {
    selectedLevel = (e.target as HTMLSelectElement).value;
    AudioService.playPop();
    renderList();
  });

  // Status filter
  statusSelect?.addEventListener('change', (e) => {
    selectedStatus = (e.target as HTMLSelectElement).value;
    AudioService.playPop();
    renderList();
  });

  // Category pill clicks
  container.querySelectorAll('.category-filter-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      AudioService.playPop();
      const target = e.currentTarget as HTMLElement;
      selectedCategory = target.getAttribute('data-category') || 'All';

      container.querySelectorAll('.category-filter-btn').forEach((b) => {
        b.classList.remove('btn-primary');
        b.classList.add('btn-secondary');
      });
      target.classList.remove('btn-secondary');
      target.classList.add('btn-primary');

      renderList();
    });
  });

  // Add Phrase Modal
  container.querySelector('#add-phrase-modal-btn')?.addEventListener('click', () => {
    AudioService.playPop();
    const modalContent = document.createElement('div');
    modalContent.innerHTML = `
      <form id="new-phrase-form" style="display: flex; flex-direction: column; gap: 16px;">
        <div>
          <label class="input-label">${isRu ? 'Фраза или идиома (на английском):' : 'Phrase or Idiom:'}</label>
          <input type="text" id="new-phrase-text" class="input-text" placeholder="e.g. In the long run" required style="font-size: 15px;" />
        </div>

        <div>
          <label class="input-label">${isRu ? 'Перевод на русский язык:' : 'Translation (Russian):'}</label>
          <input type="text" id="new-phrase-trans" class="input-text" placeholder="например, В долгосрочной перспективе" required style="font-size: 15px;" />
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div>
            <label class="input-label">${isRu ? 'Уровень:' : 'Level:'}</label>
            <select id="new-phrase-level" class="input-select">
              <option value="A1">A1</option>
              <option value="A2" selected>A2</option>
              <option value="B1">B1</option>
            </select>
          </div>

          <div>
            <label class="input-label">${isRu ? 'Категория:' : 'Category:'}</label>
            <select id="new-phrase-category" class="input-select">
              <option value="Everyday English">${isRu ? 'Повседневный' : 'Everyday English'}</option>
              <option value="Work">${isRu ? 'Работа' : 'Work'}</option>
              <option value="University">${isRu ? 'Учеба' : 'University'}</option>
              <option value="IT">${isRu ? 'IT и разработка' : 'IT'}</option>
              <option value="Communication">${isRu ? 'Общение' : 'Communication'}</option>
              <option value="Travel">${isRu ? 'Путешествия' : 'Travel'}</option>
            </select>
          </div>
        </div>

        <div>
          <label class="input-label">${isRu ? 'Пример предложения (на английском):' : 'Example Sentence (English):'}</label>
          <textarea id="new-phrase-example" class="textarea-custom" placeholder="e.g. Exercising will pay off in the long run." required style="font-size: 15px; min-height: 80px;"></textarea>
        </div>

        <div>
          <label class="input-label">${isRu ? 'Перевод примера (на русский):' : 'Example Translation (Russian):'}</label>
          <input type="text" id="new-phrase-example-trans" class="input-text" placeholder="например, Спорт принесет плоды в долгосрочной перспективе." style="font-size: 15px;" />
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 8px;">
          <button type="button" class="btn btn-secondary" id="cancel-add-phrase-btn">${I18n.t('btn.cancel')}</button>
          <button type="submit" class="btn btn-primary" style="font-weight: 700;">${I18n.t('btn.save')}</button>
        </div>
      </form>
    `;

    const modal = Modal.show({
      title: isRu ? 'Добавить новую английскую фразу' : 'Add New English Phrase',
      content: modalContent
    });

    modalContent.querySelector('#cancel-add-phrase-btn')?.addEventListener('click', () => {
      modal.close();
    });

    const form = modalContent.querySelector('#new-phrase-form') as HTMLFormElement;
    form?.addEventListener('submit', (e) => {
      e.preventDefault();

      const phraseText = (modalContent.querySelector('#new-phrase-text') as HTMLInputElement).value.trim();
      const phraseTrans = (modalContent.querySelector('#new-phrase-trans') as HTMLInputElement).value.trim();
      const level = (modalContent.querySelector('#new-phrase-level') as HTMLSelectElement).value as any;
      const category = (modalContent.querySelector('#new-phrase-category') as HTMLSelectElement).value as PhraseCategory;
      const example = (modalContent.querySelector('#new-phrase-example') as HTMLTextAreaElement).value.trim();
      const exampleTrans = (modalContent.querySelector('#new-phrase-example-trans') as HTMLInputElement).value.trim();

      const newPhrase: Phrase = {
        id: 'phrase-custom-' + Date.now(),
        phrase: phraseText,
        translation: phraseTrans,
        pronunciation: `/${phraseText.toLowerCase()}/`,
        level,
        category,
        example,
        exampleTranslation: exampleTrans,
        explanation: isRu ? 'Пользовательская фраза для личной практики.' : 'Custom user-added phrase for personalized learning.',
        commonUsage: isRu ? 'Добавлено в личный словарь.' : 'Added by user to personal vocabulary.',
        status: 'new',
        reviewCount: 0
      };

      StorageService.addPhrase(newPhrase);
      phrases.unshift(newPhrase);
      AudioService.playSuccess();
      Toast.show(isRu ? `Фраза "${phraseText}" успешно добавлена!` : `Phrase "${phraseText}" added!`, 'success');
      modal.close();
      renderList();
    });
  });

  return container;
}
