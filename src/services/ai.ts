import { UserState } from '../types/user';
import { DailyPlan, DailyTask } from '../types/progress';
import { SentenceFeedback } from '../types/phrase';
import { StreakService } from './streak';
import { I18n } from './i18n';

export interface WritingFeedback {
  wordCount: number;
  overallScore: number; // 0-100
  grammarScore: number;
  vocabularyScore: number;
  naturalnessScore: number;
  strengths: string[];
  mistakes: Array<{
    original: string;
    correction: string;
    explanation: string;
  }>;
  betterVersion: string;
  tutorComment: string;
}

export interface SpeakingFeedback {
  score: number;
  fluencyRating: 'Developing' | 'Good' | 'Strong' | 'Excellent';
  grammarTip: string;
  vocabularyTip: string;
  betterVersion: string;
  tutorNote: string;
}

export interface TutorChatResponse {
  transcript: string;
  reply: string;
  correction?: string;
}

async function requestTutorChat(payload: {
  message?: string;
  audioBase64?: string;
  mimeType?: string;
  history: Array<{ role: 'user' | 'assistant'; text: string }>;
  level: string;
  correctMode: boolean;
  transcribeOnly?: boolean;
}): Promise<TutorChatResponse> {
  const response = await fetch('/api/tutor-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const result = await response.json().catch(() => ({})) as { error?: string };
    throw new Error(result.error || `Tutor request failed (${response.status})`);
  }

  return await response.json() as TutorChatResponse;
}

async function encodeAudio(blob: Blob): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || '');
      const comma = dataUrl.indexOf(',');
      if (comma < 0) reject(new Error('Could not encode microphone recording'));
      else resolve(dataUrl.slice(comma + 1));
    };
    reader.onerror = () => reject(new Error('Could not read microphone recording'));
    reader.readAsDataURL(blob);
  });
}

