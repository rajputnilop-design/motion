import {BadgeCheck, Check, CreditCard, KeyRound, MessageCircle, Sparkles, Wallet, Wrench, FileText} from 'lucide-react';
import React, {useMemo} from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {easeInOut, easeOut, pop, tween} from '../anim';
import {Background, Grain} from '../components/Background';
import {LogoMark, Wordmark} from '../components/Logo';
import {Phone, PHONE_RATIO} from '../components/Phone';
import {MaskWords, Sfx, SfxName, Tap} from '../components/ui';
import {Spotlight, Rect} from '../demo/screens';
import {MobileShell, SCREEN_W} from '../reels/mobile';
import {TapGrid} from '../reels/Reel';
import {ChatHomeM} from '../reels/screens1';
import {C, SANS, SERIF_IN} from '../theme';
import {displayText, Lang, STEPS, Timing, UI} from './data';
import {
  AccountChooser,
  API_KEY_ROW,
  CreateKeyDialog,
  KEY_COPY,
  KEY_DLG,
  MoreSheetContent,
  moreRowY,
  PROJ_DLG,
  SETUP,
  SetupSheetContent,
  Sheet,
  StudioPage,
  STUDIO,
  Toast,
} from './screens';

export const apiKeyDefaults: {lang: Lang; music: boolean; voiceover: boolean; grid: boolean} = {lang: 'en', music: true, voiceover: true, grid: false};

const W = 1080;
const PHONE_W = 400;
const PHONE_SCALE = 1.42;
const PHONE_TOP = 640;
const SCREEN_TOP = 12 + 50;
const MUSIC = 0.36;
const DUCKED = 0.13;

const stepOf = (id: string) => STEPS.find((s) => s.id === id)!;
type Spot = {rect: Rect; from: number; to: number; zoom?: number; radius?: number};

