import { User } from '../types/user';
import { ProgressService } from '../services/progress';
import { AudioService, DialogueLine } from '../services/audio';
import { I18n } from '../services/i18n';
import { Toast } from '../components/Toast';

interface ListeningTrack {
  id: string;
  title: string;
  titleRu: string;
  level: 'A1' | 'A2' | 'B1';
  duration: string;
  lines: DialogueLine[];
  transcript: string;
  questions: Array<{
    id: string;
    questionRu: string;
    questionEn: string;
    optionsRu: string[];
    optionsEn: string[];
    correctIndex: number;
    explanationRu: string;
    explanationEn: string;
  }>;
}

const LISTENING_TRACKS: ListeningTrack[] = [
  {
    id: 'l-1',
    title: 'Ordering at a Tech Campus Cafe',
    titleRu: 'В кафе студенческого кампуса',
    level: 'A1',
    duration: '1:45',
    lines: [
      { speaker: 'Barista', text: 'Hi there! Welcome to the Campus Hub. What can I get started for you today?' },
      { speaker: 'Alex', text: 'Hello! I would like a medium oat cappuccino, please.' },
      { speaker: 'Barista', text: 'Sure thing. Would you like any syrup with that?' },
      { speaker: 'Alex', text: 'No syrup, thank you. Also, do you have any vegan croissants left?' },
      { speaker: 'Barista', text: 'Yes, we just baked a fresh batch ten minutes ago.' },
      { speaker: 'Alex', text: 'Awesome, I will take one of those as well. Can I pay by card?' },
      { speaker: 'Barista', text: 'Yes, contactless card or mobile pay works fine. That will be six dollars and fifty cents.' }
    ],
    transcript: `Barista: "Hi there! Welcome to the Campus Hub. What can I get started for you today?"
Alex: "Hello! I would like a medium oat cappuccino, please."
Barista: "Sure thing. Would you like any syrup with that?"
Alex: "No syrup, thank you. Also, do you have any vegan croissants left?"
Barista: "Yes, we just baked a fresh batch ten minutes ago."
Alex: "Awesome, I will take one of those as well. Can I pay by card?"
Barista: "Yes, contactless card or mobile pay works fine. That will be six dollars and fifty cents."`,
    questions: [
      {
        id: 'lq1',
        questionRu: 'Какое молоко Алекс попросил для капучино?',
        questionEn: 'What kind of milk does Alex order for his cappuccino?',
        optionsRu: ['Коровье цельное', 'Овсяное молоко (Oat milk)', 'Соевое молоко', 'Миндальное молоко'],
        optionsEn: ['Whole milk', 'Oat milk', 'Soy milk', 'Almond milk'],
        correctIndex: 1,
        explanationRu: 'Алекс сказал: "I would like a medium oat cappuccino, please."',
        explanationEn: 'Alex says: "I would like a medium oat cappuccino, please."'
      },
      {
        id: 'lq2',
        questionRu: 'Когда испекли свежую партию круассанов?',
        questionEn: 'When was the fresh batch of vegan croissants baked?',
        optionsRu: ['Час назад', 'Десять минут назад (Ten minutes ago)', 'Вчера вечером', 'Сегодня в 6 утра'],
        optionsEn: ['An hour ago', 'Ten minutes ago', 'Yesterday', 'This morning at 6 AM'],
        correctIndex: 1,
        explanationRu: 'Бариста ответил: "We just baked a fresh batch ten minutes ago."',
        explanationEn: 'The barista says: "We just baked a fresh batch ten minutes ago."'
      },
      {
        id: 'lq3',
        questionRu: 'Как Алекс оплачивает свой заказ?',
        questionEn: 'How does Alex pay for his order?',
        optionsRu: ['Наличными', 'Банковской картой / телефоном', 'Студенческими баллами', 'Криптовалютой'],
        optionsEn: ['Cash', 'By card/contactless', 'University points', 'Cryptocurrency'],
        correctIndex: 1,
        explanationRu: 'Алекс спросил: "Can I pay by card?", и бариста подтвердил бесконтактную оплату.',
        explanationEn: 'Alex asks "Can I pay by card?" and the barista confirms.'
      }
    ]
  },
  {
    id: 'l-2',
    title: 'Standup Meeting & Code Review Discussion',
    titleRu: 'Стендап и обсуждение кода',
    level: 'A2',
    duration: '2:15',
    lines: [
      { speaker: 'Team Lead', text: 'Good morning team. Let us do our quick daily standup. Dan, what did you work on yesterday?' },
      { speaker: 'Dan', text: 'Yesterday, I worked on the authentication bug reported by users. I found out that the token was expiring prematurely. I deployed a hotfix to staging, and tests are passing now.' },
      { speaker: 'Team Lead', text: 'Great work. Are you blocked by anything today?' },
      { speaker: 'Dan', text: 'No blockers on my end. Today I will take care of the database migration script with Sarah.' },
      { speaker: 'Team Lead', text: 'Sounds good. Remember that we have a sprint demo this Friday at three PM.' }
    ],
    transcript: `Team Lead: "Good morning team. Let us do our quick daily standup. Dan, what did you work on yesterday?"
Dan: "Yesterday, I worked on the authentication bug reported by users. I found out that the token was expiring prematurely. I deployed a hotfix to staging, and tests are passing now."
Team Lead: "Great work. Are you blocked by anything today?"
Dan: "No blockers on my end. Today I will take care of the database migration script with Sarah."
Team Lead: "Sounds good. Remember that we have a sprint demo this Friday at three PM."`,
    questions: [
      {
        id: 'lq1',
        questionRu: 'Какую ошибку Дэн исправлял вчера?',
        questionEn: 'What bug did Dan investigate yesterday?',
        optionsRu: ['Сбой платежей', 'Слишком быстрое истечение токена авторизации', 'Проблему с версткой CSS', 'Зависание видео'],
        optionsEn: ['Payment crash', 'Prematurely expiring authentication token', 'CSS layout issue', 'Video loading lag'],
        correctIndex: 1,
        explanationRu: 'Дэн сказал: "I found out that the token was expiring prematurely."',
        explanationEn: 'Dan found out that the token was expiring prematurely.'
      },
      {
        id: 'lq2',
        questionRu: 'Чем Дэн займется сегодня вместе с Сарой?',
        questionEn: 'What will Dan work on today with Sarah?',
        optionsRu: ['Написанием писем для рассылки', 'Скриптом миграции базы данных', 'Редизайном логотипа', 'Собеседованием кандидатов'],
        optionsEn: ['Writing marketing emails', 'Database migration script with Sarah', 'Redesigning the logo', 'Interviewing candidates'],
        correctIndex: 1,
        explanationRu: 'Дэн пояснил: "Today I will take care of the database migration script with Sarah."',
        explanationEn: 'Dan states: "Today I will take care of the database migration script with Sarah."'
      }
    ]
  },
  {
    id: 'l-3',
    title: 'University Lecture: AI & Ethics Discussion',
    titleRu: 'Лекция: Этика и ответственность в AI',
    level: 'B1',
    duration: '2:40',
    lines: [
      { speaker: 'Professor', text: 'As algorithms become deeply integrated into societal decisions, algorithmic accountability is no longer a purely theoretical dilemma. If an automated credit evaluation system exhibits implicit bias against specific demographics, who bears ultimate responsibility?' },
      { speaker: 'Student', text: 'I believe accountability must be shared across the entire lifecycle. While developers must rigorously audit training datasets for sampling biases, institutions cannot simply deploy black-box models without robust explainability frameworks.' }
    ],
    transcript: `Professor: "As algorithms become deeply integrated into societal decisions, algorithmic accountability is no longer a purely theoretical dilemma. If an automated credit evaluation system exhibits implicit bias against specific demographics, who bears ultimate responsibility?"
Student: "I believe accountability must be shared across the entire lifecycle. While developers must rigorously audit training datasets for sampling biases, institutions cannot simply deploy black-box models without robust explainability frameworks."`,
    questions: [
      {
        id: 'lq1',
        questionRu: 'Какую основную тему обсуждает профессор?',
        questionEn: 'What core issue is the professor discussing?',
        optionsRu: [
          'Покупку дешевых ноутбуков',
          'Ответственность и предвзятость алгоритмов в системах принятия решений',
          'Обучение роботов кулинарии',
          'Историю средневековой литературы'
        ],
        optionsEn: [
          'Buying cheaper laptops for students',
          'Algorithmic accountability and bias in AI decision systems',
          'Teaching robots how to cook',
          'History of medieval literature'
        ],
        correctIndex: 1,
        explanationRu: 'Тема касается алгоритмической подотчетности и предвзятости данных.',
        explanationEn: 'The topic centers on algorithmic accountability and implicit bias in automated systems.'
      },
      {
        id: 'lq2',
        questionRu: 'Какова позиция студента относительно ответственности?',
        questionEn: 'What does the student argue regarding accountability?',
        optionsRu: [
          'Виноваты только государственные органы',
          'Ответственность должна распределяться на всех этапах жизненного цикла модели',
          'Никто не должен использовать алгоритмы вообще',
          'Компьютеры должны писать все законы'
        ],
        optionsEn: [
          'Only governments should be blamed',
          'Accountability must be shared across the entire lifecycle',
          'Nobody should ever use algorithms',
          'Computers should make all human laws'
        ],
        correctIndex: 1,
        explanationRu: 'Студент подчеркнул: "I believe accountability must be shared across the entire lifecycle."',
        explanationEn: 'The student states: "I believe accountability must be shared across the entire lifecycle."'
      }
    ]
  }
];

