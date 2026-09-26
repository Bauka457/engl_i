import { Question, QuestionResult } from '../types/test';
import { I18n } from '../services/i18n';
import { AudioService } from '../services/audio';

export interface TestCardCallbacks {
  onAnswerSelected?: (answer: string, isCorrect: boolean) => void;
  onNextQuestion?: () => void;
}

export function renderTestCard(
  question: Question,
  currentIndex: number,
  totalQuestions: number,
  callbacksOrOnResult: TestCardCallbacks | ((result: QuestionResult) => void)
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'test-container card';
  container.style.maxWidth = '760px';
  container.style.margin = '20px auto';
  container.style.padding = '28px';
  container.style.border = '2px solid var(--border-strong)';
  container.style.borderRadius = 'var(--radius-xl)';

  const isRu = I18n.getLang() === 'ru';
  let selectedAnswer = '';
  let isAnswerCorrect = false;

  container.innerHTML = `
    <div class="test-progress-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span class="badge badge-${question.difficulty.toLowerCase()}" style="font-weight: 800;">${question.difficulty}</span>
        <span class="badge badge-neutral" style="text-transform: capitalize; font-weight: 700;">${question.category.replace('_', ' ')}</span>
      </div>
      <div style="font-size: 0.9rem; font-weight: 800; color: var(--text-muted); font-family: var(--font-mono);">
        ${isRu ? 'Вопрос' : 'Question'} ${currentIndex + 1} ${isRu ? 'из' : 'of'} ${totalQuestions}
      </div>
    </div>

    <div class="progress-bar-track" style="margin-bottom: 24px; height: 10px; border-radius: var(--radius-full);">
      <div class="progress-bar-fill" style="width: ${((currentIndex + 1) / totalQuestions) * 100}%; background: linear-gradient(90deg, var(--accent-green), #10b981);"></div>
    </div>

    <h2 class="question-text" style="font-size: 1.35rem; font-weight: 800; color: var(--text-primary); margin-bottom: 20px; line-height: 1.4;">
      ${question.question}
    </h2>

    <div class="options-list" id="test-options-list" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
      ${question.options
        .map(
          (opt, optIdx) => `
        <button 
          class="option-item" 
          data-answer="${opt}"
          style="display: flex; justify-content: space-between; align-items: center; padding: 14px 18px; border-radius: var(--radius-md); border: 2px solid var(--border-strong); background-color: var(--bg-surface); text-align: left; font-size: 0.98rem; font-weight: 600; cursor: pointer; transition: all var(--transition-fast);"
        >
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="display: inline-block; width: 24px; height: 24px; border-radius: 50%; background-color: var(--bg-secondary); border: 1.5px solid var(--border-strong); text-align: center; line-height: 22px; font-size: 0.8rem; font-weight: 800;">
              ${String.fromCharCode(65 + optIdx)}
            </span>
            <span>${opt}</span>
          </div>
          <span class="option-indicator" style="font-size: 1rem; color: var(--text-muted); font-weight: 800;">○</span>
        </button>
      `
        )
        .join('')}
    </div>

    <div id="test-feedback-box" class="test-explanation-box" style="display: none; padding: 14px 18px; border-radius: var(--radius-md); font-size: 0.95rem; margin-bottom: 20px; line-height: 1.5;"></div>

    <div style="display: flex; justify-content: flex-end; margin-top: 10px;">
      <button class="btn btn-duo" id="test-next-btn" style="display: none; min-width: 180px; font-size: 1rem; padding: 12px 24px;">
        ${currentIndex + 1 === totalQuestions ? (isRu ? 'Завершить тест 🏁' : 'Complete Test 🏁') : (isRu ? 'Следующий вопрос ▶' : 'Next Question ▶')}
      </button>
    </div>
  `;

  let answered = false;
  const optionsList = container.querySelector('#test-options-list');
  const feedbackBox = container.querySelector('#test-feedback-box') as HTMLElement;
  const nextBtn = container.querySelector('#test-next-btn') as HTMLButtonElement;

  optionsList?.querySelectorAll('.option-item').forEach((item) => {
    item.addEventListener('click', (e) => {
      if (answered) return;
      answered = true;

      const target = e.currentTarget as HTMLButtonElement;
      selectedAnswer = target.getAttribute('data-answer') || '';
      isAnswerCorrect = selectedAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();

      if (isAnswerCorrect) {
        AudioService.playSuccess();
      } else {
        AudioService.playError();
      }

      // Style all options
      optionsList.querySelectorAll('.option-item').forEach((optBtn) => {
        const optText = optBtn.getAttribute('data-answer') || '';
        const ind = optBtn.querySelector('.option-indicator') as HTMLElement;
        const b = optBtn as HTMLElement;

        if (optText.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase()) {
          b.style.backgroundColor = 'var(--accent-green-light)';
          b.style.borderColor = 'var(--accent-green)';
          b.style.color = 'var(--accent-green-hover)';
          if (ind) {
            ind.textContent = '✓';
            ind.style.color = 'var(--accent-green-hover)';
          }
        } else if (optBtn === target && !isAnswerCorrect) {
          b.style.backgroundColor = 'var(--accent-rose-light)';
          b.style.borderColor = 'var(--accent-rose)';
          b.style.color = 'var(--accent-rose)';
          if (ind) {
            ind.textContent = '✕';
            ind.style.color = 'var(--accent-rose)';
          }
        } else {
          b.style.opacity = '0.5';
        }
      });

      // Show feedback explanation
      feedbackBox.style.display = 'block';
      if (isAnswerCorrect) {
        feedbackBox.style.backgroundColor = 'var(--accent-green-light)';
        feedbackBox.style.border = '1.5px solid var(--accent-green-border)';
        feedbackBox.style.color = '#15803d';
        feedbackBox.innerHTML = `
          <div style="font-weight: 800; margin-bottom: 4px;">${isRu ? 'Правильно! ✓' : 'Correct Answer! ✓'}</div>
          <div>${question.explanation}</div>
        `;
      } else {
        feedbackBox.style.backgroundColor = 'var(--accent-rose-light)';
        feedbackBox.style.border = '1.5px solid #fca5a5';
        feedbackBox.style.color = '#b91c1c';
        feedbackBox.innerHTML = `
          <div style="font-weight: 800; margin-bottom: 4px;">${isRu ? 'Не совсем так' : 'Incorrect'}</div>
          <div style="margin-bottom: 4px;">${isRu ? 'Правильный ответ:' : 'Correct answer:'} <strong>${question.correctAnswer}</strong></div>
          <div>${question.explanation}</div>
        `;
      }

      nextBtn.style.display = 'inline-flex';

      if (typeof callbacksOrOnResult === 'object' && callbacksOrOnResult.onAnswerSelected) {
        callbacksOrOnResult.onAnswerSelected(selectedAnswer, isAnswerCorrect);
      }
    });
  });

  nextBtn?.addEventListener('click', () => {
    AudioService.playPop();
    if (typeof callbacksOrOnResult === 'function') {
      callbacksOrOnResult({
        questionId: question.id,
        userAnswer: selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect: isAnswerCorrect,
        category: question.category
      });
    } else if (typeof callbacksOrOnResult === 'object' && callbacksOrOnResult.onNextQuestion) {
      callbacksOrOnResult.onNextQuestion();
    }
  });

  return container;
}