/** Everything on the phone, timed from the narration. */
const buildPhone = (T: Timing) => {
  const v = T.v.bind(T);
  const sfx: {at: number; name: SfxName; volume?: number}[] = [];
  const taps: {x: number; y: number; at: number}[] = [];
  const spots: Spot[] = [];
  const tap = (x: number, y: number, at: number) => {
    taps.push({x, y, at});
    sfx.push({at, name: 'tap', volume: 0.45});
    return at;
  };
  const spot = (rect: Rect, from: number, to: number, zoom?: number, radius?: number) => {
    spots.push({rect, from, to, zoom, radius});
    sfx.push({at: from, name: 'pop', volume: 0.15});
  };

  // Step 1 — More → Your API key → the AI Studio link.
  const moreAt = tap(SCREEN_W * 0.9, 750 - 35, v('k04', 0.18));
  const apiRowAt = tap(120, moreRowY(API_KEY_ROW), v('k04', 0.48));
  const setupTop0 = 300;
  const linkAt = tap(120, setupTop0 + SETUP.link + 2, v('k04', 0.93));
  spot({x: 10, y: moreRowY(API_KEY_ROW) - 22, w: SCREEN_W - 20, h: 44}, moreAt + 14, apiRowAt - 2, 1.15, 12);
  spot({x: 16, y: setupTop0 + SETUP.link - 12, w: 214, h: 26}, v('k04', 0.68), linkAt - 2, 1.2, 8);

  // Step 2 — sign in, Create API key.
  const browserIn = linkAt + 8;
  const pickAt = tap(150, 52 + 70 + 34 + 70 + 35, v('k05', 0.42));
  const createKeyBtn = tap(STUDIO.create.x + STUDIO.create.w / 2, STUDIO.create.y + STUDIO.create.h / 2, v('k05', 0.93));
  spot({x: STUDIO.create.x - 4, y: STUDIO.create.y - 4, w: STUDIO.create.w + 8, h: STUDIO.create.h + 8}, v('k05', 0.62), createKeyBtn - 2, 1.2, 22);

  // Step 3 — choose a project; none yet, so create one and select it.
  const dlgAt = Math.max(createKeyBtn + 6, T.start('k06'));
  const menuAt = tap(SCREEN_W / 2, KEY_DLG.dropdown + 19, v('k06', 0.1));
  const createProjectAt = tap(130, KEY_DLG.createProject, v('k06', 0.4));
  const typeFrom = createProjectAt + 14;
  const projectDoneAt = tap(PROJ_DLG.create.x + PROJ_DLG.create.w / 2, PROJ_DLG.create.y + PROJ_DLG.create.h / 2, Math.max(typeFrom + 32, v('k06', 0.76)));
  spot({x: 30, y: KEY_DLG.dropdown - 26, w: SCREEN_W - 60, h: 66}, v('k06', 0.0) + 4, menuAt + 8, 1.18, 10);
  spot({x: 36, y: KEY_DLG.createProject - 20, w: SCREEN_W - 72, h: 40}, menuAt + 10, createProjectAt - 2, 1.18, 8);
  spot({x: 30, y: KEY_DLG.dropdown - 26, w: SCREEN_W - 60, h: 66}, projectDoneAt + 10, T.end('k06') - 2, 1.18, 10);

  // Step 4 — Create key, copy it.
  const createKeyAt = tap(KEY_DLG.createKey.x + KEY_DLG.createKey.w / 2, KEY_DLG.createKey.y + KEY_DLG.createKey.h / 2, v('k07', 0.14));
  const keyAt = createKeyAt + 10;
  const copyAt = tap(KEY_COPY.x + KEY_COPY.w / 2, KEY_COPY.y + KEY_COPY.h / 2, v('k07', 0.8));
  spot({x: 14, y: STUDIO.list, w: SCREEN_W - 28, h: 232}, keyAt + 6, copyAt - 14, 1.08, 14);
  spot({x: KEY_COPY.x - 6, y: KEY_COPY.y - 6, w: KEY_COPY.w + 12, h: KEY_COPY.h + 12}, copyAt - 12, copyAt + 10, 1.25, 8);

  // Step 5 — back in the app: consent, paste, Save.
  const browserOut = T.start('k08');
  const scrolled = -50;
  const checkAt = tap(45, scrolled + SETUP.under18 + 160, v('k08', 0.28));
  const pasteAt = tap(140, scrolled + SETUP.paste + 24, v('k08', 0.55));
  const saveAt = tap(SCREEN_W - 57, scrolled + SETUP.paste + 24, v('k08', 0.88));
  sfx.push({at: saveAt + 4, name: 'success', volume: 0.35});
  const privacyTop = 70;
  const setupTop = (f: number) =>
    setupTop0 +
    (scrolled - setupTop0) * tween(f, [browserOut + 6, browserOut + 26], [0, 1], easeInOut) +
    (privacyTop - scrolled) * tween(f, [T.start('k09'), T.start('k09') + 16], [0, 1], easeInOut);
  spot({x: 18, y: privacyTop + SETUP.privacy - 4, w: SCREEN_W - 36, h: 128}, T.start('k09') + 18, T.end('k09') - 6, 1.22, 14);

  const focus = spots.filter((s) => s.zoom).map((s) => ({from: s.from, to: s.to, y: s.rect.y + s.rect.h / 2, s: s.zoom ?? 1}));
  sfx.push(
    {at: moreAt + 3, name: 'whoosh-soft', volume: 0.18},
    {at: apiRowAt + 6, name: 'whoosh-soft', volume: 0.18},
    {at: browserIn, name: 'swipe', volume: 0.22},
    {at: pickAt + 8, name: 'swipe', volume: 0.15},
    {at: dlgAt, name: 'pop', volume: 0.2},
    {at: keyAt, name: 'success', volume: 0.3},
    {at: copyAt + 4, name: 'pop-high', volume: 0.25},
    {at: browserOut, name: 'swipe', volume: 0.22},
  );

  const Content: React.FC = () => {
    const frame = useCurrentFrame();
    const browserX = tween(frame, [browserIn, browserIn + 12], [1, 0], easeInOut) + tween(frame, [browserOut, browserOut + 12], [0, 1], easeInOut);
    const showBrowser = frame >= browserIn - 1 && frame <= browserOut + 13;
    return (
      <>
        <MobileShell tab={frame >= moreAt ? 'more' : 'chat'}>
          <ChatHomeM />
        </MobileShell>
        <Sheet from={moreAt + 3} to={apiRowAt + 4} top={44}>
          <MoreSheetContent pressAt={apiRowAt} />
        </Sheet>
        <Sheet from={apiRowAt + 6} top={setupTop}>
          <SetupSheetContent linkAt={linkAt} checkAt={checkAt} pasteAt={pasteAt} saveAt={saveAt} />
        </Sheet>
        {showBrowser ? (
          <div style={{position: 'absolute', inset: 0, zIndex: 60, transform: `translateX(${browserX * 100}%)`}}>
            {frame < pickAt + 18 ? <AccountChooser pickAt={pickAt} /> : null}
            {frame >= pickAt + 8 ? (
              <div style={{position: 'absolute', inset: 0, opacity: tween(frame, [pickAt + 8, pickAt + 16], [0, 1])}}>
                <StudioPage createPressAt={createKeyBtn} keyAt={keyAt} copyAt={copyAt} />
              </div>
            ) : null}
            {frame >= dlgAt - 1 && frame < createKeyAt + 16 ? (
              <CreateKeyDialog at={dlgAt} menuAt={menuAt} createProjectAt={createProjectAt} projectDoneAt={projectDoneAt} createKeyAt={createKeyAt} typeFrom={typeFrom} />
            ) : null}
            <Toast at={copyAt + 4} label="Copied to clipboard" light />
          </div>
        ) : null}
        <Toast at={saveAt + 6} label="API key saved" y={60} />
        {spots.map((s, i) => (
          <Spotlight key={i} rect={s.rect} from={s.from} to={s.to} radius={s.radius} />
        ))}
        {taps.map((t, i) => (
          <div key={i} style={{position: 'absolute', inset: 0, zIndex: 90, pointerEvents: 'none'}}>
            <Tap x={t.x} y={t.y} at={t.at} />
          </div>
        ))}
      </>
    );
  };
  return {Content, sfx, focus};
};

