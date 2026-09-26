import { User, UserState } from '../types/user';
import { DailyPlan } from '../types/progress';
import { StorageService } from '../services/storage';
import { AIService } from '../services/ai';
import { I18n } from '../services/i18n';
import { Toast } from '../components/Toast';

type Intake = { mood: string; minutes: number; focus: string; note: string };

const FOCUSES = [
  { id: 'speaking', icon: '💬', ru: 'Разговор', en: 'Speaking' },
  { id: 'vocabulary', icon: '🧠', ru: 'Новые слова', en: 'Vocabulary' },
  { id: 'grammar', icon: '🧩', ru: 'Грамматика', en: 'Grammar' },
  { id: 'mixed', icon: '✨', ru: 'На выбор помощника', en: 'Surprise me' }
];

const TASK_TITLES_RU: Record<string, string> = {
  'Gentle Phrase Review': 'Повторить полезные фразы',
  'Relaxed Speaking Prompt': 'Спокойная разговорная практика',
  '3-Question Quick Check': 'Мини-проверка из 3 вопросов',
  'Core Phrase Mastery': 'Выучить полезные фразы',
  'Targeted Grammar Rule': 'Разобрать правило грамматики',
  'Daily Mini Test': 'Короткая проверка знаний',
  'Phrase Practice & Sentence Building': 'Фразы и предложения',
  'Voice Speaking Lab': 'Разговорная практика',
  'Spoken Response': 'Ответить вслух',
  'Comprehension Reading': 'Прочитать короткий текст',
  'Grammar Deep Dive': 'Практика грамматики',
  'Writing Lab Challenge': 'Практика письма',
  'Advanced Phrase Workout': 'Практика выражений',
  'Grammar Roadmap Lesson': 'Грамматика на практике',
  'Speaking Lab & AI Conversation': 'Разговорная практика',
  'Writing & Sentence Synthesis': 'Письмо и предложения',
  'Mastery Mini Test': 'Проверка знаний',
  Speaking: 'Разговорная практика',
  Vocabulary: 'Новые слова',
  Grammar: 'Грамматика'
};

const TASK_DESCRIPTIONS_RU: Record<string, string> = {
  'Review 3 practical everyday expressions at a calm pace.': 'Повтори три полезных выражения без спешки.',
  'Answer one short speaking question out loud.': 'Ответь вслух на один короткий вопрос.',
  'Lock in what you learned with a rapid mini quiz.': 'Закрепи знания короткой проверкой.',
  'Learn and create your own sentences with 3 essential phrases.': 'Разбери три выражения и составь свои предложения.',
  'Quick walkthrough of key tense rules with one mini-exercise.': 'Повтори важное правило и выполни упражнение.',
  '5 high-impact questions to test your knowledge.': 'Проверь себя на пяти вопросах.',
  'Explore 4 high-frequency phrases and write your own examples.': 'Разбери четыре частых выражения и придумай примеры.',
  'Record your spoken answers to 2 interactive daily prompts.': 'Ответь вслух на два вопроса.',
  'Short real-world story with vocabulary hints and comprehension questions.': 'Прочитай короткий текст и ответь на вопросы.',
  'Practice fluent pronunciation and answer prompt out loud.': 'Потренируй произношение и ответь вслух.',
  'Comprehensive 5-question test evaluating phrases and grammar.': 'Проверь фразы и грамматику на пяти вопросах.',
  'Master 5 phrases in context with sentence formulation.': 'Изучи пять выражений и используй их в предложениях.',
  'Understand core sentence mechanics and solve interactive exercises.': 'Разберись в структуре предложений на практике.',
  'Simulate a live dialog with the AI English Tutor.': 'Потренируй разговор на английском.',
  'Draft a 60-80 word paragraph with instant AI feedback.': 'Напиши короткий текст и проверь его.',
  '8-question multi-skill evaluation with personalized diagnostics.': 'Проверь знания на восьми вопросах.'
};

