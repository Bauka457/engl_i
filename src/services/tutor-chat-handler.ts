import { GoogleGenAI } from '@google/genai';
import type { RequestHandler } from 'express';

type ChatTurn = { role: 'user' | 'assistant'; text: string };

const allowedAudioTypes = new Set([
  'audio/webm',
  'audio/ogg',
  'audio/mp4',
  'audio/mpeg',
  'audio/wav'
]);

export const tutorChatHandler: RequestHandler = async (request, response) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    response.status(503).json({ error: 'AI tutor is not configured. Add GEMINI_API_KEY to the server environment.' });
    return;
  }

  const message = typeof request.body?.message === 'string' ? request.body.message.trim().slice(0, 2000) : '';
  const audioBase64 = typeof request.body?.audioBase64 === 'string' ? request.body.audioBase64 : '';
  const mimeType = typeof request.body?.mimeType === 'string' ? request.body.mimeType.split(';')[0].toLowerCase() : '';
  const history = Array.isArray(request.body?.history)
    ? (request.body.history as ChatTurn[]).slice(-10).filter((turn) =>
      (turn?.role === 'user' || turn?.role === 'assistant') && typeof turn.text === 'string'
    ).map((turn) => ({ role: turn.role, text: turn.text.slice(0, 1000) }))
    : [];
  const level = ['A1', 'A2', 'B1'].includes(request.body?.level) ? request.body.level : 'A1';
  const correctMode = request.body?.correctMode !== false;
  const transcribeOnly = request.body?.transcribeOnly === true;

  if ((!message && !audioBase64) || (audioBase64 && !allowedAudioTypes.has(mimeType))) {
    response.status(400).json({ error: 'Send a text message or a supported audio recording.' });
    return;
  }

  if (audioBase64 && (audioBase64.length > 3_500_000 || !/^[A-Za-z0-9+/]+={0,2}$/.test(audioBase64))) {
    response.status(413).json({ error: 'The recording is too large. Please record a shorter message.' });
    return;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const conversation = history.map((turn) => `${turn.role === 'user' ? 'Learner' : 'Tutor'}: ${turn.text}`).join('\n');
    const prompt = transcribeOnly
      ? 'Transcribe the spoken English in the supplied audio faithfully. Return only JSON with string keys transcript, reply, correction. Set reply and correction to empty strings.'
      : [
        'You are a friendly, patient English conversation tutor. Continue a natural conversation based on the learner message and history.',
        `Learner level: ${level}. Keep vocabulary and sentence length suitable for this level.`,
        correctMode ? 'If the learner makes a useful English mistake, give one concise correction; otherwise leave correction empty.' : 'Do not correct the learner.',
        'Reply in English, warmly and briefly, and end with one natural question that encourages the learner to continue.',
        'Return only JSON with string keys transcript, reply, correction. For text input, transcript must repeat the learner message. For audio, transcribe only the learner speech faithfully. Use an empty correction when none is needed.',
        conversation ? `Conversation so far:\n${conversation}` : 'This is the start of the conversation.'
      ].join('\n\n');

    const parts = audioBase64
      ? [{ inlineData: { mimeType, data: audioBase64 } }, { text: prompt }]
      : [{ text: `Learner message: ${message}\n\n${prompt}` }];
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts }],
      config: { responseMimeType: 'application/json' }
    });

    const parsed = JSON.parse(result.text || '{}') as { transcript?: string; reply?: string; correction?: string };
    if (!transcribeOnly && !parsed.reply?.trim()) throw new Error('Gemini returned an empty tutor reply');

    response.json({
      transcript: String(parsed.transcript || message).trim().slice(0, 2000),
      reply: parsed.reply.trim().slice(0, 1200),
      correction: correctMode ? String(parsed.correction || '').trim().slice(0, 400) : ''
    });
  } catch (error) {
    console.error('Tutor conversation failed:', error);
    response.status(502).json({ error: 'The tutor could not answer right now. Please try again.' });
  }
};