const focusAt = (focus: {from: number; to: number; y: number; s: number}[], frame: number) => {
  let wsum = 0;
  let ysum = 0;
  let s = 1;
  for (const f of focus) {
    const w = tween(frame, [f.from - 4, f.from + 12], [0, 1], easeInOut) * tween(frame, [f.to - 4, f.to + 12], [1, 0], easeInOut);
    if (w <= 0) continue;
    wsum += w;
    ysum += w * f.y;
    s = Math.max(s, 1 + (f.s - 1) * w);
  }
  return {s, y: wsum > 0 ? ysum / wsum : 375};
};

/** Is the phone on screen at this frame? Hidden for the explainer graphics. */
const phoneShown = (T: Timing, f: number) => {
  const hideA = tween(f, [T.start('k02') - 4, T.start('k02') + 10], [0, 1], easeInOut) * tween(f, [T.start('k04') - 10, T.start('k04') + 4], [1, 0], easeInOut);
  const hideB = tween(f, [T.start('k10') - 4, T.start('k10') + 10], [0, 1], easeInOut);
  return 1 - Math.max(hideA, hideB);
};

const PhoneRig: React.FC<{T: Timing; build: ReturnType<typeof buildPhone>; grid?: boolean}> = ({T, build, grid}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const shown = phoneShown(T, frame);
  if (shown <= 0) return null;
  const enter = pop(frame, fps, 0, 16, 110);
  const f = focusAt(build.focus, frame);
  const float = Math.sin(frame / 45) * 5;
  return (
    <div
      style={{
        position: 'absolute',
        left: W / 2 - PHONE_W / 2,
        top: PHONE_TOP,
        width: PHONE_W,
        height: PHONE_W * PHONE_RATIO,
        transformOrigin: `50% ${SCREEN_TOP + f.y}px`,
        transform: `translateY(${(1 - enter) * 80 + float + (1 - shown) * 900}px) scale(${PHONE_SCALE * f.s}) perspective(2400px) rotateY(${Math.sin(frame / 80) * 3}deg)`,
        opacity: Math.min(1, shown * 1.5),
      }}
    >
      <div style={{position: 'absolute', left: '6%', right: '6%', top: '8%', bottom: '4%', borderRadius: 80, background: 'radial-gradient(ellipse, rgba(116,80,239,0.45), transparent 70%)', filter: 'blur(50px)'}} />
      <Phone width={PHONE_W} darkStatus screenStyle={{background: C.app}}>
        <build.Content />
        {grid ? <TapGrid /> : null}
      </Phone>
    </div>
  );
};

