import { User } from '../types/user';
import { AIService, WritingFeedback } from '../services/ai';
import { ProgressService } from '../services/progress';
import { AudioService } from '../services/audio';
import { I18n } from '../services/i18n';
import { Toast } from '../components/Toast';

const WRITING_TOPICS = [
  {
    id: 'wt-1',
    titleRu: 'Расскажите о своем дне',
    titleEn: 'Write about your day',
    promptRu: 'Опишите, что вы делали с утра до вечера, что прошло удачно и какие планы на завтра.',
    promptEn: 'Describe what you did from morning to evening, what went well, and what you plan for tomorrow.'
  },
  {
    id: 'wt-2',
    titleRu: 'Опишите близкого друга',
    titleEn: 'Describe your best friend',
    promptRu: 'Расскажите о друге: внешность, увлечения, характер и почему вы хорошо ладите.',
    promptEn: 'Introduce a close friend: what do they look like, what are their hobbies, and why do you get along with them?'
  },
  {
    id: 'wt-3',
    titleRu: 'Ваша работа или учеба',
    titleEn: 'Write about your university or job',
    promptRu: 'Объясните, чем вы занимаетесь, любимые предметы или инструменты, карьерные цели.',
    promptEn: 'Explain what you study or work on, your favourite subjects or tools, and your future career ambitions.'
  },
  {
    id: 'wt-4',
    titleRu: 'Деловое письмо или обращение',
    titleEn: 'Write a professional email',
    promptRu: 'Составьте вежливое письмо преподавателю или руководителю с просьбой или отчетом.',
    promptEn: 'Draft a polite email to a professor or manager asking for an extension or feedback on a project assignment.'
  },
  {
    id: 'wt-5',
    titleRu: 'Мнение об удаленной работе',
    titleEn: 'Give your opinion on remote work',
    promptRu: 'Что вам ближе: удаленная работа/учеба или офлайн в офисе? Приведите 2-3 аргумента.',
    promptEn: 'Do you prefer working/studying remotely or in person? Provide 2-3 reasons supporting your view.'
  }
];

