import { Achievement } from '../types/progress';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-first-day',
    title: 'First Step',
    titleRu: 'Первый шаг',
    description: 'Complete your very first English learning session.',
    descriptionRu: 'Завершите свое самое первое занятие по английскому.',
    icon: '🚀',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    category: 'study_time'
  },
  {
    id: 'ach-streak-3',
    title: 'Momentum Builder',
    titleRu: 'Разгон привычки',
    description: 'Reach a 3-day learning streak without interruptions.',
    descriptionRu: 'Достигните серии 3 дня занятий подряд без пропусков.',
    icon: '⚡',
    unlocked: false,
    progress: 0,
    maxProgress: 3,
    category: 'streak'
  },
  {
    id: 'ach-streak-7',
    title: 'One Week Warrior',
    titleRu: 'Недельный воин',
    description: 'Maintain a 7-day learning streak without missing a day.',
    descriptionRu: 'Удерживайте серию 7 дней подряд — сформируйте крепкую привычку.',
    icon: '🔥',
    unlocked: false,
    progress: 0,
    maxProgress: 7,
    category: 'streak'
  },
  {
    id: 'ach-streak-30',
    title: 'Unstoppable Habit',
    titleRu: 'Железная привычка',
    description: 'Achieve a 30-day streak of daily English practice.',
    descriptionRu: 'Достигните 30 дней ежедневной практики английского языка.',
    icon: '👑',
    unlocked: false,
    progress: 0,
    maxProgress: 30,
    category: 'streak'
  },
  {
    id: 'ach-phrases-10',
    title: 'Phrase Explorer',
    titleRu: 'Исследователь фраз',
    description: 'Learn and review your first 10 active English phrases.',
    descriptionRu: 'Изучите и повторите свои первые 10 живых фраз.',
    icon: '💬',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
    category: 'phrases'
  },
  {
    id: 'ach-phrases-50',
    title: 'Phrase Master',
    titleRu: 'Мастер фраз',
    description: 'Master 30+ core English phrases with personal sentence practice.',
    descriptionRu: 'Освойте 30+ ключевых выражений с личными предложениями.',
    icon: '📚',
    unlocked: false,
    progress: 0,
    maxProgress: 30,
    category: 'phrases'
  },
  {
    id: 'ach-grammar-5',
    title: 'Grammar Architect',
    titleRu: 'Знаток грамматики',
    description: 'Complete 5 fundamental grammar topics from A1 to B1.',
    descriptionRu: 'Пройдите 5 ключевых грамматических тем от A1 до B1.',
    icon: '🧩',
    unlocked: false,
    progress: 0,
    maxProgress: 5,
    category: 'skills'
  },
  {
    id: 'ach-speaking-first',
    title: 'Voice Unlocked',
    titleRu: 'Первый разговор',
    description: 'Complete a speaking practice session using microphone voice recognition.',
    descriptionRu: 'Пройдите разговорную тренировку с микрофоном и распознаванием речи.',
    icon: '🎙️',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    category: 'skills'
  },
  {
    id: 'ach-listening-master',
    title: 'Keen Ear',
    titleRu: 'Чуткий слух',
    description: 'Listen to 3 dialogue tracks and answer all questions correctly.',
    descriptionRu: 'Прослушайте 3 аудио-диалога и правильно ответьте на вопросы.',
    icon: '🎧',
    unlocked: false,
    progress: 0,
    maxProgress: 3,
    category: 'skills'
  },
  {
    id: 'ach-test-perfect',
    title: 'Straight A Student',
    titleRu: 'Отличник',
    description: 'Score 100% on any diagnostic mini test.',
    descriptionRu: 'Наберите 100% правильных ответов в проверочном мини-тесте.',
    icon: '🎯',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    category: 'tests'
  },
  {
    id: 'ach-xp-500',
    title: '500 XP Club',
    titleRu: 'Клуб 500 XP',
    description: 'Accumulate 500 XP points on your English learning path.',
    descriptionRu: 'Наберите 500 очков опыта (XP) за выполненные уроки и тесты.',
    icon: '⭐',
    unlocked: false,
    progress: 0,
    maxProgress: 500,
    category: 'study_time'
  },
  {
    id: 'ach-level-b1',
    title: 'B1 Fluency Champion',
    titleRu: 'Чемпион уровня B1',
    description: 'Reach Intermediate level and master conversational confidence.',
    descriptionRu: 'Достигните уровня B1 и обретите уверенность в разговоре.',
    icon: '🏆',
    unlocked: false,
    progress: 0,
    maxProgress: 1500,
    category: 'study_time'
  }
];