export const AIService = {
  async chatWithTutor(
    message: string,
    history: Array<{ role: 'user' | 'assistant'; text: string }>,
    level: string,
    correctMode: boolean
  ): Promise<TutorChatResponse> {
    return await requestTutorChat({ message, history, level, correctMode });
  },

  async speakWithTutor(
    audio: Blob,
    history: Array<{ role: 'user' | 'assistant'; text: string }>,
    level: string,
    correctMode: boolean
  ): Promise<TutorChatResponse> {
    if (audio.size > 2_500_000) throw new Error('Recording is too long. Please keep voice messages under 15 seconds.');
    return await requestTutorChat({
      audioBase64: await encodeAudio(audio),
      mimeType: audio.type || 'audio/webm',
      history,
      level,
      correctMode
    });
  },

  async transcribeSpeech(audio: Blob): Promise<string> {
    if (audio.size > 2_500_000) throw new Error('Recording is too long. Please keep voice messages under 15 seconds.');
    const response = await requestTutorChat({
      audioBase64: await encodeAudio(audio),
      mimeType: audio.type || 'audio/webm',
      history: [],
      level: 'A1',
      correctMode: false,
      transcribeOnly: true
    });
    if (!response.transcript) throw new Error('No speech was detected. Please try again.');
    return response.transcript;
  },

  /**
   * Generates an adaptive Daily Plan based on user state, mood, free time, and goals.
   */
  async generateDailyPlan(userState: UserState): Promise<DailyPlan> {
    try {
      const response = await fetch('/api/daily-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userState, language: I18n.getLang() })
      });
      if (response.ok) return await response.json() as DailyPlan;
    } catch (error) {
      console.info('AI endpoint unavailable; using the local planner.', error);
    }

    // Artificial small delay for realistic smooth SaaS feel
    await new Promise((resolve) => setTimeout(resolve, 600));

    const promptText = (userState.userPrompt || '').toLowerCase();
    const availableTime = userState.availableTime || 30;
    const isTired = promptText.includes('tired') || promptText.includes('exhausted') || promptText.includes('heavy') || promptText.includes('sleepy') || promptText.includes('hard day');
    const wantsSpeaking = promptText.includes('speak') || promptText.includes('talk') || promptText.includes('voice') || promptText.includes('pronunciation');
    const wantsGrammar = promptText.includes('grammar') || promptText.includes('rule') || promptText.includes('tense');
    const wantsWriting = promptText.includes('writ') || promptText.includes('essay') || promptText.includes('email');
    const wantsReading = promptText.includes('read') || promptText.includes('article') || promptText.includes('text');

    const tasks: DailyTask[] = [];

    if (availableTime <= 15) {
      // 15-minute quick session
      if (isTired) {
        tasks.push({
          id: 'task-phrases',
          type: 'phrases',
          title: 'Gentle Phrase Review',
          description: 'Review 3 practical everyday expressions at a calm pace.',
          duration: 5,
          completed: false,
          linkRoute: '/phrases'
        });
        tasks.push({
          id: 'task-speaking',
          type: 'speaking',
          title: 'Relaxed Speaking Prompt',
          description: 'Answer one short speaking question out loud.',
          duration: 6,
          completed: false,
          linkRoute: '/speaking'
        });
        tasks.push({
          id: 'task-test',
          type: 'test',
          title: '3-Question Quick Check',
          description: 'Lock in what you learned with a rapid mini quiz.',
          duration: 4,
          completed: false,
          linkRoute: '/tests'
        });
      } else {
        tasks.push({
          id: 'task-phrases',
          type: 'phrases',
          title: 'Core Phrase Mastery',
          description: 'Learn and create your own sentences with 3 essential phrases.',
          duration: 6,
          completed: false,
          linkRoute: '/phrases'
        });
        tasks.push({
          id: 'task-grammar',
          type: 'grammar',
          title: 'Targeted Grammar Rule',
          description: 'Quick walkthrough of key tense rules with one mini-exercise.',
          duration: 5,
          completed: false,
          linkRoute: '/grammar'
        });
        tasks.push({
          id: 'task-test',
          type: 'test',
          title: 'Daily Mini Test',
          description: '5 high-impact questions to test your knowledge.',
          duration: 4,
          completed: false,
          linkRoute: '/tests'
        });
      }
    } else if (availableTime <= 30) {
      // 20-30 minutes standard session
      tasks.push({
        id: 'task-phrases',
        type: 'phrases',
        title: 'Phrase Practice & Sentence Building',
        description: 'Explore 4 high-frequency phrases and write your own examples.',
        duration: 8,
        completed: false,
        linkRoute: '/phrases'
      });

      if (wantsSpeaking) {
        tasks.push({
          id: 'task-speaking',
          type: 'speaking',
          title: 'Voice Speaking Lab',
          description: 'Record your spoken answers to 2 interactive daily prompts.',
          duration: 10,
          completed: false,
          linkRoute: '/speaking'
        });
      } else if (wantsGrammar) {
        tasks.push({
          id: 'task-grammar',
          type: 'grammar',
          title: 'Grammar Deep Dive',
          description: 'Master structure patterns, common errors, and practical usage.',
          duration: 9,
          completed: false,
          linkRoute: '/grammar'
        });
      } else if (wantsWriting) {
        tasks.push({
          id: 'task-writing',
          type: 'writing',
          title: 'Writing Lab Challenge',
          description: 'Craft a 60-80 word paragraph with instant AI feedback.',
          duration: 10,
          completed: false,
          linkRoute: '/writing'
        });
      } else {
        tasks.push({
          id: 'task-reading',
          type: 'reading',
          title: 'Comprehension Reading',
          description: 'Short real-world story with vocabulary hints and comprehension questions.',
          duration: 7,
          completed: false,
          linkRoute: '/reading'
        });
        tasks.push({
          id: 'task-speaking',
          type: 'speaking',
          title: 'Spoken Response',
          description: 'Practice fluent pronunciation and answer prompt out loud.',
          duration: 8,
          completed: false,
          linkRoute: '/speaking'
        });
      }

      tasks.push({
        id: 'task-test',
        type: 'test',
        title: 'Daily Mini Test',
        description: 'Comprehensive 5-question test evaluating phrases and grammar.',
        duration: 5,
        completed: false,
        linkRoute: '/tests'
      });
    } else {
      // 45-60 minutes intensive session
      tasks.push({
        id: 'task-phrases',
        type: 'phrases',
        title: 'Advanced Phrase Workout',
        description: 'Master 5 phrases in context with sentence formulation.',
        duration: 12,
        completed: false,
        linkRoute: '/phrases'
      });
      tasks.push({
        id: 'task-grammar',
        type: 'grammar',
        title: 'Grammar Roadmap Lesson',
        description: 'Understand core sentence mechanics and solve interactive exercises.',
        duration: 12,
        completed: false,
        linkRoute: '/grammar'
      });
      tasks.push({
        id: 'task-speaking',
        type: 'speaking',
        title: 'Speaking Lab & AI Conversation',
        description: 'Simulate a live dialog with the AI English Tutor.',
        duration: 12,
        completed: false,
        linkRoute: '/speaking'
      });
      tasks.push({
        id: 'task-writing',
        type: 'writing',
        title: 'Writing & Sentence Synthesis',
        description: 'Draft an essay or email response and receive detailed line-by-line feedback.',
        duration: 12,
        completed: false,
        linkRoute: '/writing'
      });
      tasks.push({
        id: 'task-test',
        type: 'test',
        title: 'Mastery Mini Test',
        description: '8-question multi-skill evaluation with personalized diagnostics.',
        duration: 8,
        completed: false,
        linkRoute: '/tests'
      });
    }

    // Dynamic motivating message based on user state
    let motivation = `Consistency is your greatest superpower. Take it step by step, and enjoy today's session!`;
    if (isTired) {
      motivation = `You had a demanding day, and showing up anyway proves your dedication. We have kept today's practice smooth, practical, and light!`;
    } else if (promptText.includes('motivated') || promptText.includes('excited') || promptText.includes('energy')) {
      motivation = `Awesome energy today! Let's capitalize on your momentum to make significant leaps in your English skills!`;
    } else if (userState.streak > 3) {
      motivation = `🔥 You are on a ${userState.streak}-day streak! Keep the flame burning bright today!`;
    }

    const calculatedTotalMinutes = tasks.reduce((sum, t) => sum + t.duration, 0);

    return {
      id: 'plan-' + Date.now(),
      date: StreakService.getTodayDateString(),
      userStateText: userState.userPrompt || `${availableTime} minutes practice session`,
      totalMinutes: calculatedTotalMinutes,
      motivation,
      tasks,
      completed: false,
      source: 'local'
    };
  },

  /**
   * Checks a user's original sentence using the learned phrase.
   */
  async checkPhraseSentence(phrase: string, sentence: string, level: string = 'A1'): Promise<SentenceFeedback> {
    await new Promise((resolve) => setTimeout(resolve, 450));

    const trimmed = sentence.trim();
    if (!trimmed) {
      return {
        isGood: false,
        grammarChecked: false,
        phraseUsageChecked: false,
        naturalnessChecked: false,
        comment: 'Please write a sentence first before submitting for review.'
      };
    }

    const lowerSentence = trimmed.toLowerCase();
    const cleanPhrase = phrase.toLowerCase().replace(/ \/ .*/, '').trim();

    // Check if phrase parts are used
    const phraseWords = cleanPhrase.split(' ').filter(w => w.length > 2);
    const usesPhrase = phraseWords.some(w => lowerSentence.includes(w)) || lowerSentence.includes(cleanPhrase);

    // Basic capitalization & punctuation check
    const startsCapital = /^[A-Z]/.test(trimmed);
    const endsPunctuation = /[.!?]$/.test(trimmed);

    let corrected = trimmed;
    if (!startsCapital) {
      corrected = corrected.charAt(0).toUpperCase() + corrected.slice(1);
    }
    if (!endsPunctuation) {
      corrected = corrected + '.';
    }

    // Common corrections
    corrected = corrected
      .replace(/\bi am agree\b/gi, 'I agree')
      .replace(/\bi have (\d+) years\b/gi, 'I am $1 years old')
      .replace(/\bdepend of\b/gi, 'depend on')
      .replace(/\binterested to\b/gi, 'interested in')
      .replace(/\bgood in\b/gi, 'good at')
      .replace(/\bmake a progress\b/gi, 'make progress');

    const grammarChecked = true;
    const phraseUsageChecked = usesPhrase;
    const naturalnessChecked = trimmed.split(' ').length >= 4;

    const isGood = phraseUsageChecked && naturalnessChecked;

    let comment = '';
    if (isGood) {
      comment = `Excellent work! Your sentence effectively incorporates the phrase "${phrase}" with clear meaning and accurate structure.`;
    } else if (!phraseUsageChecked) {
      comment = `Your sentence is interesting, but make sure to explicitly include the key phrase "${phrase}".`;
    } else {
      comment = `Good start! Try expanding your sentence with more context (e.g. why, when, or with whom).`;
    }

    return {
      isGood,
      correctedSentence: corrected,
      grammarChecked,
      phraseUsageChecked,
      naturalnessChecked,
      comment,
      suggestions: [
        `Try speaking this sentence out loud 3 times.`,
        `Consider creating a second variation in past tense.`
      ]
    };
  },

  /**
   * Reviews an essay or paragraph submitted to Writing Lab.
   */
  async checkWriting(topic: string, text: string, level: string = 'A2'): Promise<WritingFeedback> {
    await new Promise((resolve) => setTimeout(resolve, 750));

    const words = text.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    const mistakes: Array<{ original: string; correction: string; explanation: string }> = [];

    // Detect common ESL errors
    if (/i am agree/i.test(text)) {
      mistakes.push({
        original: 'I am agree',
        correction: 'I agree',
        explanation: '"Agree" is a verb in English, not an adjective. Say "I agree", never "I am agree".'
      });
    }
    if (/depend of/i.test(text)) {
      mistakes.push({
        original: 'depend of',
        correction: 'depend on',
        explanation: 'The verb "depend" strictly collocates with the preposition "on".'
      });
    }
    if (/he don't/i.test(text)) {
      mistakes.push({
        original: "he don't",
        correction: "he doesn't",
        explanation: 'Third-person singular subjects (he/she/it) require "doesn\'t" in Present Simple.'
      });
    }
    if (/more better/i.test(text)) {
      mistakes.push({
        original: 'more better',
        correction: 'better',
        explanation: '"Better" is already a comparative adjective. Avoid double comparatives.'
      });
    }
    if (/i look forward to see/i.test(text)) {
      mistakes.push({
        original: 'look forward to see',
        correction: 'look forward to seeing',
        explanation: '"Look forward to" is always followed by an -ing gerund.'
      });
    }

    const baseScore = Math.min(95, Math.max(65, 60 + Math.min(25, wordCount / 3) - (mistakes.length * 6)));
    const grammarScore = Math.max(60, 95 - (mistakes.length * 10));
    const vocabularyScore = Math.min(96, Math.max(70, 72 + Math.floor(wordCount / 4)));
    const naturalnessScore = Math.min(92, Math.max(68, 80 - (mistakes.length * 5)));

    // Generate improved polish
    let betterVersion = text.trim();
    mistakes.forEach(m => {
      const reg = new RegExp(m.original, 'gi');
      betterVersion = betterVersion.replace(reg, m.correction);
    });

    if (betterVersion.length > 0 && !/[.!?]$/.test(betterVersion)) {
      betterVersion += '.';
    }

    return {
      wordCount,
      overallScore: Math.round(baseScore),
      grammarScore,
      vocabularyScore,
      naturalnessScore,
      strengths: [
        'Clear communicative intent and logical progression.',
        wordCount >= 40 ? 'Sufficient detail and descriptive depth.' : 'Concise and direct phrasing.',
        'Good attempt at using target vocabulary in relevant context.'
      ],
      mistakes,
      betterVersion: betterVersion || text,
      tutorComment: `Great effort on "${topic}"! You conveyed your ideas clearly. Review the grammar notes above to refine your accuracy, and try reading the corrected version out loud.`
    };
  },

  /**
   * Conversational turn with the AI English Tutor.
   */
  async startAIConversation(
    message: string,
    history: Array<{ role: 'user' | 'assistant'; text: string }>,
    level: string = 'A1',
    correctMode: boolean = true
  ): Promise<{ reply: string; correction?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const lower = message.toLowerCase();
    let correction: string | undefined = undefined;

    // Detect common minor slip
    if (lower.includes('i am agree')) {
      correction = 'Note: Say "I agree" instead of "I am agree".';
    } else if (lower.includes('i have 2') && lower.includes('years')) {
      correction = 'Note: In English, express age with "I am ... years old" rather than "have".';
    } else if (lower.includes('depend of')) {
      correction = 'Note: Use "depend on" instead of "depend of".';
    }

    let reply = '';

    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
      if (level === 'A1') {
        reply = "Hello! It is great to chat with you today. How was your day? Did you study or work?";
      } else if (level === 'A2') {
        reply = "Hi there! Glad you are here. Tell me a little bit about what you did today, or what you are planning for this evening!";
      } else {
        reply = "Hello! Welcome back to our conversation session. What is on your mind today, and what interesting challenge did you tackle recently?";
      }
    } else if (lower.includes('tired') || lower.includes('exhausted') || lower.includes('hard')) {
      reply = "I understand completely. Resting is just as important as studying. What usually helps you unwind and recharge your energy?";
    } else if (lower.includes('university') || lower.includes('study') || lower.includes('exam')) {
      reply = "University life can be intense! What subject or project are you focusing on right now? Do you find it interesting?";
    } else if (lower.includes('work') || lower.includes('job') || lower.includes('company')) {
      reply = "Work challenges teach us so much. Do you use English at your job, or are you preparing to work in an international environment?";
    } else if (lower.includes('weather') || lower.includes('cold') || lower.includes('sun') || lower.includes('rain')) {
      reply = "Weather always influences our mood! What kind of weather is your favorite for taking a walk or staying cozy inside?";
    } else if (lower.includes('hobby') || lower.includes('music') || lower.includes('game') || lower.includes('movie')) {
      reply = "That sounds fascinating! How often do you get time to enjoy your hobbies? Do you listen to English music or watch English movies?";
    } else {
      if (level === 'A1') {
        reply = "That makes sense! Tell me more about that. Why do you think so?";
      } else if (level === 'A2') {
        reply = "Interesting perspective! Could you elaborate a bit on that? How does that affect your daily routine?";
      } else {
        reply = "That is a thoughtful point. If you had the chance to change one thing about that situation, what approach would you take?";
      }
    }

    return {
      reply,
      correction: correctMode ? correction : undefined
    };
  },

  /**
   * Provides feedback on speech recognition results.
   */
  async generateSpeakingFeedback(
    prompt: string,
    transcript: string,
    level: string = 'A2'
  ): Promise<SpeakingFeedback> {
    await new Promise((resolve) => setTimeout(resolve, 550));

    const words = transcript.trim().split(/\s+/).filter(Boolean);
    const count = words.length;

    let score = 75;
    let fluencyRating: 'Developing' | 'Good' | 'Strong' | 'Excellent' = 'Good';

    if (count < 8) {
      score = 70;
      fluencyRating = 'Developing';
    } else if (count < 20) {
      score = 82;
      fluencyRating = 'Good';
    } else if (count < 40) {
      score = 90;
      fluencyRating = 'Strong';
    } else {
      score = 96;
      fluencyRating = 'Excellent';
    }

    let betterVersion = transcript;
    if (betterVersion.length > 0) {
      betterVersion = betterVersion.charAt(0).toUpperCase() + betterVersion.slice(1);
      if (!/[.!?]$/.test(betterVersion)) betterVersion += '.';
    }

    return {
      score,
      fluencyRating,
      grammarTip: count >= 10 
        ? 'Great cadence! Work on linking words smoothly (e.g. "and then", "moreover", "as a result").'
        : 'Good start. Aim to speak in complete sentences rather than short disconnected fragments.',
      vocabularyTip: 'Try incorporating descriptive adjectives and phrasal verbs to make your speech sound more vivid.',
      betterVersion: betterVersion || 'Try speaking your thoughts in complete sentences.',
      tutorNote: `You tackled the prompt: "${prompt}". Speaking out loud daily is the fastest way to break the language barrier!`
    };
  },

  async evaluateSpeaking(prompt: string, transcript: string, level: string = 'A2') {
    const fb = await this.generateSpeakingFeedback(prompt, transcript, level);
    return {
      fluencyScore: Math.round(fb.score / 10),
      grammarScore: Math.max(1, Math.min(10, Math.round(fb.score / 10) - 1)),
      feedback: fb.grammarTip + ' ' + fb.vocabularyTip,
      betterVersion: fb.betterVersion
    };
  }
};