export function renderWritingPage(
  user: User,
  _onNavigate: (route: string) => void
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'page-container';

  let selectedTopic = WRITING_TOPICS[0];
  let writtenText = '';
  let feedback: WritingFeedback | null = null;
  let isAnalyzing = false;
  const isRu = I18n.getLang() === 'ru';

  const countWords = (str: string) => str.trim().split(/\s+/).filter(Boolean).length;

  const render = () => {
    const topicTitle = isRu ? selectedTopic.titleRu : selectedTopic.titleEn;
    const topicPrompt = isRu ? selectedTopic.promptRu : selectedTopic.promptEn;

    container.innerHTML = `
      <div style="margin-bottom: 24px;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
          <span class="badge" style="background-color: var(--accent-green-light); color: var(--accent-green-hover); font-weight: 800;">
            ${isRu ? 'Лаборатория письма' : 'Writing Lab'}
          </span>
          <span class="badge badge-${user.currentLevel.toLowerCase()}">${user.currentLevel}</span>
        </div>
        <h2 style="font-size: 1.6rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em;">
          ${isRu ? 'Письмо и составление предложений' : 'Writing & Composition Lab'}
        </h2>
        <p style="font-size: 0.92rem; color: var(--text-secondary); max-width: 650px; margin-top: 4px; line-height: 1.5;">
          ${isRu ? 'Формулируйте мысли на английском. Мгновенная проверка грамматики, улучшение словарного запаса и естественные варианты фраз.' : 'Structure your thoughts into coherent English paragraphs. Get instant line-by-line grammar diagnostics, vocabulary enhancements, and native phrasing.'}
        </p>
      </div>

      <div class="card" style="max-width: 820px; margin: 0 auto; padding: 26px; border: 2px solid var(--border-strong); border-radius: var(--radius-xl);">
        <!-- Topic Selection -->
        <div style="margin-bottom: 20px;">
          <label class="input-label" style="font-weight: 700;">${isRu ? 'Выберите тему для письма:' : 'Select Writing Assignment:'}</label>
          <select id="writing-topic-select" class="input-select" style="font-weight: 600; padding: 10px 14px;">
            ${WRITING_TOPICS.map(
              (t) => `<option value="${t.id}" ${t.id === selectedTopic.id ? 'selected' : ''}>${isRu ? t.titleRu : t.titleEn}</option>`
            ).join('')}
          </select>
        </div>

        <!-- Selected Prompt Box -->
        <div style="background-color: var(--bg-secondary); border-radius: var(--radius-lg); padding: 18px 20px; border-left: 4px solid var(--accent-primary); margin-bottom: 20px;">
          <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin-bottom: 4px;">
            ${topicTitle}
          </h3>
          <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.5;">
            ${topicPrompt}
          </p>
        </div>

        <!-- Textarea Editor -->
        <div style="margin-bottom: 12px;">
          <textarea 
            id="writing-text-input" 
            class="textarea-custom" 
            style="min-height: 170px; font-size: 15px; padding: 14px;" 
            placeholder="${isRu ? 'Начните писать свой текст на английском языке...' : 'Start drafting your paragraph here in English...'}"
          >${writtenText}</textarea>
        </div>

        <!-- Word Count & Submit Row -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 12px;">
          <div style="font-size: 0.9rem; font-weight: 700; color: var(--text-muted);" id="writing-word-counter">
            ${isRu ? 'Слов:' : 'Words:'} ${countWords(writtenText)}
          </div>
          <button class="btn btn-duo" id="analyze-writing-btn" ${isAnalyzing ? 'disabled' : ''} style="font-weight: 800; min-width: 190px;">
            ${isAnalyzing ? (isRu ? 'Анализирую текст...' : 'Analyzing Text...') : (isRu ? 'Проверить текст →' : 'Analyze Writing →')}
          </button>
        </div>

        <!-- AI Feedback Section -->
        <div id="writing-feedback-container">
          ${
            feedback
              ? `
            <div style="border-top: 1px solid var(--border-subtle); padding-top: 24px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 10px;">
                <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary);">
                  ${isRu ? 'Разбор вашего текста' : 'Writing Evaluation Report'}
                </h3>
                <span class="badge" style="background-color: var(--accent-green-light); color: var(--accent-green-hover); font-size: 0.95rem; font-weight: 800; padding: 4px 12px;">
                  ${isRu ? 'Общий балл: ' : 'Overall: '}${feedback.overallScore} / 100
                </span>
              </div>

              <!-- Metric Badges Grid -->
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; margin-bottom: 20px;">
                <div style="padding: 12px; background-color: var(--bg-secondary); border-radius: var(--radius-md); text-align: center; border: 1px solid var(--border-subtle);">
                  <div style="font-size: 0.78rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">${isRu ? 'Грамматика' : 'Grammar'}</div>
                  <div style="font-size: 1.4rem; font-weight: 800; color: var(--accent-primary); margin-top: 2px;">${feedback.grammarAccuracy}%</div>
                </div>
                <div style="padding: 12px; background-color: var(--bg-secondary); border-radius: var(--radius-md); text-align: center; border: 1px solid var(--border-subtle);">
                  <div style="font-size: 0.78rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">${isRu ? 'Словарь' : 'Vocabulary'}</div>
                  <div style="font-size: 1.4rem; font-weight: 800; color: var(--accent-green-hover); margin-top: 2px;">${feedback.vocabularyRichness}%</div>
                </div>
                <div style="padding: 12px; background-color: var(--bg-secondary); border-radius: var(--radius-md); text-align: center; border: 1px solid var(--border-subtle);">
                  <div style="font-size: 0.78rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">${isRu ? 'Связность' : 'Coherence'}</div>
                  <div style="font-size: 1.4rem; font-weight: 800; color: var(--accent-amber); margin-top: 2px;">${feedback.coherence}%</div>
                </div>
              </div>

              <!-- General Assessment -->
              <div style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 20px;">
                ${feedback.overallComment}
              </div>

              <!-- Polished Native Version -->
              ${
                feedback.correctedText
                  ? `
                <div style="background-color: var(--bg-secondary); padding: 18px; border-radius: var(--radius-md); border-left: 4px solid var(--accent-green); margin-bottom: 20px;">
                  <strong style="color: var(--accent-green-hover); font-size: 0.85rem; text-transform: uppercase;">
                    ${isRu ? 'Улучшенная версия текста:' : 'Polished Native Version:'}
                  </strong>
                  <div style="font-weight: 600; color: var(--text-primary); font-size: 0.95rem; margin-top: 6px; line-height: 1.5;">
                    "${feedback.correctedText}"
                  </div>
                </div>
              `
                  : ''
              }
            </div>
          `
              : ''
          }
        </div>
      </div>
    `;

    // Topic select
    container.querySelector('#writing-topic-select')?.addEventListener('change', (e) => {
      const id = (e.target as HTMLSelectElement).value;
      const found = WRITING_TOPICS.find((t) => t.id === id);
      if (found) {
        AudioService.playPop();
        selectedTopic = found;
        feedback = null;
        render();
      }
    });

    // Textarea input
    const textarea = container.querySelector('#writing-text-input') as HTMLTextAreaElement;
    textarea?.addEventListener('input', (e) => {
      writtenText = (e.target as HTMLTextAreaElement).value;
      const counter = container.querySelector('#writing-word-counter');
      if (counter) counter.textContent = `${isRu ? 'Слов:' : 'Words:'} ${countWords(writtenText)}`;
    });

    // Analyze button
    container.querySelector('#analyze-writing-btn')?.addEventListener('click', async () => {
      if (countWords(writtenText) < 5) {
        Toast.show(isRu ? 'Пожалуйста, напишите хотя бы одно полноценное предложение (от 5 слов).' : 'Please write at least 5 words.', 'warning');
        return;
      }

      AudioService.playPop();
      isAnalyzing = true;
      render();

      try {
        feedback = await AIService.checkWriting(topicTitle, writtenText);
        AudioService.playSuccess();
        ProgressService.addXp(30, isRu ? `Письменная работа: "${topicTitle}"` : `Writing practice: "${topicTitle}"`);
      } catch (e) {
        console.error(e);
        Toast.show(isRu ? 'Не удалось проанализировать текст' : 'Could not analyze writing', 'error');
      } finally {
        isAnalyzing = false;
        render();
      }
    });
  };

  render();
  return container;
}
