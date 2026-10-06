import script from './script.json';
import timeline from './timeline.json';

export type Lang = 'en' | 'mr';
export const STEPS = script.steps;
export type StepTime = {id: string; start: number; dur: number; end: number; voAt: number; voFrames: number; beats?: number[]};

/** Frame helpers for one language's manifesto timeline. */
export class Timing {
  readonly total: number;
  readonly voDir: string | null;
  readonly rows: StepTime[];
  private byId: Record<string, StepTime>;

  constructor(lang: Lang) {
    const t = (timeline as unknown as Record<Lang, {total: number; voDir: string | null; steps: Omit<StepTime, 'end'>[]}>)[lang];
    this.total = t.total;
    this.voDir = t.voDir;
    this.rows = t.steps.map((r) => ({...r, end: r.start + r.dur}));
    this.byId = Object.fromEntries(this.rows.map((r) => [r.id, r]));
  }

  step(id: string): StepTime {
    return this.byId[id];
  }

  /** Frame at fraction `f` of the step's narration. */
  v(id: string, f: number): number {
    const s = this.byId[id];
    return Math.round(Math.min(s.end - 2, s.voAt + f * s.voFrames));
  }

  /**
   * Frame where phrase `k` of the line starts (from the recording's pauses), or, for a language that only has
   * an estimated timeline, the frame at fraction `f` of the line.
   */
  b(id: string, k: number, f: number): number {
    const beats = this.byId[id].beats;
    return beats && beats[k] !== undefined ? beats[k] : this.v(id, f);
  }

  start(id: string): number {
    return this.byId[id].start;
  }

  end(id: string): number {
    return this.byId[id].end;
  }

  at(frame: number): StepTime {
    let cur = this.rows[0];
    for (const r of this.rows) if (r.start <= frame) cur = r;
    return cur;
  }
}

export const displayText = (t: string) =>
  t
    .replace(/A\.I\. Shiksha Mitra dot com/g, 'aishikshamitra.com')
    .replace(/AI Shiksha Mitra/g, 'AIShikshaMitra')
    .replace(/ए आय शिक्षामित्र डॉट कॉम/g, 'aishikshamitra.com ')
    .replace(/ए आय शिक्षामित्र/g, 'AIShikshaMitra')
    .replace(/ए आय/g, 'AI')
    .replace(/ +([,.?!])/g, '$1')
    .replace(/  +/g, ' ')
    .trim();

type L = Record<Lang, string>;
/** On-screen words inside the illustrations. */
export const W: Record<string, L> = {
  board: {en: 'A new teacher?', mr: 'नवा शिक्षक?'},
  secs: {en: '3 sec', mr: '३ सेकंद'},
  understood: {en: 'I understood!', mr: 'समजलं!'},
  answer: {en: 'Answer', mr: 'उत्तर'},
  but: {en: 'But...', mr: 'पण...'},
  machines: {en: 'Machines will think?', mr: 'यंत्रं विचार करतील?'},
  danger: {en: "The real danger is,", mr: 'धोका हा आहे,'},
  weStop: {en: 'we will stop.', mr: 'आपण विचार करणं सोडून देऊ.'},
  letters: {en: 'A  B  C  D', mr: 'अ  आ  इ  ई'},
  letters2: {en: '1  2  3  4', mr: 'क  ख  ग  घ'},
  think: {en: 'Think', mr: 'विचार'},
  haveAI: {en: 'Those who have AI', mr: 'AI असणारे'},
  useAI: {en: 'Those who use it well', mr: 'योग्य वापरणारे'},
  forTeachers: {en: "AI built for Bharat's teachers", mr: 'भारताच्या शिक्षकांसाठी बनवलेलं AI'},
  paper: {en: 'Question paper', mr: 'प्रश्नपत्रिका'},
  plan: {en: 'Lesson plan', mr: 'पाठ नियोजन'},
  report: {en: 'Report', mr: 'अहवाल'},
  learn: {en: 'Learn first. Then lead.', mr: 'आधी शिका. मग नेतृत्व करा.'},
  tagA: {en: 'AI gives answers.', mr: 'AI उत्तरं देतं.'},
  tagB: {en: 'Teachers build minds.', mr: 'शिक्षक माणसं घडवतात.'},
  start: {en: 'Start today', mr: 'आजच सुरुवात करा'},
  share: {en: 'Send this to one teacher', mr: 'एका शिक्षकाला पाठवा'},
  change: {en: 'who can lead the change', mr: 'जो बदल घडवू शकतो'},
};