const Caption: React.FC<{T: Timing; lang: Lang; id: string}> = ({T, lang, id}) => {
  const frame = useCurrentFrame();
  const st = T.step(id);
  const words = displayText(stepOf(id).vo[lang]).split(' ');
  const total = words.reduce((n, w) => n + w.length + 1, 0);
  const p = (frame - st.voAt) / Math.max(1, st.voFrames);
  let acc = 0;
  return (
    <div style={{fontFamily: SANS, fontSize: 38, lineHeight: 1.42, fontWeight: 500, textAlign: 'center', opacity: tween(frame, [st.start, st.start + 8], [0, 1])}}>
      {words.map((w, i) => {
        const at = acc / total;
        acc += w.length + 1;
        const lit = tween(p, [at - 0.04, at + 0.02], [0, 1]);
        return (
          <span key={i} style={{color: `rgba(244,244,245,${0.36 + 0.64 * lit})`}}>
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        );
      })}
    </div>
  );
};

const TopText: React.FC<{T: Timing; lang: Lang; focus: {from: number; to: number; y: number; s: number}[]}> = ({T, lang, focus}) => {
  const frame = useCurrentFrame();
  const st = T.at(frame);
  const step = stepOf(st.id) as (typeof STEPS)[number] & {step?: number};
  if (st.id === 'k11') return null;
  const zoom = Math.min(1, (focusAt(focus, frame).s - 1) / 0.12);
  return (
    <>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 700, background: 'linear-gradient(180deg, rgba(5,5,7,0.96) 0%, rgba(5,5,7,0.9) 72%, rgba(5,5,7,0) 100%)', opacity: zoom}} />
      {step.step ? (
        <div style={{position: 'absolute', top: 206, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12}}>
          <div style={{fontFamily: SANS, fontSize: 24, fontWeight: 700, letterSpacing: lang === 'en' ? '0.18em' : '0.04em', color: '#C4B5FD'}}>{UI.step[lang].replace('{n}', String(step.step))}</div>
          <div style={{display: 'flex', gap: 8}}>
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} style={{width: 64, height: 6, borderRadius: 3, background: n <= (step.step ?? 0) ? 'linear-gradient(90deg, #7450EF, #A3A6F9)' : 'rgba(255,255,255,0.14)'}} />
            ))}
          </div>
        </div>
      ) : null}
      <div key={st.id} style={{position: 'absolute', top: step.step ? 270 : 236, left: 60, right: 60}}>
        <MaskWords
          text={step.title[lang]}
          at={st.start + 2}
          stagger={2}
          style={{justifyContent: 'center', textAlign: 'center', fontFamily: SERIF_IN, fontSize: 70, fontWeight: 600, color: C.text, lineHeight: 1.12}}
        />
        <div style={{marginTop: 22}}>
          <Caption T={T} lang={lang} id={st.id} />
        </div>
      </div>
    </>
  );
};

const BrandBug: React.FC<{T: Timing}> = ({T}) => {
  const frame = useCurrentFrame();
  const o = tween(frame, [T.start('k11') - 6, T.start('k11') + 6], [1, 0]);
  if (o <= 0) return null;
  return (
    <div style={{position: 'absolute', top: 104, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14, opacity: o}}>
      <LogoMark size={60} glow={0.5} />
      <Wordmark size={34} />
    </div>
  );
};

const Chip: React.FC<{at: number; icon: React.ReactNode; label: string; big?: boolean}> = ({at, icon, label, big}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = pop(frame, fps, at, 12, 150);
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14,
        padding: big ? '20px 30px' : '14px 24px',
        borderRadius: 999,
        background: 'rgba(116,80,239,0.18)',
        border: '1.5px solid rgba(139,108,246,0.6)',
        fontFamily: SANS,
        fontSize: big ? 38 : 32,
        fontWeight: 600,
        color: C.text,
        opacity: Math.min(1, p * 1.5),
        transform: `scale(${0.6 + 0.4 * p})`,
      }}
    >
      {icon}
      {label}
    </div>
  );
};

