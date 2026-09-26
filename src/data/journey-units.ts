export interface JourneyStep {
  type: 'phrase' | 'grammar' | 'quiz' | 'listening';
  title: string;
  phrase?: string;
  pronunciation?: string;
  translation?: string;
  example?: string;
  rule?: string;
  question?: string;
  options?: string[];
  correctIndex?: number;
  explanation?: string;
}

export interface JourneyLesson {
  id: string;
  unitId: string;
  title: string;
  titleRu: string;
  icon: string;
  level: 'A1' | 'A2' | 'B1';
  estimatedMinutes: number;
  xpReward: number;
  descriptionRu: string;
  descriptionEn: string;
  steps: JourneyStep[];
}

export interface JourneyUnit {
  id: string;
  number: number;
  titleRu: string;
  titleEn: string;
  level: 'A1' | 'A2' | 'B1';
  descriptionRu: string;
  descriptionEn: string;
  color: string;
  lessons: JourneyLesson[];
}

export const JOURNEY_UNITS: JourneyUnit[] = [
  {
    id: 'unit-1',
    number: 1,
    titleRu: 'Раздел 1: Знакомство и базовые фразы',
    titleEn: 'Unit 1: First Steps & Greetings',
    level: 'A1',
    descriptionRu: 'Начните с самых нужных фраз для первого контакта и приветствий.',
    descriptionEn: 'Master essential greetings and basic introduction phrases.',
    color: '#22c55e',
    lessons: [
      {
        id: 'les-1',
        unitId: 'unit-1',
        title: 'Greetings & Introduction',
        titleRu: 'Приветствие и знакомство',
        icon: '👋',
        level: 'A1',
        estimatedMinutes: 3,
        xpReward: 20,
        descriptionRu: 'Научитесь легко здороваться и представляться.',
        descriptionEn: 'Learn how to greet someone and introduce yourself naturally.',
        steps: [
          {
            type: 'phrase',
            title: 'Ключевая фраза',
            phrase: 'Nice to meet you',
            pronunciation: '/naɪs tuː miːt juː/',
            translation: 'Приятно познакомиться',
            example: 'Hello! I am Alex. Nice to meet you.'
          },
          {
            type: 'phrase',
            title: 'Полезная фраза',
            phrase: 'How is it going?',
            pronunciation: '/haʊ ɪz ɪt ˈɡoʊɪŋ/',
            translation: 'Как дела? Как поживаешь?',
            example: 'Hey Dan! How is it going today?'
          },
          {
            type: 'quiz',
            title: 'Проверка знаний',
            question: 'Как вежливо ответить на "Nice to meet you"?',
            options: ['Goodbye', 'Nice to meet you too!', 'I am fine go away', 'Yesterday morning'],
            correctIndex: 1,
            explanation: '"Nice to meet you too!" — стандартный и дружелюбный ответ.'
          }
        ]
      },
      {
        id: 'les-2',
        unitId: 'unit-1',
        title: 'Verb "To Be" & Pronouns',
        titleRu: 'Глагол To Be и местоимения',
        icon: '📖',
        level: 'A1',
        estimatedMinutes: 4,
        xpReward: 25,
        descriptionRu: 'Основа основ английского: I am, you are, he/she is.',
        descriptionEn: 'The core backbone of English sentences.',
        steps: [
          {
            type: 'grammar',
            title: 'Правило глагола To Be',
            rule: 'В настоящем времени to be имеет 3 формы: I am, You/We/They are, He/She/It is.',
            example: 'I am a student. She is a developer. They are ready.'
          },
          {
            type: 'quiz',
            title: 'Мини-проверка',
            question: 'Выберите правильный вариант: "She ___ learning English."',
            options: ['are', 'is', 'am', 'be'],
            correctIndex: 1,
            explanation: 'Для he / she / it всегда используется форма "is".'
          }
        ]
      },
      {
        id: 'les-3',
        unitId: 'unit-1',
        title: 'Ordering at a Cafe',
        titleRu: 'Заказ в кофейне',
        icon: '☕',
        level: 'A1',
        estimatedMinutes: 4,
        xpReward: 25,
        descriptionRu: 'Как уверенно заказать кофе и перекусить.',
        descriptionEn: 'Order coffee and snacks like a native speaker.',
        steps: [
          {
            type: 'phrase',
            title: 'Вежливый заказ',
            phrase: 'I would like a medium cappuccino, please',
            pronunciation: '/aɪ wʊd laɪk.../',
            translation: 'Я бы хотел средний капучино, пожалуйста',
            example: 'I would like an oat cappuccino and a croissant, please.'
          },
          {
            type: 'quiz',
            title: 'Вопрос по заказу',
            question: 'Как спросить: "Могу ли я оплатить картой?"',
            options: ['Where is money?', 'Can I pay by card?', 'I take card please', 'Pay card now?'],
            correctIndex: 1,
            explanation: '"Can I pay by card?" — самая естественная фраза в любом кафе или магазине.'
          }
        ]
      },
      {
        id: 'les-4',
        unitId: 'unit-1',
        title: 'Checkpoint: Unit 1 Test',
        titleRu: 'Чекпоинт: Тест Раздела 1',
        icon: '🏆',
        level: 'A1',
        estimatedMinutes: 5,
        xpReward: 35,
        descriptionRu: 'Закрепите успехи и получите первую награду!',
        descriptionEn: 'Review what you learned and earn bonus rewards.',
        steps: [
          {
            type: 'quiz',
            title: 'Вопрос 1 из 3',
            question: 'We ___ happy to meet our new colleagues.',
            options: ['is', 'are', 'am', 'be'],
            correctIndex: 1,
            explanation: 'Местоимение "we" согласуется с формой "are".'
          },
          {
            type: 'quiz',
            title: 'Вопрос 2 из 3',
            question: 'Что означает фраза "How is it going?"',
            options: ['Куда ты идешь?', 'Как дела?', 'Который час?', 'Кто это?'],
            correctIndex: 1,
            explanation: '"How is it going?" = "Как дела?".'
          },
          {
            type: 'quiz',
            title: 'Вопрос 3 из 3',
            question: 'Как вежливо попросить воду?',
            options: ['Water now!', 'I want water fast', 'Could I have some water, please?', 'Give water'],
            correctIndex: 2,
            explanation: '"Could I have..., please?" — идеальная вежливая форма.'
          }
        ]
      }
    ]
  },
  {
    id: 'unit-2',
    number: 2,
    titleRu: 'Раздел 2: Повседневная жизнь и время',
    titleEn: 'Unit 2: Daily Life & Routine',
    level: 'A1',
    descriptionRu: 'Расскажите о своем дне, привычках и расписании.',
    descriptionEn: 'Talk about your day, hobbies, and habits with confidence.',
    color: '#3b82f6',
    lessons: [
      {
        id: 'les-5',
        unitId: 'unit-2',
        title: 'Daily Routine Phrases',
        titleRu: 'Распорядок дня',
        icon: '⏰',
        level: 'A1',
        estimatedMinutes: 4,
        xpReward: 25,
        descriptionRu: 'Утро, подъем, дела и вечерний отдых.',
        descriptionEn: 'Morning alarm, daily tasks, and winding down.',
        steps: [
          {
            type: 'phrase',
            title: 'Фраза дня',
            phrase: 'get used to',
            pronunciation: '/ɡɛt juːst tuː/',
            translation: 'привыкать к чему-то',
            example: 'It took me two weeks to get used to waking up at 7 AM.'
          },
          {
            type: 'quiz',
            title: 'Проверка',
            question: 'Выберите правильный предлог: "I wake up ___ 7:00 AM."',
            options: ['in', 'on', 'at', 'by'],
            correctIndex: 2,
            explanation: 'С точным временем всегда используется предлог "at" (at 7 AM, at noon).'
          }
        ]
      },
      {
        id: 'les-6',
        unitId: 'unit-2',
        title: 'Present Simple vs Continuous',
        titleRu: 'Привычки и текущие действия',
        icon: '⚡',
        level: 'A2',
        estimatedMinutes: 4,
        xpReward: 25,
        descriptionRu: 'Разница между "делаю обычно" и "делаю прямо сейчас".',
        descriptionEn: 'Regular actions versus actions happening right now.',
        steps: [
          {
            type: 'grammar',
            title: 'Разница времен',
            rule: 'Present Simple (I study every day) — для регулярных действий. Present Continuous (I am studying right now) — для момента речи.',
            example: 'I usually drink tea, but right now I am drinking coffee.'
          },
          {
            type: 'quiz',
            title: 'Практика',
            question: '"Listen! Someone ___ the piano."',
            options: ['play', 'plays', 'is playing', 'played'],
            correctIndex: 2,
            explanation: 'Слово "Listen!" указывает на действие прямо сейчас -> is playing.'
          }
        ]
      },
      {
        id: 'les-7',
        unitId: 'unit-2',
        title: 'Checkpoint: Routine Mastery',
        titleRu: 'Чекпоинт Раздела 2',
        icon: '🏆',
        level: 'A2',
        estimatedMinutes: 5,
        xpReward: 35,
        descriptionRu: 'Закрепите тему и перейдите к разговору о работе!',
        descriptionEn: 'Test your progress and unlock the work unit.',
        steps: [
          {
            type: 'quiz',
            title: 'Вопрос 1',
            question: 'He ___ English every single day.',
            options: ['study', 'studies', 'is study', 'studying'],
            correctIndex: 1,
            explanation: 'Для he / she в Present Simple добавляется окончание -s/-es: studies.'
          },
          {
            type: 'quiz',
            title: 'Вопрос 2',
            question: 'Что означает: "I need to take a break"?',
            options: ['Мне нужно сломать это', 'Мне нужно сделать перерыв', 'Я ухожу навсегда', 'Я спешу'],
            correctIndex: 1,
            explanation: '"Take a break" = сделать короткий перерыв / отдохнуть.'
          }
        ]
      }
    ]
  },
  {
    id: 'unit-3',
    number: 3,
    titleRu: 'Раздел 3: Работа, IT и Карьера',
    titleEn: 'Unit 3: Work, IT & Career',
    level: 'A2',
    descriptionRu: 'Совещания, проекты, переписка с коллегами и дедлайны.',
    descriptionEn: 'Meetings, project discussions, sprint updates, and deadlines.',
    color: '#8b5cf6',
    lessons: [
      {
        id: 'les-8',
        unitId: 'unit-3',
        title: 'Meeting & Standup Vocabulary',
        titleRu: 'Митинги и стендапы',
        icon: '💻',
        level: 'A2',
        estimatedMinutes: 4,
        xpReward: 25,
        descriptionRu: 'Как отвечать на "What did you work on yesterday?".',
        descriptionEn: 'Essential language for software teams and modern offices.',
        steps: [
          {
            type: 'phrase',
            title: 'Офисная фраза',
            phrase: 'on the same page',
            pronunciation: '/ɒn ðə seɪm peɪdʒ/',
            translation: 'быть на одной волне, одинаково понимать ситуацию',
            example: 'Let us have a quick sync to make sure we are on the same page.'
          },
          {
            type: 'phrase',
            title: 'Рабочая фраза',
            phrase: 'touch base with',
            pronunciation: '/tʌtʃ beɪs wɪð/',
            translation: 'кратко связаться, созвониться',
            example: 'I will touch base with you after the client call.'
          },
          {
            type: 'quiz',
            title: 'Тест по контексту',
            question: 'Тимлид спрашивает: "Are you blocked by anything today?". Что это значит?',
            options: ['Кто заблокировал твой телефон?', 'Есть ли у тебя блокеры / проблемы в работе?', 'Ты идешь на обед?', 'Какой твой пароль?'],
            correctIndex: 1,
            explanation: '"Are you blocked?" — есть ли препятствия, мешающие выполнить задачу.'
          }
        ]
      },
      {
        id: 'les-9',
        unitId: 'unit-3',
        title: 'Past Simple & Project Updates',
        titleRu: 'Прошедшее время в проектах',
        icon: '📊',
        level: 'A2',
        estimatedMinutes: 4,
        xpReward: 25,
        descriptionRu: 'Как говорить о том, что было сделано вчера.',
        descriptionEn: 'Reporting completed work accurately in English.',
        steps: [
          {
            type: 'grammar',
            title: 'Past Simple',
            rule: 'Правильные глаголы получают окончание -ed (deploy -> deployed, finish -> finished). Неправильные имеют свою форму (write -> wrote, find -> found).',
            example: 'Yesterday I deployed a hotfix and fixed the login bug.'
          },
          {
            type: 'quiz',
            title: 'Проверка формы',
            question: '"Yesterday Dan ___ the problem in the code."',
            options: ['find', 'finded', 'found', 'finding'],
            correctIndex: 2,
            explanation: 'Вторая форма неправильного глагола find — found.'
          }
        ]
      },
      {
        id: 'les-10',
        unitId: 'unit-3',
        title: 'Unit 3 Checkpoint & Badge',
        titleRu: 'Чекпоинт Раздела 3',
        icon: '🏆',
        level: 'A2',
        estimatedMinutes: 5,
        xpReward: 35,
        descriptionRu: 'Откройте путь к уровню B1!',
        descriptionEn: 'Prove your A2 workplace mastery.',
        steps: [
          {
            type: 'quiz',
            title: 'Вопрос 1',
            question: 'We need to meet the ___ before Friday.',
            options: ['deadline', 'deadlock', 'lifetime', 'finishline'],
            correctIndex: 0,
            explanation: '"Meet the deadline" — уложиться в срок / дедлайн.'
          },
          {
            type: 'quiz',
            title: 'Вопрос 2',
            question: 'What does "figure out" mean in "I will figure out the issue"?',
            options: ['Забыть проблему', 'Разобраться / найти решение', 'Нарисовать фигуру', 'Удалить код'],
            correctIndex: 1,
            explanation: '"Figure out" = разобраться, понять, выяснить.'
          }
        ]
      }
    ]
  },
  {
    id: 'unit-4',
    number: 4,
    titleRu: 'Раздел 4: Уверенная речь и уровень B1',
    titleEn: 'Unit 4: Path to B1 Fluency',
    level: 'B1',
    descriptionRu: 'Выражение своего мнения, сложные мысли и беглая речь.',
    descriptionEn: 'Expressing nuanced opinions and conversational confidence.',
    color: '#ec4899',
    lessons: [
      {
        id: 'les-11',
        unitId: 'unit-4',
        title: 'Expressing Opinions & Debating',
        titleRu: 'Выражение мнения и дискуссии',
        icon: '🎙️',
        level: 'B1',
        estimatedMinutes: 5,
        xpReward: 30,
        descriptionRu: 'Как звучать убедительно и естественно.',
        descriptionEn: 'Speak convincingly without searching for words.',
        steps: [
          {
            type: 'phrase',
            title: 'Вводные конструкции',
            phrase: 'as far as I am concerned',
            pronunciation: '/æz fɑːr æz aɪ æm kənˈsɜːrnd/',
            translation: 'насколько я могу судить / что касается меня',
            example: 'As far as I am concerned, remote work offers higher productivity.'
          },
          {
            type: 'quiz',
            title: 'Проверка B1',
            question: 'Какая фраза выражает вежливое несогласие?',
            options: ['You are wrong!', 'I see your point, but consider another side.', 'Stop speaking', 'No way never'],
            correctIndex: 1,
            explanation: '"I see your point, but..." — признак зрелого владения языком на уровне B1.'
          }
        ]
      },
      {
        id: 'les-12',
        unitId: 'unit-4',
        title: 'Mastery Exam A1 → B1',
        titleRu: 'Итоговый экзамен A1 → B1',
        icon: '🎓',
        level: 'B1',
        estimatedMinutes: 6,
        xpReward: 50,
        descriptionRu: 'Финальный рубеж: поздравляем с достижением уровня B1!',
        descriptionEn: 'Your ultimate milestone from A1 to confident B1.',
        steps: [
          {
            type: 'quiz',
            title: 'Финальный вопрос 1',
            question: 'If I ___ more free time, I would travel around the world.',
            options: ['have', 'had', 'will have', 'having'],
            correctIndex: 1,
            explanation: 'В Second Conditional (нереальное условие в настоящем) используется Past Simple: If I had.'
          },
          {
            type: 'quiz',
            title: 'Финальный вопрос 2',
            question: 'I have been studying English ___ six months.',
            options: ['since', 'for', 'during', 'from'],
            correctIndex: 1,
            explanation: 'С периодом времени ("six months") используется предлог "for".'
          }
        ]
      }
    ]
  }
];
