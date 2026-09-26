import { ReadingArticle } from '../types/lesson';

export const INITIAL_READING_ARTICLES: ReadingArticle[] = [
  {
    id: 'r-a1-morning-routine',
    title: 'A Productive Morning Routine',
    level: 'A1',
    category: 'Daily Life',
    readingTime: 3,
    text: `Alex is a computer science student. Every morning, he wakes up at 7:00 AM. He drinks a large glass of warm water and takes a short 10-minute walk in the fresh air. 

At 7:30 AM, Alex prepares a simple breakfast: oatmeal with fruit and hot black tea. While having breakfast, he avoids checking his smartphone notifications. Instead, he listens to a 10-minute English podcast for beginners.

Before leaving for his university lectures at 8:30 AM, Alex reviews five English phrases on his phone. He believes that small, consistent actions every day are much better than studying for five hours once a week. Because of this habit, he feels energetic, focused, and ready to learn.`,
    vocabularyHints: [
      { word: 'routine', meaning: 'регулярный распорядок / привычный порядок' },
      { word: 'avoids', meaning: 'избегает' },
      { word: 'notifications', meaning: 'уведомления' },
      { word: 'consistent', meaning: 'постоянный, систематический' },
      { word: 'energetic', meaning: 'энергичный' }
    ],
    questions: [
      {
        id: 'q1',
        question: 'What time does Alex wake up every morning?',
        options: ['6:00 AM', '7:00 AM', '8:00 AM', '8:30 AM'],
        correctIndex: 1,
        explanation: 'The text states: "Every morning, he wakes up at 7:00 AM."'
      },
      {
        id: 'q2',
        question: 'What does Alex avoid doing during breakfast?',
        options: ['Drinking tea', 'Listening to audio', 'Checking smartphone notifications', 'Eating fruits'],
        correctIndex: 2,
        explanation: 'The passage explicitly says: "While having breakfast, he avoids checking his smartphone notifications."'
      },
      {
        id: 'q3',
        question: 'What does Alex listen to while eating breakfast?',
        options: ['Rock music', 'English podcast for beginners', 'University news', 'Audiobook in French'],
        correctIndex: 1,
        explanation: 'He listens to a 10-minute English podcast for beginners.'
      },
      {
        id: 'q4',
        question: 'How many English phrases does Alex review before leaving?',
        options: ['Two', 'Three', 'Five', 'Twenty'],
        correctIndex: 2,
        explanation: 'The text mentions he reviews five English phrases.'
      },
      {
        id: 'q5',
        question: 'What philosophy does Alex believe in?',
        options: [
          'Studying only before exams',
          'Small consistent actions every day are better than cramming',
          'Drinking coffee all day long',
          'Never studying in the morning'
        ],
        correctIndex: 1,
        explanation: 'He believes small, consistent actions every day are much better than studying for five hours once a week.'
      }
    ]
  },
  {
    id: 'r-a1-traveling-by-train',
    title: 'First Trip by High-Speed Train',
    level: 'A1',
    category: 'Travel',
    readingTime: 3,
    text: `Elena loves traveling. Last weekend, she took a modern high-speed train from Almaty to Astana. It was her very first time traveling alone.

Elena arrived at the railway station forty minutes before departure. She showed her electronic ticket on her mobile phone and boarded car number four. Her seat was next to a large panoramic window. 

During the journey, Elena watched the wide, beautiful steppes of Kazakhstan. She brought a notebook and wrote down interesting English words she saw on signs and menus. The train had free Wi-Fi and electrical outlets, so she practiced English exercises on her tablet. 

After several hours, the train safely arrived in the capital. Elena was proud of herself for traveling independently.`,
    vocabularyHints: [
      { word: 'departure', meaning: 'отправление' },
      { word: 'boarded', meaning: 'села в поезд / зашла на борт' },
      { word: 'panoramic', meaning: 'панорамный' },
      { word: 'journey', meaning: 'поездка, путешествие' },
      { word: 'independently', meaning: 'самостоятельно' }
    ],
    questions: [
      {
        id: 'q1',
        question: 'Where did Elena travel from and to?',
        options: ['From London to Paris', 'From Almaty to Astana', 'From Astana to Shymkent', 'From Almaty to Tashkent'],
        correctIndex: 1,
        explanation: 'She took a train from Almaty to Astana.'
      },
      {
        id: 'q2',
        question: 'When did Elena arrive at the railway station?',
        options: ['5 minutes before', '40 minutes before departure', '2 hours late', 'The night before'],
        correctIndex: 1,
        explanation: 'The text says: "Elena arrived at the railway station forty minutes before departure."'
      },
      {
        id: 'q3',
        question: 'Where was her seat located?',
        options: ['Near the restaurant', 'Next to a large panoramic window', 'In the middle aisle', 'Next to the luggage rack'],
        correctIndex: 1,
        explanation: 'Her seat was next to a large panoramic window.'
      },
      {
        id: 'q4',
        question: 'What did Elena write down in her notebook?',
        options: ['Train recipes', 'Interesting English words from signs and menus', 'Math formulas', 'Phone numbers'],
        correctIndex: 1,
        explanation: 'She wrote down interesting English words she saw on signs and menus.'
      },
      {
        id: 'q5',
        question: 'How did Elena feel after arriving?',
        options: ['Angry and tired', 'Proud of traveling independently', 'Scared of big cities', 'Disappointed by the train'],
        correctIndex: 1,
        explanation: 'The text states Elena was proud of herself for traveling independently.'
      }
    ]
  },
  {
    id: 'r-a2-remote-work',
    title: 'The Shift to Remote Work and Digital Teams',
    level: 'A2',
    category: 'Work & IT',
    readingTime: 4,
    text: `Over the past few years, the way people work has transformed dramatically. Millions of software engineers, designers, and managers now work remotely from home offices or co-working spaces.

Working remotely offers significant advantages. Employees save hours every day because they do not have to commute through heavy city traffic. They can organize their schedules flexibly and spend more quality time with their families. 

However, remote work also brings unique challenges. The line between work hours and personal time can easily become blurred. People sometimes feel isolated or struggle to communicate effectively without seeing teammates in person.

To overcome these obstacles, successful remote teams establish clear communication guidelines. They use asynchronous messaging tools for daily updates and schedule short video check-ins to maintain social connection. For tech specialists, proficient English has become an absolute necessity, because international distributed teams share documentation, code reviews, and meetings in English.`,
    vocabularyHints: [
      { word: 'transformed', meaning: 'кардинально изменился' },
      { word: 'commute', meaning: 'ежедневная дорога на работу и обратно' },
      { word: 'blurred', meaning: 'размытый, нечеткий' },
      { word: 'isolated', meaning: 'изолированный, одинокий' },
      { word: 'asynchronous', meaning: 'асинхронный (без мгновенного ответа)' }
    ],
    questions: [
      {
        id: 'q1',
        question: 'What is one major benefit of working remotely mentioned in the text?',
        options: [
          'Employees receive free office lunches',
          'Employees save hours by not having to commute through traffic',
          'Employees never have to talk to anyone',
          'Companies give everyone new apartments'
        ],
        correctIndex: 1,
        explanation: 'The text says employees save hours every day because they do not commute.'
      },
      {
        id: 'q2',
        question: 'What is a common challenge of remote work?',
        options: [
          'Computers break more frequently',
          'The line between work hours and personal time becomes blurred',
          'Internet is unavailable at home',
          'Nobody is allowed to drink coffee'
        ],
        correctIndex: 1,
        explanation: 'The text mentions the line between work hours and personal time can easily become blurred.'
      },
      {
        id: 'q3',
        question: 'How do successful remote teams maintain social connection?',
        options: [
          'By meeting in another country every day',
          'By scheduling short video check-ins',
          'By calling each other at midnight',
          'By avoiding all messages'
        ],
        correctIndex: 1,
        explanation: 'They schedule short video check-ins to maintain social connection.'
      },
      {
        id: 'q4',
        question: 'Why is English crucial for tech specialists in remote companies?',
        options: [
          'It is required by law in every country',
          'International distributed teams share docs, code reviews, and calls in English',
          'English is the only language computers understand',
          'Because keyboards only type English'
        ],
        correctIndex: 1,
        explanation: 'International distributed teams share documentation, code reviews, and meetings in English.'
      },
      {
        id: 'q5',
        question: 'What kind of messaging tools do teams use for daily updates?',
        options: ['Telegraph', 'Asynchronous messaging tools', 'Handwritten letters', 'Fax machines'],
        correctIndex: 1,
        explanation: 'The text highlights that teams use asynchronous messaging tools for daily updates.'
      }
    ]
  },
  {
    id: 'r-a2-language-habits',
    title: 'How The Brain Builds Language Habits',
    level: 'A2',
    category: 'Education',
    readingTime: 4,
    text: `Many adult learners believe that children learn languages faster because their brains are magically superior. While children do have high neuroplasticity, modern cognitive research shows that adults possess powerful cognitive advantages: analytical reasoning, conceptual knowledge, and self-discipline.

The true secret to fluency is habit loop design: a cue, a routine, and a reward. If you wait until you "feel motivated" to study English, you will rarely maintain consistency. Motivation is an emotion that fluctuates based on stress, fatigue, and mood.

Instead, pair your language practice with an existing daily anchor. For example: "Right after I pour my morning coffee (cue), I will review five phrases for 10 minutes (routine), and then mark my daily streak on my calendar (reward)."

When you practice in short, focused bursts every single day, neural connections strengthen through spaced repetition. Over a few months, speaking and understanding English transforms from a stressful chore into a natural automatic habit.`,
    vocabularyHints: [
      { word: 'neuroplasticity', meaning: 'нейропластичность (способность мозга перестраиваться)' },
      { word: 'fluctuates', meaning: 'колеблется, меняется туда-обратно' },
      { word: 'anchor', meaning: 'якорь (привычное действие-триггер)' },
      { word: 'spaced repetition', meaning: 'интервальное повторение' },
      { word: 'chore', meaning: 'рутинная неприятная обязанность' }
    ],
    questions: [
      {
        id: 'q1',
        question: 'What cognitive advantages do adults possess according to modern research?',
        options: [
          'Larger heads and faster walking',
          'Analytical reasoning, conceptual knowledge, and self-discipline',
          'The ability to never sleep',
          'Immunity to mental fatigue'
        ],
        correctIndex: 1,
        explanation: 'The text lists analytical reasoning, conceptual knowledge, and self-discipline.'
      },
      {
        id: 'q2',
        question: 'Why is relying purely on motivation problematic?',
        options: [
          'Motivation is illegal',
          'Motivation fluctuates based on stress, fatigue, and mood',
          'Motivation makes you forget words',
          'Motivation takes years to appear'
        ],
        correctIndex: 1,
        explanation: 'Motivation fluctuates based on stress, fatigue, and mood, leading to inconsistency.'
      },
      {
        id: 'q3',
        question: 'What are the three parts of a habit loop?',
        options: [
          'Start, Middle, and Finish',
          'A cue, a routine, and a reward',
          'Reading, Writing, and Speaking',
          'Coffee, Tea, and Water'
        ],
        correctIndex: 1,
        explanation: 'The passage explicitly names: "a cue, a routine, and a reward."'
      },
      {
        id: 'q4',
        question: 'What is given as an example of a "cue"?',
        options: [
          'Going to sleep at 2 AM',
          'Pouring morning coffee',
          'Writing a final exam',
          'Buying an expensive dictionary'
        ],
        correctIndex: 1,
        explanation: '"Right after I pour my morning coffee (cue)..."'
      },
      {
        id: 'q5',
        question: 'What mechanism strengthens neural connections during daily study?',
        options: [
          'Spaced repetition in short, focused bursts',
          'Studying 10 hours without water',
          'Memorizing long wordlists alphabetically',
          'Watching movies without subtitles only'
        ],
        correctIndex: 0,
        explanation: 'The text notes neural connections strengthen through spaced repetition in short bursts.'
      }
    ]
  },
  {
    id: 'r-b1-artificial-intelligence',
    title: 'Artificial Intelligence and the Future of Learning',
    level: 'B1',
    category: 'Technology',
    readingTime: 5,
    text: `Artificial intelligence has sparked a profound revolution across modern pedagogy. Traditional language education was inherently constrained by fixed classroom curricula, where thirty students with different cognitive speeds, backgrounds, and personal interests were forced to progress at the exact same tempo.

Generative AI flips this paradigm on its head. Today, an intelligent adaptive platform can serve as a tireless, 24/7 personal tutor. If a learner arrives home exhausted after eight hours of university lectures, the system does not enforce an exhausting sixty-minute grammar test. Instead, it gauges the user\'s cognitive load, dynamically scales the lesson to twenty gentle minutes, and focuses on practical conversational phrases.

Furthermore, AI enables real-time personalized feedback that previously required expensive one-on-one human tutoring. When you draft an English paragraph or formulate a spoken response, the model can instantly pinpoint grammatical inaccuracies, suggest natural idiomatic alternatives, and explain the underlying reasoning.

Nevertheless, human agency remains paramount. Technology provides the optimal environment and personalized roadmap, but the genuine transformation from A1 to B1 happens through the learner\'s personal determination, curiosity, and steady daily commitment.`,
    vocabularyHints: [
      { word: 'profound revolution', meaning: 'глубокая революция / кардинальное изменение' },
      { word: 'constrained', meaning: 'ограниченный рамками' },
      { word: 'paradigm', meaning: 'парадигма, устоявшаяся модель' },
      { word: 'gauges', meaning: 'оценивает, измеряет' },
      { word: 'paramount', meaning: 'первостепенный, важнейший' }
    ],
    questions: [
      {
        id: 'q1',
        question: 'What was a primary constraint of traditional language education?',
        options: [
          'There were no pencils or paper',
          'Thirty students with different speeds and backgrounds had to follow the same tempo',
          'Languages were too difficult to write',
          'Students could only study on holidays'
        ],
        correctIndex: 1,
        explanation: 'Classrooms forced thirty students with diverse speeds and interests to move at identical tempo.'
      },
      {
        id: 'q2',
        question: 'How can an adaptive AI system assist an exhausted student?',
        options: [
          'By giving them a zero mark immediately',
          'By dynamically adjusting the session duration and focusing on gentle, practical practice',
          'By canceling the student account',
          'By forcing three hours of complex theory'
        ],
        correctIndex: 1,
        explanation: 'It gauges cognitive load, scales the lesson to 20 gentle minutes, and focuses on practical phrases.'
      },
      {
        id: 'q3',
        question: 'What high-value capability did one-on-one human tutoring provide that AI now democratizes?',
        options: [
          'Selling textbooks',
          'Real-time personalized feedback, error explanation, and natural alternatives',
          'Grading attendance sheets',
          'Giving physical certificates'
        ],
        correctIndex: 1,
        explanation: 'Instant personalized feedback, pinpointing errors, and suggesting natural phrasing.'
      },
      {
        id: 'q4',
        question: 'What does the text conclude about the role of the human learner?',
        options: [
          'Learners will not need to make any effort in the future',
          'Human agency, determination, and daily commitment remain paramount',
          'Computers will speak for humans completely',
          'Studying languages will become obsolete'
        ],
        correctIndex: 1,
        explanation: 'The text highlights that human agency remains paramount; transformation happens through steady commitment.'
      },
      {
        id: 'q5',
        question: 'What does the phrase "flips this paradigm on its head" mean?',
        options: [
          'Destroys computers',
          'Completely reverses or transforms the traditional approach',
          'Falls asleep upside down',
          'Ignores all technology'
        ],
        correctIndex: 1,
        explanation: 'It is an idiom meaning completely overturning or fundamentally transforming an existing model.'
      }
    ]
  }
];