/** k01 — chips over the phone: one-time setup, free. */
const IntroChips: React.FC<{T: Timing; lang: Lang}> = ({T, lang}) => {
  const frame = useCurrentFrame();
  const end = T.start('k02');
  if (frame > end + 8) return null;
  const o = tween(frame, [end - 8, end + 4], [1, 0]);
  return (
    <div style={{opacity: o}}>
      <div style={{position: 'absolute', top: 1060, left: 40, transform: 'rotate(-5deg)'}}>
        <Chip at={T.v('k01', 0.4)} icon={<BadgeCheck size={30} color="#4ADE80" />} label={UI.free[lang]} big />
      </div>
      <div style={{position: 'absolute', top: 1300, right: 40, transform: 'rotate(4deg)'}}>
        <Chip at={T.v('k01', 0.62)} icon={<KeyRound size={30} color="#DABE47" />} label={UI.oneTime[lang]} big />
      </div>
    </div>
  );
};

const Node: React.FC<{at: number; children: React.ReactNode; glow?: string}> = ({at, children, glow = 'rgba(116,80,239,0.5)'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = pop(frame, fps, at, 14, 140);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 22,
        padding: '26px 36px',
        borderRadius: 28,
        background: 'rgba(22,22,28,0.92)',
        border: '1.5px solid rgba(139,108,246,0.45)',
        boxShadow: `0 0 50px -10px ${glow}`,
        fontFamily: SANS,
        fontSize: 40,
        fontWeight: 600,
        color: C.text,
        opacity: Math.min(1, p * 1.4),
        transform: `translateY(${(1 - p) * 40}px) scale(${0.85 + 0.15 * p})`,
      }}
    >
      {children}
    </div>
  );
};

const Link: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  const p = tween(frame, [at, at + 14], [0, 1], easeOut);
  const dash = (frame * 2) % 40;
  return (
    <svg width="20" height="120" style={{display: 'block', margin: '6px auto'}}>
      <line x1="10" y1="0" x2="10" y2={120 * p} stroke="#8B74F2" strokeWidth="4" strokeDasharray="10 10" strokeDashoffset={-dash} strokeLinecap="round" />
    </svg>
  );
};

/** k02 — the app reaches Google's AI through your key; chat, tools and papers light up. */
const KeyDiagram: React.FC<{T: Timing; lang: Lang}> = ({T, lang}) => {
  const frame = useCurrentFrame();
  const a = T.start('k02');
  const b = T.start('k03');
  if (frame < a - 2 || frame > b + 10) return null;
  const o = tween(frame, [a, a + 8], [0, 1]) * tween(frame, [b - 4, b + 8], [1, 0]);
  const feats = [
    {I: MessageCircle, t: UI.chat[lang], at: T.v('k02', 0.66)},
    {I: Wrench, t: UI.tools[lang], at: T.v('k02', 0.78)},
    {I: FileText, t: UI.papers[lang], at: T.v('k02', 0.9)},
  ];
  return (
    <div style={{position: 'absolute', top: 700, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: o}}>
      <Node at={a + 4}>
        <LogoMark size={64} glow={0.6} />
        AIShikshaMitra
      </Node>
      <Link at={a + 14} />
      <Node at={T.v('k02', 0.12)} glow="rgba(218,190,71,0.55)">
        <KeyRound size={52} color="#DABE47" />
        {UI.yourKey[lang]}
      </Node>
      <Link at={T.v('k02', 0.25)} />
      <Node at={T.v('k02', 0.32)} glow="rgba(10,140,240,0.55)">
        <Sparkles size={50} color="#7DB4FF" />
        Google AI · Gemini
      </Node>
      <div style={{display: 'flex', gap: 18, marginTop: 70, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 980}}>
        {feats.map(({I, t, at}) => (
          <Chip key={t} at={at} icon={<I size={30} color="#B9A3FF" />} label={t} />
        ))}
      </div>
    </div>
  );
};

