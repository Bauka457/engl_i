import { User } from '../types/user';
import { StorageService } from '../services/storage';
import { I18n } from '../services/i18n';
import { AudioService } from '../services/audio';

export function renderCalendarPage(
  user: User,
  _onNavigate: (route: string) => void
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'calendar-page-wrapper';

  let currentView: 'month' | 'week' = 'month';
  const history = StorageService.getHistory();
  const currentLang = I18n.getLang();
  const isRu = currentLang === 'ru';

  const now = new Date();
  let displayedYear = now.getFullYear();
  let displayedMonth = now.getMonth(); // 0-indexed

  const monthNamesRu = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];
  const monthNamesEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const render = () => {
    const monthName = isRu ? monthNamesRu[displayedMonth] : monthNamesEn[displayedMonth];

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <span class="badge" style="background-color: var(--accent-amber-light); color: var(--accent-amber-hover); font-weight: 800;">
              ${isRu ? 'Календарь привычки' : 'Habit Tracker'}
            </span>
            <span style="font-size: 0.88rem; font-weight: 800; color: var(--accent-amber);">
              🔥 ${user.streak} ${isRu ? 'дней подряд' : 'days streak'}
            </span>
          </div>
          <h2 style="font-size: 1.6rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em;">
            ${isRu ? 'Календарь занятий и серия дней' : 'Study Calendar & Streak'}
          </h2>
          <p style="font-size: 0.92rem; color: var(--text-secondary); max-width: 650px; margin-top: 4px;">
            ${isRu ? 'Отслеживайте непрерывность занятий каждый день. Зеленые дни — выполненные нормы практики, желтые — частичные сессии.' : 'Track your consistency day-by-day. Green days represent completed goals, yellow indicates partial sessions.'}
          </p>
        </div>

        <div style="display: flex; gap: 6px; background-color: var(--bg-surface); padding: 4px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <button class="btn btn-sm ${currentView === 'month' ? 'btn-primary' : 'btn-secondary'} view-switch-btn" data-view="month" style="font-weight: 700;">
            ${I18n.t('cal.month_view')}
          </button>
          <button class="btn btn-sm ${currentView === 'week' ? 'btn-primary' : 'btn-secondary'} view-switch-btn" data-view="week" style="font-weight: 700;">
            ${I18n.t('cal.week_view')}
          </button>
        </div>
      </div>

      <!-- Calendar Controls & Card -->
      <div class="card" style="padding: 24px; max-width: 860px; margin: 0 auto; border: 2px solid var(--border-strong);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
          <h3 style="font-size: 1.3rem; font-weight: 800; color: var(--text-primary);">
            ${monthName} ${displayedYear}
          </h3>

          <div style="display: flex; gap: 8px;">
            <button class="btn btn-secondary btn-sm" id="cal-prev-btn" style="font-weight: 700;">${I18n.t('cal.prev')}</button>
            <button class="btn btn-secondary btn-sm" id="cal-today-btn" style="font-weight: 700;">${I18n.t('cal.today')}</button>
            <button class="btn btn-secondary btn-sm" id="cal-next-btn" style="font-weight: 700;">${I18n.t('cal.next')}</button>
          </div>
        </div>

        <!-- Legend -->
        <div style="display: flex; gap: 16px; margin-bottom: 20px; font-size: 0.85rem; font-weight: 700; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="width: 14px; height: 14px; border-radius: 4px; background-color: var(--accent-green);"></span>
            <span>${I18n.t('cal.completed_legend')}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="width: 14px; height: 14px; border-radius: 4px; background-color: var(--accent-amber);"></span>
            <span>${I18n.t('cal.partial_legend')}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="width: 14px; height: 14px; border-radius: 4px; background-color: var(--bg-surface-hover); border: 1px solid var(--border-strong);"></span>
            <span>${I18n.t('cal.missed_legend')}</span>
          </div>
        </div>

        <!-- Month / Week Grid Slot -->
        <div id="calendar-grid-slot"></div>

        <!-- Selected Day Details Box -->
        <div id="selected-day-details" style="margin-top: 24px; padding: 16px 20px; border-radius: var(--radius-md); background-color: var(--bg-secondary); border: 1px solid var(--border-subtle); display: none;"></div>
      </div>
    `;

    // Calendar Days Generator
    const gridSlot = container.querySelector('#calendar-grid-slot') as HTMLElement;
    const detailsBox = container.querySelector('#selected-day-details') as HTMLElement;

    const daysOfWeek = isRu ? ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    if (currentView === 'month') {
      const firstDayOfMonth = new Date(displayedYear, displayedMonth, 1).getDay();
      // Shift so Monday is index 0
      const startOffset = (firstDayOfMonth + 6) % 7;
      const daysInMonth = new Date(displayedYear, displayedMonth + 1, 0).getDate();

      let gridHtml = `
        <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; text-align: center; margin-bottom: 8px;">
          ${daysOfWeek.map((d) => `<div style="font-size: 0.8rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">${d}</div>`).join('')}
        </div>
        <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px;">
      `;

      // Empty padding cells before first day
      for (let i = 0; i < startOffset; i++) {
        gridHtml += `<div style="height: 60px; opacity: 0.15;"></div>`;
      }

      // Actual month days
      const todayStr = new Date().toISOString().split('T')[0];

      for (let day = 1; day <= daysInMonth; day++) {
        const monthNum = String(displayedMonth + 1).padStart(2, '0');
        const dayNum = String(day).padStart(2, '0');
        const dateStr = `${displayedYear}-${monthNum}-${dayNum}`;

        const entry = history.find((h) => h.date === dateStr);
        const isToday = dateStr === todayStr;

        let statusBg = 'var(--bg-surface)';
        let statusBorder = isToday ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)';
        let statusDot = '';

        if (entry) {
          if (entry.minutes >= 15 || entry.tasksCompleted >= 2) {
            statusBg = 'var(--accent-green-light)';
            statusBorder = '1.5px solid var(--accent-green-border)';
            statusDot = `<span style="display: block; width: 6px; height: 6px; border-radius: 50%; background-color: var(--accent-green); margin: 2px auto 0;"></span>`;
          } else if (entry.minutes > 0 || entry.tasksCompleted > 0) {
            statusBg = 'var(--accent-amber-light)';
            statusBorder = '1.5px solid var(--accent-amber-border)';
            statusDot = `<span style="display: block; width: 6px; height: 6px; border-radius: 50%; background-color: var(--accent-amber); margin: 2px auto 0;"></span>`;
          }
        } else if (isToday) {
          statusBg = 'var(--accent-primary-light)';
          statusDot = `<span style="display: block; width: 6px; height: 6px; border-radius: 50%; background-color: var(--accent-primary); margin: 2px auto 0;"></span>`;
        }

        gridHtml += `
          <div 
            class="cal-day-cell" 
            data-date="${dateStr}"
            style="height: 60px; border-radius: var(--radius-md); background-color: ${statusBg}; border: ${statusBorder}; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: transform var(--transition-fast);"
          >
            <span style="font-size: 0.95rem; font-weight: ${isToday ? '800' : '600'}; color: ${isToday ? 'var(--accent-primary)' : 'var(--text-primary)'};">${day}</span>
            ${statusDot}
          </div>
        `;
      }

      gridHtml += `</div>`;
      gridSlot.innerHTML = gridHtml;
    } else {
      // Week View (Current displayed week)
      let weekHtml = `
        <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px;">
      `;

      for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - (d.getDay() === 0 ? 6 : d.getDay() - 1) + i);
        const dateStr = d.toISOString().split('T')[0];
        const dayNum = d.getDate();
        const entry = history.find((h) => h.date === dateStr);
        const isToday = dateStr === new Date().toISOString().split('T')[0];

        let statusBg = 'var(--bg-surface)';
        let statusBorder = isToday ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)';
        if (entry && (entry.minutes >= 15 || entry.tasksCompleted >= 2)) {
          statusBg = 'var(--accent-green-light)';
          statusBorder = '1.5px solid var(--accent-green-border)';
        }

        weekHtml += `
          <div 
            class="cal-day-cell" 
            data-date="${dateStr}"
            style="padding: 16px 8px; border-radius: var(--radius-md); background-color: ${statusBg}; border: ${statusBorder}; display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer;"
          >
            <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">${daysOfWeek[i]}</span>
            <span style="font-size: 1.15rem; font-weight: 800; color: ${isToday ? 'var(--accent-primary)' : 'var(--text-primary)'};">${dayNum}</span>
            <span style="font-size: 0.75rem; font-weight: 700; color: ${entry ? 'var(--accent-green-hover)' : 'var(--text-muted)'};">
              ${entry ? `${entry.minutes} ${isRu ? 'мин' : 'min'}` : (isRu ? '—' : '—')}
            </span>
          </div>
        `;
      }

      weekHtml += `</div>`;
      gridSlot.innerHTML = weekHtml;
    }

    // Day Cell Click Details
    gridSlot.querySelectorAll('.cal-day-cell').forEach((cell) => {
      cell.addEventListener('click', (e) => {
        AudioService.playPop();
        const dateStr = (e.currentTarget as HTMLElement).getAttribute('data-date');
        if (!dateStr) return;

        const entry = history.find((h) => h.date === dateStr);

        detailsBox.style.display = 'block';
        if (entry) {
          detailsBox.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong style="color: var(--text-primary); font-size: 1.05rem;">
                  ${isRu ? `День занятий: ${dateStr}` : `Study Session: ${dateStr}`}
                </strong>
                <div style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 4px;">
                  ⏱️ ${entry.minutes} ${isRu ? 'минут практики' : 'study minutes'} • 🎯 ${entry.tasksCompleted} ${isRu ? 'выполненных задач' : 'tasks completed'} • ⚡ +${entry.xpEarned} XP
                </div>
              </div>
              <span class="badge" style="background-color: var(--accent-green-light); color: var(--accent-green-hover); font-weight: 800;">
                ${isRu ? 'Серия сохранена ✓' : 'Streak Kept ✓'}
              </span>
            </div>
          `;
        } else {
          detailsBox.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong style="color: var(--text-primary); font-size: 1.05rem;">${dateStr}</strong>
                <div style="font-size: 0.9rem; color: var(--text-muted); margin-top: 4px;">
                  ${isRu ? 'В этот день не было записанных занятий.' : 'No recorded learning sessions on this day.'}
                </div>
              </div>
              <span class="badge" style="background-color: var(--bg-surface); color: var(--text-muted); font-weight: 700;">
                ${isRu ? 'Отдых' : 'Rest'}
              </span>
            </div>
          `;
        }
      });
    });

    // View Switch Buttons
    container.querySelectorAll('.view-switch-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const view = (e.currentTarget as HTMLElement).getAttribute('data-view') as 'month' | 'week';
        if (view) {
          AudioService.playPop();
          currentView = view;
          render();
        }
      });
    });

    // Prev / Next / Today
    container.querySelector('#cal-prev-btn')?.addEventListener('click', () => {
      AudioService.playPop();
      if (displayedMonth === 0) {
        displayedMonth = 11;
        displayedYear -= 1;
      } else {
        displayedMonth -= 1;
      }
      render();
    });

    container.querySelector('#cal-next-btn')?.addEventListener('click', () => {
      AudioService.playPop();
      if (displayedMonth === 11) {
        displayedMonth = 0;
        displayedYear += 1;
      } else {
        displayedMonth += 1;
      }
      render();
    });

    container.querySelector('#cal-today-btn')?.addEventListener('click', () => {
      AudioService.playPop();
      displayedYear = now.getFullYear();
      displayedMonth = now.getMonth();
      render();
    });
  };

  render();
  return container;
}
