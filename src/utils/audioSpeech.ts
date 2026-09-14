// Web Speech API utility for authentic TOEIC LC practice

export type Accent = "US" | "UK" | "AU";

class AudioSpeechService {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (this.synth) {
      this.voices = this.synth.getVoices();
    }
  }

  private selectVoice(accent: Accent): SpeechSynthesisVoice | null {
    if (!this.voices.length && this.synth) {
      this.voices = this.synth.getVoices();
    }

    const langCode = accent === "UK" ? "en-GB" : accent === "AU" ? "en-AU" : "en-US";
    const matched = this.voices.find(v => v.lang.replace("_", "-").startsWith(langCode));
    if (matched) return matched;

    // Fallback to any English voice
    return this.voices.find(v => v.lang.startsWith("en")) || this.voices[0] || null;
  }

  public speak(
    text: string,
    options?: {
      accent?: Accent;
      rate?: number;
      onEnd?: () => void;
      onError?: () => void;
    }
  ) {
    if (!this.synth) {
      console.warn("SpeechSynthesis not supported in this browser");
      options?.onEnd?.();
      return;
    }

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = this.selectVoice(options?.accent || "US");
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = "en-US";
    }

    utterance.rate = options?.rate || 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      options?.onEnd?.();
    };

    utterance.onerror = (e) => {
      console.warn("SpeechSynthesis error:", e);
      options?.onError?.();
    };

    this.synth.speak(utterance);
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  public isAvailable(): boolean {
    return typeof window !== "undefined" && "speechSynthesis" in window;
  }
}

export const speechService = new AudioSpeechService();
