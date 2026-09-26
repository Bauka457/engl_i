import { User } from '../types/user';
import { StorageService } from '../services/storage';
import { ProgressService } from '../services/progress';
import { StreakService } from '../services/streak';
import { AudioService } from '../services/audio';
import { I18n } from '../services/i18n';
import { Toast } from '../components/Toast';
import { renderEmptyState } from '../components/EmptyState';

export function renderDailyPlanPage(
  user: User,
  onNavigate: (route: string) => void
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'page-container';

  let plan = StorageService.getDailyPlan();
  const isRu = I18n.getLang() === 'ru';

  if (!plan) {
    const emptyState = renderEmptyState({
      icon: '📅',
      title: isRu ? 'Нет активного плана на день' : 'No Active Daily Plan',
      description: isRu
        ? 'План формируется автоматически на основе ваших целей. Вы также можете сразу перейти к урокам.'
        : 'Tell us how you feel and what you want to achieve today, and AI will construct your personalized plan.',
      actionText: isRu ? 'Перейти к урокам ▶' : 'Go to Learn Path',
      onAction: () => onNavigate('/dashboard')
    });
    container.appendChild(emptyState);
    return container;
  }

  const completedCount = plan.tasks.filter((t) => t.completed).length;
  const isAllCompleted = completedCount === plan.tasks.length && plan.tasks.length > 0;

  // If completed, trigger streak increment & bonus XP
  if (isAllCompleted && !plan.completed) {
    plan.completed = true;
    plan.completedAt = new Date().toISOString();

    if (!plan.bonusXpAwarded) {
      plan.bonusXpAwarded = true;
      AudioService.playCelebration();
      ProgressService.addXp(50, isRu ? 'Выполнен весь дневной план! 🎉' : "Completed Today's Daily Plan! 🎉");
      StreakService.recordStudyTime(plan.totalMinutes);
      StreakService.checkAndUpdateStreak(user);
      ProgressService.updateCalendarEntry(plan.totalMinutes, plan.tasks.length, 50);
    }

    StorageService.saveDailyPlan(plan);
  }

  container.innerHTML = `
    <!-- Page Header -->
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
      <div>
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
          <span class="badge" style="background-color: var(--accent-green-light); color: var(--accent-green-hover); font-weight: 800;">
            ${isRu ? 'План на день' : "Today's Study Plan"}
          </span>
          <span style="font-size: 0.88rem; font-weight: 700; color: var(--text-muted);">
            ${plan.date} • ⏱️ ${plan.totalMinutes} ${isRu ? 'минут' : 'minutes'}
          </span>
        </div>
        <h2 style="font-size: 1.6rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em;">
          ${isAllCompleted ? (isRu ? 'План на сегодня выполнен! 🎉' : 'Daily Plan Completed! 🎉') : (isRu ? 'Ваш персональный план на день' : 'Your Personalized Daily Roadmap')}
        </h2>
        <p style="font-size: 0.92rem; color: var(--text-secondary); margin-top: 4px;">
          ${plan.userStateText || (isRu ? 'Регулярные занятия небольшими шагами приносят максимальный результат.' : 'Consistent daily steps toward B1 fluency.')}
        </p>
      </div>

      <button class="btn btn-secondary" id="generate-new-plan-btn" style="font-weight: 700;">
        ${isRu ? '↺ Обновить план' : '↺ Generate Different Plan'}
      </button>
    </div>

    <!-- Motivation Quote Banner -->
    <div style="padding: 14px 20px; border-radius: var(--radius-lg); background-color: var(--bg-surface); border: 2px solid var(--border-subtle); margin-bottom: 24px; display: flex; align-items: center; gap: 14px;">
      <span style="font-size: 1.6rem;">💡</span>
      <div style="font-size: 0.95rem; color: var(--text-primary); font-style: italic; font-weight: 600;">
        "${plan.motivation}"
      </div>
    </div>

    <!-- Completion Screen when all done -->
    ${
      isAllCompleted
        ? `
      <div class="completion-banner card" style="margin-bottom: 32px; padding: 28px; text-align: center; border: 2px solid var(--accent-green-border); background-color: var(--accent-green-light); border-radius: var(--radius-xl);">
        <div style="font-size: 3rem; margin-bottom: 8px;">🏆</div>
        <h3 style="font-size: 1.4rem; font-weight: 800; color: var(--text-primary);">
          ${isRu ? 'План на сегодня выполнен! 🎉' : "Today's Study Plan Complete!"}
        </h3>
        <p style="font-size: 0.95rem; color: var(--text-secondary); max-width: 520px; margin: 6px auto 16px;">
          ${isRu ? 'Потрясающая регулярность! Вы успешно выполнили все задачи на сегодня.' : 'Phenomenal consistency! You have completed all scheduled tasks.'}
        </p>

        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
          <div class="completion-chip" style="color: var(--accent-amber); font-weight: 800; padding: 8px 16px; background-color: var(--bg-surface); border-radius: var(--radius-full); border: 1.5px solid var(--accent-amber-border);">
            <span>🔥</span> +1 ${isRu ? `день к серии (${user.streak} всего)` : `day streak (${user.streak} total)`}
          </div>
          <div class="completion-chip" style="color: var(--accent-primary); font-weight: 800; padding: 8px 16px; background-color: var(--bg-surface); border-radius: var(--radius-full); border: 1.5px solid var(--accent-primary);">
            <span>⚡</span> +50 XP ${isRu ? 'бонус за план' : 'session bonus'}
          </div>
        </div>
      </div>
    `
        : ''
    }

    <!-- Progress Indicator -->
    <div class="card" style="margin-bottom: 24px; padding: 18px 24px; border: 2px solid var(--border-strong);">
      <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.95rem; font-weight: 800; margin-bottom: 8px;">
        <span>${isRu ? 'Прогресс сегодняшнего плана' : "Today's Plan Progress"}</span>
        <span style="color: var(--accent-green-hover); font-family: var(--font-mono);">
          ${completedCount} / ${plan.tasks.length} ${isRu ? 'выполнено' : 'tasks'} (${Math.round((completedCount / plan.tasks.length) * 100)}%)
        </span>
      </div>
      <div class="progress-bar-track" style="height: 10px;">
        <div class="progress-bar-fill" style="width: ${(completedCount / plan.tasks.length) * 100}%; background: linear-gradient(90deg, var(--accent-green), #10b981);"></div>
      </div>
    </div>

    <!-- Tasks List -->
    <div style="display: flex; flex-direction: column; gap: 14px;">
      ${plan.tasks
        .map(
          (task, index) => `
        <div 
          class="card card-interactive daily-task-card ${task.completed ? 'task-completed-card' : ''}" 
          data-task-id="${task.id}"
          style="padding: 18px 22px; border: 2px solid ${task.completed ? 'var(--accent-green-border)' : 'var(--border-strong)'}; background-color: ${task.completed ? 'var(--bg-surface-hover)' : 'var(--bg-surface)'}; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px; border-radius: var(--radius-lg);"
        >
          <div style="display: flex; align-items: flex-start; gap: 16px; flex: 1; min-width: 260px;">
            <button 
              class="task-checkbox-btn ${task.completed ? 'checked' : ''}" 
              data-task-id="${task.id}"
              style="width: 28px; height: 28px; border-radius: 8px; border: 2px solid ${task.completed ? 'var(--accent-green)' : 'var(--border-strong)'}; background-color: ${task.completed ? 'var(--accent-green)' : 'transparent'}; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; cursor: pointer; flex-shrink: 0; margin-top: 2px;"
            >
              ${task.completed ? '✓' : ''}
            </button>

            <div>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 2px;">
                <span class="badge" style="background-color: var(--bg-secondary); color: var(--text-muted); font-size: 0.75rem; font-weight: 700;">
                  ${index + 1}
                </span>
                <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted);">
                  ⏱️ ${task.duration} ${isRu ? 'мин' : 'min'}
                </span>
              </div>
              <h3 style="font-size: 1.1rem; font-weight: 800; color: var(--text-primary); text-decoration: ${task.completed ? 'line-through' : 'none'}; opacity: ${task.completed ? '0.75' : '1'};">
                ${task.title}
              </h3>
              <p style="font-size: 0.88rem; color: var(--text-secondary); margin-top: 4px; line-height: 1.45;">
                ${task.description}
              </p>
            </div>
          </div>

          <div style="display: flex; gap: 8px;">
            <button class="btn ${task.completed ? 'btn-secondary' : 'btn-duo'} btn-sm open-task-route-btn" data-route="${task.linkRoute}" data-task-id="${task.id}" style="font-weight: 700;">
              ${task.completed ? (isRu ? 'Повторить ↺' : 'Review ↺') : (isRu ? 'Выполнить ▶' : 'Start ▶')}
            </button>
          </div>
        </div>
      `
        )
        .join('')}
    </div>
  `;

  // Checkbox toggle
  container.querySelectorAll('.task-checkbox-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const taskId = (e.currentTarget as HTMLElement).getAttribute('data-task-id');
      const targetTask = plan?.tasks.find((t) => t.id === taskId);
      if (targetTask && plan) {
        AudioService.playPop();
        targetTask.completed = !targetTask.completed;
        if (targetTask.completed) {
          ProgressService.addXp(20, isRu ? `Выполнена задача: ${targetTask.title}` : `Completed task: ${targetTask.title}`);
        }
        StorageService.saveDailyPlan(plan);
        container.innerHTML = '';
        container.appendChild(renderDailyPlanPage(user, onNavigate));
      }
    });
  });

  // Open task route
  container.querySelectorAll('.open-task-route-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const route = (e.currentTarget as HTMLElement).getAttribute('data-route') || '/dashboard';
      AudioService.playPop();
      onNavigate(route);
    });
  });

  // Generate new plan
  container.querySelector('#generate-new-plan-btn')?.addEventListener('click', () => {
    AudioService.playPop();
    Toast.show(isRu ? 'Обновляем план...' : 'Updating plan...', 'info');
    onNavigate('/dashboard');
  });

  return container;
}
