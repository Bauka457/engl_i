import { GrammarLesson } from '../types/lesson';
import { StorageService } from '../services/storage';
import { ProgressService } from '../services/progress';
import { AudioService } from '../services/audio';
import { I18n } from '../services/i18n';

export function renderGrammarCard(
  lesson: GrammarLesson,
  onCompleted?: (updatedLesson: GrammarLesson) => void
): HTMLElement {
  const card = document.createElement('div');
  card.className = 'card';
  card.id = `grammar-card-${lesson.id}`;
  card.style.border = '2px solid var(--border-strong)';
  card.style.padding = '24px';
  card.style.borderRadius = 'var(--radius-xl)';

  const isRu = I18n.getLang() === 'ru';

  card.innerHTML = `
    <div class="card-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
      <div>
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px; flex-wrap: wrap;">
          <span class="badge badge-${lesson.level.toLowerCase()}" style="font-weight: 800;">${lesson.level}</span>
          <span class="badge badge-neutral" style="font-weight: 700;">${lesson.category}</span>
          ${
            lesson.completed
              ? `<span class="badge" style="background-color: var(--accent-green-light); color: var(--accent-green-hover); font-weight: 800;">${isRu ? 'Пройдено ✓' : 'Completed ✓'}</span>`
              : ''
          }
        </div>
        <h3 class="card-title" style="font-size: 1.35rem; font-weight: 800; color: var(--text-primary); margin-top: 4px;">${lesson.title}</h3>
        <p class="card-subtitle" style="font-size: 0.92rem; color: var(--text-secondary); margin-top: 2px;">${lesson.description}</p>
      </div>
    </div>

    <!-- Explanation -->
    <div style="font-size: 0.95rem; color: var(--text-primary); line-height: 1.6; margin-bottom: 18px;">
      ${lesson.explanation}
    </div>

    <!-- Core Rules -->
    <div style="background-color: var(--bg-secondary); border-radius: var(--radius-md); padding: 18px; margin-bottom: 18px; border: 1px solid var(--border-subtle);">
      <div style="font-size: 0.82rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; margin-bottom: 10px;">
        ${isRu ? 'Ключевые правила и формулы:' : 'Core Patterns & Rules:'}
      </div>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        ${lesson.rules
          .map(
            (rule) => `
          <div class="grammar-rule-item" style="display: flex; align-items: flex-start; gap: 10px; font-size: 0.92rem; line-height: 1.45;">
            <span style="color: var(--accent-green-hover); font-weight: 800;">•</span>
            <span style="color: var(--text-primary);">${rule}</span>
          </div>
        `
          )
          .join('')}
      </div>
    </div>

    <!-- Examples -->
    <div style="margin-bottom: 18px;">
      <div style="font-size: 0.82rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; margin-bottom: 10px;">
        ${isRu ? 'Живые примеры:' : 'Real-world Examples:'}
      </div>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        ${lesson.examples
          .map(
            (ex, exIdx) => `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background-color: var(--bg-surface); border-radius: var(--radius-md); border-left: 3px solid var(--accent-green); border-top: 1px solid var(--border-subtle); border-right: 1px solid var(--border-subtle); border-bottom: 1px solid var(--border-subtle);">
            <div>
              <div style="font-weight: 700; color: var(--text-primary); font-size: 0.95rem;">"${ex.en}"</div>
              <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 2px;">${ex.ru}</div>
            </div>
            <button class="btn btn-sm btn-ghost grammar-ex-audio-btn" data-ex-idx="${exIdx}" title="${isRu ? 'Слушать пример' : 'Listen to example'}">
              🔊
            </button>
          </div>
        `
          )
          .join('')}
      </div>
    </div>

    <!-- Common Mistakes Dropdown -->
    <details style="margin-bottom: 20px; background-color: var(--bg-secondary); border-radius: var(--radius-md); padding: 14px 18px; border: 1px solid var(--border-subtle);">
      <summary style="font-size: 0.9rem; font-weight: 800; color: var(--accent-amber-hover); cursor: pointer;">
        ⚠️ ${isRu ? `Типичные ошибки (${lesson.commonMistakes.length})` : `Common Mistakes to Avoid (${lesson.commonMistakes.length})`}
      </summary>
      <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 12px;">
        ${lesson.commonMistakes
          .map(
            (m) => `
          <div style="font-size: 0.88rem; padding: 10px 14px; background-color: var(--bg-surface); border-radius: var(--radius-sm); border-left: 3px solid var(--accent-rose); border: 1px solid var(--border-subtle);">
            <div style="color: var(--accent-rose); text-decoration: line-through; font-weight: 600;">${m.wrong}</div>
            <div style="color: var(--accent-green-hover); font-weight: 700; margin-top: 2px;">✓ ${m.right}</div>
            <div style="color: var(--text-muted); font-size: 0.8rem; margin-top: 4px;">${m.why}</div>
          </div>
        `
          )
          .join('')}
      </div>
    </details>

    <!-- Interactive Mini Exercise -->
    <div style="background-color: var(--bg-surface); border: 2px solid var(--border-strong); border-radius: var(--radius-lg); padding: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <span style="font-size: 0.82rem; font-weight: 800; color: var(--accent-green-hover); text-transform: uppercase;">
          ${isRu ? 'Мини-упражнение на закрепление' : 'Quick Check Exercise'}
        </span>
        <span class="badge" style="background-color: var(--bg-secondary); font-size: 0.75rem; font-weight: 700;">+15 XP</span>
      </div>

      <div style="font-size: 1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 14px;">
        ${lesson.exercise.question}
      </div>

      <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 14px;" id="grammar-opt-list-${lesson.id}">
        ${lesson.exercise.options
          .map(
            (opt, oIdx) => `
          <button 
            class="btn btn-secondary grammar-opt-btn" 
            data-opt-idx="${oIdx}"
            style="justify-content: flex-start; text-align: left; padding: 10px 14px; font-size: 0.92rem; border-radius: var(--radius-sm); font-weight: 600;"
          >
            <span style="width: 22px; font-weight: 800;">${String.fromCharCode(65 + oIdx)}.</span>
            <span>${opt}</span>
          </button>
        `
          )
          .join('')}
      </div>

      <div id="grammar-feedback-${lesson.id}" style="display: none; padding: 12px 14px; border-radius: var(--radius-md); font-size: 0.92rem; margin-bottom: 14px;"></div>

      <div style="display: flex; justify-content: flex-end;">
        <button class="btn btn-duo btn-sm" id="grammar-check-btn-${lesson.id}" style="font-weight: 700; min-width: 130px;" disabled>
          ${I18n.t('btn.check')}
        </button>
      </div>
    </div>
  `;

  // Listen example audio
  card.querySelectorAll('.grammar-ex-audio-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt((e.currentTarget as HTMLElement).getAttribute('data-ex-idx') || '0', 10);
      const ex = lesson.examples[idx];
      if (ex) {
        AudioService.playPop();
        AudioService.speak(ex.en);
      }
    });
  });

  // Exercise interaction
  let selectedIdx: number | null = null;
  let isAnswered = false;

  const optBtns = card.querySelectorAll(`#grammar-opt-list-${lesson.id} .grammar-opt-btn`);
  const checkBtn = card.querySelector(`#grammar-check-btn-${lesson.id}`) as HTMLButtonElement;
  const feedbackBox = card.querySelector(`#grammar-feedback-${lesson.id}`) as HTMLElement;

  optBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      if (isAnswered) return;
      AudioService.playPop();
      selectedIdx = parseInt((e.currentTarget as HTMLElement).getAttribute('data-opt-idx') || '0', 10);

      optBtns.forEach((b) => {
        (b as HTMLElement).classList.remove('btn-primary');
        (b as HTMLElement).classList.add('btn-secondary');
      });
      (e.currentTarget as HTMLElement).classList.remove('btn-secondary');
      (e.currentTarget as HTMLElement).classList.add('btn-primary');

      if (checkBtn) checkBtn.disabled = false;
    });
  });

  checkBtn?.addEventListener('click', () => {
    if (selectedIdx === null || isAnswered) return;
    isAnswered = true;

    const isCorrect = selectedIdx === lesson.exercise.correctIndex;
    feedbackBox.style.display = 'block';

    if (isCorrect) {
      AudioService.playSuccess();
      feedbackBox.style.backgroundColor = 'var(--accent-green-light)';
      feedbackBox.style.color = '#15803d';
      feedbackBox.style.border = '1.5px solid var(--accent-green-border)';
      feedbackBox.innerHTML = `<strong>${isRu ? 'Правильно! ✓' : 'Correct! ✓'}</strong> ${lesson.exercise.explanation}`;

      if (!lesson.completed) {
        lesson.completed = true;
        StorageService.updateGrammar(lesson);
        ProgressService.addXp(15, isRu ? `Пройдена грамматика: ${lesson.title}` : `Grammar completed: ${lesson.title}`);
        onCompleted?.(lesson);
      }
    } else {
      AudioService.playError();
      feedbackBox.style.backgroundColor = 'var(--accent-rose-light)';
      feedbackBox.style.color = '#b91c1c';
      feedbackBox.style.border = '1.5px solid #fca5a5';
      feedbackBox.innerHTML = `<strong>${isRu ? 'Не совсем так.' : 'Not quite.'}</strong> ${lesson.exercise.explanation}`;
    }

    checkBtn.disabled = true;
    checkBtn.textContent = isRu ? 'Проверено ✓' : 'Checked ✓';
  });

  return card;
}