export function renderListeningPage(
  _user: User,
  _onNavigate: (route: string) => void
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'listening-page-wrapper';

  let currentTrack = LISTENING_TRACKS[0];
  let showTranscript = true;
  let isPlaying = false;
  let activeLineIndex = -1;
  let currentSpeed = 0.9;
  let userAnswers: { [qId: string]: number } = {};
  let submitted = false;

  const isRu = I18n.getLang() === 'ru';

  const render = () => {
    const trackTitle = isRu ? currentTrack.titleRu : currentTrack.title;

    container.innerHTML = `
      <div style="margin-bottom: 24px;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
          <span class="badge" style="background-color: var(--accent-green-light); color: var(--accent-green-hover); font-weight: 800;">
            ${I18n.t('listening.badge')}
          </span>
          <span class="badge badge-${currentTrack.level.toLowerCase()}">${currentTrack.level}</span>
        </div>
        <h2 style="font-size: 1.6rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em;">
          ${I18n.t('listening.title')}
        </h2>
        <p style="font-size: 0.92rem; color: var(--text-secondary); max-width: 650px; margin-top: 4px; line-height: 1.5;">
          ${I18n.t('listening.subtitle')}
        </p>
      </div>

      <!-- Track Selector Tabs -->
      <div class="track-tabs-row" style="display: flex; gap: 10px; margin-bottom: 24px; overflow-x: auto; padding-bottom: 4px;">
        ${LISTENING_TRACKS.map(
          (t) => `
          <button class="btn btn-sm ${currentTrack.id === t.id ? 'btn-primary' : 'btn-secondary'} track-select-btn" data-id="${t.id}" style="font-weight: 700; border-radius: var(--radius-full); padding: 8px 16px;">
            <span>🎧</span> ${isRu ? t.titleRu : t.title} (${t.level})
          </button>
        `
        ).join('')}
      </div>

      <!-- Main Audio Player Card -->
      <div class="card" style="max-width: 780px; margin: 0 auto 28px; padding: 24px; border: 2px solid var(--border-strong);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary);">${trackTitle}</h3>
            <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">
              ${isRu ? 'Длительность: ~' : 'Duration: ~'}${currentTrack.duration} • ${isRu ? 'Уровень' : 'Level'} ${currentTrack.level}
            </span>
          </div>
          <button class="btn btn-secondary btn-sm" id="toggle-transcript-btn" style="font-weight: 700;">
            ${showTranscript ? I18n.t('listening.hide_transcript') : I18n.t('listening.show_transcript')}
          </button>
        </div>

        <!-- Speech Audio Controller -->
        <div class="audio-player-box" style="background-color: var(--bg-secondary); border-radius: var(--radius-lg); padding: 20px; border: 1px solid var(--border-subtle); margin-bottom: 20px;">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
            <div style="display: flex; align-items: center; gap: 14px;">
              <button class="btn btn-duo" id="play-pause-btn" style="width: 54px; height: 54px; border-radius: 50%; padding: 0; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; flex-shrink: 0;">
                <span id="play-icon">${isPlaying ? '⏸' : '▶'}</span>
              </button>
              <div>
                <div style="font-weight: 800; font-size: 0.95rem; color: var(--text-primary);" id="playback-status-text">
                  ${isPlaying ? I18n.t('listening.playing') : I18n.t('listening.ready')}
                </div>
                <div style="font-size: 0.8rem; color: var(--text-muted); display: flex; align-items: center; gap: 6px; margin-top: 2px;">
                  <span id="equalizer-bars" class="audio-equalizer" style="${isPlaying ? 'display: inline-flex;' : 'display: none;'}">
                    <span></span><span></span><span></span><span></span>
                  </span>
                  <span id="playback-time-label">${currentTrack.duration}</span>
                </div>
              </div>
            </div>

            <!-- Speed Selector -->
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 0.82rem; font-weight: 700; color: var(--text-secondary);">${I18n.t('listening.speed')}</span>
              <div style="display: flex; gap: 4px; background-color: var(--bg-surface); padding: 2px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
                <button class="btn btn-xs ${currentSpeed === 0.8 ? 'btn-primary' : 'btn-ghost'} speed-btn" data-speed="0.8">0.8x</button>
                <button class="btn btn-xs ${currentSpeed === 0.9 ? 'btn-primary' : 'btn-ghost'} speed-btn" data-speed="0.9">1.0x</button>
                <button class="btn btn-xs ${currentSpeed === 1.1 ? 'btn-primary' : 'btn-ghost'} speed-btn" data-speed="1.1">1.2x</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Transcript Dialog View -->
        ${
          showTranscript
            ? `
          <div class="transcript-container" style="background-color: var(--bg-surface); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle); padding: 18px; margin-bottom: 24px;">
            <div style="font-size: 0.8rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.05em;">
              ${isRu ? 'Текст диалога (нажмите на строку для прослушивания):' : 'Dialogue Transcript (click any line to replay):'}
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px;" id="dialogue-lines-list">
              ${currentTrack.lines
                .map(
                  (line, idx) => `
                <div 
                  class="dialogue-line-item ${activeLineIndex === idx ? 'active-spoken' : ''}" 
                  data-line-idx="${idx}"
                  style="display: flex; gap: 12px; padding: 10px 14px; border-radius: var(--radius-md); background-color: ${
                    activeLineIndex === idx ? 'var(--accent-green-light)' : 'var(--bg-secondary)'
                  }; cursor: pointer; transition: background-color var(--transition-fast); border-left: 3px solid ${
                    activeLineIndex === idx ? 'var(--accent-green)' : 'transparent'
                  };"
                >
                  <span class="speaker-tag" style="font-weight: 800; font-size: 0.85rem; color: var(--accent-green-hover); min-width: 80px;">${line.speaker}:</span>
                  <span class="speaker-text" style="font-size: 0.92rem; color: var(--text-primary); flex: 1; line-height: 1.45;">${line.text}</span>
                  <span style="font-size: 0.85rem; color: var(--text-muted);">🔊</span>
                </div>
              `
                )
                .join('')}
            </div>
          </div>
        `
            : ''
        }

        <!-- Comprehension Questions -->
        <div>
          <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin-bottom: 16px;">
            ${I18n.t('listening.questions')}
          </h3>

          <div style="display: flex; flex-direction: column; gap: 20px;">
            ${currentTrack.questions
              .map((q, qIdx) => {
                const questionText = isRu ? q.questionRu : q.questionEn;
                const options = isRu ? q.optionsRu : q.optionsEn;
                const explanation = isRu ? q.explanationRu : q.explanationEn;
                const selected = userAnswers[q.id];
                const isCorrect = selected === q.correctIndex;

                return `
                <div style="background-color: var(--bg-surface); border-radius: var(--radius-md); padding: 16px 20px; border: 1.5px solid var(--border-subtle);">
                  <div style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-bottom: 12px;">
                    ${qIdx + 1}. ${questionText}
                  </div>

                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    ${options
                      .map((opt, oIdx) => {
                        let btnStyle = 'background-color: var(--bg-secondary); border: 1px solid var(--border-subtle); color: var(--text-primary);';
                        if (selected === oIdx) {
                          btnStyle = 'background-color: var(--accent-primary-light); border: 1.5px solid var(--accent-primary); color: var(--accent-primary); font-weight: 700;';
                        }
                        if (submitted) {
                          if (oIdx === q.correctIndex) {
                            btnStyle = 'background-color: var(--accent-green-light); border: 1.5px solid var(--accent-green-border); color: var(--accent-green-hover); font-weight: 800;';
                          } else if (selected === oIdx && !isCorrect) {
                            btnStyle = 'background-color: var(--accent-rose-light); border: 1.5px solid #fca5a5; color: var(--accent-rose); font-weight: 700;';
                          }
                        }

                        return `
                        <button 
                          class="btn question-opt-btn" 
                          data-qid="${q.id}" 
                          data-oidx="${oIdx}"
                          style="justify-content: flex-start; text-align: left; padding: 10px 14px; font-size: 0.9rem; border-radius: var(--radius-sm); ${btnStyle}"
                          ${submitted ? 'disabled' : ''}
                        >
                          <span style="font-weight: 800; width: 20px;">${String.fromCharCode(65 + oIdx)}.</span>
                          <span>${opt}</span>
                        </button>
                      `;
                      })
                      .join('')}
                  </div>

                  ${
                    submitted
                      ? `
                    <div style="margin-top: 10px; font-size: 0.85rem; padding: 8px 12px; border-radius: var(--radius-sm); background-color: ${
                      isCorrect ? 'var(--accent-green-light)' : 'var(--accent-rose-light)'
                    }; color: ${isCorrect ? 'var(--accent-green-hover)' : 'var(--accent-rose)'}; font-weight: 600;">
                      ${isCorrect ? '✓ ' + (isRu ? 'Правильно!' : 'Correct!') : '✗ ' + (isRu ? 'Ошибка.' : 'Incorrect.')} ${explanation}
                    </div>
                  `
                      : ''
                  }
                </div>
              `;
              })
              .join('')}
          </div>

          <div style="margin-top: 20px; display: flex; justify-content: flex-end;">
            <button class="btn btn-duo" id="submit-listening-answers-btn" style="min-width: 170px; font-size: 0.95rem;">
              ${I18n.t('listening.submit')}
            </button>
          </div>
        </div>
      </div>
    `;

    // Toggle transcript
    container.querySelector('#toggle-transcript-btn')?.addEventListener('click', () => {
      showTranscript = !showTranscript;
      render();
    });

    // Track selector
    container.querySelectorAll('.track-select-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
        const found = LISTENING_TRACKS.find((t) => t.id === id);
        if (found) {
          AudioService.playPop();
          AudioService.stop();
          currentTrack = found;
          userAnswers = {};
          submitted = false;
          isPlaying = false;
          activeLineIndex = -1;
          render();
        }
      });
    });

    // Speed selector
    container.querySelectorAll('.speed-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        currentSpeed = parseFloat((e.currentTarget as HTMLElement).getAttribute('data-speed') || '1.0');
        AudioService.playPop();
        render();
      });
    });

    // Play/Pause dialogue
    container.querySelector('#play-pause-btn')?.addEventListener('click', () => {
      if (isPlaying) {
        AudioService.stop();
        isPlaying = false;
        activeLineIndex = -1;
        render();
      } else {
        isPlaying = true;
        AudioService.playPop();

        const statusEl = container.querySelector('#playback-status-text');
        const playIconEl = container.querySelector('#play-icon');
        const eqEl = container.querySelector('#equalizer-bars') as HTMLElement;
        if (statusEl) statusEl.textContent = I18n.t('listening.playing');
        if (playIconEl) playIconEl.textContent = '⏸';
        if (eqEl) eqEl.style.display = 'inline-flex';

        AudioService.playDialogue(
          currentTrack.lines,
          (idx) => {
            activeLineIndex = idx;
            container.querySelectorAll('.dialogue-line-item').forEach((item, i) => {
              if (i === idx) {
                item.classList.add('active-spoken');
                (item as HTMLElement).style.backgroundColor = 'var(--accent-green-light)';
                (item as HTMLElement).style.borderLeft = '3px solid var(--accent-green)';
              } else {
                item.classList.remove('active-spoken');
                (item as HTMLElement).style.backgroundColor = 'var(--bg-secondary)';
                (item as HTMLElement).style.borderLeft = '3px solid transparent';
              }
            });
          },
          () => {
            isPlaying = false;
            activeLineIndex = -1;
            render();
          }
        );
      }
    });

    // Click single dialogue line to speak
    container.querySelectorAll('.dialogue-line-item').forEach((item) => {
      item.addEventListener('click', (e) => {
        const idx = parseInt((e.currentTarget as HTMLElement).getAttribute('data-line-idx') || '0', 10);
        const line = currentTrack.lines[idx];
        if (line) {
          AudioService.playPop();
          AudioService.speak(line.text, { rate: currentSpeed });
        }
      });
    });

    // Question options
    container.querySelectorAll('.question-opt-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        if (submitted) return;
        AudioService.playPop();
        const qId = (e.currentTarget as HTMLElement).getAttribute('data-qid');
        const oIdx = parseInt((e.currentTarget as HTMLElement).getAttribute('data-oidx') || '0', 10);
        if (qId) {
          userAnswers[qId] = oIdx;
          render();
        }
      });
    });

    // Submit answers
    container.querySelector('#submit-listening-answers-btn')?.addEventListener('click', () => {
      const answeredCount = Object.keys(userAnswers).length;
      if (answeredCount < currentTrack.questions.length) {
        Toast.show(isRu ? 'Пожалуйста, ответьте на все вопросы к диалогу.' : 'Please answer all questions.', 'warning');
        return;
      }

      submitted = true;
      let correct = 0;
      currentTrack.questions.forEach((q) => {
        if (userAnswers[q.id] === q.correctIndex) correct++;
      });

      if (correct === currentTrack.questions.length) {
        AudioService.playCelebration();
        ProgressService.addXp(30, isRu ? `Аудирование: "${trackTitle}" пройдено на 100%!` : `Listening: 100% score on "${trackTitle}"`);
        Toast.show(isRu ? 'Отлично! Все ответы верны (+30 XP) 🎉' : 'Awesome! All answers correct! (+30 XP) 🎉', 'success');
      } else {
        AudioService.playSuccess();
        ProgressService.addXp(15, isRu ? `Практика аудирования: "${trackTitle}"` : `Listening practice: "${trackTitle}"`);
      }

      render();
    });
  };

  render();
  return container;
}
