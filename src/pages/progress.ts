import { User } from '../types/user';
import { StorageService } from '../services/storage';
import { ProgressService } from '../services/progress';
import { I18n } from '../services/i18n';

export function renderProgressPage(
  user: User,
  _onNavigate: (route: string) => void
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'progress-page-wrapper';

  const phrases = StorageService.getPhrases();
  const grammar = StorageService.getGrammar();
  const testResults = StorageService.getTestResults();
  const history = StorageService.getHistory();
  const levelInfo = ProgressService.calculateLevel(user.xp);

  const currentLang = I18n.getLang();
  const isRu = currentLang === 'ru';

  const learnedPhrasesCount = phrases.filter((p) => p.status === 'learned').length;
  const completedGrammarCount = grammar.filter((g) => g.completed).length;

  const totalTests = testResults.length;
  const avgTestScore = totalTests > 0
    ? Math.round(testResults.reduce((acc, t) => acc + t.percentage, 0) / totalTests)
    : 0;

  // Past 7 days
  const weekDaysRu = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const weekDaysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weekDays = isRu ? weekDaysRu : weekDaysEn;

  const today = new Date();
  const last7Days: Array<{ dayName: string; dateStr: string; minutes: number; isToday: boolean }> = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = weekDays[d.getDay()];
    const entry = history.find((h) => h.date === dateStr);
    last7Days.push({
      dayName,
      dateStr,
      minutes: entry ? entry.minutes : (i === 0 ? user.todayStudyMinutes || 0 : 0),
      isToday: i === 0
    });
  }

  const maxMinutes = Math.max(30, ...last7Days.map((d) => d.minutes));

  container.innerHTML = `
    <!-- Header -->
    <div style="margin-bottom: 24px;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
        <span class="badge" style="background-color: var(--accent-primary-light); color: var(--accent-primary); font-weight: 800;">
          ${isRu ? 'Аналитика и динамика' : 'Analytics & Stats'}
        </span>
        <span style="font-size: 0.88rem; font-weight: 700; color: var(--text-muted);">
          ${user.currentLevel} → ${user.targetLevel}
        </span>
      </div>
      <h2 style="font-size: 1.6rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em;">
        ${isRu ? 'Статистика и прогресс обучения' : 'My Learning Progress & Stats'}
      </h2>
      <p style="font-size: 0.92rem; color: var(--text-secondary); max-width: 650px; margin-top: 4px;">
        ${isRu ? 'Наглядные показатели вашей регулярности, накопленного опыта XP и распределения навыков.' : 'Data-backed insights into your learning velocity, streak consistency, and skill distribution.'}
      </p>
    </div>

    <!-- High-level Metric Grid -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 28px;">
      <div class="card" style="padding: 20px; border: 2px solid var(--border-strong);">
        <div style="font-size: 0.8rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">
          ${isRu ? 'Всего времени' : 'Total Study Time'}
        </div>
        <div style="font-size: 1.8rem; font-weight: 800; color: var(--text-primary); font-family: var(--font-mono); margin-top: 4px;">
          ${Math.floor((user.totalStudyMinutes || 0) / 60)}${isRu ? 'ч ' : 'h '}${(user.totalStudyMinutes || 0) % 60}${isRu ? 'м' : 'm'}
        </div>
        <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); margin-top: 2px;">
          ${isRu ? `Сегодня: ${user.todayStudyMinutes || 0} мин` : `Today: ${user.todayStudyMinutes || 0} min`}
        </div>
      </div>

      <div class="card" style="padding: 20px; border: 2px solid var(--border-strong);">
        <div style="font-size: 0.8rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">
          ${isRu ? 'Выучено фраз' : 'Learned Phrases'}
        </div>
        <div style="font-size: 1.8rem; font-weight: 800; color: var(--accent-green-hover); font-family: var(--font-mono); margin-top: 4px;">
          ${learnedPhrasesCount} / ${phrases.length}
        </div>
        <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); margin-top: 2px;">
          ${Math.round((learnedPhrasesCount / phrases.length) * 100)}% ${isRu ? 'активного запаса' : 'retention'}
        </div>
      </div>

      <div class="card" style="padding: 20px; border: 2px solid var(--border-strong);">
        <div style="font-size: 0.8rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">
          ${isRu ? 'Темы грамматики' : 'Grammar Topics'}
        </div>
        <div style="font-size: 1.8rem; font-weight: 800; color: var(--accent-primary); font-family: var(--font-mono); margin-top: 4px;">
          ${completedGrammarCount} / ${grammar.length}
        </div>
        <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); margin-top: 2px;">
          ${isRu ? 'ключевых правил освоено' : 'topics mastered'}
        </div>
      </div>

      <div class="card" style="padding: 20px; border: 2px solid var(--border-strong);">
        <div style="font-size: 0.8rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">
          ${isRu ? 'Средний балл тестов' : 'Avg Test Score'}
        </div>
        <div style="font-size: 1.8rem; font-weight: 800; color: var(--accent-amber); font-family: var(--font-mono); margin-top: 4px;">
          ${avgTestScore}%
        </div>
        <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); margin-top: 2px;">
          ${totalTests} ${isRu ? 'пройденных проверок' : 'tests completed'}
        </div>
      </div>
    </div>

    <!-- 7-Day Velocity Chart Card -->
    <div class="card" style="padding: 24px; margin-bottom: 28px; border: 2px solid var(--border-strong);">
      <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin-bottom: 4px;">
        ${isRu ? 'График активности за последние 7 дней' : '7-Day Activity Velocity'}
      </h3>
      <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 24px;">
        ${isRu ? 'Минуты практики в день. Зеленый столбец означает достижение дневной нормы (15+ мин).' : 'Daily study minutes. Green bars indicate hitting your daily habit target.'}
      </p>

      <div style="display: flex; align-items: flex-end; justify-content: space-between; height: 160px; padding-top: 20px; border-bottom: 1px solid var(--border-subtle); gap: 12px;">
        ${last7Days
          .map((d) => {
            const heightPct = Math.max(8, Math.round((d.minutes / maxMinutes) * 100));
            const isTargetMet = d.minutes >= 15;
            return `
            <div style="flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; justify-content: flex-end;">
              <span style="font-size: 0.75rem; font-weight: 700; color: ${isTargetMet ? 'var(--accent-green-hover)' : 'var(--text-muted)'}; margin-bottom: 6px;">
                ${d.minutes > 0 ? `${d.minutes}м` : '0'}
              </span>
              <div 
                style="width: 100%; max-width: 38px; height: ${heightPct}%; border-radius: 6px 6px 0 0; background-color: ${
              isTargetMet ? 'var(--accent-green)' : d.minutes > 0 ? 'var(--accent-amber)' : 'var(--bg-secondary)'
            }; transition: height 0.3s ease; border: 1px solid ${
              isTargetMet ? 'var(--accent-green-border)' : 'var(--border-subtle)'
            };"
              ></div>
              <span style="font-size: 0.78rem; font-weight: ${d.isToday ? '800' : '600'}; color: ${
              d.isToday ? 'var(--accent-primary)' : 'var(--text-muted)'
            }; margin-top: 8px;">
                ${d.dayName}
              </span>
            </div>
          `;
          })
          .join('')}
      </div>
    </div>

    <!-- Current Level Mastery Card -->
    <div class="card" style="padding: 24px; border: 2px solid var(--border-strong);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 10px;">
        <div>
          <span style="font-size: 0.8rem; font-weight: 800; color: var(--accent-green-hover); text-transform: uppercase;">
            ${isRu ? 'Текущий уровень' : 'Current Rank'}
          </span>
          <h3 style="font-size: 1.3rem; font-weight: 800; color: var(--text-primary); margin-top: 2px;">
            ${isRu ? `Уровень ${levelInfo.level} — ${levelInfo.titleRu || levelInfo.title}` : `Level ${levelInfo.level} — ${levelInfo.title}`}
          </h3>
        </div>
        <div style="font-size: 1.1rem; font-weight: 800; color: var(--accent-primary);">
          ${user.xp} XP
        </div>
      </div>

      <div class="progress-bar-track" style="height: 10px; margin-bottom: 8px;">
        <div class="progress-bar-fill" style="width: ${levelInfo.progressPercent}%; background: linear-gradient(90deg, var(--accent-green), #10b981);"></div>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 700; color: var(--text-muted);">
        <span>${isRu ? 'Прогресс уровня' : 'Level progress'}</span>
        <span>${isRu ? `Еще ${levelInfo.nextLevelXp - user.xp} XP до следующего ранга` : `${levelInfo.nextLevelXp - user.xp} XP to next level`}</span>
      </div>
    </div>
  `;

  return container;
}
