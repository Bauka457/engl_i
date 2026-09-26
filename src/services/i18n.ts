/**
 * Internationalization (i18n) Service for English Journey
 * Complete, fluent Russian (RU) as default, with seamless English (EN) toggle.
 */

import { StorageService } from './storage';

export type AppLang = 'ru' | 'en';

type Translations = Record<string, { en: string; ru: string }>;

const DICTIONARY: Translations = {
  // Navigation
  'nav.learn': { en: 'Learn Path', ru: 'Уроки' },
  'nav.dashboard': { en: 'Learn Path', ru: 'Уроки' },
  'nav.dailyPlan': { en: 'Daily Plan', ru: 'План на день' },
  'nav.practice': { en: 'Practice', ru: 'Практика' },
  'nav.tracker': { en: 'Habit Tracker', ru: 'Трекер привычки' },
  'nav.settings': { en: 'Settings', ru: 'Настройки' },
  'nav.phrases': { en: 'Phrases', ru: 'Фразы' },
  'nav.grammar': { en: 'Grammar', ru: 'Грамматика' },
  'nav.reading': { en: 'Reading', ru: 'Чтение' },
  'nav.listening': { en: 'Listening', ru: 'Аудирование' },
  'nav.speaking': { en: 'Speaking', ru: 'Разговор' },
  'nav.writing': { en: 'Writing', ru: 'Письмо' },
  'nav.tests': { en: 'Mini Tests', ru: 'Мини-тесты' },
  'nav.progress': { en: 'Progress & Stats', ru: 'Статистика' },
  'nav.calendar': { en: 'Calendar', ru: 'Календарь' },
  'nav.achievements': { en: 'Achievements', ru: 'Достижения' },
  'nav.profile': { en: 'Profile', ru: 'Профиль' },

  // Header & Controls
  'header.streak': { en: 'day streak', ru: 'дней подряд' },
  'header.streak_short': { en: 'd', ru: 'дн' },
  'header.xp': { en: 'XP', ru: 'XP' },
  'header.theme_dark': { en: 'Dark', ru: 'Темная' },
  'header.theme_light': { en: 'Light', ru: 'Светлая' },
  'header.lang_ru': { en: 'Русский', ru: 'Русский' },
  'header.lang_en': { en: 'English', ru: 'English' },

  // Common Buttons & Badges
  'btn.save': { en: 'Save', ru: 'Сохранить' },
  'btn.cancel': { en: 'Cancel', ru: 'Отмена' },
  'btn.close': { en: 'Close', ru: 'Закрыть' },
  'btn.submit': { en: 'Submit', ru: 'Отправить' },
  'btn.listen': { en: 'Listen', ru: 'Слушать' },
  'btn.check': { en: 'Check ✓', ru: 'Проверить ✓' },
  'btn.continue': { en: 'Continue ▶', ru: 'Продолжить ▶' },
  'btn.start': { en: 'Start ▶', ru: 'Начать ▶' },
  'btn.next': { en: 'Next Step ▶', ru: 'Дальше ▶' },
  'btn.retry': { en: 'Try Again ↺', ru: 'Попробовать снова ↺' },
  'btn.repeat': { en: 'Review ↺', ru: 'Повторить ↺' },
  'btn.export': { en: 'Export Data (JSON)', ru: 'Экспорт данных (JSON)' },
  'btn.import': { en: 'Import Data', ru: 'Импорт данных' },
  'btn.reset': { en: 'Reset All Progress', ru: 'Сбросить весь прогресс' },

  // Roadmap & Duolingo Path
  'roadmap.welcome': { en: 'Welcome back,', ru: 'Привет,' },
  'roadmap.ready': { en: 'Ready to learn?', ru: 'Готовы к новому уроку?' },
  'roadmap.next_step': { en: 'Next lesson:', ru: 'Следующий урок:' },
  'roadmap.continue_btn': { en: 'Continue Lesson ▶', ru: 'Продолжить урок ▶' },
  'roadmap.completed_path': { en: 'completed', ru: 'пути пройдено' },
  'roadmap.active_lesson': { en: 'Active Lesson', ru: 'Текущий урок' },
  'roadmap.completed_lesson': { en: 'Completed', ru: 'Пройдено' },
  'roadmap.locked_lesson': { en: 'Locked', ru: 'Закрыто' },
  'roadmap.min': { en: 'min', ru: 'мин' },
  'roadmap.section': { en: 'Section', ru: 'Раздел' },
  'roadmap.daily_goal': { en: "Today's Habit Goal", ru: 'Цель привычки на сегодня' },
  'roadmap.daily_goal_sub': { en: 'Complete 1 lesson or practice 15 min', ru: 'Пройти 1 урок или позаниматься 15 минут' },

  // Lesson Modal
  'lesson.complete_title': { en: 'Lesson Complete! 🎉', ru: 'Урок завершен! 🎉' },
  'lesson.complete_sub': { en: 'Fantastic job! Another steady step toward B1 mastery.', ru: 'Отличная работа! Еще один уверенный шаг к уровню B1.' },
  'lesson.xp_earned': { en: 'XP Earned', ru: 'XP получено' },
  'lesson.continue_journey': { en: 'Continue Journey 🚀', ru: 'Продолжить путь 🚀' },
  'lesson.listen_pronunciation': { en: 'Listen Pronunciation', ru: 'Слушать произношение' },
  'lesson.understood': { en: 'Got it, continue ▶', ru: 'Понятно, дальше ▶' },
  'lesson.correct': { en: 'Great job! ✓', ru: 'Отлично! Все верно ✓' },
  'lesson.incorrect': { en: 'Not quite right.', ru: 'Не совсем так.' },
  'lesson.example_label': { en: 'Example:', ru: 'Пример:' },

  // Practice Hub
  'practice.title': { en: 'Practice & Skills Gym', ru: 'Практика и тренировки' },
  'practice.subtitle': {
    en: 'Strengthen your English with focused exercises: collocations, listening comprehension, speech lab, and tests.',
    ru: 'Закрепляйте знания в удобных модулях: живые фразы, диалоги на слух, разговорная речь с микрофоном и тесты.'
  },
  'practice.tab_phrases': { en: 'Phrases & Idioms', ru: 'Фразы и идиомы' },
  'practice.tab_listening': { en: 'Listening Lab', ru: 'Аудирование' },
  'practice.tab_speaking': { en: 'Speaking Club', ru: 'Разговорная речь' },
  'practice.tab_tests': { en: 'Mini Tests', ru: 'Мини-тесты' },

  // Phrases
  'phrases.title': { en: 'Active Phrases & Collocations', ru: 'Активные фразы английского' },
  'phrases.badge': { en: 'Phrase-First Method', ru: 'Фразовое обучение' },
  'phrases.subtitle': {
    en: 'Learn natural collocations rather than isolated words. Listen to pronunciation, make your own sentences, and build real fluency.',
    ru: 'Изучайте живые устойчивые словосочетания вместо оторванных слов. Слушайте произношение, составляйте предложения и говорите естественно.'
  },
  'phrases.add_btn': { en: '+ Add Custom Phrase', ru: '+ Добавить свою фразу' },
  'phrases.search_placeholder': { en: '🔍 Search phrases, translations or examples...', ru: '🔍 Поиск по фразам, переводам или примерам...' },
  'phrases.all_levels': { en: 'All Levels', ru: 'Все уровни' },
  'phrases.all_statuses': { en: 'All Statuses', ru: 'Все статусы' },
  'phrases.status_new': { en: 'New', ru: 'Новая' },
  'phrases.status_learning': { en: 'Learning', ru: 'Изучается' },
  'phrases.status_difficult': { en: 'Difficult', ru: 'Сложная' },
  'phrases.status_learned': { en: 'Mastered ✓', ru: 'Усвоено ✓' },
  'phrases.your_turn': { en: '✍️ Your Turn', ru: '✍️ Ваша очередь' },
  'phrases.your_turn_desc': { en: 'Write a sentence with this phrase in your own context', ru: 'Составьте предложение с этой фразой в вашем контексте' },
  'phrases.check_btn': { en: 'Check My Sentence', ru: 'Проверить предложение' },
  'phrases.usage_label': { en: 'Usage note:', ru: 'Контекст и применение:' },
  'phrases.better_version': { en: 'Better version:', ru: 'Лучший вариант:' },

  // Listening
  'listening.title': { en: 'Audio Comprehension Lab', ru: 'Лаборатория аудирования' },
  'listening.badge': { en: 'Audio Practice', ru: 'Практика аудирования' },
  'listening.subtitle': {
    en: 'Train your ear to natural conversational English. Listen carefully to dialogue excerpts and verify your comprehension.',
    ru: 'Тренируйте понимание живой речи на слух. Слушайте диалоги носителей языка и отвечайте на контрольные вопросы.'
  },
  'listening.play': { en: 'Play Dialogue ▶', ru: 'Воспроизвести диалог ▶' },
  'listening.pause': { en: 'Pause ⏸', ru: 'Пауза ⏸' },
  'listening.show_transcript': { en: 'Show Transcript 👁️', ru: 'Показать текст диалога 👁️' },
  'listening.hide_transcript': { en: 'Hide Transcript 🙈', ru: 'Скрыть текст диалога 🙈' },
  'listening.speed': { en: 'Speed:', ru: 'Скорость:' },
  'listening.ready': { en: 'Ready to Play', ru: 'Готово к прослушиванию' },
  'listening.playing': { en: 'Playing Dialogue...', ru: 'Идет воспроизведение...' },
  'listening.paused': { en: 'Paused', ru: 'Пауза' },
  'listening.finished': { en: 'Playback Finished ✓', ru: 'Аудио завершено ✓' },
  'listening.questions': { en: 'Comprehension Questions', ru: 'Вопросы к диалогу' },
  'listening.submit': { en: 'Check Answers', ru: 'Проверить ответы' },
  'listening.tip': {
    en: '💡 Tip: Click any line in the dialogue transcript to hear that individual sentence!',
    ru: '💡 Совет: Нажмите на любую реплику в транскрипте, чтобы прослушать конкретную фразу!'
  },

  // Speaking
  'speaking.title': { en: 'Speaking & Fluency Lab', ru: 'Разговорная речь и беглость' },
  'speaking.subtitle': {
    en: 'Overcome the psychological barrier. Speak into the microphone with speech recognition or chat with the friendly AI tutor.',
    ru: 'Преодолейте языковой барьер. Говорите в микрофон с проверкой распознавания речи или общайтесь с AI-тьютором.'
  },
  'speaking.mode_prompt': { en: '🎯 Topic Practice', ru: '🎯 Тема для речи' },
  'speaking.mode_tutor': { en: '🤖 AI Tutor Chat', ru: '🤖 Чат с тьютором' },
  'speaking.start_recording': { en: 'Click microphone to record', ru: 'Нажмите на микрофон для записи' },
  'speaking.recording_active': { en: 'Listening... Speak in English now!', ru: 'Слушаю... Говорите на английском!' },
  'speaking.stop_recording': { en: 'Stop Recording', ru: 'Остановить запись' },
  'speaking.try_again': { en: 'Try Again ↺', ru: 'Заново ↺' },
  'speaking.analyze_btn': { en: 'Analyze My Speech →', ru: 'Анализ моей речи →' },
  'speaking.correct_mode': { en: 'Correct my grammar & vocabulary', ru: 'Исправлять мои ошибки' },
  'speaking.your_topic': { en: 'Your Topic:', ru: 'Ваша тема для речи:' },

  // Tests
  'tests.title': { en: 'Mini Tests & Checkup', ru: 'Мини-тесты и самопроверка' },
  'tests.subtitle': {
    en: 'Solidify your knowledge. Check your grasp of key phrases, grammar rules, and natural sentence structures.',
    ru: 'Закрепите знания. Проверьте себя по фразам, правилам грамматики и правильному порядку слов.'
  },
  'tests.quick_btn': { en: '⚡ Quick Test (5 Qs)', ru: '⚡ Быстрый тест (5 вопр.)' },
  'tests.full_btn': { en: '📝 Standard Test (8 Qs)', ru: '📝 Полный тест (8 вопр.)' },
  'tests.q_progress': { en: 'Question', ru: 'Вопрос' },
  'tests.of': { en: 'of', ru: 'из' },
  'tests.check_answer': { en: 'Check Answer', ru: 'Проверить ответ' },
  'tests.next_q': { en: 'Next Question ▶', ru: 'Следующий вопрос ▶' },
  'tests.finish_test': { en: 'Finish Test 🏁', ru: 'Завершить тест 🏁' },
  'tests.results_title': { en: 'Test Results', ru: 'Результаты теста' },
  'tests.pass_msg': { en: 'Great achievement! You mastered this material.', ru: 'Отличный результат! Материал усвоен на ура.' },
  'tests.retry_msg': { en: 'Good practice! Review missed questions and try once more.', ru: 'Хорошая тренировка! Повторите ошибки и попробуйте снова.' },
  'tests.history_title': { en: 'Previous Test Attempts', ru: 'История прошлых попыток' },
  'tests.no_history': { en: 'No tests completed yet. Start your first quick test above!', ru: 'Вы еще не проходили тесты. Начните первый быстрый тест выше!' },

  // Habit Tracker Hub
  'tracker.title': { en: 'Habit & Consistency Tracker', ru: 'Трекер привычки и серии' },
  'tracker.subtitle': {
    en: 'Consistency beats intensity. Keep your daily study streak alive, earn badges, and watch your skills grow.',
    ru: 'Регулярность важнее зубрежки. Поддерживайте непрерывную серию дней, открывайте награды и растите каждый день.'
  },
  'tracker.tab_calendar': { en: '🔥 Streak Calendar', ru: '🔥 Календарь серии' },
  'tracker.tab_achievements': { en: '🏆 Achievements', ru: '🏆 Достижения' },
  'tracker.tab_stats': { en: '📊 XP & Study Stats', ru: '📊 Статистика и время' },
  'tracker.days_streak': { en: 'days streak', ru: 'дней серии подряд' },

  // Calendar
  'cal.month_view': { en: 'Month View', ru: 'Месяц' },
  'cal.week_view': { en: 'Week View', ru: 'Неделя' },
  'cal.prev': { en: '◀ Prev', ru: '◀ Пред.' },
  'cal.today': { en: 'Today', ru: 'Сегодня' },
  'cal.next': { en: 'Next ▶', ru: 'След. ▶' },
  'cal.completed_legend': { en: 'Completed (15+ min / 1+ lesson)', ru: 'Выполнено (15+ мин / 1+ урок)' },
  'cal.partial_legend': { en: 'Partial session', ru: 'Частичная практика' },
  'cal.missed_legend': { en: 'Rest / Missed day', ru: 'День отдыха / Пропуск' },

  // Achievements
  'ach.title': { en: 'Achievements & Milestones', ru: 'Достижения и награды' },
  'ach.unlocked_badge': { en: 'Unlocked ✓', ru: 'Получено ✓' },
  'ach.in_progress': { en: 'In Progress', ru: 'В процессе' },
  'ach.progress_label': { en: 'Progress', ru: 'Прогресс' },

  // Daily Plan
  'plan.title': { en: "Today's Study Plan", ru: 'План занятий на сегодня' },
  'plan.completed_title': { en: 'Daily Plan Completed! 🎉', ru: 'План на сегодня выполнен! 🎉' },
  'plan.generate_diff': { en: '↺ Generate New Plan', ru: '↺ Создать другой план' },
  'plan.all_done_msg': {
    en: 'Fantastic consistency! You finished all scheduled tasks for today.',
    ru: 'Потрясающая регулярность! Все запланированные задачи на сегодня успешно выполнены.'
  },
  'plan.streak_bonus': { en: '+1 Day Streak', ru: '+1 день к серии' },
  'plan.empty_title': { en: 'No Active Daily Plan', ru: 'Нет активного плана на день' },
  'plan.empty_desc': {
    en: 'Start by choosing your study focus or launching a quick lesson.',
    ru: 'Начните с прохождения урока или выберите цели для сегодняшнего дня.'
  },

  // Settings
  'settings.title': { en: 'Settings & Profile', ru: 'Настройки и профиль' },
  'settings.subtitle': {
    en: 'Manage interface theme, language, sound effects, audio diagnostics, and local data.',
    ru: 'Оформление, язык интерфейса, звуковая система, проверка произношения и управление данными.'
  },
  'settings.appearance': { en: 'Appearance & Language', ru: 'Оформление и язык' },
  'settings.theme_label': { en: 'Theme Mode', ru: 'Цветовая тема' },
  'settings.theme_desc': { en: 'Clean light or restful dark mode', ru: 'Светлая или комфортная темная тема' },
  'settings.lang_label': { en: 'Interface Language', ru: 'Язык интерфейса' },
  'settings.lang_desc': { en: 'Switch between Russian and English', ru: 'Переключение между русским и английским' },
  'settings.audio_diag_title': { en: '🔊 Audio Engine & Diagnostics', ru: '🔊 Звуковая система и диагностика' },
  'settings.audio_diag_desc': {
    en: 'Test speech synthesis voice pronunciation and Web Audio sound effects.',
    ru: 'Проверка синтеза речи носителей языка и тактильных звуковых эффектов Web Audio.'
  },
  'settings.speech_synth_label': { en: 'Speech Synthesis Voice', ru: 'Синтез речи (произношение)' },
  'settings.webaudio_label': { en: 'Web Audio SFX', ru: 'Звуковые эффекты' },
  'settings.supported_ready': { en: 'Supported & Ready ✓', ru: 'Поддерживается и готово ✓' },
  'settings.test_speech': { en: '🔊 Test Voice Pronunciation', ru: '🔊 Тест произношения речи' },
  'settings.test_sfx': { en: '🔔 Test Success Chime', ru: '🔔 Тест звука успеха' },
  'settings.test_fanfare': { en: '🎉 Test Level-up Fanfare', ru: '🎉 Тест фанфар' },
  'settings.routine_title': { en: 'Study Habit Schedule', ru: 'Удобное время для занятий' },
  'settings.routine_label': { en: 'Preferred Daily Study Window:', ru: 'Предпочитаемое время учебы:' },
  'settings.time_morning': { en: 'Morning (07:00 - 10:00)', ru: 'Утро (07:00 - 10:00)' },
  'settings.time_afternoon': { en: 'Afternoon (12:00 - 15:00)', ru: 'День (12:00 - 15:00)' },
  'settings.time_evening': { en: 'Evening (18:00 - 21:00)', ru: 'Вечер (18:00 - 21:00)' },
  'settings.time_night': { en: 'Night (21:00 - 24:00)', ru: 'Ночь (21:00 - 24:00)' },
  'settings.data_management': { en: 'Data & Privacy Management', ru: 'Управление данными и резервное копирование' },
  'settings.data_desc': {
    en: "All your study progress, streak days, completed lessons, and test scores are securely kept in your browser's local storage.",
    ru: 'Все данные о ваших уроках, серии дней, фразах и пройденных тестах надежно сохраняются локально в вашем браузере.'
  },
  'settings.reset_confirm_title': { en: 'Reset All Learning Progress?', ru: 'Сбросить весь прогресс обучения?' },
  'settings.reset_confirm_msg': {
    en: 'Are you sure you want to reset all progress, streaks, and saved phrases? This cannot be undone.',
    ru: 'Вы уверены, что хотите сбросить все результаты, серию дней и сохраненные фразы? Это действие нельзя отменить.'
  },

  // Onboarding
  'onboard.welcome': { en: 'Welcome to English Journey 🚀', ru: 'Добро пожаловать в English Journey! 🚀' },
  'onboard.tagline': { en: 'Your personal English tracker from A1 to B1', ru: 'Ваш понятный трекер изучения английского от A1 до B1' },
  'onboard.subtitle': {
    en: 'No exhausting academic theory. Learn step-by-step like in Duolingo: 5-minute bite-sized lessons, natural collocations, audio dialogues, and a daily habit streak.',
    ru: 'Без скучной теории и путаницы. Обучение шаг за шагом как в Duolingo: понятные уроки по 5 минут, живые фразы, диалоги на слух и трекер привычки.'
  },
  'onboard.name_label': { en: 'What is your name?', ru: 'Как вас зовут?' },
  'onboard.name_placeholder': { en: 'e.g. Alex', ru: 'например, Бауыржан или Алина' },
  'onboard.current_lvl': { en: 'Your current level:', ru: 'Ваш текущий уровень:' },
  'onboard.target_lvl': { en: 'Your target level:', ru: 'Целевой уровень:' },
  'onboard.daily_goal': { en: 'Daily study goal:', ru: 'Сколько времени готовы уделять в день?' },
  'onboard.main_goal': { en: 'Main learning goal:', ru: 'Основная цель обучения:' },
  'onboard.start_btn': { en: 'Start My English Journey ▶', ru: 'Начать обучение ▶' },
  'onboard.goal_work': { en: 'Work & Career Progression', ru: 'Работа и карьера' },
  'onboard.goal_it': { en: 'IT & Software Development', ru: 'IT и разработка' },
  'onboard.goal_travel': { en: 'Travel & Global Communication', ru: 'Путешествия и общение' },
  'onboard.goal_friends': { en: 'Everyday Speaking & Friends', ru: 'Разговорная речь для жизни' },
  'onboard.goal_study': { en: 'University & Academic Exams', ru: 'Учеба и экзамены' },
  'onboard.min_15': { en: '15 minutes (Steady Pace)', ru: '15 минут (Легкий темп)' },
  'onboard.min_30': { en: '30 minutes (Recommended)', ru: '30 минут (Рекомендуемый)' },
  'onboard.min_45': { en: '45 minutes (Accelerated)', ru: '45 минут (Интенсивный)' }
};

