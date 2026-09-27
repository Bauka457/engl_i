import { User } from '../types/user';
import { AIService } from '../services/ai';
import { ProgressService } from '../services/progress';
import { AudioService } from '../services/audio';
import { I18n } from '../services/i18n';
import { Toast } from '../components/Toast';

export function renderSpeakingPage(
  user: User,
  _onNavigate: (route: string) => void
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'speaking-page-wrapper';

  let currentMode: 'prompt' | 'tutor' = 'prompt';
  const isRu = I18n.getLang() === 'ru';

  // Mode 1 State
  const prompts = [
    {
      id: 'sp-1',
      level: 'A1',
      prompt: 'Tell me about your typical day: what time do you wake up and what do you do?',
      promptRu: 'Расскажите о своем обычном дне: во сколько вы просыпаетесь и чем занимаетесь?'
    },
    {
      id: 'sp-2',
      level: 'A2',
      prompt: 'Describe your favorite weekend activity and why you enjoy it.',
      promptRu: 'Опишите ваше любимое занятие на выходных и почему оно вам нравится.'
    },
    {
      id: 'sp-3',
      level: 'A2',
      prompt: 'Explain an interesting software or technology tool that you use frequently.',
      promptRu: 'Расскажите об интересной программе или приложении, которым вы часто пользуетесь.'
    },
    {
      id: 'sp-4',
      level: 'B1',
      prompt: 'If you could work or study in any city in the world, which one would you choose and why?',
      promptRu: 'Если бы вы могли жить или учиться в любом городе мира, какой бы выбрали и почему?'
    }
  ];

  let selectedPrompt = prompts.find((p) => p.level === user.currentLevel) || prompts[0];
  let isRecording = false;
  let recognition: any = null;
  let transcriptText = '';
  let evaluationResult: any = null;
  let isAnalyzing = false;
  let microphoneError = '';
  let chatDraft = '';

  // Mode 2 State (AI Tutor Chat)
  let chatHistory: Array<{ role: 'user' | 'assistant'; text: string; correction?: string }> = [
    {
      role: 'assistant',
      text: `Hello ${user.name}! I am your friendly English speaking tutor. How was your day today? Did anything interesting happen?`
    }
  ];
  let correctMode = true;

  // Initialize SpeechRecognition if available
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  const microphoneErrorMessage = (error: string) => {
    if (error === 'not-allowed' || error === 'service-not-allowed' || error === 'NotAllowedError' || error === 'SecurityError') {
      return isRu
        ? 'Доступ к микрофону заблокирован. Нажмите на значок настроек сайта рядом с адресом страницы, разрешите микрофон и обновите страницу. Затем нажмите на микрофон ещё раз.'
        : 'Microphone access is blocked. Open this site’s settings from the icon beside the address bar, allow microphone access, and reload the page. Then try the microphone again.';
    }
    if (error === 'audio-capture' || error === 'NotFoundError' || error === 'DevicesNotFoundError') {
      return isRu
        ? 'Микрофон не найден. Подключите его и проверьте, что он выбран в настройках звука устройства.'
        : 'No microphone was found. Connect one and check that it is selected in your device sound settings.';
    }
    if (error === 'NotReadableError' || error === 'TrackStartError') {
      return isRu
        ? 'Микрофон занят или заблокирован другой программой. Закройте приложения, использующие микрофон, и попробуйте снова.'
        : 'The microphone is busy or blocked by another app. Close other apps using it and try again.';
    }
    if (error === 'no-speech') {
      return isRu ? 'Речь не распознана. Попробуйте говорить ближе к микрофону.' : 'No speech was detected. Try speaking closer to the microphone.';
    }
    if (error === 'network') {
      return isRu
        ? 'Сервис распознавания речи недоступен. Проверьте интернет и попробуйте другой браузер, например Chrome.'
        : 'The speech recognition service is unavailable. Check your internet connection or try another browser such as Chrome.';
    }
    if (error === 'InvalidStateError') {
      return isRu ? 'Распознавание уже запущено. Остановите его и попробуйте снова.' : 'Speech recognition is already running. Stop it and try again.';
    }
    if (error !== 'unknown') {
      return isRu
        ? `Браузер сообщил ошибку: ${error}. Попробуйте Chrome или введите ответ вручную.`
        : `Browser error: ${error}. Try Chrome or type your response instead.`;
    }
    return isRu
      ? 'Не удалось запустить распознавание речи. Проверьте разрешение микрофона в настройках сайта и попробуйте снова.'
      : 'Speech recognition could not start. Check microphone permission in site settings and try again.';
  };

  const getMicrophoneErrorCode = (error: unknown) => {
    if (error && typeof error === 'object') {
      const exception = error as { name?: string; message?: string };
      return exception.name || exception.message || 'unknown';
    }
    return typeof error === 'string' ? error : 'unknown';
  };

  const showMicrophoneError = (error: string) => {
    microphoneError = microphoneErrorMessage(error);
    render();
  };

  const render = () => {
    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <span class="badge" style="background-color: var(--accent-green-light); color: var(--accent-green-hover); font-weight: 800;">
              ${isRu ? 'Разговорная лаборатория' : 'Speaking Club'}
            </span>
            <span class="badge badge-${user.currentLevel.toLowerCase()}">${user.currentLevel}</span>
          </div>
          <h2 style="font-size: 1.6rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em;">
            ${I18n.t('speaking.title')}
          </h2>
          <p style="font-size: 0.92rem; color: var(--text-secondary); max-width: 650px; margin-top: 4px; line-height: 1.5;">
            ${I18n.t('speaking.subtitle')}
          </p>
        </div>

        <!-- Mode Toggle Switcher -->
        <div style="display: flex; gap: 6px; background-color: var(--bg-surface); padding: 4px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <button class="btn btn-sm ${currentMode === 'prompt' ? 'btn-primary' : 'btn-secondary'} mode-switch-btn" data-mode="prompt" style="font-weight: 700;">
            ${I18n.t('speaking.mode_prompt')}
          </button>
          <button class="btn btn-sm ${currentMode === 'tutor' ? 'btn-primary' : 'btn-secondary'} mode-switch-btn" data-mode="tutor" style="font-weight: 700;">
            ${I18n.t('speaking.mode_tutor')}
          </button>
        </div>
      </div>

      ${microphoneError ? `
        <div id="mic-error-help" role="alert" style="max-width: 760px; margin: 0 auto 16px; padding: 14px 16px; border: 1px solid var(--accent-rose); border-radius: var(--radius-md); color: var(--text-primary); background: var(--bg-surface); line-height: 1.5;">
          ${microphoneError}
        </div>
      ` : ''}

      <!-- Mode 1: Speaking Prompt -->
      ${
        currentMode === 'prompt'
          ? `
        <div class="card" style="max-width: 760px; margin: 0 auto; padding: 24px; border: 2px solid var(--border-strong);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 8px;">
            <span class="badge badge-neutral" style="font-weight: 700;">${isRu ? 'Тема для тренировки речи' : 'Interactive Speaking Prompt'}</span>
            <select id="prompt-select" class="input-select" style="width: auto; padding: 6px 12px; font-size: 0.85rem; font-weight: 600;">
              ${prompts.map((p) => `<option value="${p.id}" ${p.id === selectedPrompt.id ? 'selected' : ''}>[${p.level}] ${isRu ? p.promptRu.slice(0, 32) : p.prompt.slice(0, 32)}...</option>`).join('')}
            </select>
          </div>

          <div style="background-color: var(--bg-secondary); border-radius: var(--radius-lg); padding: 20px; border-left: 4px solid var(--accent-primary); margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span style="font-size: 0.8rem; font-weight: 800; color: var(--accent-primary); text-transform: uppercase;">
                ${I18n.t('speaking.your_topic')}
              </span>
              <button class="btn btn-sm btn-ghost" id="listen-prompt-btn" title="${isRu ? 'Слушать тему' : 'Listen to prompt pronunciation'}" style="font-weight: 700;">
                🔊 ${I18n.t('btn.listen')}
              </button>
            </div>
            <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary); line-height: 1.4;">
              "${selectedPrompt.prompt}"
            </h3>
            ${isRu ? `<div style="font-size: 0.9rem; color: var(--text-muted); margin-top: 6px;">${selectedPrompt.promptRu}</div>` : ''}
          </div>

          <!-- Web Speech Recording Section -->
          <div class="speaking-mic-container" style="display: flex; flex-direction: column; align-items: center; text-align: center; margin-bottom: 24px;">
            <button class="mic-pulse-btn ${isRecording ? 'recording' : ''}" id="record-speech-btn" title="${isRecording ? I18n.t('speaking.stop_recording') : I18n.t('speaking.start_recording')}" style="width: 84px; height: 84px; border-radius: 50%; font-size: 2.4rem; display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 14px rgba(0,0,0,0.1);">
              <span>${isRecording ? '⏹' : '🎙️'}</span>
            </button>
            <div style="font-size: 0.92rem; font-weight: 700; color: ${isRecording ? 'var(--accent-rose)' : 'var(--text-secondary)'}; margin-top: 14px;" id="record-status-label">
              ${isRecording ? I18n.t('speaking.recording_active') : I18n.t('speaking.start_recording')}
            </div>
          </div>

          <!-- Live Transcript / Manual Input -->
          <div style="margin-bottom: 20px;">
            <label class="input-label" style="font-weight: 700;">${isRu ? 'Ваша речь (распознанный текст или введите вручную):' : 'Spoken Transcript (or type your response):'}</label>
            <textarea 
              id="speech-transcript-box" 
              class="textarea-custom" 
              style="min-height: 100px; font-size: 15px; padding: 12px 14px;" 
              placeholder="${isRu ? 'Нажмите на микрофон и говорите по-английски, либо напишите текст сюда...' : 'Click the microphone and speak in English, or type here...'}"
            >${transcriptText}</textarea>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
            <button class="btn btn-secondary btn-sm" id="clear-speech-btn" style="font-weight: 700;">
              ${I18n.t('speaking.try_again')}
            </button>
            <button class="btn btn-duo" id="analyze-speech-btn" style="font-weight: 800; min-width: 180px;" ${!transcriptText ? 'disabled' : ''}>
              ${isAnalyzing ? (isRu ? 'Анализирую...' : 'Analyzing...') : I18n.t('speaking.analyze_btn')}
            </button>
          </div>

          <!-- Evaluation Report -->
          ${
            evaluationResult
              ? `
            <div class="card" style="margin-top: 24px; padding: 20px; background-color: var(--bg-surface); border: 2px solid var(--accent-green-border); border-radius: var(--radius-lg);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
                <h4 style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary);">${isRu ? 'Разбор вашей речи' : 'Speech Evaluation'}</h4>
                <div style="display: flex; gap: 8px;">
                  <span class="badge" style="background-color: var(--accent-green-light); color: var(--accent-green-hover); font-weight: 800;">
                    ${isRu ? 'Беглость: ' : 'Fluency: '}${evaluationResult.fluencyScore}%
                  </span>
                  <span class="badge" style="background-color: var(--accent-primary-light); color: var(--accent-primary); font-weight: 800;">
                    ${isRu ? 'Грамматика: ' : 'Grammar: '}${evaluationResult.grammarScore}%
                  </span>
                </div>
              </div>

              <div style="margin-bottom: 12px; font-size: 0.92rem; color: var(--text-secondary); line-height: 1.5;">
                ${evaluationResult.tutorNote}
              </div>

              ${
                evaluationResult.betterVersion
                  ? `
                <div style="padding: 12px 14px; background-color: var(--bg-secondary); border-radius: var(--radius-md); border-left: 3px solid var(--accent-primary);">
                  <strong style="color: var(--accent-primary); font-size: 0.85rem; text-transform: uppercase;">${isRu ? 'Как сказать естественнее:' : 'Native phrasing:'}</strong>
                  <div style="font-weight: 600; color: var(--text-primary); margin-top: 4px; font-size: 0.95rem;">"${evaluationResult.betterVersion}"</div>
                  <button class="btn btn-sm btn-ghost" id="listen-better-speech-btn" style="margin-top: 6px; font-weight: 700;">
                    🔊 ${isRu ? 'Послушать правильную версию' : 'Listen native version'}
                  </button>
                </div>
              `
                  : ''
              }
            </div>
          `
              : ''
          }
        </div>
      `
          : `
        <!-- Mode 2: AI Tutor Chat -->
        <div class="card" style="max-width: 760px; margin: 0 auto; padding: 24px; border: 2px solid var(--border-strong);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-primary), #8b5cf6); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
                🤖
              </div>
              <div>
                <h4 style="font-size: 1rem; font-weight: 800; color: var(--text-primary);">AI English Tutor</h4>
                <span style="font-size: 0.75rem; color: var(--accent-green-hover); font-weight: 700;">● ${isRu ? 'В сети' : 'Online'}</span>
              </div>
            </div>

            <label style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); cursor: pointer;">
              <input type="checkbox" id="correct-mode-checkbox" ${correctMode ? 'checked' : ''} />
              <span>${I18n.t('speaking.correct_mode')}</span>
            </label>
          </div>

          <!-- Chat Messages Area -->
          <div class="tutor-chat-messages" id="tutor-chat-messages" style="display: flex; flex-direction: column; gap: 14px; min-height: 260px; max-height: 380px; overflow-y: auto; padding: 14px; background-color: var(--bg-secondary); border-radius: var(--radius-lg); margin-bottom: 16px;">
            ${chatHistory
              .map(
                (msg) => `
              <div style="align-self: ${msg.role === 'user' ? 'flex-end' : 'flex-start'}; max-width: 85%;">
                <div style="background-color: ${
                  msg.role === 'user' ? 'var(--accent-primary)' : 'var(--bg-surface)'
                }; color: ${msg.role === 'user' ? '#fff' : 'var(--text-primary)'}; padding: 12px 16px; border-radius: var(--radius-lg); font-size: 0.95rem; line-height: 1.45; box-shadow: var(--shadow-sm); border: 1px solid ${
                  msg.role === 'user' ? 'var(--accent-primary)' : 'var(--border-subtle)'
                };">
                  ${msg.text}
                </div>
                ${
                  msg.role === 'assistant'
                    ? `
                  <button class="btn btn-ghost btn-xs replay-tutor-msg-btn" data-msg="${encodeURIComponent(msg.text)}" style="margin-top: 4px; font-size: 0.75rem; font-weight: 700; color: var(--text-muted);">
                    🔊 ${I18n.t('btn.listen')}
                  </button>
                `
                    : ''
                }
              </div>
            `
              )
              .join('')}
          </div>

          <!-- Chat Input Row -->
          <div style="display: flex; gap: 10px;">
            <input 
              type="text" 
              id="tutor-chat-input" 
              class="input-text" 
              placeholder="${isRu ? 'Напишите или продиктуйте ответ по-английски...' : 'Type your answer in English...'}" 
              style="flex: 1; font-size: 15px;"
            />
            <button class="btn btn-secondary" id="tutor-mic-input-btn" title="Speak via mic" style="padding: 0 16px; font-size: 1.2rem;">
              🎙️
            </button>
            <button class="btn btn-primary" id="tutor-chat-send-btn" style="font-weight: 700; padding: 0 20px;">
              ${I18n.t('btn.submit')}
            </button>
          </div>
        </div>
      `
      }
    `;

    if (currentMode === 'tutor') {
      const chatInput = container.querySelector('#tutor-chat-input') as HTMLInputElement | null;
      if (chatInput) chatInput.value = chatDraft;
    }

    // Mode switch
    container.querySelectorAll('.mode-switch-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        AudioService.playPop();
        currentMode = (e.currentTarget as HTMLElement).getAttribute('data-mode') as any;
        render();
      });
    });

    if (currentMode === 'prompt') {
      // Prompt select
      container.querySelector('#prompt-select')?.addEventListener('change', (e) => {
        const id = (e.target as HTMLSelectElement).value;
        const found = prompts.find((p) => p.id === id);
        if (found) {
          AudioService.playPop();
          selectedPrompt = found;
          transcriptText = '';
          evaluationResult = null;
          render();
        }
      });

      // Listen prompt
      container.querySelector('#listen-prompt-btn')?.addEventListener('click', () => {
        AudioService.playPop();
        AudioService.speak(selectedPrompt.prompt);
      });

      // Clear
      container.querySelector('#clear-speech-btn')?.addEventListener('click', () => {
        AudioService.playPop();
        transcriptText = '';
        evaluationResult = null;
        render();
      });

      // Text input edit
      const textarea = container.querySelector('#speech-transcript-box') as HTMLTextAreaElement;
      textarea?.addEventListener('input', (e) => {
        transcriptText = (e.target as HTMLTextAreaElement).value;
        const btn = container.querySelector('#analyze-speech-btn') as HTMLButtonElement;
        if (btn) btn.disabled = !transcriptText.trim();
      });

      // Record speech button
      const recordBtn = container.querySelector('#record-speech-btn') as HTMLElement;
      recordBtn?.addEventListener('click', () => {
        if (!SpeechRecognition) {
          Toast.show(isRu ? 'Ваш браузер не поддерживает Web Speech API. Введите текст в поле.' : 'Web Speech Recognition not supported in this browser. Please type below.', 'warning');
          return;
        }

        if (isRecording) {
          // Stop recording
          if (recognition) recognition.stop();
          isRecording = false;
          render();
        } else {
          // Start recording
          try {
            microphoneError = '';
            container.querySelector('#mic-error-help')?.remove();
            recognition = new SpeechRecognition();
            recognition.lang = 'en-US';
            recognition.interimResults = true;
            recognition.continuous = false;

            recognition.onstart = () => {
              isRecording = true;
              AudioService.playPop();
              const statusEl = container.querySelector('#record-status-label');
              if (statusEl) statusEl.textContent = I18n.t('speaking.recording_active');
              recordBtn.classList.add('recording');
            };

            recognition.onresult = (event: any) => {
              const current = event.resultIndex;
              const text = event.results[current][0].transcript;
              transcriptText = text;
              if (textarea) textarea.value = text;
              const btn = container.querySelector('#analyze-speech-btn') as HTMLButtonElement;
              if (btn) btn.disabled = false;
            };

            recognition.onerror = (event: any) => {
              console.error('Speech recognition error:', event.error);
              isRecording = false;
              showMicrophoneError(event.error);
            };

            recognition.onend = () => {
              isRecording = false;
              render();
            };

            recognition.start();
          } catch (e) {
            console.error(e);
            isRecording = false;
            showMicrophoneError(getMicrophoneErrorCode(e));
          }
        }
      });

      // Analyze speech
      container.querySelector('#analyze-speech-btn')?.addEventListener('click', async () => {
        if (!transcriptText.trim()) return;
        AudioService.playPop();
        isAnalyzing = true;
        render();

        try {
          evaluationResult = await AIService.evaluateSpeaking(selectedPrompt.prompt, transcriptText);
          AudioService.playSuccess();
          ProgressService.addXp(25, isRu ? `Разговорная речь: "${selectedPrompt.prompt.slice(0, 24)}..."` : `Speaking practice`);
        } catch (e) {
          console.error(e);
          Toast.show(isRu ? 'Не удалось выполнить анализ' : 'Could not evaluate speech', 'error');
        } finally {
          isAnalyzing = false;
          render();
        }
      });

      // Listen better version
      container.querySelector('#listen-better-speech-btn')?.addEventListener('click', () => {
        if (evaluationResult?.betterVersion) {
          AudioService.playPop();
          AudioService.speak(evaluationResult.betterVersion);
        }
      });
    } else {
      // Tutor mode
      const chatInput = container.querySelector('#tutor-chat-input') as HTMLInputElement;
      const sendBtn = container.querySelector('#tutor-chat-send-btn') as HTMLElement;
      const chatArea = container.querySelector('#tutor-chat-messages') as HTMLElement;
      chatInput?.addEventListener('input', () => {
        chatDraft = chatInput.value;
      });

      const sendMessage = async () => {
        const text = chatInput?.value.trim();
        if (!text) return;
        chatInput.value = '';
        chatDraft = '';

        chatHistory.push({ role: 'user', text });
        render();

        try {
          const resp = await AIService.chatWithTutor(chatHistory, text, correctMode);
          chatHistory.push({ role: 'assistant', text: resp });
          AudioService.playPop();
          AudioService.speak(resp);
          ProgressService.addXp(15, isRu ? 'Диалог с AI-тьютором' : 'Tutor chat');
          render();
          if (chatArea) chatArea.scrollTop = chatArea.scrollHeight;
        } catch (e) {
          console.error(e);
        }
      };

      sendBtn?.addEventListener('click', sendMessage);
      chatInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendMessage();
      });

      // Mic in tutor mode
      container.querySelector('#tutor-mic-input-btn')?.addEventListener('click', () => {
        if (!SpeechRecognition) {
          Toast.show(isRu ? 'Web Speech API не поддерживается' : 'Web Speech API not supported', 'warning');
          return;
        }
        try {
          microphoneError = '';
          container.querySelector('#mic-error-help')?.remove();
          const rec = new SpeechRecognition();
          rec.lang = 'en-US';
          rec.onstart = () => {
            Toast.show(isRu ? 'Слушаю... Говорите на английском' : 'Listening... Speak in English', 'info');
          };
          rec.onresult = (ev: any) => {
            const text = ev.results[0][0].transcript;
            if (chatInput) {
              chatInput.value = text;
              chatDraft = text;
            }
          };
          rec.onerror = (event: any) => {
            console.error('Tutor speech recognition error:', event.error);
            showMicrophoneError(event.error);
          };
          rec.start();
        } catch (error) {
          console.error(error);
          showMicrophoneError(getMicrophoneErrorCode(error));
        }
      });

      // Replay tutor buttons
      container.querySelectorAll('.replay-tutor-msg-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const msg = decodeURIComponent((e.currentTarget as HTMLElement).getAttribute('data-msg') || '');
          if (msg) {
            AudioService.playPop();
            AudioService.speak(msg);
          }
        });
      });
    }

    return container;
  };

  return render();
}