/** k03 — ₹0: no card, no payment. */
const FreeCard: React.FC<{T: Timing; lang: Lang}> = ({T, lang}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const a = T.start('k03');
  const b = T.start('k04');
  if (frame < a - 2 || frame > b + 10) return null;
  const o = tween(frame, [a, a + 8], [0, 1]) * tween(frame, [b - 6, b + 6], [1, 0]);
  const p = pop(frame, fps, a + 2, 11, 140);
  return (
    <div style={{position: 'absolute', top: 760, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: o}}>
      <div style={{position: 'absolute', top: -60, width: 720, height: 520, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(74,222,128,0.18), transparent 65%)'}} />
      <div style={{fontFamily: SERIF_IN, fontSize: 300, fontWeight: 700, lineHeight: 1, color: C.white, transform: `scale(${0.6 + 0.4 * p})`, textShadow: '0 0 60px rgba(74,222,128,0.45)', fontVariantNumeric: 'lining-nums'}}>
        ₹0
      </div>
      <div style={{display: 'flex', gap: 20, marginTop: 50}}>
        <Chip at={T.v('k03', 0.45)} icon={<CreditCard size={30} color="#4ADE80" />} label={UI.noCard[lang]} big />
        <Chip at={T.v('k03', 0.75)} icon={<Wallet size={30} color="#4ADE80" />} label={UI.noPayment[lang]} big />
      </div>
      <div style={{marginTop: 46, padding: '12px 24px', borderRadius: 12, background: '#202124', border: '1px solid #34353A', fontFamily: SANS, fontSize: 28, color: '#A6A8AE', opacity: tween(frame, [a + 30, a + 42], [0, 1])}}>
        Google AI Studio · <span style={{color: '#9AA8FF'}}>Free tier</span>
      </div>
    </div>
  );
};

/** k10 — free tier now, paid plan only if you choose. */
const Plans: React.FC<{T: Timing; lang: Lang}> = ({T, lang}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const a = T.start('k10');
  const b = T.start('k11');
  if (frame < a - 2 || frame > b + 10) return null;
  const o = tween(frame, [a, a + 8], [0, 1]) * tween(frame, [b - 6, b + 6], [1, 0]);
  const card = (at: number, on: boolean, title: string, big: React.ReactNode, lines: string[]) => {
    const p = pop(frame, fps, at, 14, 140);
    return (
      <div
        style={{
          width: 860,
          borderRadius: 32,
          padding: '34px 40px',
          background: on ? 'linear-gradient(135deg, rgba(74,222,128,0.16), rgba(22,22,28,0.95) 60%)' : 'rgba(22,22,28,0.9)',
          border: `2px solid ${on ? 'rgba(74,222,128,0.6)' : 'rgba(255,255,255,0.14)'}`,
          boxShadow: on ? '0 0 60px -14px rgba(74,222,128,0.6)' : undefined,
          fontFamily: SANS,
          opacity: Math.min(1, p * 1.4),
          transform: `translateY(${(1 - p) * 40}px)`,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <span style={{fontSize: 44, fontWeight: 700, color: C.text}}>{title}</span>
          {typeof big === 'string' ? <span style={{fontFamily: SERIF_IN, fontSize: 64, fontWeight: 700, color: '#4ADE80'}}>{big}</span> : big}
        </div>
        {lines.map((l) => (
          <div key={l} style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 18, fontSize: 34, color: on ? '#E4E4E7' : '#A1A1AA'}}>
            <Check size={30} color={on ? '#4ADE80' : '#71717A'} strokeWidth={3} /> {l}
          </div>
        ))}
      </div>
    );
  };
  return (
    <div style={{position: 'absolute', top: 760, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 36, opacity: o}}>
      {card(a + 4, true, UI.freeTier[lang], '₹0', [UI.everyday[lang]])}
      {card(
        T.v('k10', 0.5),
        false,
        UI.paid[lang],
        <span style={{padding: '8px 18px', borderRadius: 999, border: '1.5px solid rgba(255,255,255,0.25)', fontSize: 28, fontWeight: 600, color: '#D4D4D8'}}>{UI.optional[lang]}</span>,
        [UI.onlyIf[lang], UI.choice[lang]],
      )}
    </div>
  );
};

const EndCard: React.FC<{T: Timing; lang: Lang}> = ({T, lang}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const at = T.start('k11');
  if (frame < at) return null;
  const word = pop(frame, fps, at + 20, 14, 120);
  const ok = pop(frame, fps, at + 32, 11, 150);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 540 - 520, top: 140, width: 1040, height: 1040, borderRadius: '50%', background: 'radial-gradient(circle, rgba(20,80,245,0.3), rgba(116,80,239,0.16) 38%, transparent 68%)', opacity: tween(frame, [at, at + 20], [0, 1])}} />
      <div style={{position: 'absolute', left: 540 - 150, top: 360}}>
        <LogoMark size={300} at={at + 2} glow={1} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 720, display: 'flex', justifyContent: 'center', opacity: Math.min(1, word * 1.4), transform: `translateY(${(1 - word) * 30}px)`}}>
        <Wordmark size={96} align="center" />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 960, display: 'flex', justifyContent: 'center', opacity: Math.min(1, ok * 1.4), transform: `scale(${0.7 + 0.3 * ok})`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 20, padding: '22px 40px', borderRadius: 999, background: 'rgba(34,197,94,0.14)', border: '2px solid rgba(74,222,128,0.6)', fontFamily: SERIF_IN, fontSize: 60, fontWeight: 600, color: C.text}}>
          <BadgeCheck size={58} color="#4ADE80" /> {stepOf('k11').title[lang]}
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1130, textAlign: 'center', fontFamily: SERIF_IN, fontStyle: lang === 'en' ? 'italic' : 'normal', fontSize: 66, color: C.lavender, opacity: tween(frame, [at + 46, at + 58], [0, 1])}}>
        {UI.happy[lang]}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1300, textAlign: 'center', fontFamily: SANS, fontSize: 42, fontWeight: 600, letterSpacing: '0.04em', color: C.text2, opacity: tween(frame, [at + 58, at + 70], [0, 1])}}>
        aishikshamitra.com
      </div>
    </AbsoluteFill>
  );
};

