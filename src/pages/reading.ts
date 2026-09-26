import { User } from '../types/user';
import { ReadingArticle } from '../types/lesson';
import { StorageService } from '../services/storage';
import { ProgressService } from '../services/progress';
import { AudioService } from '../services/audio';
import { I18n } from '../services/i18n';
import { Toast } from '../components/Toast';

export function renderReadingPage(
  _user: User,
  _onNavigate: (route: string) => void
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'page-container';

  const articles = StorageService.getReading();
  let currentArticle: ReadingArticle | null = null;
  let selectedLevelFilter: 'All' | 'A1' | 'A2' | 'B1' = 'All';
  let isReadingAloud = false;
  const isRu = I18n.getLang() === 'ru';

  const renderView = () => {
    container.innerHTML = '';

    if (!currentArticle) {
      // Articles List View
      const listWrapper = document.createElement('div');
      listWrapper.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span class="badge" style="background-color: var(--accent-green-light); color: var(--accent-green-hover); font-weight: 800;">
                ${isRu ? 'Лаборатория чтения' : 'Reading Lab'}
              </span>
              <span style="font-size: 0.88rem; font-weight: 700; color: var(--text-muted);">
                ${articles.length} ${isRu ? 'текстов и рассказов' : 'articles'}
              </span>
            </div>
            <h2 style="font-size: 1.6rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em;">
              ${I18n.t('reading.title')}
            </h2>
            <p style="font-size: 0.92rem; color: var(--text-secondary); max-width: 650px; margin-top: 4px; line-height: 1.5;">
              ${I18n.t('reading.subtitle')}
            </p>
          </div>

          <!-- Level Tabs -->
          <div style="display: flex; gap: 6px; background-color: var(--bg-surface); padding: 4px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
            <button class="btn btn-sm ${selectedLevelFilter === 'All' ? 'btn-primary' : 'btn-secondary'} reading-tab" data-level="All" style="font-weight: 700;">${isRu ? 'Все уровни' : 'All Levels'}</button>
            <button class="btn btn-sm ${selectedLevelFilter === 'A1' ? 'btn-primary' : 'btn-secondary'} reading-tab" data-level="A1" style="font-weight: 700;">A1</button>
            <button class="btn btn-sm ${selectedLevelFilter === 'A2' ? 'btn-primary' : 'btn-secondary'} reading-tab" data-level="A2" style="font-weight: 700;">A2</button>
            <button class="btn btn-sm ${selectedLevelFilter === 'B1' ? 'btn-primary' : 'btn-secondary'} reading-tab" data-level="B1" style="font-weight: 700;">B1</button>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
          ${articles
            .filter((a) => selectedLevelFilter === 'All' || a.level === selectedLevelFilter)
            .map(
              (art) => `
            <div class="card card-interactive open-article-card" data-id="${art.id}" style="padding: 22px; border: 2px solid var(--border-strong); border-radius: var(--radius-xl); cursor: pointer; transition: all var(--transition-fast);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <span class="badge badge-${art.level.toLowerCase()}" style="font-weight: 800;">${art.level}</span>
                <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted);">⏱️ ${art.readingTime} ${isRu ? 'мин чтения' : 'min read'}</span>
              </div>
              <h3 style="font-size: 1.2rem; font-weight: 800; color: var(--text-primary); margin-bottom: 8px;">
                ${art.title}
              </h3>
              <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 16px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                ${art.text.replace(/\n\n/g, ' ')}
              </p>
              <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 12px;">
                <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">
                  ${art.bestScore !== undefined ? `${isRu ? 'Лучший счет: ' : 'Best score: '}${art.bestScore}/5 ✓` : (isRu ? 'Еще не прочитано' : 'Not read yet')}
                </span>
                <span style="font-size: 0.85rem; font-weight: 800; color: var(--accent-green-hover);">${isRu ? 'Читать текст →' : 'Read story →'}</span>
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      `;

      listWrapper.querySelectorAll('.reading-tab').forEach((tab) => {
        tab.addEventListener('click', (e) => {
          selectedLevelFilter = (e.currentTarget as HTMLElement).getAttribute('data-level') as any;
          AudioService.playPop();
          renderView();
        });
      });

      listWrapper.querySelectorAll('.open-article-card').forEach((card) => {
        card.addEventListener('click', (e) => {
          const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
          currentArticle = articles.find((a) => a.id === id) || null;
          AudioService.playPop();
          renderView();
        });
      });

      container.appendChild(listWrapper);
    } else {
      // Single Article Reader View
      const readerWrapper = document.createElement('div');
      readerWrapper.innerHTML = `
        <div style="max-width: 780px; margin: 0 auto;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 10px;">
            <button class="btn btn-secondary btn-sm" id="back-to-articles-btn" style="font-weight: 700;">
              ← ${isRu ? 'Ко всем рассказам' : 'Back to Articles'}
            </button>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="badge badge-${currentArticle.level.toLowerCase()}" style="font-weight: 800;">${currentArticle.level}</span>
              <button class="btn btn-duo btn-sm" id="read-aloud-btn" style="font-weight: 700;">
                <span id="read-aloud-icon">${isReadingAloud ? '⏹' : '🔊'}</span>
                <span id="read-aloud-text">${isReadingAloud ? (isRu ? 'Остановить чтение' : 'Stop Reading') : (isRu ? 'Прочитать вслух' : 'Read Aloud')}</span>
              </button>
            </div>
          </div>

          <div class="card" style="padding: 32px 36px; margin-bottom: 28px; border: 2px solid var(--border-strong); border-radius: var(--radius-xl);">
            <h2 style="font-size: 1.7rem; font-weight: 800; color: var(--text-primary); margin-bottom: 6px;">
              ${currentArticle.title}
            </h2>
            <div style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600; margin-bottom: 24px;">
              ⏱️ ${currentArticle.readingTime} ${isRu ? 'минут чтения' : 'min read'}
            </div>

            <!-- Article Body -->
            <div style="font-size: 1.05rem; line-height: 1.75; color: var(--text-primary); margin-bottom: 28px; white-space: pre-line;">
              ${currentArticle.text}
            </div>

            <!-- Vocabulary Helpers -->
            <div style="border-top: 1px solid var(--border-subtle); padding-top: 20px; margin-top: 24px;">
              <h3 style="font-size: 0.95rem; font-weight: 800; color: var(--text-primary); text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.05em;">
                📖 ${isRu ? 'Полезные слова и выражения из текста:' : 'Key Vocabulary in this Article:'}
              </h3>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px;">
                ${currentArticle.vocabularyHints
                  .map(
                    (v) => `
                  <div style="padding: 10px 14px; background-color: var(--bg-secondary); border-radius: var(--radius-md); border: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
                    <div>
                      <strong style="color: var(--text-primary); font-size: 0.95rem;">${v.word}</strong>
                      <div style="font-size: 0.82rem; color: var(--accent-green-hover); font-weight: 700; margin-top: 2px;">${v.translation}</div>
                    </div>
                    <button class="btn btn-sm btn-ghost vocab-audio-btn" data-word="${v.word}" title="Listen">
                      🔊
                    </button>
                  </div>
                `
                  )
                  .join('')}
              </div>
            </div>
          </div>
        </div>
      `;

      readerWrapper.querySelector('#back-to-articles-btn')?.addEventListener('click', () => {
        AudioService.stop();
        isReadingAloud = false;
        currentArticle = null;
        renderView();
      });

      readerWrapper.querySelector('#read-aloud-btn')?.addEventListener('click', () => {
        if (isReadingAloud) {
          AudioService.stop();
          isReadingAloud = false;
          renderView();
        } else {
          isReadingAloud = true;
          AudioService.speak(currentArticle!.text.replace(/\n+/g, ' '), {
            rate: 0.9,
            onEnd: () => {
              isReadingAloud = false;
              renderView();
            }
          });
          renderView();
        }
      });

      readerWrapper.querySelectorAll('.vocab-audio-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const w = (e.currentTarget as HTMLElement).getAttribute('data-word');
          if (w) {
            AudioService.playPop();
            AudioService.speak(w);
          }
        });
      });

      container.appendChild(readerWrapper);
    }
  };

  renderView();
  return container;
}
