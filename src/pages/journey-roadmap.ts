import { User } from '../types/user';
import { JOURNEY_UNITS, JourneyLesson } from '../data/journey-units';
import { StorageService } from '../services/storage';
import { AudioService } from '../services/audio';
import { I18n } from '../services/i18n';
import { openLessonModal } from '../components/LessonModal';

export function renderJourneyRoadmap(
  user: User,
  onNavigate: (route: string) => void,
  onProgressUpdated: () => void
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'page-container';

  const completedLessonIds = StorageService.getCompletedLessons();
  const currentLang = I18n.getLang();
  const isRu = currentLang === 'ru';

  // Find next active lesson
  let nextLesson: JourneyLesson = JOURNEY_UNITS[0].lessons[0];
  for (const unit of JOURNEY_UNITS) {
    for (const les of unit.lessons) {
      if (!completedLessonIds.includes(les.id)) {
        nextLesson = les;
        break;
      }
    }
    if (!completedLessonIds.includes(nextLesson.id)) break;
  }

  const nextLessonTitle = isRu ? nextLesson.titleRu : nextLesson.title;
  const totalLessonsCount = JOURNEY_UNITS.reduce((sum, u) => sum + u.lessons.length, 0);
  const progressPercent = Math.min(100, Math.round((completedLessonIds.length / totalLessonsCount) * 100));

  container.innerHTML = `
    <!-- Top Learning Banner (Duolingo Style: Big, Friendly, Clear) -->
    <div class="card" style="background: var(--bg-surface); border: 2px solid var(--border-strong); padding: 24px 28px; margin-bottom: 28px; border-radius: var(--radius-xl); box-shadow: var(--shadow-sm);">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px;">
        <div style="flex: 1; min-width: 280px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; flex-wrap: wrap;">
            <span class="badge" style="background-color: var(--accent-green-light); color: var(--accent-green-hover); font-weight: 800; font-size: 0.85rem; padding: 4px 10px;">
              ${user.currentLevel} → ${user.targetLevel}
            </span>
            <span style="font-size: 0.88rem; font-weight: 700; color: var(--text-muted);">
              ${progressPercent}% ${isRu ? 'пути пройдено' : 'completed'}
            </span>
          </div>

          <h1 style="font-size: 1.85rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em; line-height: 1.25;">
            ${isRu ? `Привет, ${user.name}! Твой путь к уровню B1` : `Welcome back, ${user.name}!`}
          </h1>
          <p style="font-size: 0.95rem; color: var(--text-secondary); margin-top: 6px;">
            ${isRu ? `Следующий шаг: <strong>${nextLessonTitle}</strong> (~${nextLesson.estimatedMinutes} мин)` : `Next lesson: <strong>${nextLessonTitle}</strong> (~${nextLesson.estimatedMinutes} min)`}
          </p>
        </div>

        <!-- Big Duolingo-style Action Button -->
        <div>
          <button class="btn btn-duo btn-lg" id="hero-continue-lesson-btn" style="min-width: 230px; font-size: 1.1rem; padding: 14px 28px;">
            <span>▶</span> ${isRu ? 'Продолжить урок' : 'Continue Lesson'}
          </button>
        </div>
      </div>

      <!-- Quick Habit Tracker Bar -->
      <div style="margin-top: 20px; padding-top: 18px; border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
        <div style="display: flex; gap: 18px; align-items: center; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 6px; font-weight: 800; font-size: 0.95rem; color: var(--accent-amber);" title="${isRu ? 'Серия дней ежедневных занятий' : 'Daily streak'}">
            <span style="font-size: 1.2rem;">🔥</span> ${user.streak} ${isRu ? 'дней подряд' : 'day streak'}
          </div>
          <div style="display: flex; align-items: center; gap: 6px; font-weight: 800; font-size: 0.95rem; color: var(--accent-primary);" title="${isRu ? 'Очки опыта за выполнение уроков' : 'XP points'}">
            <span style="font-size: 1.2rem;">⚡</span> ${user.xp.toLocaleString()} XP
          </div>
          <div style="display: flex; align-items: center; gap: 6px; font-weight: 800; font-size: 0.95rem; color: var(--accent-green);" title="${isRu ? 'Пройдено уроков' : 'Lessons done'}">
            <span style="font-size: 1.2rem;">🎯</span> ${completedLessonIds.length} / ${totalLessonsCount} ${isRu ? 'уроков' : 'lessons'}
          </div>
        </div>

        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button class="btn btn-secondary btn-sm" id="quick-tracker-btn" style="font-weight: 700;">
            🔥 ${isRu ? 'Трекер серии' : 'Streak Calendar'}
          </button>
          <button class="btn btn-secondary btn-sm" id="quick-practice-btn" style="font-weight: 700;">
            💬 ${isRu ? 'Практика' : 'Practice Gym'}
          </button>
        </div>
      </div>
    </div>

    <!-- Units Roadmap (Duolingo Style: Friendly Path) -->
    <div style="max-width: 680px; margin: 0 auto; display: flex; flex-direction: column; gap: 36px;">
      ${JOURNEY_UNITS.map((unit) => {
        const unitTitle = isRu ? unit.titleRu : unit.titleEn;
        const unitDesc = isRu ? unit.descriptionRu : unit.descriptionEn;
        const isUnitCompleted = unit.lessons.every((l) => completedLessonIds.includes(l.id));

        return `
          <div class="journey-unit-block">
            <!-- Unit Header Banner -->
            <div style="background-color: ${unit.color}; color: #ffffff; padding: 20px 24px; border-radius: var(--radius-xl); box-shadow: 0 4px 14px ${unit.color}35; margin-bottom: 22px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <span style="font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.95;">
                  ${unit.level} • ${isRu ? `Раздел ${unit.number}` : `Section ${unit.number}`}
                </span>
                ${isUnitCompleted ? `<span style="background: rgba(255,255,255,0.25); padding: 3px 12px; border-radius: 999px; font-size: 0.8rem; font-weight: 800;">${isRu ? 'Пройдено ✓' : 'Completed ✓'}</span>` : ''}
              </div>
              <h2 style="font-size: 1.35rem; font-weight: 800; line-height: 1.3;">
                ${unitTitle}
              </h2>
              <p style="font-size: 0.92rem; opacity: 0.95; margin-top: 4px;">
                ${unitDesc}
              </p>
            </div>

            <!-- Lessons Path Nodes -->
            <div style="display: flex; flex-direction: column; align-items: center; gap: 16px; position: relative;">
              ${unit.lessons
                .map((lesson, idx) => {
                  const isCompleted = completedLessonIds.includes(lesson.id);
                  const isCurrent = lesson.id === nextLesson.id;
                  const lTitle = isRu ? lesson.titleRu : lesson.title;
                  const lDesc = isRu ? lesson.descriptionRu : lesson.descriptionEn;

                  // Alternate subtle left/right offset for Duolingo snake feel
                  const offset = idx % 2 === 1 ? 'transform: translateX(12px);' : 'transform: translateX(-12px);';

                  return `
                  <div 
                    class="journey-lesson-node ${isCompleted ? 'completed' : isCurrent ? 'current' : 'locked'}" 
                    data-lesson-id="${lesson.id}"
                    role="button"
                    tabindex="${isCompleted || isCurrent ? '0' : '-1'}"
                    style="${offset} width: 100%; max-width: 480px; display: flex; align-items: center; gap: 16px; padding: 16px 20px; border-radius: var(--radius-xl); background-color: var(--bg-surface); border: 2px solid ${
                      isCurrent ? unit.color : isCompleted ? 'var(--accent-green-border)' : 'var(--border-strong)'
                    }; cursor: ${isCompleted || isCurrent ? 'pointer' : 'default'}; box-shadow: ${
                      isCurrent ? `0 0 0 3px ${unit.color}30, 0 4px 14px rgba(0,0,0,0.06)` : 'var(--shadow-sm)'
                    }; opacity: ${!isCompleted && !isCurrent ? '0.7' : '1'}; transition: all var(--transition-fast);"
                  >
                    <!-- Lesson Icon Node -->
                    <div style="width: 52px; height: 52px; border-radius: 50%; background-color: ${
                      isCompleted ? 'var(--accent-green-light)' : isCurrent ? unit.color : 'var(--bg-secondary)'
                    }; color: ${isCurrent ? '#fff' : 'inherit'}; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0; box-shadow: ${
                      isCurrent ? '0 4px 10px ' + unit.color + '50' : 'none'
                    };">
                      ${isCompleted ? '✅' : !isCompleted && !isCurrent ? '🔒' : lesson.icon}
                    </div>

                    <!-- Lesson Information -->
                    <div style="flex: 1; min-width: 0;">
                      <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 2px;">
                        <span style="font-size: 0.75rem; font-weight: 800; color: ${isCurrent ? unit.color : 'var(--text-muted)'}; text-transform: uppercase;">
                          ${isCurrent ? (isRu ? 'Текущий урок' : 'Active Lesson') : isCompleted ? (isRu ? 'Пройдено ✓' : 'Completed') : (isRu ? 'Закрыто' : 'Locked')}
                        </span>
                        <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">• +${lesson.xpReward} XP</span>
                      </div>
                      <h3 style="font-size: 1.05rem; font-weight: 800; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        ${lTitle}
                      </h3>
                      <p style="font-size: 0.83rem; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px;">
                        ${lDesc}
                      </p>
                    </div>

                    <!-- Action Button / Badge -->
                    <div>
                      ${
                        isCurrent
                          ? `<span class="btn btn-sm btn-duo" style="padding: 6px 16px; font-size: 0.85rem; font-weight: 800;">${isRu ? 'Начать ▶' : 'Start ▶'}</span>`
                          : isCompleted
                          ? `<span style="font-size: 0.85rem; color: var(--accent-green-hover); font-weight: 800;">${isRu ? 'Повторить ↺' : 'Review ↺'}</span>`
                          : '<span style="font-size: 1.1rem; color: var(--text-muted);">🔒</span>'
                      }
                    </div>
                  </div>
                `;
                })
                .join('')}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  // Hero button click: opens next lesson
  container.querySelector('#hero-continue-lesson-btn')?.addEventListener('click', () => {
    AudioService.playPop();
    openLessonModal(nextLesson, () => {
      onProgressUpdated();
    });
  });

  // Lesson node clicks
  container.querySelectorAll('.journey-lesson-node').forEach((node) => {
    node.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      if (target.classList.contains('locked')) {
        AudioService.playError();
        return;
      }
      const lId = target.getAttribute('data-lesson-id');
      const found = JOURNEY_UNITS.flatMap((u) => u.lessons).find((l) => l.id === lId);
      if (found) {
        AudioService.playPop();
        openLessonModal(found, () => {
          onProgressUpdated();
        });
      }
    });
  });

  // Quick navigation buttons
  container.querySelector('#quick-tracker-btn')?.addEventListener('click', () => {
    AudioService.playPop();
    onNavigate('/tracker');
  });

  container.querySelector('#quick-practice-btn')?.addEventListener('click', () => {
    AudioService.playPop();
    onNavigate('/practice');
  });

  return container;
}
