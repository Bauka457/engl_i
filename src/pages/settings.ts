import { User } from '../types/user';
import { StorageService } from '../services/storage';
import { ExportService } from '../services/export';
import { AudioService } from '../services/audio';
import { I18n } from '../services/i18n';
import { Modal } from '../components/Modal';
import { Toast } from '../components/Toast';

export function renderSettingsPage(
  _user: User,
  _onNavigate: (route: string) => void,
  onUserReset: () => void
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'page-container';

  let settings = StorageService.getSettings();
  const currentLang = I18n.getLang();
  const isRu = currentLang === 'ru';
  const audioStatus = AudioService.getStatus();

  container.innerHTML = `
    <!-- Header -->
    <div style="margin-bottom: 28px;">
      <h2 style="font-size: 1.85rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em;">
        ${I18n.t('settings.title')}
      </h2>
      <p style="font-size: 0.95rem; color: var(--text-secondary); margin-top: 4px; line-height: 1.5;">
        ${I18n.t('settings.subtitle')}
      </p>
    </div>

    <div style="max-width: 760px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px;">
      <!-- Appearance & Language Section -->
      <div class="card" style="padding: 24px; border: 2px solid var(--border-strong);">
        <h3 style="font-size: 1.2rem; font-weight: 800; color: var(--text-primary); margin-bottom: 16px;">
          ${I18n.t('settings.appearance')}
        </h3>

        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
            <div>
              <div style="font-weight: 700; color: var(--text-primary); font-size: 0.95rem;">${I18n.t('settings.theme_label')}</div>
              <div style="font-size: 0.85rem; color: var(--text-secondary);">${I18n.t('settings.theme_desc')}</div>
            </div>
            <select id="settings-theme-select" class="input-select" style="width: 150px; font-weight: 600;">
              <option value="light" ${settings.theme === 'light' ? 'selected' : ''}>☀️ ${isRu ? 'Светлая' : 'Light'}</option>
              <option value="dark" ${settings.theme === 'dark' ? 'selected' : ''}>🌙 ${isRu ? 'Темная' : 'Dark'}</option>
            </select>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 16px; flex-wrap: wrap; gap: 10px;">
            <div>
              <div style="font-weight: 700; color: var(--text-primary); font-size: 0.95rem;">${I18n.t('settings.lang_label')}</div>
              <div style="font-size: 0.85rem; color: var(--text-secondary);">${I18n.t('settings.lang_desc')}</div>
            </div>
            <select id="settings-lang-select" class="input-select" style="width: 150px; font-weight: 600;">
              <option value="ru" ${currentLang === 'ru' ? 'selected' : ''}>🇷🇺 Русский</option>
              <option value="en" ${currentLang === 'en' ? 'selected' : ''}>🇬🇧 English</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Audio Engine & Diagnostics Section -->
      <div class="card" style="padding: 24px; border: 2px solid var(--border-strong); border-left: 6px solid var(--accent-green);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
          <h3 style="font-size: 1.2rem; font-weight: 800; color: var(--text-primary);">
            ${I18n.t('settings.audio_diag_title')}
          </h3>
          <span class="badge" style="background-color: var(--accent-green-light); color: var(--accent-green-hover); font-weight: 800;">
            ${isRu ? 'Система активна ✓' : 'Engine Active ✓'}
          </span>
        </div>
        <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 16px; line-height: 1.5;">
          ${I18n.t('settings.audio_diag_desc')}
        </p>

        <!-- Audio Status Badges -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-bottom: 18px;">
          <div style="background-color: var(--bg-surface); padding: 12px 14px; border-radius: var(--radius-md); border: 1.5px solid var(--border-subtle);">
            <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 800; text-transform: uppercase;">
              ${I18n.t('settings.speech_synth_label')}
            </div>
            <div style="font-size: 0.92rem; font-weight: 700; color: var(--accent-green-hover); margin-top: 2px;">
              ${audioStatus.speechSynthesisSupported ? I18n.t('settings.supported_ready') : (isRu ? 'Недоступно в браузере' : 'Unavailable')}
            </div>
          </div>

          <div style="background-color: var(--bg-surface); padding: 12px 14px; border-radius: var(--radius-md); border: 1.5px solid var(--border-subtle);">
            <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 800; text-transform: uppercase;">
              ${I18n.t('settings.webaudio_label')}
            </div>
            <div style="font-size: 0.92rem; font-weight: 700; color: var(--accent-green-hover); margin-top: 2px;">
              ${audioStatus.webAudioSupported ? (isRu ? 'Активно (44.1 кГц) ✓' : 'Active (44.1 kHz) ✓') : (isRu ? 'Недоступно' : 'Unavailable')}
            </div>
          </div>
        </div>

        <!-- Audio Interactive Test Buttons -->
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button class="btn btn-primary btn-sm" id="test-speech-voice-btn" style="font-weight: 700;">
            ${I18n.t('settings.test_speech')}
          </button>
          <button class="btn btn-secondary btn-sm" id="test-sfx-chime-btn" style="font-weight: 700;">
            ${I18n.t('settings.test_sfx')}
          </button>
          <button class="btn btn-secondary btn-sm" id="test-sfx-fanfare-btn" style="font-weight: 700;">
            ${I18n.t('settings.test_fanfare')}
          </button>
        </div>
      </div>

      <!-- Study Routine Section -->
      <div class="card" style="padding: 24px; border: 2px solid var(--border-strong);">
        <h3 style="font-size: 1.2rem; font-weight: 800; color: var(--text-primary); margin-bottom: 16px;">
          ${I18n.t('settings.routine_title')}
        </h3>

        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div>
            <label class="input-label" style="font-weight: 700;">${I18n.t('settings.routine_label')}</label>
            <select id="settings-preferred-time" class="input-select" style="font-weight: 600;">
              <option value="Morning (07:00 - 10:00)" ${settings.preferredStudyTime.includes('Morning') ? 'selected' : ''}>${I18n.t('settings.time_morning')}</option>
              <option value="Afternoon (12:00 - 15:00)" ${settings.preferredStudyTime.includes('Afternoon') ? 'selected' : ''}>${I18n.t('settings.time_afternoon')}</option>
              <option value="Evening (18:00 - 21:00)" ${settings.preferredStudyTime.includes('Evening') ? 'selected' : ''}>${I18n.t('settings.time_evening')}</option>
              <option value="Night (21:00 - 24:00)" ${settings.preferredStudyTime.includes('Night') ? 'selected' : ''}>${I18n.t('settings.time_night')}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Data Persistence & Backup Section -->
      <div class="card" style="padding: 24px; border: 2px solid var(--border-strong);">
        <h3 style="font-size: 1.2rem; font-weight: 800; color: var(--text-primary); margin-bottom: 6px;">
          ${I18n.t('settings.data_management')}
        </h3>
        <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 20px; line-height: 1.5;">
          ${I18n.t('settings.data_desc')}
        </p>

        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <!-- Export Data Button -->
          <button class="btn btn-secondary" id="export-backup-btn" style="font-weight: 700;">
            <span>💾</span> ${I18n.t('btn.export')}
          </button>

          <!-- Import Data File -->
          <label class="btn btn-secondary" style="cursor: pointer; font-weight: 700;">
            <span>📥</span> ${I18n.t('btn.import')}
            <input type="file" id="import-backup-input" accept=".json" style="display: none;" />
          </label>
        </div>

        <!-- Danger Zone Reset -->
        <div style="margin-top: 24px; padding-top: 18px; border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
          <div>
            <div style="font-size: 0.95rem; font-weight: 800; color: var(--accent-rose);">${isRu ? 'Опасная зона' : 'Danger Zone'}</div>
            <div style="font-size: 0.82rem; color: var(--text-muted);">${isRu ? 'Полный сброс всех данных и возврат к первому уроку' : 'Reset all study data and start over'}</div>
          </div>
          <button class="btn btn-danger btn-sm" id="reset-all-data-btn" style="font-weight: 700;">
            ${I18n.t('btn.reset')}
          </button>
        </div>
      </div>
    </div>
  `;

  // Language Change
  container.querySelector('#settings-lang-select')?.addEventListener('change', (e) => {
    const nextLang = (e.target as HTMLSelectElement).value as any;
    I18n.setLang(nextLang);
  });

  // Theme Change
  container.querySelector('#settings-theme-select')?.addEventListener('change', (e) => {
    const val = (e.target as HTMLSelectElement).value as 'light' | 'dark';
    settings.theme = val;
    StorageService.saveSettings(settings);
    document.documentElement.setAttribute('data-theme', val);
    Toast.show(isRu ? `Тема переключена на: ${val === 'dark' ? 'Темная' : 'Светлая'}` : `Theme set to: ${val}`, 'info');
  });

  // Time Window
  container.querySelector('#settings-preferred-time')?.addEventListener('change', (e) => {
    settings.preferredStudyTime = (e.target as HTMLSelectElement).value;
    StorageService.saveSettings(settings);
    Toast.show(isRu ? 'Расписание сохранено ✓' : 'Schedule saved ✓', 'success');
  });

  // Audio tests
  container.querySelector('#test-speech-voice-btn')?.addEventListener('click', () => {
    AudioService.playPop();
    AudioService.speak('Hello! English Journey is ready to help you reach B1 fluency.');
    Toast.show(isRu ? 'Тест озвучки запущен 🔊' : 'Voice test started 🔊', 'info');
  });

  container.querySelector('#test-sfx-chime-btn')?.addEventListener('click', () => {
    AudioService.playSuccess();
    Toast.show(isRu ? 'Звук успеха проигран 🔔' : 'Success chime played 🔔', 'info');
  });

  container.querySelector('#test-sfx-fanfare-btn')?.addEventListener('click', () => {
    AudioService.playCelebration();
    Toast.show(isRu ? 'Фанфары проиграны 🎉' : 'Fanfare played 🎉', 'info');
  });

  // Export
  container.querySelector('#export-backup-btn')?.addEventListener('click', () => {
    AudioService.playPop();
    ExportService.downloadBackup();
    Toast.show(isRu ? 'Резервная копия скачана!' : 'Backup exported!', 'success');
  });

  // Import
  const importInput = container.querySelector('#import-backup-input') as HTMLInputElement;
  importInput?.addEventListener('change', (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        const res = ExportService.restoreBackup(text);
        if (res.success) {
          AudioService.playCelebration();
          Toast.show(isRu ? 'Данные успешно восстановлены!' : 'Backup restored successfully!', 'success');
          setTimeout(() => window.location.reload(), 800);
        } else {
          AudioService.playError();
          Toast.show(isRu ? 'Ошибка при импорте файла' : 'Import error', 'error');
        }
      };
      reader.readAsText(file);
    }
  });

  // Reset
  container.querySelector('#reset-all-data-btn')?.addEventListener('click', () => {
    AudioService.playPop();
    Modal.confirm({
      title: I18n.t('settings.reset_confirm_title'),
      message: I18n.t('settings.reset_confirm_msg'),
      confirmText: isRu ? 'Да, сбросить все' : 'Yes, Reset All',
      cancelText: I18n.t('btn.cancel'),
      danger: true,
      onConfirm: () => {
        StorageService.resetProgress();
        localStorage.clear();
        AudioService.playSuccess();
        Toast.show(isRu ? 'Прогресс сброшен' : 'Progress reset', 'info');
        onUserReset();
      }
    });
  });

  return container;
}
