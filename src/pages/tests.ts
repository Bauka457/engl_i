import { User } from '../types/user';
import { Question, QuestionResult, TestResult } from '../types/test';
import { INITIAL_TEST_QUESTIONS } from '../data/tests';
import { StorageService } from '../services/storage';
import { ProgressService } from '../services/progress';
import { AudioService } from '../services/audio';
import { I18n } from '../services/i18n';
import { renderTestCard } from '../components/TestCard';

export function renderTestsPage(
  _user: User,
  _onNavigate: (route: string) => void
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'tests-page-wrapper';

  let isTestRunning = false;
  let currentQuestions: Question[] = [];
  let currentIndex = 0;
  let detailedResults: QuestionResult[] = [];

  const previousTests = StorageService.getTestResults();
  const isRu = I18n.getLang() === 'ru';

  const startNewTest = (count: number = 8) => {
    AudioService.playPop();
    const shuffled = [...INITIAL_TEST_QUESTIONS].sort(() => 0.5 - Math.random());
    currentQuestions = shuffled.slice(0, count);
    currentIndex = 0;
    detailedResults = [];
    isTestRunning = true;
    renderTestScreen();
  };

  const renderHomeScreen = () => {
    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <span class="badge" style="background-color: var(--accent-green-light); color: var(--accent-green-hover); font-weight: 800;">
              ${isRu ? 'Проверка знаний' : 'Evaluation Engine'}
            </span>
            <span style="font-size: 0.88rem; font-weight: 700; color: var(--text-muted);">
              ${INITIAL_TEST_QUESTIONS.length} ${isRu ? 'вопросов в базе' : 'questions pool'}
            </span>
          </div>
          <h2 style="font-size: 1.6rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em;">
            ${I18n.t('tests.title')}
          </h2>
          <p style="font-size: 0.92rem; color: var(--text-secondary); max-width: 650px; margin-top: 4px; line-height: 1.5;">
            ${I18n.t('tests.subtitle')}
          </p>
        </div>

        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button class="btn btn-secondary" id="start-quick-test-btn" style="font-weight: 700;">
            ${I18n.t('tests.quick_btn')}
          </button>
          <button class="btn btn-duo" id="start-full-test-btn" style="font-weight: 800;">
            ${I18n.t('tests.full_btn')}
          </button>
        </div>
      </div>

      <!-- Test Hub Info Cards -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 28px;">
        <div class="card" style="padding: 20px; border: 2px solid var(--border-strong);">
          <div style="font-size: 0.85rem; font-weight: 800; color: var(--accent-green-hover); text-transform: uppercase; margin-bottom: 6px;">
            💬 ${isRu ? 'Фразы и коллокации' : 'Phrase Collocations'}
          </div>
          <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.45;">
            ${isRu ? 'Проверьте знание естественных связок слов и фразовых глаголов в контексте.' : 'Identify natural collocations in authentic sentences and choose the right phrasing.'}
          </p>
        </div>

        <div class="card" style="padding: 20px; border: 2px solid var(--border-strong);">
          <div style="font-size: 0.85rem; font-weight: 800; color: var(--accent-primary); text-transform: uppercase; margin-bottom: 6px;">
            🧩 ${isRu ? 'Грамматика и времена' : 'Grammar Rules'}
          </div>
          <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.45;">
            ${isRu ? 'Правильное употребление Present Simple, Past Simple, Perfect, модальных глаголов.' : 'Verify your mastery of tenses, conditionals, prepositions, and modals.'}
          </p>
        </div>

        <div class="card" style="padding: 20px; border: 2px solid var(--border-strong);">
          <div style="font-size: 0.85rem; font-weight: 800; color: var(--accent-amber); text-transform: uppercase; margin-bottom: 6px;">
            ✍️ ${isRu ? 'Построение предложений' : 'Sentence Structure'}
          </div>
          <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.45;">
            ${isRu ? 'Порядок слов, правильные союзы, предлоги и естественное звучание речи.' : 'Correct word order, clause connectives, and sentence structures.'}
          </p>
        </div>
      </div>

      <!-- Past Test Results History -->
      <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin-bottom: 16px;">
        ${I18n.t('tests.history_title')} (${previousTests.length})
      </h3>

      ${
        previousTests.length === 0
          ? `
        <div class="card" style="padding: 32px 20px; text-align: center; border: 2px dashed var(--border-strong);">
          <div style="font-size: 2.2rem; margin-bottom: 8px;">📝</div>
          <p style="font-size: 0.95rem; color: var(--text-muted); font-weight: 600;">
            ${I18n.t('tests.no_history')}
          </p>
        </div>
      `
          : `
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${previousTests
            .slice(-5)
            .reverse()
            .map((res) => {
              const isPassed = res.percentage >= 70;
              return `
              <div class="card" style="padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; border: 2px solid var(--border-subtle); flex-wrap: wrap; gap: 12px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <span style="font-size: 1.5rem;">${isPassed ? '🎯' : '💡'}</span>
                  <div>
                    <strong style="color: var(--text-primary); font-size: 0.95rem;">
                      ${isRu ? 'Мини-тест' : 'Mini Test'} (${res.score}/${res.totalQuestions})
                    </strong>
                    <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">
                      ${res.date.split('T')[0]} • ⏱️ ${res.durationSeconds} ${isRu ? 'сек.' : 'sec'}
                    </div>
                  </div>
                </div>

                <div style="display: flex; align-items: center; gap: 12px;">
                  <span class="badge" style="background-color: ${
                    isPassed ? 'var(--accent-green-light)' : 'var(--accent-amber-light)'
                  }; color: ${isPassed ? 'var(--accent-green-hover)' : 'var(--accent-amber-hover)'}; font-weight: 800; font-size: 0.9rem;">
                    ${res.percentage}%
                  </span>
                  <span style="font-weight: 800; color: var(--accent-primary); font-size: 0.85rem;">
                    +${res.xpEarned} XP
                  </span>
                </div>
              </div>
            `;
            })
            .join('')}
        </div>
      `
      }
    `;

    container.querySelector('#start-quick-test-btn')?.addEventListener('click', () => startNewTest(5));
    container.querySelector('#start-full-test-btn')?.addEventListener('click', () => startNewTest(8));
  };

  const renderTestScreen = () => {
    container.innerHTML = '';
    const q = currentQuestions[currentIndex];

    const card = renderTestCard(
      q,
      currentIndex,
      currentQuestions.length,
      (result) => {
        detailedResults.push(result);
        currentIndex += 1;

        if (currentIndex < currentQuestions.length) {
          renderTestScreen();
        } else {
          // Test Finished!
          completeTestSession();
        }
      }
    );

    container.appendChild(card);
  };

  const completeTestSession = () => {
    isTestRunning = false;
    const correctCount = detailedResults.filter((r) => r.isCorrect).length;
    const total = currentQuestions.length;
    const pct = Math.round((correctCount / total) * 100);
    const xpReward = correctCount * 5 + (pct >= 80 ? 20 : 5);

    const testRecord: TestResult = {
      id: 'test-res-' + Date.now(),
      date: new Date().toISOString(),
      score: correctCount,
      totalQuestions: total,
      percentage: pct,
      results: detailedResults,
      durationSeconds: total * 20,
      xpEarned: xpReward
    };

    StorageService.saveTestResult(testRecord);
    ProgressService.addXp(xpReward, isRu ? `Завершен тест: ${correctCount}/${total} (${pct}%)` : `Completed test`);
    ProgressService.checkAchievements();

    if (pct >= 80) {
      AudioService.playCelebration();
    } else {
      AudioService.playSuccess();
    }

    container.innerHTML = `
      <div class="card" style="max-width: 620px; margin: 30px auto; padding: 36px 28px; text-align: center; border-radius: var(--radius-xl); border: 2px solid var(--border-strong);">
        <div style="font-size: 3.5rem; margin-bottom: 12px;">${pct >= 70 ? '🎉' : '💪'}</div>
        <h2 style="font-size: 1.8rem; font-weight: 800; color: var(--text-primary); margin-bottom: 6px;">
          ${I18n.t('tests.results_title')}
        </h2>
        <p style="font-size: 0.95rem; color: var(--text-secondary); margin-bottom: 20px;">
          ${pct >= 70 ? I18n.t('tests.pass_msg') : I18n.t('tests.retry_msg')}
        </p>

        <!-- Big Score Pill -->
        <div style="display: inline-flex; align-items: center; gap: 14px; padding: 12px 28px; background-color: var(--bg-secondary); border-radius: var(--radius-full); margin-bottom: 24px; border: 2px solid var(--border-subtle);">
          <span style="font-size: 1.8rem; font-weight: 800; color: ${pct >= 70 ? 'var(--accent-green-hover)' : 'var(--accent-amber)'};">
            ${pct}%
          </span>
          <span style="font-size: 0.95rem; font-weight: 700; color: var(--text-muted);">
            (${correctCount} ${isRu ? 'из' : 'of'} ${total} ${isRu ? 'правильно' : 'correct'})
          </span>
          <span style="font-size: 1.1rem; font-weight: 800; color: var(--accent-primary);">
            +${xpReward} XP
          </span>
        </div>

        <!-- Breakdown List -->
        <div style="text-align: left; margin-bottom: 28px; display: flex; flex-direction: column; gap: 8px;">
          ${detailedResults
            .map(
              (r, idx) => `
            <div style="padding: 10px 14px; border-radius: var(--radius-md); background-color: ${
              r.isCorrect ? 'var(--accent-green-light)' : 'var(--accent-rose-light)'
            }; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.88rem; font-weight: 600; color: ${r.isCorrect ? 'var(--accent-green-hover)' : 'var(--accent-rose)'};">
                ${idx + 1}. ${r.isCorrect ? (isRu ? 'Правильно ✓' : 'Correct ✓') : (isRu ? 'Ошибка ✗' : 'Incorrect ✗')}
              </span>
              <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">
                ${r.isCorrect ? '' : `${isRu ? 'Правильно:' : 'Correct:'} ${r.correctAnswer}`}
              </span>
            </div>
          `
            )
            .join('')}
        </div>

        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
          <button class="btn btn-secondary" id="back-to-hub-btn" style="font-weight: 700; min-width: 160px;">
            ${isRu ? 'К списку тестов' : 'Back to Tests'}
          </button>
          <button class="btn btn-duo" id="try-again-btn" style="font-weight: 800; min-width: 160px;">
            ${I18n.t('btn.retry')}
          </button>
        </div>
      </div>
    `;

    container.querySelector('#back-to-hub-btn')?.addEventListener('click', () => {
      AudioService.playPop();
      renderHomeScreen();
    });

    container.querySelector('#try-again-btn')?.addEventListener('click', () => {
      startNewTest(currentQuestions.length);
    });
  };

  renderHomeScreen();
  return container;
}
