import { JourneyLesson } from '../data/journey-units';
import { StorageService } from '../services/storage';
import { ProgressService } from '../services/progress';
import { AudioService } from '../services/audio';
import { I18n } from '../services/i18n';

export function openLessonModal(
  lesson: JourneyLesson,
  onLessonFinished: () => void
): void {
  const existing = document.getElementById('lesson-modal-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'lesson-modal-overlay';
  overlay.className = 'modal-overlay';

  let currentStepIndex = 0;
  const totalSteps = lesson.steps.length;
  let selectedOptionIndex: number | null = null;
  let answerSubmitted = false;

  const currentLang = I18n.getLang();
  const isRu = currentLang === 'ru';
  const lessonTitle = isRu ? lesson.titleRu : lesson.title;

  const renderStep = () => {
    overlay.innerHTML = '';

    const isFinished = currentStepIndex >= totalSteps;

    if (isFinished) {
      // Victory / Celebration Screen
      StorageService.completeLesson(lesson.id);
      ProgressService.addXp(lesson.xpReward, isRu ? `Пройден урок: ${lessonTitle}` : `Completed lesson: ${lessonTitle}`);
      AudioService.playCelebration();

      overlay.innerHTML = `
        <div class="modal-content" style="max-width: 480px; text-align: center; padding: 36px 28px; border-radius: var(--radius-xl); border: 2px solid var(--border-strong);">
          <div style="font-size: 3.5rem; margin-bottom: 12px; animation: bounce 1s ease;">🎉</div>
          <span class="badge" style="background-color: var(--accent-green-light); color: var(--accent-green-hover); font-weight: 800; margin-bottom: 12px; font-size: 0.85rem; padding: 4px 12px;">
            ${I18n.t('lesson.complete_title')}
          </span>
          <h2 style="font-size: 1.6rem; font-weight: 800; color: var(--text-primary); margin-bottom: 8px;">
            ${lessonTitle}
          </h2>
          <p style="font-size: 0.95rem; color: var(--text-secondary); margin-bottom: 24px; line-height: 1.5;">
            ${I18n.t('lesson.complete_sub')}
          </p>

          <div style="display: inline-flex; align-items: center; gap: 8px; padding: 10px 22px; background-color: var(--accent-green-light); border: 1.5px solid var(--accent-green-border); border-radius: var(--radius-full); margin-bottom: 28px;">
            <span style="font-size: 1.3rem;">⚡</span>
            <span style="font-size: 1.15rem; font-weight: 800; color: var(--accent-green-hover);">+${lesson.xpReward} XP</span>
          </div>

          <div>
            <button class="btn btn-duo btn-lg" id="finish-lesson-btn" style="width: 100%; font-size: 1.05rem;">
              ${I18n.t('lesson.continue_journey')}
            </button>
          </div>
        </div>
      `;

      overlay.querySelector('#finish-lesson-btn')?.addEventListener('click', () => {
        overlay.remove();
        onLessonFinished();
      });
      return;
    }

    const step = lesson.steps[currentStepIndex];
    const progressPercent = Math.round(((currentStepIndex) / totalSteps) * 100);

    overlay.innerHTML = `
      <div class="modal-content" style="max-width: 560px; padding: 26px 28px; border-radius: var(--radius-xl); border: 2px solid var(--border-strong);">
        <!-- Top Bar: Progress & Close -->
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 22px;">
          <button class="btn btn-ghost btn-sm" id="close-lesson-btn" style="font-size: 1.2rem; padding: 4px 10px; border-radius: 8px;" aria-label="${I18n.t('btn.close')}">
            ✕
          </button>
          <!-- Progress Bar like Duolingo -->
          <div style="flex: 1; height: 12px; background-color: var(--bg-secondary); border-radius: var(--radius-full); overflow: hidden; position: relative; border: 1px solid var(--border-subtle);">
            <div style="width: ${progressPercent}%; height: 100%; background: linear-gradient(90deg, var(--accent-green), #10b981); border-radius: var(--radius-full); transition: width 0.3s ease;"></div>
          </div>
          <span style="font-size: 0.85rem; font-weight: 800; color: var(--text-muted); font-family: var(--font-mono);">
            ${currentStepIndex + 1} / ${totalSteps}
          </span>
        </div>

        <!-- Step Content Area -->
        <div style="margin-bottom: 24px;">
          <span style="font-size: 0.8rem; font-weight: 800; color: var(--accent-green-hover); text-transform: uppercase; letter-spacing: 0.05em;">
            ${step.title}
          </span>

          ${
            step.type === 'phrase'
              ? `
            <div style="text-align: center; margin-top: 16px; padding: 26px 20px; background-color: var(--bg-secondary); border-radius: var(--radius-lg); border: 1.5px solid var(--border-subtle);">
              <h2 style="font-size: 1.8rem; font-weight: 800; color: var(--text-primary); margin-bottom: 6px;">
                ${step.phrase}
              </h2>
              <div style="font-size: 0.92rem; color: var(--text-muted); font-family: var(--font-mono); margin-bottom: 12px;">
                ${step.pronunciation || ''}
              </div>
              <div style="display: inline-block; font-size: 1.1rem; font-weight: 700; color: var(--accent-green-hover); padding: 6px 16px; background-color: var(--accent-green-light); border-radius: var(--radius-md); margin-bottom: 16px;">
                ${step.translation}
              </div>

              ${
                step.example
                  ? `
                <div style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.5; font-style: italic; border-top: 1px solid var(--border-subtle); padding-top: 14px;">
                  "${step.example}"
                </div>
              `
                  : ''
              }

              <div style="margin-top: 18px;">
                <button class="btn btn-secondary btn-sm" id="speak-step-phrase-btn" style="font-weight: 700;">
                  🔊 ${I18n.t('lesson.listen_pronunciation')}
                </button>
              </div>
            </div>
          `
              : step.type === 'grammar'
              ? `
            <div style="margin-top: 16px; padding: 22px; background-color: var(--bg-secondary); border-radius: var(--radius-lg); border-left: 4px solid var(--accent-primary);">
              <h3 style="font-size: 1.2rem; font-weight: 800; color: var(--text-primary); margin-bottom: 10px;">
                💡 ${step.title}
              </h3>
              <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 14px;">
                ${step.rule}
              </p>
              ${
                step.example
                  ? `
                <div style="background-color: var(--bg-surface); padding: 12px 16px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
                  <strong style="color: var(--accent-primary); font-size: 0.85rem; text-transform: uppercase;">${I18n.t('lesson.example_label')}</strong>
                  <div style="font-weight: 600; color: var(--text-primary); margin-top: 4px; font-size: 0.95rem;">"${step.example}"</div>
                </div>
              `
                  : ''
              }
            </div>
          `
              : `
            <!-- Quiz Step -->
            <div style="margin-top: 16px;">
              <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary); line-height: 1.4; margin-bottom: 18px;">
                ${step.question}
              </h3>

              <div style="display: flex; flex-direction: column; gap: 10px;" id="quiz-options-list">
                ${step.options
                  ?.map(
                    (opt, optIdx) => `
                  <button 
                    class="btn btn-secondary quiz-opt-btn" 
                    data-opt-idx="${optIdx}" 
                    style="justify-content: flex-start; text-align: left; padding: 14px 18px; font-size: 0.98rem; font-weight: 600; border-width: 2px; border-radius: var(--radius-md); min-height: 52px;"
                  >
                    <span style="display: inline-block; width: 26px; height: 26px; border-radius: 50%; background-color: var(--bg-secondary); border: 1.5px solid var(--border-strong); text-align: center; line-height: 24px; font-size: 0.82rem; margin-right: 12px; font-weight: 800;">
                      ${String.fromCharCode(65 + optIdx)}
                    </span>
                    <span>${opt}</span>
                  </button>
                `
                  )
                  .join('')}
              </div>

              <div id="quiz-feedback-box" style="display: none; margin-top: 16px; padding: 14px 18px; border-radius: var(--radius-md); font-size: 0.95rem; line-height: 1.5;"></div>
            </div>
          `
          }
        </div>

        <!-- Footer Action Button -->
        <div style="display: flex; justify-content: flex-end; gap: 12px; border-top: 1px solid var(--border-subtle); padding-top: 18px;">
          ${
            step.type === 'quiz'
              ? `
            <button class="btn btn-duo" id="check-quiz-btn" style="min-width: 150px; font-size: 1rem;" ${selectedOptionIndex === null ? 'disabled' : ''}>
              ${answerSubmitted ? I18n.t('btn.next') : I18n.t('btn.check')}
            </button>
          `
              : `
            <button class="btn btn-duo" id="next-step-btn" style="min-width: 150px; font-size: 1rem;">
              ${I18n.t('lesson.understood')}
            </button>
          `
          }
        </div>
      </div>
    `;

    // Close button
    overlay.querySelector('#close-lesson-btn')?.addEventListener('click', () => {
      overlay.remove();
    });

    // Speak phrase
    overlay.querySelector('#speak-step-phrase-btn')?.addEventListener('click', () => {
      if (step.phrase) {
        AudioService.playPop();
        AudioService.speak(step.phrase);
      }
    });

    // Next step for non-quiz
    overlay.querySelector('#next-step-btn')?.addEventListener('click', () => {
      AudioService.playPop();
      currentStepIndex += 1;
      renderStep();
    });

    // Quiz options
    if (step.type === 'quiz') {
      const checkBtn = overlay.querySelector('#check-quiz-btn') as HTMLButtonElement;
      const feedbackBox = overlay.querySelector('#quiz-feedback-box') as HTMLElement;

      overlay.querySelectorAll('.quiz-opt-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          if (answerSubmitted) return;
          AudioService.playPop();
          const idx = parseInt((e.currentTarget as HTMLElement).getAttribute('data-opt-idx') || '0', 10);
          selectedOptionIndex = idx;

          overlay.querySelectorAll('.quiz-opt-btn').forEach((b) => {
            b.classList.remove('selected');
            (b as HTMLElement).style.borderColor = 'var(--border-strong)';
            (b as HTMLElement).style.backgroundColor = 'var(--bg-surface)';
          });

          (e.currentTarget as HTMLElement).classList.add('selected');
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-primary)';
          (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--accent-primary-light)';

          if (checkBtn) checkBtn.disabled = false;
        });
      });

      checkBtn?.addEventListener('click', () => {
        if (!answerSubmitted) {
          answerSubmitted = true;
          const isCorrect = selectedOptionIndex === step.correctIndex;

          overlay.querySelectorAll('.quiz-opt-btn').forEach((b, i) => {
            if (i === step.correctIndex) {
              (b as HTMLElement).style.borderColor = 'var(--accent-green)';
              (b as HTMLElement).style.backgroundColor = 'var(--accent-green-light)';
              (b as HTMLElement).style.color = 'var(--accent-green-hover)';
            } else if (i === selectedOptionIndex && !isCorrect) {
              (b as HTMLElement).style.borderColor = 'var(--accent-rose)';
              (b as HTMLElement).style.backgroundColor = 'var(--accent-rose-light)';
              (b as HTMLElement).style.color = 'var(--accent-rose)';
            }
          });

          if (feedbackBox) {
            feedbackBox.style.display = 'block';
            if (isCorrect) {
              AudioService.playSuccess();
              feedbackBox.style.backgroundColor = 'var(--accent-green-light)';
              feedbackBox.style.color = '#15803d';
              feedbackBox.style.border = '1.5px solid var(--accent-green-border)';
              feedbackBox.innerHTML = `<strong>${I18n.t('lesson.correct')}</strong> ${step.explanation || ''}`;
            } else {
              AudioService.playError();
              feedbackBox.style.backgroundColor = 'var(--accent-rose-light)';
              feedbackBox.style.color = '#b91c1c';
              feedbackBox.style.border = '1.5px solid #fca5a5';
              feedbackBox.innerHTML = `<strong>${I18n.t('lesson.incorrect')}</strong> ${step.explanation || ''}`;
            }
          }

          checkBtn.textContent = I18n.t('btn.next');
        } else {
          currentStepIndex += 1;
          selectedOptionIndex = null;
          answerSubmitted = false;
          renderStep();
        }
      });
    }
  };

  document.body.appendChild(overlay);
  renderStep();
}