export function renderTodayPage(user: User, onNavigate: (route: string) => void): HTMLElement {
  const container = document.createElement('div');
  container.className = 'page-container today-page';
  const isRu = I18n.getLang() === 'ru';
  let intake: Intake = { mood: '', minutes: user.dailyGoal || 15, focus: '', note: '' };
  let plan = StorageService.getDailyPlan();
  if (plan?.date !== new Date().toISOString().slice(0, 10)) plan = null;

  const renderPlan = (activePlan: DailyPlan) => {
    const done = activePlan.tasks.filter((task) => task.completed).length;
    const percent = activePlan.tasks.length ? Math.round(done / activePlan.tasks.length * 100) : 0;
    container.innerHTML = `
      <section class="today-heading">
        <div class="today-kicker">${isRu ? 'ТВОЙ АНГЛИЙСКИЙ' : 'YOUR ENGLISH PRACTICE'}</div>
        <h2>${isRu ? `Привет, ${escapeHtml(user.name)}` : `Hi, ${escapeHtml(user.name)}`}</h2>
        <p>${isRu ? 'Сегодня занимаемся в твоём темпе.' : 'A session that fits your day.'}</p>
      </section>
      <section class="today-plan-panel">
        <div class="today-plan-topline"><span class="today-level">${user.currentLevel}</span><span class="today-source">${activePlan.source === 'ai' ? 'Gemini AI' : (isRu ? 'План-подбор' : 'Adaptive plan')}</span><span>${activePlan.totalMinutes} ${isRu ? 'минут' : 'min'}</span></div>
        <h3>${isRu ? 'Твой план на сегодня' : "Today's plan"}</h3>
        <p class="today-plan-motivation">${escapeHtml(activePlan.motivation)}</p>
        <div class="today-progress-label"><span>${isRu ? 'Прогресс' : 'Progress'}</span><span>${done}/${activePlan.tasks.length}</span></div>
        <div class="today-progress-track"><span style="width:${percent}%"></span></div>
        <div class="today-task-list">
          ${activePlan.tasks.map((task) => `
            <button class="today-task ${task.completed ? 'is-done' : ''}" data-task-id="${escapeHtml(task.id)}" ${task.completed ? 'disabled' : ''}>
              <span class="today-task-check">${task.completed ? '✓' : '○'}</span>
              <span class="today-task-copy"><strong>${escapeHtml(isRu ? TASK_TITLES_RU[task.title] || task.title : task.title)}</strong><small>${task.duration} ${isRu ? 'мин' : 'min'} · ${escapeHtml(isRu ? TASK_DESCRIPTIONS_RU[task.description] || task.description : task.description)}</small></span>
              <span class="today-task-arrow">›</span>
            </button>
          `).join('')}
        </div>
        <div class="today-plan-actions">
          <button class="btn btn-primary" id="continue-plan">${isRu ? 'Открыть план' : 'Open plan'}</button>
          <button class="btn btn-ghost" id="new-plan">${isRu ? 'Составить заново' : 'Make a new plan'}</button>
        </div>
      </section>
      <section class="today-shortcuts">
        <button class="today-shortcut" id="check-level"><span>🎯</span><span><strong>${isRu ? 'Проверить уровень' : 'Check my level'}</strong><small>${isRu ? 'Тест по желанию' : 'Optional assessment'}</small></span><b>›</b></button>
        <button class="today-shortcut" id="open-progress"><span>📈</span><span><strong>${isRu ? 'Мой прогресс' : 'My progress'}</strong><small>${user.xp} XP · ${user.streak} ${isRu ? 'дн. подряд' : 'day streak'}</small></span><b>›</b></button>
      </section>`;

    container.querySelector('#continue-plan')?.addEventListener('click', () => onNavigate('/daily-plan'));
    container.querySelector('#new-plan')?.addEventListener('click', renderIntake);
    container.querySelector('#check-level')?.addEventListener('click', () => onNavigate('/tests'));
    container.querySelector('#open-progress')?.addEventListener('click', () => onNavigate('/progress'));
    container.querySelectorAll<HTMLButtonElement>('.today-task:not(:disabled)').forEach((button) => {
      button.addEventListener('click', () => {
        const task = activePlan.tasks.find((item) => item.id === button.dataset.taskId);
        if (task) onNavigate(task.linkRoute);
      });
    });
  };

  const renderIntake = () => {
    let step = 0;
    container.innerHTML = `
      <section class="today-heading"><div class="today-kicker">${isRu ? 'ПЛАН НА СЕГОДНЯ' : "TODAY'S PLAN"}</div><h2>${isRu ? `Привет, ${escapeHtml(user.name)}` : `Hi, ${escapeHtml(user.name)}`}</h2><p>${isRu ? 'Пара ответов, и я подберу занятие.' : "A couple of answers and I'll shape your session."}</p></section>
      <section class="intake-panel"><div class="assistant-message"><span class="assistant-avatar">E</span><p id="assistant-question"></p></div><div id="intake-choices" class="intake-choices"></div><div id="intake-extra"></div><div class="intake-footer"><span id="intake-step-label"></span><button class="btn btn-primary" id="intake-next" disabled></button></div></section>
      <button class="today-back-link" id="show-plan">${plan ? (isRu ? 'Вернуться к плану' : "Back to today's plan") : ''}</button>`;

    const questions = isRu
      ? ['Как ты себя чувствуешь сегодня?', 'Сколько времени удобно уделить английскому?', 'Что хочется потренировать?']
      : ['How are you feeling today?', 'How much time do you have?', 'What would you like to practice?'];
    const choices = [
      [
        { id: 'tired', text: isRu ? 'Устал(а)' : 'Low energy', icon: '🌧️' },
        { id: 'okay', text: isRu ? 'Нормально' : 'Doing okay', icon: '⛅' },
        { id: 'energized', text: isRu ? 'Есть силы' : 'Energized', icon: '☀️' }
      ],
      [10, 15, 30, 45].map((minutes) => ({ id: String(minutes), text: `${minutes} ${isRu ? 'минут' : 'minutes'}`, icon: '◷' })),
      FOCUSES.map((focus) => ({ id: focus.id, text: isRu ? focus.ru : focus.en, icon: focus.icon }))
    ];
    const questionEl = container.querySelector('#assistant-question') as HTMLElement;
    const choicesEl = container.querySelector('#intake-choices') as HTMLElement;
    const extraEl = container.querySelector('#intake-extra') as HTMLElement;
    const nextButton = container.querySelector('#intake-next') as HTMLButtonElement;
    const stepLabel = container.querySelector('#intake-step-label') as HTMLElement;

    const paintStep = () => {
      questionEl.textContent = questions[step];
      stepLabel.textContent = `${step + 1} / 3`;
      nextButton.disabled = ![intake.mood, intake.minutes, intake.focus][step];
      nextButton.innerHTML = step === 2 ? `${isRu ? 'Составить план' : 'Create my plan'} <span>→</span>` : `${isRu ? 'Дальше' : 'Next'} <span>→</span>`;
      choicesEl.innerHTML = choices[step].map((choice) => {
        const selected = [intake.mood, String(intake.minutes), intake.focus][step] === choice.id;
        return `<button class="intake-choice ${selected ? 'selected' : ''}" data-choice="${choice.id}"><span>${choice.icon}</span>${choice.text}</button>`;
      }).join('');
      extraEl.innerHTML = step === 2
        ? `<label class="intake-note-label" for="intake-note">${isRu ? 'Есть конкретный запрос? (необязательно)' : 'Anything specific? (optional)'}</label><textarea id="intake-note" class="textarea-custom intake-note" maxlength="240" placeholder="${isRu ? 'Например: подготовиться к разговору на работе' : 'For example: prepare for a conversation at work'}">${escapeHtml(intake.note)}</textarea>`
        : '';
      choicesEl.querySelectorAll<HTMLButtonElement>('.intake-choice').forEach((button) => {
        button.addEventListener('click', () => {
          const value = button.dataset.choice || '';
          if (step === 0) intake.mood = value;
          if (step === 1) intake.minutes = Number(value);
          if (step === 2) intake.focus = value;
          paintStep();
        });
      });
      extraEl.querySelector<HTMLTextAreaElement>('#intake-note')?.addEventListener('input', (event) => {
        intake.note = (event.currentTarget as HTMLTextAreaElement).value;
      });
    };

    nextButton.addEventListener('click', async () => {
      if (step < 2) {
        step += 1;
        paintStep();
        return;
      }
      nextButton.disabled = true;
      nextButton.textContent = isRu ? 'Подбираю...' : 'Building your plan...';
      const focus = FOCUSES.find((item) => item.id === intake.focus);
      const moodText = intake.mood === 'tired' ? 'I feel tired and need a gentle session.' : intake.mood === 'energized' ? 'I feel energized today.' : 'I feel okay today.';
      const promptText = [moodText, `I have ${intake.minutes} minutes.`, `I want to practice ${intake.focus}.`, intake.note].filter(Boolean).join(' ');
      const state: UserState = {
        mood: intake.mood,
        availableTime: intake.minutes,
        currentLevel: user.currentLevel,
        targetLevel: user.targetLevel,
        mainGoal: user.mainGoal,
        streak: user.streak,
        learnedPhrasesCount: StorageService.getLearnedPhrasesCount(),
        userPrompt: promptText
      };
      try {
        const generatedPlan = await AIService.generateDailyPlan(state);
        plan = generatedPlan;
        const generatedMinutes = generatedPlan.tasks.reduce((total, task) => total + task.duration, 0);
        if (generatedMinutes > intake.minutes && generatedPlan.tasks.length) {
          let remainingMinutes = intake.minutes;
          generatedPlan.tasks.forEach((task, index) => {
            task.duration = index === generatedPlan.tasks.length - 1
              ? remainingMinutes
              : Math.max(1, Math.floor(task.duration / generatedMinutes * intake.minutes));
            remainingMinutes -= task.duration;
          });
          generatedPlan.totalMinutes = intake.minutes;
        }
        if (focus && intake.focus !== 'mixed') {
          const task = generatedPlan.tasks.find((item) => item.type === intake.focus || (intake.focus === 'vocabulary' && item.type === 'phrases'));
          if (task) task.title = focus.en;
        }
        StorageService.saveDailyPlan(generatedPlan);
        Toast.show({ type: 'success', title: isRu ? 'План готов' : 'Plan ready', message: isRu ? `Подобрал занятие на ${generatedPlan.totalMinutes} минут.` : `Your ${generatedPlan.totalMinutes}-minute session is ready.` });
        renderPlan(generatedPlan);
      } catch (error) {
        console.error(error);
        nextButton.disabled = false;
        nextButton.textContent = isRu ? 'Попробовать ещё раз' : 'Try again';
      }
    });
    container.querySelector('#show-plan')?.addEventListener('click', () => plan && renderPlan(plan));
    paintStep();
  };

  if (plan) renderPlan(plan);
  else renderIntake();
  return container;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character] || character);
}