import { Question } from '../types/test';

export const INITIAL_TEST_QUESTIONS: Question[] = [
  // PHRASES QUESTIONS
  {
    id: 't-phr-1',
    type: 'phrase_selection',
    difficulty: 'A1',
    category: 'phrases',
    question: 'Choose the correct phrase to complete: "I need to _____ about which university course to enroll in."',
    options: ['make a decision', 'take a progress', 'wake a break', 'cut down'],
    correctAnswer: 'make a decision',
    explanation: 'The natural English collocation is "make a decision" (принять решение).'
  },
  {
    id: 't-phr-2',
    type: 'multiple_choice',
    difficulty: 'A1',
    category: 'phrases',
    question: 'What is the correct English phrase for "проводить время"?',
    options: ['spend time', 'pass hours', 'lose time', 'give time'],
    correctAnswer: 'spend time',
    explanation: '"Spend time" is the standard phrase for passing time meaningfully with people or activities.'
  },
  {
    id: 't-phr-3',
    type: 'sentence_completion',
    difficulty: 'A1',
    category: 'phrases',
    question: 'Complete: "You have been coding for three straight hours, you should _____."',
    options: ['take a break', 'make a break', 'have an end', 'give up'],
    correctAnswer: 'take a break',
    explanation: '"Take a break" means to pause your work to rest.'
  },
  {
    id: 't-phr-4',
    type: 'multiple_choice',
    difficulty: 'A1',
    category: 'phrases',
    question: 'Which preposition completes the phrase: "She is very good _____ explaining English grammar"?',
    options: ['at', 'in', 'on', 'with'],
    correctAnswer: 'at',
    explanation: 'The standard idiom is "be good at" something or doing something.'
  },
  {
    id: 't-phr-5',
    type: 'sentence_completion',
    difficulty: 'A1',
    category: 'phrases',
    question: 'Complete: "Are you interested _____ web application architecture?"',
    options: ['in', 'about', 'for', 'with'],
    correctAnswer: 'in',
    explanation: 'The correct preposition after "interested" is always "in".'
  },
  {
    id: 't-phr-6',
    type: 'phrase_selection',
    difficulty: 'A2',
    category: 'phrases',
    question: 'Select the phrasal verb meaning "to maintain friendly relations with":',
    options: ['get along with', 'deal with', 'figure out', 'cut down on'],
    correctAnswer: 'get along with',
    explanation: '"Get along with" someone means having a good, pleasant relationship with them.'
  },
  {
    id: 't-phr-7',
    type: 'multiple_choice',
    difficulty: 'A2',
    category: 'phrases',
    question: 'Complete: "I don\'t _____ going out tonight; I\'d rather stay home and read."',
    options: ['feel like', 'look like', 'take like', 'give like'],
    correctAnswer: 'feel like',
    explanation: '"Feel like doing something" expresses an inclination or desire in the moment.'
  },
  {
    id: 't-phr-8',
    type: 'phrase_selection',
    difficulty: 'A2',
    category: 'phrases',
    question: 'Choose the phrase meaning "узнать / выяснить":',
    options: ['find out', 'look for', 'turn off', 'put off'],
    correctAnswer: 'find out',
    explanation: '"Find out" means to discover information or truth about something.'
  },
  {
    id: 't-phr-9',
    type: 'sentence_completion',
    difficulty: 'A2',
    category: 'phrases',
    question: 'Complete: "We can\'t print the documents because the printer has _____ paper."',
    options: ['run out of', 'looked for', 'picked up', 'turned down'],
    correctAnswer: 'run out of',
    explanation: '"Run out of" means to exhaust the supply of an essential resource.'
  },
  {
    id: 't-phr-10',
    type: 'multiple_choice',
    difficulty: 'B1',
    category: 'phrases',
    question: 'Which phrase must ALWAYS be followed by a gerund (-ing) or noun?',
    options: ['look forward to', 'want to', 'plan to', 'decide to'],
    correctAnswer: 'look forward to',
    explanation: 'In "look forward to", "to" is a preposition, so it requires an -ing verb (e.g. look forward to seeing you).'
  },
  {
    id: 't-phr-11',
    type: 'phrase_selection',
    difficulty: 'B1',
    category: 'phrases',
    question: 'Which phrase means "to think of an innovative idea or solution"?',
    options: ['come up with', 'get used to', 'deal with', 'pay attention to'],
    correctAnswer: 'come up with',
    explanation: '"Come up with" means to produce or invent an idea or solution.'
  },
  {
    id: 't-phr-12',
    type: 'multiple_choice',
    difficulty: 'B1',
    category: 'phrases',
    question: 'What does "put off" mean in: "Don\'t put off your revision until the last night"?',
    options: ['To postpone / delay', 'To cancel completely', 'To complete quickly', 'To celebrate'],
    correctAnswer: 'To postpone / delay',
    explanation: '"Put off" means to delay or postpone doing something until a later time.'
  },

  // GRAMMAR QUESTIONS
  {
    id: 't-g-1',
    type: 'multiple_choice',
    difficulty: 'A1',
    category: 'grammar',
    question: 'Which form of the verb "to be" correctly fills the blank: "My friends _____ waiting for me at the campus cafe."',
    options: ['are', 'is', 'am', 'be'],
    correctAnswer: 'are',
    explanation: '"My friends" is plural (they), requiring the verb "are".'
  },
  {
    id: 't-g-2',
    type: 'multiple_choice',
    difficulty: 'A1',
    category: 'grammar',
    question: 'Choose the correct Present Simple sentence:',
    options: [
      'He always finishes his homework before dinner.',
      'He always finish his homework before dinner.',
      'He always finishing his homework before dinner.',
      'He is always finish his homework before dinner.'
    ],
    correctAnswer: 'He always finishes his homework before dinner.',
    explanation: 'In Present Simple with 3rd-person singular "he", the verb "finish" adds -es -> "finishes".'
  },
  {
    id: 't-g-3',
    type: 'sentence_completion',
    difficulty: 'A1',
    category: 'grammar',
    question: 'Complete the question: "_____ you understand the instructions?"',
    options: ['Do', 'Are', 'Is', 'Does'],
    correctAnswer: 'Do',
    explanation: 'In Present Simple questions with "you" and the base verb "understand", the auxiliary is "Do".'
  },
  {
    id: 't-g-4',
    type: 'true_false',
    difficulty: 'A1',
    category: 'grammar',
    question: 'True or False: "I am knowing the answer right now" is grammatically correct in standard English.',
    options: ['False', 'True'],
    correctAnswer: 'False',
    explanation: '"Know" is a stative verb and is not used in continuous forms; say "I know the answer".'
  },
  {
    id: 't-g-5',
    type: 'multiple_choice',
    difficulty: 'A1',
    category: 'grammar',
    question: 'Select the past tense of "buy":',
    options: ['bought', 'buyed', 'brought', 'boated'],
    correctAnswer: 'bought',
    explanation: 'The irregular past simple form of "buy" is "bought".'
  },
  {
    id: 't-g-6',
    type: 'sentence_completion',
    difficulty: 'A1',
    category: 'grammar',
    question: 'Fill in: "Where _____ you go during your summer holiday last year?"',
    options: ['did', 'do', 'were', 'have'],
    correctAnswer: 'did',
    explanation: 'Past Simple questions use the auxiliary "did" with the base form of the main verb ("go").'
  },
  {
    id: 't-g-7',
    type: 'multiple_choice',
    difficulty: 'A2',
    category: 'grammar',
    question: 'Choose the correct sentence in Present Perfect:',
    options: [
      'I have never tried sushi before.',
      'I have never try sushi before.',
      'I am never tried sushi before.',
      'I did never tried sushi before.'
    ],
    correctAnswer: 'I have never tried sushi before.',
    explanation: 'Present Perfect formula is have/has + past participle (V3): "have never tried".'
  },
  {
    id: 't-g-8',
    type: 'multiple_choice',
    difficulty: 'A2',
    category: 'grammar',
    question: 'Which sentence correctly compares two items?',
    options: [
      'Learning phrases is more practical than memorizing single words.',
      'Learning phrases is practicaler than memorizing single words.',
      'Learning phrases is more practical as memorizing single words.',
      'Learning phrases is most practical than memorizing single words.'
    ],
    correctAnswer: 'Learning phrases is more practical than memorizing single words.',
    explanation: '"Practical" has three syllables, so it forms comparative with "more" + adjective + "than".'
  },
  {
    id: 't-g-9',
    type: 'sentence_completion',
    difficulty: 'A2',
    category: 'grammar',
    question: 'First conditional: "If you _____ every day, your accent _____ quickly."',
    options: [
      'practice / will improve',
      'will practice / improves',
      'practiced / will improve',
      'practice / improves'
    ],
    correctAnswer: 'practice / will improve',
    explanation: 'First conditional: If + Present Simple, will + base infinitive.'
  },
  {
    id: 't-g-10',
    type: 'true_false',
    difficulty: 'A2',
    category: 'grammar',
    question: 'True or False: "She has visited London last May" is correct.',
    options: ['False', 'True'],
    correctAnswer: 'False',
    explanation: 'Because a specific past time is stated ("last May"), Past Simple must be used: "She visited London last May".'
  },
  {
    id: 't-g-11',
    type: 'multiple_choice',
    difficulty: 'B1',
    category: 'grammar',
    question: 'Second conditional: "If I _____ a million dollars, I _____ a modern educational center."',
    options: [
      'had / would build',
      'have / will build',
      'had / will build',
      'would have / built'
    ],
    correctAnswer: 'had / would build',
    explanation: 'Second conditional (hypothetical) uses Past Simple in if-clause and would + base verb in main clause.'
  },
  {
    id: 't-g-12',
    type: 'multiple_choice',
    difficulty: 'B1',
    category: 'grammar',
    question: 'Convert to passive: "Engineers tested the application thoroughly."',
    options: [
      'The application was tested thoroughly by engineers.',
      'The application has tested thoroughly by engineers.',
      'The application is tested thoroughly by engineers.',
      'The application were tested thoroughly by engineers.'
    ],
    correctAnswer: 'The application was tested thoroughly by engineers.',
    explanation: 'Singular subject "application" in past tense requires "was" + past participle "tested".'
  },
  {
    id: 't-g-13',
    type: 'multiple_choice',
    difficulty: 'B1',
    category: 'grammar',
    question: 'Reported speech: Direct quote: "I can speak three languages," said David.',
    options: [
      'David said he could speak three languages.',
      'David said he can speak three languages.',
      'David told that he can speak three languages.',
      'David said he would speak three languages.'
    ],
    correctAnswer: 'David said he could speak three languages.',
    explanation: 'In past reported speech, modal "can" changes into "could".'
  },

  // SENTENCE BUILDING & USAGE
  {
    id: 't-sb-1',
    type: 'multiple_choice',
    difficulty: 'A1',
    category: 'sentence_building',
    question: 'Put the words in correct order to make a natural question:',
    options: [
      'Where do you live in Kazakhstan?',
      'Where you do live in Kazakhstan?',
      'Where live you in Kazakhstan?',
      'Do you where live in Kazakhstan?'
    ],
    correctAnswer: 'Where do you live in Kazakhstan?',
    explanation: 'Question word (Where) + auxiliary (do) + subject (you) + main verb (live).'
  },
  {
    id: 't-sb-2',
    type: 'multiple_choice',
    difficulty: 'A2',
    category: 'sentence_building',
    question: 'Which sentence has the most natural word order?',
    options: [
      'I usually drink two cups of green tea in the morning.',
      'I drink usually two cups of green tea in the morning.',
      'In the morning I usually two cups drink of green tea.',
      'Usually drink I two cups of green tea in the morning.'
    ],
    correctAnswer: 'I usually drink two cups of green tea in the morning.',
    explanation: 'Adverbs of frequency like "usually" come between the subject and the main verb.'
  },
  {
    id: 't-sb-3',
    type: 'multiple_choice',
    difficulty: 'B1',
    category: 'sentence_building',
    question: 'Choose the best sentence combining two clauses:',
    options: [
      'Although he was exhausted, he completed his daily 15-minute speaking practice.',
      'Because he was exhausted, although he completed his practice.',
      'He was exhausted, but although he practiced speaking.',
      'Despite he was exhausted, he completed his speaking practice.'
    ],
    correctAnswer: 'Although he was exhausted, he completed his daily 15-minute speaking practice.',
    explanation: '"Although" correctly introduces a concession clause followed by a complete main clause.'
  },
  {
    id: 't-sb-4',
    type: 'phrase_selection',
    difficulty: 'B1',
    category: 'sentence_building',
    question: 'Which relative pronoun correctly joins these ideas: "The software engineer _____ designed the architecture is very talented."',
    options: ['who', 'which', 'where', 'whose'],
    correctAnswer: 'who',
    explanation: 'Use "who" (or "that") when referring to human subjects.'
  },
  {
    id: 't-sb-5',
    type: 'multiple_choice',
    difficulty: 'B1',
    category: 'sentence_building',
    question: 'Select the sentence with accurate preposition usage:',
    options: [
      'She is used to working in high-pressure environments.',
      'She is used to work in high-pressure environments.',
      'She is use to working in high-pressure environments.',
      'She used to working in high-pressure environments.'
    ],
    correctAnswer: 'She is used to working in high-pressure environments.',
    explanation: '"Be used to" (= accustomed to) is followed by a gerund (-ing): "is used to working".'
  }
];
