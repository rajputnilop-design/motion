import script from './script.json';
import timeline from './timeline.json';

export type Lang = 'en' | 'hi' | 'mr';
export type StepId = (typeof script.steps)[number]['id'];

export const FPS = script.fps;
export const STEPS = script.steps;
export const CHAPTERS = script.chapters;

export type StepTime = {id: string; start: number; dur: number; end: number; voAt: number; voFrames: number};

/** Frame helpers for one language's timeline. */
export class Timing {
  readonly lang: Lang;
  readonly total: number;
  readonly voDir: string | null;
  readonly rows: StepTime[];
  private byId: Record<string, StepTime>;

  constructor(lang: Lang) {
    const t = timeline[lang];
    this.lang = lang;
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

  /** Frame at fraction `f` of the step's narration (0 = first word, 1 = last word). */
  v(id: string, f: number): number {
    const s = this.step(id);
    return Math.round(Math.min(s.end - 4, s.voAt + f * s.voFrames));
  }

  /** Frame at fraction `f` of the whole step. */
  s(id: string, f: number): number {
    const s = this.step(id);
    return Math.round(s.start + f * s.dur);
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

/** On-screen version of a narration line: pronunciation spellings back to the written brand names. */
export const displayText = (text: string): string =>
  text
    .replace(/A\.I\. Shiksha Mitra dot com/g, 'aishikshamitra.com')
    .replace(/ए आ[ईय] शिक्षामित्र डॉट कॉम/g, 'aishikshamitra.com ')
    .replace(/AI Shiksha Mitra/g, 'AIShikshaMitra')
    .replace(/ए आ[ईय] शिक्षामित्र/g, 'AIShikshaMitra ')
    .replace(/AIShikshaMitra (ची|ला|ने|चे|च्या)/g, 'AIShikshaMitra$1')
    .replace(/ए आई/g, 'AI')
    .replace(/ए आय/g, 'AI')
    .replace(/Maha TET/g, 'MahaTET')
    .replace(/महा टेट/g, 'MahaTET ')
    .replace(/MahaTET ची/g, 'MahaTETची')
    .replace(/ +([,.।?!:])/g, '$1')
    .replace(/  +/g, ' ')
    .trim();

export const UI: Record<string, Record<Lang, string>> = {
  introTitle: {en: 'How to use AIShikshaMitra', hi: 'AIShikshaMitra कैसे इस्तेमाल करें', mr: 'AIShikshaMitra कसं वापरायचं'},
  introSub: {en: 'A complete guide for teachers', hi: 'शिक्षकों के लिए पूरी गाइड', mr: 'शिक्षकांसाठी संपूर्ण मार्गदर्शिका'},
  cta: {en: 'Try it today', hi: 'आज ही आज़माइए', mr: 'आजच वापरून पाहा'},
  chapter: {en: 'Chapter', hi: 'अध्याय', mr: 'प्रकरण'},
  draft: {en: 'Explain photosynthesis for Class 7', hi: 'कक्षा 7 को प्रकाश संश्लेषण समझाइए', mr: 'इयत्ता 7 ला प्रकाशसंश्लेषण समजावा'},
  callHello: {en: 'Hello Aasha!', hi: 'नमस्ते आशा!', mr: 'नमस्कार आशा!'},
  callHi: {
    en: 'Hello! I am Aasha. How can I help you today?',
    hi: 'नमस्ते! मैं आशा हूँ। बताइए, आज मैं आपकी क्या मदद करूँ?',
    mr: 'नमस्कार! मी आशा. आज मी तुम्हाला कशी मदत करू?',
  },
  callAsk: {en: 'Create a lesson plan for me.', hi: 'मेरे लिए एक लेसन प्लान बना दो।', mr: 'माझ्यासाठी एक लेसन प्लॅन बनव.'},
  callGuide: {
    en: 'I can guide you to the Tools section, where you can easily create a full lesson plan.',
    hi: 'मैं आपको Tools सेक्शन तक ले चलती हूँ, वहाँ आप आसानी से पूरा लेसन प्लान बना सकते हैं।',
    mr: 'मी तुम्हाला Tools विभागात घेऊन जाते, तिथे तुम्ही सहज पूर्ण लेसन प्लॅन बनवू शकता.',
  },
  sentToChat: {en: 'Sent to Chat', hi: 'Chat में भेजा गया', mr: 'Chat मध्ये पाठवले'},
};

export const chapterIndex = (id: string): number => {
  const i = CHAPTERS.findIndex((c) => c.id === id);
  return id === 'intro' || id === 'outro' ? 0 : i;
};

export const NUMBERED = CHAPTERS.filter((c) => c.id !== 'intro' && c.id !== 'outro');