class I18nServiceClass {
  private currentLang: AppLang = 'ru';
  private listeners: Array<(lang: AppLang) => void> = [];

  constructor() {
    this.init();
  }

  private init(): void {
    const settings = StorageService.getSettings();
    if (settings && settings.language) {
      this.currentLang = settings.language.toLowerCase() === 'english' ? 'en' : 'ru';
    } else {
      // Default to Russian
      this.currentLang = 'ru';
    }
  }

  public getLang(): AppLang {
    return this.currentLang;
  }

  public setLang(lang: AppLang): void {
    this.currentLang = lang;
    const settings = StorageService.getSettings();
    settings.language = lang === 'en' ? 'English' : 'Russian';
    StorageService.saveSettings(settings);

    // Notify listeners
    this.listeners.forEach((fn) => fn(lang));

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('languagechange', { detail: lang }));
    }
  }

  public toggleLang(): AppLang {
    const next: AppLang = this.currentLang === 'en' ? 'ru' : 'en';
    this.setLang(next);
    return next;
  }

  public t(key: string, defaultText?: string): string {
    const entry = DICTIONARY[key];
    if (!entry) return defaultText || key;
    return entry[this.currentLang] || entry.ru || entry.en || defaultText || key;
  }

  public onLanguageChange(fn: (lang: AppLang) => void): () => void {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }
}

export const I18n = new I18nServiceClass();
export const t = (key: string, defaultText?: string) => I18n.t(key, defaultText);
