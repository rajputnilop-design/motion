import script from './script.json';
import timeline from './timeline.json';

export type Lang = 'en' | 'hi' | 'mr';
export const FPS = script.fps;
export const STEPS = script.steps;
export type StepTime = {id: string; start: number; dur: number; end: number; voAt: number; voFrames: number};

/** Frame helpers for one language's API-key reel timeline. */
export class Timing {
  readonly total: number;
  readonly voDir: string | null;
  readonly rows: StepTime[];
  private byId: Record<string, StepTime>;

  constructor(lang: Lang) {
    const t = timeline[lang];
    this.total = t.total;
    this.voDir = t.voDir;
    this.rows = t.steps.map((r) => ({...r, end: r.start + r.dur}));
    this.byId = Object.fromEntries(this.rows.map((r) => [r.id, r]));
  }

  step(id: string): StepTime {
    const s = this.byId[id];
    if (!s) throw new Error(`unknown step ${id}`);
    return s;
  }

  /** Frame at fraction `f` of the step's narration. */
  v(id: string, f: number): number {
    const s = this.step(id);
    return Math.round(Math.min(s.end - 4, s.voAt + f * s.voFrames));
  }

  start(id: string): number {
    return this.step(id).start;
  }

  end(id: string): number {
    return this.step(id).end;
  }

  at(frame: number): StepTime {
    let cur = this.rows[0];
    for (const r of this.rows) if (r.start <= frame) cur = r;
    return cur;
  }
}

export const displayText = (text: string): string =>
  text
    .replace(/AI Shiksha Mitra/g, 'AIShikshaMitra')
    .replace(/ए आ[ईय] शिक्षामित्र/g, 'AIShikshaMitra ')
    .replace(/AIShikshaMitra (चे|के|ची|ला)/g, (_m, s) => (s === 'के' ? 'AIShikshaMitra के' : `AIShikshaMitra${s}`))
    .replace(/ +([,.।?!:])/g, '$1')
    .replace(/  +/g, ' ')
    .trim();

type L = Record<Lang, string>;
export const UI: Record<string, L> = {
  oneTime: {en: 'One-time setup', hi: 'एक बार का सेटअप', mr: 'एकदाच सेटअप'},
  free: {en: 'Free', hi: 'फ़्री', mr: 'मोफत'},
  yourKey: {en: 'Your API key', hi: 'आपकी API key', mr: 'तुमची API key'},
  chat: {en: 'Chat', hi: 'चैट', mr: 'चॅट'},
  tools: {en: 'Tools', hi: 'टूल्स', mr: 'टूल्स'},
  papers: {en: 'Question papers', hi: 'क्वेश्चन पेपर', mr: 'प्रश्नपत्रिका'},
  noCard: {en: 'No card', hi: 'कार्ड नहीं', mr: 'कार्ड नको'},
  noPayment: {en: 'No payment', hi: 'पेमेंट नहीं', mr: 'पेमेंट नाही'},
  step: {en: 'STEP {n} OF 5', hi: 'स्टेप {n} / 5', mr: 'स्टेप {n} / 5'},
  freeTier: {en: 'Free tier', hi: 'Free tier', mr: 'Free tier'},
  everyday: {en: 'Enough for everyday use', hi: 'रोज़ के काम के लिए काफ़ी', mr: 'रोजच्या कामासाठी पुरेशी'},
  paid: {en: 'Paid plan', hi: 'पेड प्लान', mr: 'पेड प्लॅन'},
  onlyIf: {en: 'Only if you need more', hi: 'सिर्फ़ ज़्यादा ज़रूरत हो तो', mr: 'जास्त गरज असेल तरच'},
  choice: {en: 'Your choice, anytime', hi: 'आपकी मर्ज़ी, कभी भी', mr: 'तुमची निवड, कधीही'},
  optional: {en: 'Optional', hi: 'वैकल्पिक', mr: 'ऐच्छिक'},
  happy: {en: 'Happy teaching!', hi: 'हैप्पी टीचिंग!', mr: 'हॅप्पी टीचिंग!'},
  onDevice: {en: 'Only on this device', hi: 'सिर्फ़ इसी डिवाइस पर', mr: 'फक्त याच डिव्हाइसवर'},
  noCloud: {en: 'Never synced to the cloud', hi: 'क्लाउड में सिंक नहीं', mr: 'क्लाउडवर सिंक नाही'},
};
