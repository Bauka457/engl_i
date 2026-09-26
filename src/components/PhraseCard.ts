import { Phrase, PhraseStatus } from '../types/phrase';
import { StorageService } from '../services/storage';
import { ProgressService } from '../services/progress';
import { AIService } from '../services/ai';
import { AudioService } from '../services/audio';
import { I18n } from '../services/i18n';
import { Toast } from './Toast';

export function renderPhraseCard(
  phrase: Phrase,
  onReviewUpdated?: (updatedPhrase: Phrase) => void
): HTMLElement {
  const card = document.createElement('div');
  card.className = 'phrase-card';
  card.id = `phrase-card-${phrase.id}`;
  card.style.border = '2px solid var(--border-strong)';

  const hasSentences = phrase.userSentences && phrase.userSentences.length > 0;
  const latestSentence = hasSentences ? phrase.userSentences![phrase.userSentences!.length - 1] : null;
  const isRu = I18n.getLang() === 'ru';

  const statusLabel = () => {
    switch (phrase.status) {
      case 'new': return isRu ? 'НОВАЯ' : 'NEW';
      case 'learning': return isRu ? 'В ПРОЦЕССЕ' : 'LEARNING';
      case 'difficult': return isRu ? 'СЛОЖНАЯ' : 'DIFFICULT';
      case 'learned': return isRu ? 'УСВОЕНО ✓' : 'MASTERED ✓';
      default: return phrase.status.toUpperCase();
    }
  };

  card.innerHTML = `
    <div class="phrase-main-header">
      <div style="flex: 1; min-width: 0;">
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          <h3 class="phrase-word" style="font-size: 1.4rem; font-weight: 800; color: var(--text-primary);">${phrase.phrase}</h3>
          <button class="btn btn-secondary btn-sm phrase-audio-btn" id="speak-phrase-btn-${phrase.id}" title="${I18n.t('btn.listen')}">
            <span class="audio-icon">🔊</span>
            <span class="audio-label">${I18n.t('btn.listen')}</span>
          </button>
          <span class="badge badge-${phrase.level.toLowerCase()}">${phrase.level}</span>
          <span class="badge badge-neutral">${phrase.category}</span>
          <span class="badge" style="background-color: var(--bg-surface-active); color: var(--text-muted); font-size: 0.72rem; font-weight: 800;">
            ${statusLabel()}
          </span>
        </div>
        <div class="phrase-phonetic" style="font-size: 0.9rem; color: var(--text-muted); font-family: var(--font-mono); margin-top: 4px;">${phrase.pronunciation}</div>
      </div>
      <div class="phrase-translation" style="font-size: 1.15rem; font-weight: 700; color: var(--accent-green-hover);">${phrase.translation}</div>
    </div>

    <!-- Example in context -->
    <div class="phrase-example-box" style="padding: 14px 16px; border-radius: var(--radius-md); background-color: var(--bg-secondary); margin-bottom: 14px; border: 1px solid var(--border-subtle);">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
        <strong style="color: var(--text-primary); font-size: 0.95rem;">"${phrase.example}"</strong>
        <button class="btn btn-sm btn-ghost example-audio-btn" id="speak-example-btn-${phrase.id}" title="${isRu ? 'Слушать пример' : 'Listen to example'}" style="padding: 2px 8px; font-size: 0.85rem;">
          🔊
        </button>
      </div>
      ${phrase.exampleTranslation ? `<div class="phrase-example-trans" style="font-size: 0.88rem; color: var(--text-muted); margin-top: 4px;">${phrase.exampleTranslation}</div>` : ''}
    </div>

    <!-- Explanation & usage notes -->
    <div class="phrase-explanation" style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 16px; line-height: 1.5;">
      <strong>${I18n.t('phrases.usage_label')}</strong> ${phrase.explanation}
      <div style="font-size: 0.83rem; color: var(--text-muted); margin-top: 4px;">
        💡 <em>${phrase.commonUsage}</em>
      </div>
    </div>

    <!-- Sentence Building Section (Your Turn) -->
    <div class="sentence-builder-box" style="background-color: var(--bg-surface-hover); padding: 16px; border-radius: var(--radius-lg); border: 1.5px solid var(--border-subtle); margin-bottom: 16px;">
      <div class="sentence-builder-title" style="margin-bottom: 8px;">
        <strong style="color: var(--text-primary); font-size: 0.95rem;">${I18n.t('phrases.your_turn')}</strong>
        <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 2px;">
          ${I18n.t('phrases.your_turn_desc')}
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 8px;">
        <input 
          type="text" 
          class="input-text" 
          id="sentence-input-${phrase.id}" 
          placeholder='e.g., I need to ${phrase.phrase} before Monday...' 
          value="${latestSentence ? latestSentence.sentence : ''}"
          style="font-size: 15px; padding: 10px 14px;"
        />
        <div style="display: flex; justify-content: flex-end;">
          <button class="btn btn-primary btn-sm" id="check-sentence-btn-${phrase.id}" style="font-weight: 700;">
            ${I18n.t('phrases.check_btn')}
          </button>
        </div>
      </div>

      <div id="sentence-feedback-container-${phrase.id}" style="${latestSentence ? 'display: block;' : 'display: none;'} margin-top: 12px;">
        ${
          latestSentence
            ? `
          <div class="sentence-feedback-card" style="padding: 12px 14px; background-color: var(--bg-surface); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
            <div class="feedback-badge-row" style="display: flex; gap: 8px; margin-bottom: 6px;">
              <span class="feedback-pill pass" style="font-size: 0.75rem; font-weight: 700; color: var(--accent-green-hover);">${isRu ? 'Грамматика ✓' : 'Grammar ✓'}</span>
              <span class="feedback-pill pass" style="font-size: 0.75rem; font-weight: 700; color: var(--accent-green-hover);">${isRu ? 'Использование фразы ✓' : 'Phrase usage ✓'}</span>
              <span class="feedback-pill pass" style="font-size: 0.75rem; font-weight: 700; color: var(--accent-green-hover);">${isRu ? 'Естественность ✓' : 'Naturalness ✓'}</span>
            </div>
            <div style="font-size: 0.85rem; color: var(--text-secondary);">${latestSentence.feedback.comment}</div>
            ${
              latestSentence.feedback.correctedSentence
                ? `<div class="feedback-better-version" style="font-size: 0.85rem; font-weight: 600; color: var(--accent-primary); margin-top: 6px;">${I18n.t('phrases.better_version')} "${latestSentence.feedback.correctedSentence}"</div>`
                : ''
            }
          </div>
        `
            : ''
        }
      </div>
    </div>

    <!-- Review / Status Action Bar -->
    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 14px; flex-wrap: wrap; gap: 10px;">
      <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-muted);">
        ${isRu ? 'Оцените запоминание:' : 'Rate recall:'}
      </div>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <button class="btn btn-sm ${phrase.status === 'difficult' ? 'btn-primary' : 'btn-secondary'} rate-btn" data-status="difficult" style="font-size: 0.8rem; font-weight: 700;">
          ${isRu ? 'Сложно' : 'Difficult'}
        </button>
        <button class="btn btn-sm ${phrase.status === 'learning' ? 'btn-primary' : 'btn-secondary'} rate-btn" data-status="learning" style="font-size: 0.8rem; font-weight: 700;">
          ${isRu ? 'Учу' : 'Learning'}
        </button>
        <button class="btn btn-sm ${phrase.status === 'learned' ? 'btn-duo' : 'btn-secondary'} rate-btn" data-status="learned" style="font-size: 0.8rem; font-weight: 800;">
          ${isRu ? 'Усвоено ✓' : 'Mastered ✓'}
        </button>
      </div>
    </div>
  `;

  // Audio pronunciation
  card.querySelector(`#speak-phrase-btn-${phrase.id}`)?.addEventListener('click', () => {
    AudioService.playPop();
    AudioService.speak(phrase.phrase);
  });

  card.querySelector(`#speak-example-btn-${phrase.id}`)?.addEventListener('click', () => {
    AudioService.playPop();
    AudioService.speak(phrase.example);
  });

  // Check user sentence
  card.querySelector(`#check-sentence-btn-${phrase.id}`)?.addEventListener('click', async () => {
    const input = card.querySelector(`#sentence-input-${phrase.id}`) as HTMLInputElement;
    const text = input?.value.trim();
    if (!text) {
      Toast.show(isRu ? 'Пожалуйста, напишите предложение с этой фразой.' : 'Please write a sentence first.', 'warning');
      return;
    }

    AudioService.playPop();
    const btn = card.querySelector(`#check-sentence-btn-${phrase.id}`) as HTMLButtonElement;
    btn.disabled = true;
    btn.textContent = isRu ? 'Проверяю...' : 'Checking...';

    try {
      const feedback = await AIService.checkSentence(phrase.phrase, text);

      if (!phrase.userSentences) phrase.userSentences = [];
      phrase.userSentences.push({
        sentence: text,
        feedback,
        date: new Date().toISOString()
      });

      if (feedback.isGrammaticallyCorrect && feedback.isUsedCorrectly) {
        phrase.status = 'learned';
        AudioService.playSuccess();
        ProgressService.addXp(15, isRu ? `Составлено предложение с: "${phrase.phrase}"` : `Practiced phrase: "${phrase.phrase}"`);
      } else {
        AudioService.playError();
      }

      StorageService.updatePhrase(phrase);
      onReviewUpdated?.(phrase);
    } catch (e) {
      console.error(e);
      Toast.show(isRu ? 'Не удалось проверить предложение' : 'Could not check sentence', 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = I18n.t('phrases.check_btn');
    }
  });

  // Rate status buttons
  card.querySelectorAll('.rate-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      AudioService.playPop();
      const status = (e.currentTarget as HTMLElement).getAttribute('data-status') as PhraseStatus;
      if (status) {
        phrase.status = status;
        phrase.reviewCount = (phrase.reviewCount || 0) + 1;
        StorageService.updatePhrase(phrase);
        if (status === 'learned') {
          ProgressService.addXp(10, isRu ? `Фраза усвоена: ${phrase.phrase}` : `Mastered: ${phrase.phrase}`);
          AudioService.playCelebration();
        }
        onReviewUpdated?.(phrase);
      }
    });
  });

  return card;
}