export const ApiKeyReel: React.FC<{lang: Lang; music?: boolean; voiceover?: boolean; grid?: boolean}> = ({lang, music = true, voiceover = true, grid}) => {
  const T = useMemo(() => new Timing(lang), [lang]);
  const build = useMemo(() => buildPhone(T), [T]);
  const volume = (f: number) => {
    let v = MUSIC;
    if (voiceover && T.voDir) {
      for (const l of T.rows) {
        const ramp = interpolate(f, [l.voAt - 8, l.voAt, l.voAt + l.voFrames, l.voAt + l.voFrames + 12], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        v = Math.min(v, MUSIC - (MUSIC - DUCKED) * ramp);
      }
    }
    return v;
  };
  return (
    <AbsoluteFill style={{background: '#050507'}}>
      <Background />
      <PhoneRig T={T} build={build} grid={grid} />
      <IntroChips T={T} lang={lang} />
      <TopText T={T} lang={lang} focus={build.focus} />
      <BrandBug T={T} />
      <KeyDiagram T={T} lang={lang} />
      <FreeCard T={T} lang={lang} />
      <Plans T={T} lang={lang} />
      <EndCard T={T} lang={lang} />
      {music ? <Audio src={staticFile(`audio/apikey/music-${lang}.wav`)} volume={volume} /> : null}
      {voiceover && T.voDir
        ? T.rows.map((l) => (
            <Sequence key={l.id} from={l.voAt} layout="none" name={`vo-${l.id}`}>
              <Audio src={staticFile(`${T.voDir}/${l.id}.wav`)} volume={1} />
            </Sequence>
          ))
        : null}
      {build.sfx.map((s, i) => (
        <Sfx key={i} at={s.at} name={s.name} volume={s.volume ?? 0.4} />
      ))}
      <Sfx at={T.start('k02')} name="whoosh-soft" volume={0.2} />
      <Sfx at={T.start('k03') + 2} name="impact" volume={0.14} />
      <Sfx at={T.start('k04')} name="whoosh-soft" volume={0.2} />
      <Sfx at={T.start('k10')} name="whoosh-soft" volume={0.2} />
      <Sfx at={T.start('k11') + 2} name="shimmer" volume={0.3} />
      <Grain />
    </AbsoluteFill>
  );
};

export const apiKeyDuration = (lang: Lang) => new Timing(lang).total;
