import { GoogleGenAI } from '@google/genai';
import type { RequestHandler } from 'express';
import type { DailyTask } from '../types/progress';
import type { UserState } from '../types/user';

export const dailyPlanHandler: RequestHandler = async (request, response) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    response.status(503).json({ error: 'Gemini is not configured' });
    return;
  }

  const userState = request.body?.userState as UserState | undefined;
  const language = request.body?.language === 'ru' ? 'Russian' : 'English';
  if (!userState || !userState.currentLevel || !userState.availableTime) {
    response.status(400).json({ error: 'A valid learning state is required' });
    return;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        'Create a short, practical English-study plan from this learner state.',
        `Respond in ${language}.`,
        `Learner state: ${JSON.stringify(userState)}`,
        'Return only JSON with keys motivation and tasks. tasks must contain 1-4 objects with keys type, title, description, duration. type must be one of phrases, grammar, reading, listening, speaking, writing, test. Durations must be positive whole minutes and the total must not exceed availableTime. Adapt workload to mood, requested focus, level, main goal and available time. Do not include generic lesson-roadmap language.'
      ].join('\n'),
      config: { responseMimeType: 'application/json' }
    });

    const parsed = JSON.parse(result.text || '{}') as { motivation?: string; tasks?: Array<Partial<DailyTask>> };
    if (!Array.isArray(parsed.tasks) || parsed.tasks.length === 0) {
      throw new Error('Gemini returned an empty plan');
    }

    const routes: Record<DailyTask['type'], string> = {
      phrases: '/phrases', grammar: '/grammar', reading: '/reading', listening: '/listening',
      speaking: '/speaking', writing: '/writing', test: '/tests'
    };
    let minutesLeft = Math.max(5, Math.min(60, Math.floor(userState.availableTime)));
    const tasks: DailyTask[] = parsed.tasks.slice(0, 4).map((task, index, allTasks) => {
      const type = Object.hasOwn(routes, task.type || '') ? task.type as DailyTask['type'] : 'phrases';
      const requestedDuration = Math.max(1, Math.floor(Number(task.duration) || 1));
      const duration = index === allTasks.length - 1
        ? Math.max(1, minutesLeft)
        : Math.min(requestedDuration, Math.max(1, minutesLeft - (allTasks.length - index - 1)));
      minutesLeft -= duration;
      return {
        id: `ai-task-${Date.now()}-${index}`,
        type,
        title: String(task.title || 'English practice').slice(0, 80),
        description: String(task.description || 'Practice English with a short activity.').slice(0, 180),
        duration,
        completed: false,
        linkRoute: routes[type]
      };
    });

    response.json({
      id: `plan-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      userStateText: String(userState.userPrompt || '').slice(0, 500),
      totalMinutes: tasks.reduce((sum, task) => sum + task.duration, 0),
      motivation: String(parsed.motivation || 'A small step today keeps your English moving forward.').slice(0, 240),
      tasks,
      completed: false,
      source: 'ai'
    });
  } catch (error) {
    console.error('Gemini plan generation failed:', error);
    response.status(502).json({ error: 'The AI could not build a plan right now' });
  }
};