import { GrammarLesson } from '../types/lesson';

export const INITIAL_GRAMMAR_LESSONS: GrammarLesson[] = [
  // A1 LESSONS
  {
    id: 'g-to-be',
    title: 'Verb "to be"',
    level: 'A1',
    category: 'Foundations',
    description: 'The foundation of English: am, is, are, was, were.',
    explanation: 'The verb "to be" connects a subject with its state, identity, nationality, or location. Unlike other English verbs, it changes form depending on the subject pronoun.',
    rules: [
      'I am (I\'m)',
      'He / She / It is (He\'s / She\'s / It\'s)',
      'We / You / They are (We\'re / You\'re / They\'re)',
      'Negatives add "not": I am not, He is not (isn\'t), We are not (aren\'t)',
      'Questions invert subject and verb: Are you ready? Is he at home?'
    ],
    examples: [
      { en: 'I am a software engineering student.', ru: 'Я студент программной инженерии.' },
      { en: 'She is from Almaty.', ru: 'Она из Алматы.' },
      { en: 'They are very friendly teammates.', ru: 'Они очень дружелюбные коллеги.' },
      { en: 'Are you ready to practice?', ru: 'Ты готов тренироваться?' }
    ],
    commonMistakes: [
      { wrong: 'I have 22 years old.', right: 'I am 22 years old.', why: 'In English, age is expressed with "to be", not "have".' },
      { wrong: 'She are very happy.', right: 'She is very happy.', why: '"She" is 3rd person singular and requires "is".' }
    ],
    miniExercise: {
      prompt: 'Complete the sentence: "My brother and I _____ interested in learning web development."',
      options: ['am', 'is', 'are', 'be'],
      correctIndex: 2,
      explanation: '"My brother and I" equals "we", so the correct verb form is "are".'
    },
    completed: false
  },
  {
    id: 'g-personal-pronouns',
    title: 'Personal Pronouns',
    level: 'A1',
    category: 'Foundations',
    description: 'Subject and object pronouns: I/me, he/him, they/them.',
    explanation: 'Personal pronouns replace nouns. Subject pronouns perform the action (before the verb), while object pronouns receive the action (after verbs or prepositions).',
    rules: [
      'Subject: I, you, he, she, it, we, they',
      'Object: me, you, him, her, it, us, them',
      'Use subject before verb: He called yesterday.',
      'Use object after verb or preposition: She called him. Send it to me.'
    ],
    examples: [
      { en: 'We invited them to our presentation.', ru: 'Мы пригласили их на нашу презентацию.' },
      { en: 'Can you help me with this task?', ru: 'Можешь помочь мне с этой задачей?' },
      { en: 'She told us about the new schedule.', ru: 'Она рассказала нам о новом расписании.' }
    ],
    commonMistakes: [
      { wrong: 'Him and me went to university.', right: 'He and I went to university.', why: 'They are subjects of the verb "went", so subject pronouns are required.' }
    ],
    miniExercise: {
      prompt: 'Choose the correct pronoun: "Our teacher gave _____ extra time to finish the essay."',
      options: ['we', 'us', 'they', 'our'],
      correctIndex: 1,
      explanation: 'The pronoun comes after the verb "gave", so we use the object pronoun "us".'
    },
    completed: false
  },
  {
    id: 'g-present-simple',
    title: 'Present Simple',
    level: 'A1',
    category: 'Tenses',
    description: 'Habits, regular routines, facts, and permanent situations.',
    explanation: 'Present Simple is used for things that happen regularly, habits, universal truths, and long-term facts. Remember the crucial -s / -es ending for he/she/it!',
    rules: [
      'Affirmative: I/you/we/they + verb (base form)',
      '3rd person singular: he/she/it + verb + -s / -es (works, watches, studies)',
      'Negative: do not (don\'t) / does not (doesn\'t) + base verb',
      'Questions: Do / Does + subject + base verb?'
    ],
    examples: [
      { en: 'I study English every single morning.', ru: 'Я учу английский каждое утро.' },
      { en: 'He writes clean and maintainable code.', ru: 'Он пишет чистый и поддерживаемый код.' },
      { en: 'Do you work on weekends?', ru: 'Ты работаешь по выходным?' }
    ],
    commonMistakes: [
      { wrong: 'He don\'t know the answer.', right: 'He doesn\'t know the answer.', why: '3rd person singular takes "does not / doesn\'t".' },
      { wrong: 'She likes speak English.', right: 'She likes to speak English.', why: '"Like" requires an infinitive "to speak" or gerund "speaking".' }
    ],
    miniExercise: {
      prompt: 'Select the correct sentence:',
      options: [
        'My friend study IT at university.',
        'My friend studies IT at university.',
        'My friend studying IT at university.',
        'My friend do study IT at university.'
      ],
      correctIndex: 1,
      explanation: 'For singular subjects (he/she/my friend), verbs ending in consonant + y change to -ies (study -> studies).'
    },
    completed: false
  },
  {
    id: 'g-present-continuous',
    title: 'Present Continuous',
    level: 'A1',
    category: 'Tenses',
    description: 'Actions happening right now or temporary situations.',
    explanation: 'Formed using am/is/are + verb-ing. Used for actions in progress at the moment of speaking or temporary trends.',
    rules: [
      'Form: Subject + am/is/are + verb + -ing',
      'Negative: Subject + am/is/are + not + verb + -ing',
      'Questions: Am/Is/Are + subject + verb + -ing?',
      'Stative verbs (know, want, like, understand) are rarely used in continuous!'
    ],
    examples: [
      { en: 'I am reading an interesting article right now.', ru: 'Я читаю интересную статью прямо сейчас.' },
      { en: 'They are preparing for the upcoming exams.', ru: 'Они готовятся к предстоящим экзаменам.' },
      { en: 'Are you listening to me?', ru: 'Ты меня слушаешь?' }
    ],
    commonMistakes: [
      { wrong: 'I am knowing what you mean.', right: 'I know what you mean.', why: '"Know" is a state/mental verb and is not used in continuous forms.' }
    ],
    miniExercise: {
      prompt: 'Fill in the blank: "Listen! Somebody _____ at the door."',
      options: ['knocks', 'is knocking', 'are knocking', 'knocked'],
      correctIndex: 1,
      explanation: '"Listen!" signals an action occurring right now in this exact moment, so "is knocking" is required.'
    },
    completed: false
  },
  {
    id: 'g-past-simple',
    title: 'Past Simple',
    level: 'A1',
    category: 'Tenses',
    description: 'Completed actions in the past with specific time reference.',
    explanation: 'Used for actions that started and finished at a definite time in the past. Regular verbs add -ed, while irregular verbs have distinct second forms (go -> went, see -> saw).',
    rules: [
      'Regular verbs: base + -ed (worked, decided, waited)',
      'Irregular verbs: 2nd form (bought, wrote, spoke, felt)',
      'Negative: did not (didn\'t) + base verb (He didn\'t come)',
      'Questions: Did + subject + base verb? (Did you call him?)'
    ],
    examples: [
      { en: 'I finished my university project yesterday.', ru: 'Я закончил свой университетский проект вчера.' },
      { en: 'She bought a new laptop last Friday.', ru: 'Она купила новый ноутбук в прошлую пятницу.' },
      { en: 'Did you make a decision?', ru: 'Ты принял решение?' }
    ],
    commonMistakes: [
      { wrong: 'I didn\'t went to class.', right: 'I didn\'t go to class.', why: 'After the auxiliary "didn\'t", always use the base form of the verb.' }
    ],
    miniExercise: {
      prompt: 'Which sentence is grammatically correct?',
      options: [
        'Did you saw the new notification?',
        'Did you see the new notification?',
        'Did you seen the new notification?',
        'Do you saw the new notification?'
      ],
      correctIndex: 1,
      explanation: 'In past questions, "Did" already carries the past tense, so the main verb stays in base form: "Did you see".'
    },
    completed: false
  },
  {
    id: 'g-future-will',
    title: 'Future with "will"',
    level: 'A1',
    category: 'Tenses',
    description: 'Spontaneous decisions, promises, and predictions.',
    explanation: 'We use "will" + bare infinitive when making quick decisions in the moment, making promises, offers, or predicting what we think will happen.',
    rules: [
      'Affirmative: Subject + will (\'ll) + base verb',
      'Negative: Subject + will not (won\'t) + base verb',
      'Questions: Will + subject + base verb?',
      'No -s for 3rd person singular!'
    ],
    examples: [
      { en: 'I will help you with your speaking practice.', ru: 'Я помогу тебе с разговорной практикой.' },
      { en: 'I think it will rain this evening.', ru: 'Думаю, сегодня вечером пойдет дождь.' },
      { en: 'Don\'t worry, I won\'t forget.', ru: 'Не волнуйся, я не забуду.' }
    ],
    commonMistakes: [
      { wrong: 'I will to call you later.', right: 'I will call you later.', why: 'Modal verbs like "will" are followed by bare infinitive without "to".' }
    ],
    miniExercise: {
      prompt: 'Complete: "The phone is ringing. I _____ it!"',
      options: ['answer', 'will answer', 'am answering', 'answered'],
      correctIndex: 1,
      explanation: 'A spontaneous decision made at the moment of speech uses "will answer".'
    },
    completed: false
  },
  {
    id: 'g-can-cant',
    title: 'can / can\'t',
    level: 'A1',
    category: 'Modals',
    description: 'Expressing ability, possibility, and polite permission.',
    explanation: '"Can" is a modal auxiliary verb. It never changes form (no -s, no -ed) and is followed by the bare infinitive of the verb.',
    rules: [
      'Ability: I can speak two languages.',
      'Negative: cannot / can\'t (I can\'t hear you clearly).',
      'Questions: Can you explain this rule again?',
      'Always follow with bare verb (never "can to go")'
    ],
    examples: [
      { en: 'She can write complex SQL queries.', ru: 'Она умеет писать сложные SQL-запросы.' },
      { en: 'I can\'t attend the meeting at 4 PM.', ru: 'Я не могу присутствовать на встрече в 16:00.' },
      { en: 'Can you give me an example?', ru: 'Можешь привести мне пример?' }
    ],
    commonMistakes: [
      { wrong: 'He cans speak German.', right: 'He can speak German.', why: '"Can" never takes an -s ending.' }
    ],
    miniExercise: {
      prompt: 'Choose the correct form: "_____ you help me figure out this problem?"',
      options: ['Are', 'Can', 'Do', 'Have'],
      correctIndex: 1,
      explanation: '"Can you help me" is the standard way to request assistance or ability.'
    },
    completed: false
  },

  // A2 LESSONS
  {
    id: 'g-present-perfect',
    title: 'Present Perfect',
    level: 'A2',
    category: 'Tenses',
    description: 'Life experiences and past actions with results in the present.',
    explanation: 'Formed with have/has + past participle (3rd form). Connects past events with the present moment, without giving an exact time reference.',
    rules: [
      'Form: have / has + past participle (V3)',
      'Signal words: already, yet, ever, never, just, recently, since, for',
      'Use for life experiences: Have you ever visited London?',
      'Use for actions with present consequence: I have lost my keys (I don\'t have them now).'
    ],
    examples: [
      { en: 'I have already learned 30 new phrases this week.', ru: 'Я уже выучил 30 новых фраз на этой неделе.' },
      { en: 'She has worked in tech for over five years.', ru: 'Она работает в технологической сфере уже более пяти лет.' },
      { en: 'Have you ever spoken with a native speaker?', ru: 'Ты когда-нибудь разговаривал с носителем языка?' }
    ],
    commonMistakes: [
      { wrong: 'I have seen him yesterday.', right: 'I saw him yesterday.', why: 'When a specific past time is stated (yesterday, in 2021), use Past Simple, not Present Perfect.' }
    ],
    miniExercise: {
      prompt: 'Fill in the blank: "We _____ finished our daily plan yet."',
      options: ['haven\'t', 'hasn\'t', 'didn\'t', 'aren\'t'],
      correctIndex: 0,
      explanation: 'With "We" and the signal word "yet" in a negative sentence, we use "haven\'t finished".'
    },
    completed: false
  },
  {
    id: 'g-comparatives-superlatives',
    title: 'Comparatives & Superlatives',
    level: 'A2',
    category: 'Adjectives',
    description: 'Comparing people, things, and ideas (-er/more, -est/most).',
    explanation: 'Short adjectives add -er/-est (faster, fastest). Long adjectives (2+ syllables) use more/most (more interesting, most interesting). Irregular forms: good -> better -> best, bad -> worse -> worst.',
    rules: [
      '1 syllable: fast -> faster than -> the fastest',
      'Ends in -y: easy -> easier than -> the easiest',
      '2+ syllables: more expensive than -> the most expensive',
      'Always use "the" before superlatives: the best decision'
    ],
    examples: [
      { en: 'Consistent daily study is better than cramming once a week.', ru: 'Регулярные ежедневные занятия лучше зубрежки раз в неделю.' },
      { en: 'This is the most useful grammar explanation I have read.', ru: 'Это самое полезное грамматическое объяснение, что я читал.' }
    ],
    commonMistakes: [
      { wrong: 'More better', right: 'Better', why: 'Never double-mark comparatives (never say "more bigger" or "more better").' }
    ],
    miniExercise: {
      prompt: 'Select the correct sentence:',
      options: [
        'Speaking is more easier than writing.',
        'Speaking is easier than writing.',
        'Speaking is easiest than writing.',
        'Speaking is more easy than writing.'
      ],
      correctIndex: 1,
      explanation: 'Two-syllable adjectives ending in -y drop -y and add -ier (easier than).'
    },
    completed: false
  },
  {
    id: 'g-first-conditional',
    title: 'First Conditional',
    level: 'A2',
    category: 'Conditionals',
    description: 'Real and possible future situations and their probable results.',
    explanation: 'Used to talk about things that might realistically happen in the future if a certain condition is met. Structure: If + Present Simple, ... will + bare verb.',
    rules: [
      'If clause: Present Simple (If it rains...)',
      'Main clause: will / won\'t + base verb (...we will stay home)',
      'NEVER put "will" inside the "if" clause! (If you will study -> INCORRECT)'
    ],
    examples: [
      { en: 'If you practice for 20 minutes every day, you will make fast progress.', ru: 'Если ты будешь тренироваться по 20 минут каждый день, ты добьешься быстрого прогресса.' },
      { en: 'If I pass my B1 exam, I will apply for the international internship.', ru: 'Если я сдам экзамен B1, я подам заявку на международную стажировку.' }
    ],
    commonMistakes: [
      { wrong: 'If it will rain tomorrow, I will take an umbrella.', right: 'If it rains tomorrow, I will take an umbrella.', why: 'Never use "will" directly after "if" in conditional clauses.' }
    ],
    miniExercise: {
      prompt: 'Complete: "If you _____ hard, you _____ the exam."',
      options: [
        'study / will pass',
        'will study / pass',
        'studies / pass',
        'studied / will pass'
      ],
      correctIndex: 0,
      explanation: 'Condition takes Present Simple ("study"), result takes future with will ("will pass").'
    },
    completed: false
  },

  // B1 LESSONS
  {
    id: 'g-second-conditional',
    title: 'Second Conditional',
    level: 'B1',
    category: 'Conditionals',
    description: 'Hypothetical, imaginary, or unlikely situations in the present/future.',
    explanation: 'Used to imagine dreams, unreal situations, or give advice ("If I were you..."). Structure: If + Past Simple, ... would + bare infinitive.',
    rules: [
      'If clause: Past Simple (If I had more free time...)',
      'Main clause: would / could / might + base verb (...I would read more books)',
      'For "to be", formal English uses "were" for all subjects: If I were you...'
    ],
    examples: [
      { en: 'If I spoke fluent English today, I would apply for remote jobs worldwide.', ru: 'Если бы я свободно говорил по-английски сегодня, я бы подавал на удаленную работу по всему миру.' },
      { en: 'If I were you, I would focus on common phrasal verbs first.', ru: 'На твоем месте я бы сначала сосредоточился на распространенных фразовых глаголах.' }
    ],
    commonMistakes: [
      { wrong: 'If I would have money, I would travel.', right: 'If I had money, I would travel.', why: 'Do not use "would" in the if-clause.' }
    ],
    miniExercise: {
      prompt: 'Choose the correct second conditional sentence:',
      options: [
        'If I had more time, I would learn a third language.',
        'If I have more time, I would learn a third language.',
        'If I had more time, I will learn a third language.',
        'If I would have time, I learned a third language.'
      ],
      correctIndex: 0,
      explanation: 'Second conditional pairs Past Simple ("had") with "would" + base verb ("would learn").'
    },
    completed: false
  },
  {
    id: 'g-passive-voice',
    title: 'Passive Voice',
    level: 'B1',
    category: 'Structure',
    description: 'Focusing on the action and receiver rather than the doer.',
    explanation: 'Passive voice is used when the person doing the action is unknown, unimportant, or obvious from context. Structure: Subject + to be (in appropriate tense) + Past Participle (V3).',
    rules: [
      'Present Simple Passive: am/is/are + V3 (English is spoken here)',
      'Past Simple Passive: was/were + V3 (The bug was fixed yesterday)',
      'Present Perfect Passive: has/have been + V3 (The update has been deployed)',
      'Use "by + agent" only if the actor provides essential information.'
    ],
    examples: [
      { en: 'The new feature was released ahead of schedule.', ru: 'Новая функция была выпущена с опережением графика.' },
      { en: 'Millions of messages are sent every minute.', ru: 'Миллионы сообщений отправляются каждую минуту.' }
    ],
    commonMistakes: [
      { wrong: 'The file was delete by mistake.', right: 'The file was deleted by mistake.', why: 'Passive voice strictly requires the past participle (V3/ed).' }
    ],
    miniExercise: {
      prompt: 'Convert to passive: "They discovered a security flaw."',
      options: [
        'A security flaw was discovered.',
        'A security flaw has discovered.',
        'A security flaw is discovered.',
        'A security flaw were discovered.'
      ],
      correctIndex: 0,
      explanation: 'Past tense of singular "flaw" takes "was" + V3 "discovered".'
    },
    completed: false
  },
  {
    id: 'g-reported-speech',
    title: 'Reported Speech',
    level: 'B1',
    category: 'Communication',
    description: 'Reporting what someone else said without quotation marks.',
    explanation: 'When reporting what someone said in the past, verb tenses shift one step back: Present Simple -> Past Simple, Present Continuous -> Past Continuous, will -> would, can -> could.',
    rules: [
      'Present Simple -> Past Simple: "I am ready" -> He said he was ready.',
      'Present Continuous -> Past Continuous: "I am studying" -> She said she was studying.',
      'will -> would: "I will call" -> He said he would call.',
      'Pronouns and time words change: "tomorrow" -> the next day, "here" -> there.'
    ],
    examples: [
      { en: 'He told me that he was preparing for the IELTS exam.', ru: 'Он сказал мне, что готовится к экзамену IELTS.' },
      { en: 'She explained that the results would be available on Monday.', ru: 'Она объяснила, что результаты будут доступны в понедельник.' }
    ],
    commonMistakes: [
      { wrong: 'He said me that he was tired.', right: 'He told me that he was tired. / He said that he was tired.', why: '"Say" does not take a personal object without "to", whereas "tell" requires a personal object (tell someone).' }
    ],
    miniExercise: {
      prompt: 'Report this: "I will join the call soon," said Sarah.',
      options: [
        'Sarah said she will join the call soon.',
        'Sarah said she would join the call soon.',
        'Sarah told that she join the call soon.',
        'Sarah said she joined the call soon.'
      ],
      correctIndex: 1,
      explanation: 'In past reported speech, "will" changes into "would".'
    },
    completed: false
  },
  {
    id: 'g-relative-clauses',
    title: 'Relative Clauses (who, which, that)',
    level: 'B1',
    category: 'Complex Sentences',
    description: 'Connecting ideas and defining nouns smoothly.',
    explanation: 'Relative clauses give extra information about a noun without starting a new sentence. Use "who" for people, "which" for things, "that" for people or things, "where" for places.',
    rules: [
      'People: who / that (The developer who built this app)',
      'Things: which / that (The book which I bought)',
      'Places: where (The university where I study)',
      'Possession: whose (The student whose project won first place)'
    ],
    examples: [
      { en: 'This is the framework that made our development five times faster.', ru: 'Это фреймворк, который ускорил нашу разработку в пять раз.' },
      { en: 'Meet Alex, the mentor who helped me reach B1 level.', ru: 'Познакомьтесь с Алексом, наставником, который помог мне достичь уровня B1.' }
    ],
    commonMistakes: [
      { wrong: 'The programmer which fixed the issue.', right: 'The programmer who fixed the issue.', why: 'Use "who" for human beings, not "which".' }
    ],
    miniExercise: {
      prompt: 'Fill in: "The city _____ I was born is famous for its mountains."',
      options: ['which', 'where', 'who', 'whose'],
      correctIndex: 1,
      explanation: 'When referring to a location in which something happened, use "where".'
    },
    completed: false
  }
];
