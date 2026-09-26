/**
 * AudioService — Robust multi-mode audio engine for English Journey
 * Combines Web Speech API (natural pronunciation & character dialogues)
 * with Web Audio API (tactile sound effects, celebratory chimes, fallback tones)
 * and physical audio playback with zero 404s.
 */

export interface DialogueLine {
  speaker: string;
  text: string;
}

export interface AudioStatus {
  speechSynthesisSupported: boolean;
  webAudioSupported: boolean;
  voicesCount: number;
  selectedVoice: string | null;
}

class AudioServiceClass {
  private audioCtx: AudioContext | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isDialoguePlaying: boolean = false;
  private currentDialogueIndex: number = -1;
  private dialogueStopRequested: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Warm up voices
      window.speechSynthesis.onvoiceschanged = () => {
        this.getEnglishVoices();
      };
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  public getEnglishVoices(): SpeechSynthesisVoice[] {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
    const all = window.speechSynthesis.getVoices();
    const enVoices = all.filter((v) => v.lang.startsWith('en'));
    return enVoices.length > 0 ? enVoices : all;
  }

  public getStatus(): AudioStatus {
    const hasSynth = typeof window !== 'undefined' && 'speechSynthesis' in window;
    const hasWebAudio = typeof window !== 'undefined' && ('AudioContext' in window || 'webkitAudioContext' in window);
    const voices = this.getEnglishVoices();
    return {
      speechSynthesisSupported: hasSynth,
      webAudioSupported: hasWebAudio,
      voicesCount: voices.length,
      selectedVoice: voices[0]?.name || null
    };
  }

  /**
   * Speak English text with configurable speed, pitch and callback
   */
  public speak(
    text: string,
    options: {
      rate?: number;
      pitch?: number;
      lang?: string;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: () => void;
    } = {}
  ): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      // Fallback: subtle chime to indicate audio requested
      this.playTone(550, 'sine', 0.2);
      options.onError?.();
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = options.lang || 'en-US';
      utterance.rate = options.rate ?? 0.92;
      utterance.pitch = options.pitch ?? 1.0;

      // Try selecting high quality English voice if available
      const voices = this.getEnglishVoices();
      if (voices.length > 0) {
        // Prefer natural / google / siri voices if present
        const preferred = voices.find(
          (v) =>
            v.name.includes('Google') ||
            v.name.includes('Natural') ||
            v.name.includes('Samantha') ||
            v.name.includes('Alex') ||
            v.name.includes('Daniel')
        );
        utterance.voice = preferred || voices[0];
      }

      utterance.onstart = () => {
        options.onStart?.();
      };

      utterance.onend = () => {
        this.currentUtterance = null;
        options.onEnd?.();
      };

      utterance.onerror = (e) => {
        console.warn('SpeechSynthesis error:', e);
        this.currentUtterance = null;
        options.onError?.();
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Error in AudioService.speak', err);
      this.playTone(440, 'sine', 0.15);
      options.onError?.();
    }
  }

  /**
   * Stop any current speech or dialogue
   */
  public stop(): void {
    this.dialogueStopRequested = true;
    this.isDialoguePlaying = false;
    this.currentDialogueIndex = -1;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public isSpeaking(): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
    return window.speechSynthesis.speaking || this.isDialoguePlaying;
  }

  /**
   * Play interactive dialogue passage line by line with natural character pitch distinctions
   */
  public playDialogue(
    lines: DialogueLine[],
    options: {
      rate?: number;
      onLineChange?: (lineIndex: number, line: DialogueLine) => void;
      onEnd?: () => void;
      onError?: () => void;
    } = {}
  ): void {
    this.stop();
    this.dialogueStopRequested = false;
    this.isDialoguePlaying = true;
    this.currentDialogueIndex = 0;

    const playNext = (index: number) => {
      if (this.dialogueStopRequested || !this.isDialoguePlaying) {
        this.isDialoguePlaying = false;
        options.onEnd?.();
        return;
      }

      if (index >= lines.length) {
        this.isDialoguePlaying = false;
        this.currentDialogueIndex = -1;
        options.onEnd?.();
        return;
      }

      const item = lines[index];
      this.currentDialogueIndex = index;
      options.onLineChange?.(index, item);

      // Character pitch variation
      let pitch = 1.0;
      const speakerLower = item.speaker.toLowerCase();
      if (speakerLower.includes('barista') || speakerLower.includes('student') || speakerLower.includes('sarah')) {
        pitch = 1.15;
      } else if (speakerLower.includes('alex') || speakerLower.includes('dan')) {
        pitch = 0.95;
      } else if (speakerLower.includes('lead') || speakerLower.includes('professor')) {
        pitch = 0.88;
      }

      this.speak(item.text, {
        rate: options.rate ?? 0.88,
        pitch,
        onEnd: () => {
          if (this.dialogueStopRequested) return;
          // Natural conversational pause between lines
          setTimeout(() => {
            if (!this.dialogueStopRequested) {
              playNext(index + 1);
            }
          }, 450);
        },
        onError: () => {
          options.onError?.();
          this.isDialoguePlaying = false;
        }
      });
    };

    playNext(0);
  }

  /**
   * Pure Web Audio API Tone Generator
   */
  public playTone(freq: number, type: OscillatorType = 'sine', duration: number = 0.15, gain: number = 0.1): void {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gainNode.gain.setValueAtTime(gain, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Silently ignore if blocked by autoplay policy
    }
  }

  /**
   * Sound Effect: Correct answer / Goal achieved (pleasant ascending chime)
   */
  public playSuccess(): void {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Note 1: C5 (523Hz)
      const osc1 = ctx.createOscillator();
      const g1 = ctx.createGain();
      osc1.frequency.setValueAtTime(523.25, now);
      g1.gain.setValueAtTime(0.12, now);
      g1.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc1.connect(g1);
      g1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.18);

      // Note 2: E5 (659Hz)
      const osc2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      osc2.frequency.setValueAtTime(659.25, now + 0.08);
      g2.gain.setValueAtTime(0.14, now + 0.08);
      g2.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc2.connect(g2);
      g2.connect(ctx.destination);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.28);

      // Note 3: G5 (783Hz)
      const osc3 = ctx.createOscillator();
      const g3 = ctx.createGain();
      osc3.frequency.setValueAtTime(783.99, now + 0.16);
      g3.gain.setValueAtTime(0.15, now + 0.16);
      g3.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc3.connect(g3);
      g3.connect(ctx.destination);
      osc3.start(now + 0.16);
      osc3.stop(now + 0.45);
    } catch (e) {}
  }

  /**
   * Sound Effect: Incorrect answer / Needs review (soft low buzz)
   */
  public playError(): void {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now); // A3
      osc.frequency.setValueAtTime(196, now + 0.1); // G3
      g.gain.setValueAtTime(0.1, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.28);
    } catch (e) {}
  }

  /**
   * Sound Effect: Subtle tactile UI pop
   */
  public playPop(): void {
    this.playTone(700, 'sine', 0.06, 0.05);
  }

  /**
   * Sound Effect: Celebration / Level Up Fanfare
   */
  public playCelebration(): void {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        const start = now + idx * 0.1;
        const dur = idx === 3 ? 0.6 : 0.2;
        osc.frequency.setValueAtTime(freq, start);
        g.gain.setValueAtTime(0.12, start);
        g.gain.exponentialRampToValueAtTime(0.001, start + dur);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + dur);
      });
    } catch (e) {}
  }
}

export const AudioService = new AudioServiceClass();
