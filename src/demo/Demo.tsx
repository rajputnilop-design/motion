import React, {useMemo} from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {easeInOut, easeOut, pop, tween} from '../anim';
import {Background, Grain} from '../components/Background';
import {BROWSER_H, BROWSER_W} from '../components/Browser';
import {LogoMark, Wordmark} from '../components/Logo';
import {Phone, PHONE_RATIO} from '../components/Phone';
import {MaskWords, Sfx} from '../components/ui';
import {C, SANS, SERIF_IN} from '../theme';
import {CHAPTERS, chapterIndex, displayText, Lang, NUMBERED, STEPS, Timing, UI} from './data';
import {buildPhone, DemoPhone, Focus} from './phone';
import {TapGrid} from '../reels/Reel';
import {DesktopView} from './screens';

export const demoDefaults: {lang: Lang; music: boolean; voiceover: boolean} = {lang: 'en', music: true, voiceover: true};

const PHONE_W = 400;
const PHONE_SCALE = 1.14;
const PHONE_TOP = 62;
const PANEL_X = 990;
const PANEL_W = 820;
const MUSIC = 0.34;
const DUCKED = 0.12;
// Logical y of the screen content inside the Phone mockup (bezel + status bar).
const SCREEN_TOP = 12 + 50;

const stepOf = (id: string) => STEPS.find((s) => s.id === id)!;

/** Zoom that follows spotlights flagged for a closer look. */
const focusAt = (focus: Focus[], frame: number) => {
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

const Laptop: React.FC<{T: Timing}> = ({T}) => {
  const frame = useCurrentFrame();
  const a = T.start('s02');
  const b = T.start('s03');
  const enter = tween(frame, [a, a + 22], [0, 1], easeOut);
  const exit = tween(frame, [b - 4, b + 14], [0, 1], easeInOut);
  if (frame < a - 1 || exit >= 1) return null;
  const k = 0.585;
  const w = BROWSER_W * k;
  const h = BROWSER_H * k;
  return (
    <div
      style={{
        position: 'absolute',
        left: 880,
        top: 168,
        width: w + 40,
        opacity: Math.min(1, enter * 1.4) * (1 - exit),
        transform: `translateX(${(1 - enter) * 160 + exit * 120}px) perspective(2200px) rotateY(-7deg)`,
      }}
    >
      <div style={{padding: 14, borderRadius: 26, background: 'linear-gradient(160deg, #3A3D4A, #15161C 40%, #0B0C10)', boxShadow: '0 40px 90px -30px rgba(0,0,0,0.8)'}}>
        <div style={{width: w, height: h, overflow: 'hidden', borderRadius: 10}}>
          <div style={{transform: `scale(${k})`, transformOrigin: '0 0'}}>
            <DesktopView />
          </div>
        </div>
      </div>
      <div style={{margin: '0 -46px', height: 22, borderRadius: '0 0 26px 26px', background: 'linear-gradient(180deg, #4A4D5A, #23252D 60%, #121318)'}} />
      <div style={{margin: '-22px auto 0', width: 160, height: 9, borderRadius: '0 0 10px 10px', background: '#16171C'}} />
    </div>
  );
};

const PhoneRig: React.FC<{T: Timing; lang: Lang; grid?: boolean}> = ({T, lang, grid}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const build = useMemo(() => buildPhone(T, lang), [T, lang]);
  const a = T.start('s02');
  const out = T.start('s27');
  if (frame < a - 1) return null;
  const enter = pop(frame, fps, a, 16, 110);
  const exit = tween(frame, [out - 2, out + 16], [0, 1], easeInOut);
  if (exit >= 1) return null;
  const toSide = tween(frame, [T.start('s03') - 4, T.start('s03') + 16], [0, 1], easeInOut);
  const cx = 430 + 130 * toSide;
  const f = focusAt(build.focus, frame);
  const float = Math.sin(frame / 45) * 5;
  const sway = -6 + Math.sin(frame / 80) * 2;
  return (
    <div
      style={{
        position: 'absolute',
        left: cx - PHONE_W / 2,
        top: PHONE_TOP,
        width: PHONE_W,
        height: PHONE_W * PHONE_RATIO,
        transformOrigin: `50% ${SCREEN_TOP + f.y}px`,
        transform: `translateY(${(1 - enter) * 520 + float + exit * 80}px) scale(${PHONE_SCALE * f.s * (1 - 0.1 * exit)}) perspective(2400px) rotateY(${sway}deg)`,
        opacity: Math.min(1, enter * 2) * (1 - exit),
      }}
    >
      <div style={{position: 'absolute', left: '6%', right: '6%', top: '8%', bottom: '4%', borderRadius: 80, background: 'radial-gradient(ellipse, rgba(116,80,239,0.45), transparent 70%)', filter: 'blur(50px)'}} />
      <Phone width={PHONE_W} darkStatus screenStyle={{background: C.app}}>
        <DemoPhone build={build} frame={frame} />
        {grid ? <TapGrid /> : null}
      </Phone>
    </div>
  );
};

const PhoneSfx: React.FC<{T: Timing; lang: Lang}> = ({T, lang}) => {
  const build = useMemo(() => buildPhone(T, lang), [T, lang]);
  return (
    <>
      {build.sfx.map((s, i) => (
        <Sfx key={i} at={s.at} name={s.name} volume={s.volume ?? 0.4} />
      ))}
    </>
  );
};

const Intro: React.FC<{T: Timing; lang: Lang}> = ({T, lang}) => {
  const frame = useCurrentFrame();
  const end = T.end('s01');
  if (frame > end + 16) return null;
  const out = tween(frame, [end - 8, end + 12], [0, 1], easeInOut);
  return (
    <AbsoluteFill style={{opacity: 1 - out, transform: `scale(${1 - 0.06 * out})`}}>
      <div style={{position: 'absolute', left: 960 - 330, top: 140, width: 660, height: 660, borderRadius: '50%', background: 'radial-gradient(circle, rgba(20,80,245,0.28), rgba(116,80,239,0.14) 40%, transparent 70%)'}} />
      <div style={{position: 'absolute', left: 960 - 120, top: 150}}>
        <LogoMark size={240} at={4} glow={1} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 420, display: 'flex', justifyContent: 'center', opacity: tween(frame, [22, 34], [0, 1]), transform: `translateY(${tween(frame, [22, 40], [24, 0])}px)`}}>
        <Wordmark size={64} align="center" />
      </div>
      <div style={{position: 'absolute', left: 120, right: 120, top: 600}}>
        <MaskWords text={UI.introTitle[lang]} at={36} stagger={3} style={{justifyContent: 'center', fontFamily: SERIF_IN, fontSize: 92, fontWeight: 600, color: C.text, lineHeight: 1.15}} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 742,
          textAlign: 'center',
          fontFamily: SANS,
          fontSize: 36,
          fontWeight: 500,
          letterSpacing: lang === 'en' ? '0.04em' : 0,
          color: C.lavender,
          opacity: tween(frame, [50, 62], [0, 1]),
        }}
      >
        {UI.introSub[lang]}
      </div>
      <Caption T={T} lang={lang} id="s01" style={{position: 'absolute', left: 260, right: 260, top: 860, textAlign: 'center', fontSize: 30}} />
    </AbsoluteFill>
  );
};

/** The narration line on screen, words brightening as they are spoken. */
const Caption: React.FC<{T: Timing; lang: Lang; id: string; style?: React.CSSProperties}> = ({T, lang, id, style}) => {
  const frame = useCurrentFrame();
  const st = T.step(id);
  const words = displayText(stepOf(id).vo[lang]).split(' ');
  const total = words.reduce((n, w) => n + w.length + 1, 0);
  const p = (frame - st.voAt) / Math.max(1, st.voFrames);
  let acc = 0;
  return (
    <div style={{fontFamily: SANS, fontSize: 32, lineHeight: 1.5, color: C.text, opacity: tween(frame, [st.start, st.start + 8], [0, 1]), ...style}}>
      {words.map((w, i) => {
        const at = acc / total;
        acc += w.length + 1;
        const lit = tween(p, [at - 0.04, at + 0.02], [0, 1]);
        return (
          <span key={i} style={{color: `rgba(244,244,245,${0.38 + 0.62 * lit})`}}>
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        );
      })}
    </div>
  );
};

const Panel: React.FC<{T: Timing; lang: Lang}> = ({T, lang}) => {
  const frame = useCurrentFrame();
  const st = T.at(frame);
  if (frame < T.start('s02') || frame >= T.start('s27') + 14) return null;
  const step = stepOf(st.id);
  const devices = st.id === 's02';
  const exit = tween(frame, [T.start('s27') - 2, T.start('s27') + 12], [0, 1], easeInOut);
  const chapter = CHAPTERS.find((c) => c.id === step.chapter)!;
  const n = chapterIndex(step.chapter);
  const firstOfChapter = STEPS.find((s) => s.chapter === step.chapter)!.id;
  const chapStart = T.start(firstOfChapter);
  const enter = (d: number) => ({
    opacity: tween(frame, [st.start + d, st.start + d + 10], [0, 1]),
    transform: `translateY(${tween(frame, [st.start + d, st.start + d + 14], [16, 0])}px)`,
  });
  const top = devices ? 770 : 236;
  const path = (step as {path?: string[]}).path;
  return (
    <div style={{position: 'absolute', left: PANEL_X, top: 0, width: PANEL_W, height: 1080, opacity: 1 - exit}}>
      {n > 0 ? (
        <div
          style={{
            position: 'absolute',
            top: top - 58,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 21,
            letterSpacing: lang === 'en' ? '0.2em' : '0.04em',
            color: C.purpleLight,
            opacity: tween(frame, [chapStart, chapStart + 10], [0, 1]),
          }}
        >
          <span style={{padding: '6px 12px', borderRadius: 10, background: 'rgba(116,80,239,0.2)', border: '1px solid rgba(139,108,246,0.5)', color: '#C4B5FD', letterSpacing: 0}}>
            {String(n).padStart(2, '0')}
          </span>
          {lang === 'en' ? chapter.en.toUpperCase() : chapter[lang]}
        </div>
      ) : null}
      <div key={st.id} style={{position: 'absolute', top, width: PANEL_W}}>
        <MaskWords
          text={step.title[lang]}
          at={st.start + 2}
          stagger={2}
          style={{fontFamily: SERIF_IN, fontSize: devices ? 64 : 76, fontWeight: 600, color: C.text, lineHeight: 1.12}}
        />
        {path ? (
          <div style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 26, ...enter(8)}}>
            {path.map((p, i) => (
              <React.Fragment key={p}>
                {i > 0 ? <span style={{color: '#8B74F2', fontSize: 26}}>›</span> : null}
                <span style={{padding: '8px 18px', borderRadius: 999, background: 'rgba(116,80,239,0.18)', border: '1.5px solid rgba(139,108,246,0.55)', fontFamily: SANS, fontSize: 22, fontWeight: 600, color: '#DDD6FE'}}>
                  {p}
                </span>
              </React.Fragment>
            ))}
          </div>
        ) : null}
        <Caption T={T} lang={lang} id={st.id} style={{marginTop: path ? 30 : 28, fontSize: devices ? 28 : 34, maxWidth: PANEL_W}} />
      </div>
      {!devices ? <ChapterSteps T={T} lang={lang} frame={frame} chapter={step.chapter} current={st.id} /> : null}
      {!devices ? <Progress T={T} frame={frame} /> : null}
    </div>
  );
};

const IN_CHAPTER: Record<Lang, string> = {en: 'IN THIS CHAPTER', hi: 'इस अध्याय में', mr: 'या प्रकरणात'};

/** Checklist of the chapter's steps: done ones ticked, the current one lit. */
const ChapterSteps: React.FC<{T: Timing; lang: Lang; frame: number; chapter: string; current: string}> = ({T, lang, frame, chapter, current}) => {
  const steps = STEPS.filter((s) => s.chapter === chapter);
  if (steps.length < 2) return null;
  const a = T.start(steps[0].id);
  const ci = steps.findIndex((s) => s.id === current);
  return (
    <div style={{position: 'absolute', top: 1000 - 46 - steps.length * 40, left: 0, width: PANEL_W, opacity: tween(frame, [a + 6, a + 18], [0, 1])}}>
      <div style={{fontFamily: SANS, fontSize: 15, fontWeight: 700, letterSpacing: lang === 'en' ? '0.22em' : '0.04em', color: '#7C7A8C', marginBottom: 10}}>{IN_CHAPTER[lang]}</div>
      {steps.map((s, i) => {
        const done = i < ci;
        const cur = i === ci;
        const lit = cur ? tween(frame, [T.start(s.id), T.start(s.id) + 10], [0, 1]) : 0;
        return (
          <div key={s.id} style={{display: 'flex', alignItems: 'center', gap: 14, height: 40, fontFamily: SANS, fontSize: 22, fontWeight: cur ? 600 : 500, color: cur ? C.text : done ? '#A1A1AA' : '#5E5C6B'}}>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                fontWeight: 700,
                color: done ? '#0B0B0E' : cur ? C.white : '#5E5C6B',
                background: done ? '#8B74F2' : cur ? `rgba(116,80,239,${0.4 + 0.6 * lit})` : 'transparent',
                border: done || cur ? 'none' : '1.5px solid #3F3F46',
                boxShadow: cur ? `0 0 ${16 * lit}px rgba(139,108,246,0.9)` : undefined,
              }}
            >
              {done ? '✓' : i + 1}
            </div>
            {s.title[lang]}
          </div>
        );
      })}
    </div>
  );
};

const Progress: React.FC<{T: Timing; frame: number}> = ({T, frame}) => {
  const spans = NUMBERED.map((c) => {
    const ids = STEPS.filter((s) => s.chapter === c.id).map((s) => s.id);
    return {id: c.id, a: T.start(ids[0]), b: T.end(ids[ids.length - 1])};
  });
  const show = tween(frame, [T.start('s03'), T.start('s03') + 14], [0, 1]);
  return (
    <div style={{position: 'absolute', top: 1000, left: 0, width: PANEL_W, display: 'flex', gap: 8, opacity: show}}>
      {spans.map((s) => {
        const p = interpolate(frame, [s.a, s.b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const cur = frame >= s.a && frame < s.b;
        return (
          <div key={s.id} style={{flex: 1, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.1)', overflow: 'hidden'}}>
            <div style={{width: `${p * 100}%`, height: '100%', borderRadius: 3, background: cur ? 'linear-gradient(90deg, #7450EF, #A3A6F9)' : '#6D55D8'}} />
          </div>
        );
      })}
    </div>
  );
};

const BrandBug: React.FC<{T: Timing}> = ({T}) => {
  const frame = useCurrentFrame();
  const o = tween(frame, [T.start('s02') + 10, T.start('s02') + 24], [0, 1]) * tween(frame, [T.start('s27') - 2, T.start('s27') + 10], [1, 0]);
  if (o <= 0) return null;
  return (
    <div style={{position: 'absolute', left: PANEL_X, top: 64, display: 'flex', alignItems: 'center', gap: 14, opacity: o}}>
      <LogoMark size={52} glow={0.5} />
      <Wordmark size={30} />
    </div>
  );
};

const Outro: React.FC<{T: Timing; lang: Lang}> = ({T, lang}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const at = T.start('s27');
  if (frame < at) return null;
  const word = pop(frame, fps, at + 22, 14, 120);
  const cta = pop(frame, fps, at + 50, 12, 150);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 960 - 420, top: 0, width: 840, height: 840, borderRadius: '50%', background: 'radial-gradient(circle, rgba(20,80,245,0.28), rgba(116,80,239,0.16) 38%, transparent 68%)', opacity: tween(frame, [at, at + 20], [0, 1])}} />
      <div style={{position: 'absolute', left: 960 - 115, top: 96}}>
        <LogoMark size={230} at={at + 4} glow={1} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 356, display: 'flex', justifyContent: 'center', opacity: Math.min(1, word * 1.4), transform: `translateY(${(1 - word) * 30}px)`}}>
        <Wordmark size={78} align="center" />
      </div>
      <div style={{position: 'absolute', left: 140, right: 140, top: 540}}>
        <MaskWords text={stepOf('s27').title[lang]} at={at + 34} stagger={3} style={{justifyContent: 'center', fontFamily: SERIF_IN, fontSize: 84, fontWeight: 600, color: C.text, lineHeight: 1.15}} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 720, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22}}>
        <div
          style={{
            padding: '22px 60px',
            borderRadius: 999,
            background: 'linear-gradient(135deg, #6A45EC, #7450EF 50%, #8E6CF6)',
            boxShadow: '0 20px 50px -14px rgba(116,80,239,0.9)',
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 40,
            color: C.white,
            opacity: Math.min(1, cta * 1.5),
            transform: `scale(${0.7 + 0.3 * cta})`,
          }}
        >
          {UI.cta[lang]}
        </div>
        <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 36, letterSpacing: '0.04em', color: C.text2, opacity: tween(frame, [at + 60, at + 70], [0, 1])}}>aishikshamitra.com</div>
      </div>
    </AbsoluteFill>
  );
};

export const Demo: React.FC<{lang: Lang; music?: boolean; voiceover?: boolean; grid?: boolean}> = ({lang, music = true, voiceover = true, grid}) => {
  const T = useMemo(() => new Timing(lang), [lang]);
  const vo = T.rows;
  const volume = (f: number) => {
    let v = MUSIC;
    if (voiceover && T.voDir) {
      for (const l of vo) {
        const ramp = interpolate(f, [l.voAt - 8, l.voAt, l.voAt + l.voFrames, l.voAt + l.voFrames + 12], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        v = Math.min(v, MUSIC - (MUSIC - DUCKED) * ramp);
      }
    }
    return v;
  };
  const chapterStarts = CHAPTERS.map((c) => STEPS.find((s) => s.chapter === c.id)!.id).filter((id) => id !== 's01');
  return (
    <AbsoluteFill style={{background: '#050507'}}>
      <Background />
      <Intro T={T} lang={lang} />
      <Laptop T={T} />
      <PhoneRig T={T} lang={lang} grid={grid} />
      <BrandBug T={T} />
      <Panel T={T} lang={lang} />
      <Outro T={T} lang={lang} />
      {music ? <Audio src={staticFile(`audio/demo/music-${lang}.wav`)} volume={volume} /> : null}
      {voiceover && T.voDir
        ? vo.map((l) => (
            <Sequence key={l.id} from={l.voAt} layout="none" name={`vo-${l.id}`}>
              <Audio src={staticFile(`${T.voDir}/${l.id}.wav`)} volume={1} />
            </Sequence>
          ))
        : null}
      <PhoneSfx T={T} lang={lang} />
      <Sfx at={4} name="shimmer" volume={0.3} />
      {chapterStarts.map((id) => (
        <Sfx key={id} at={T.start(id)} name="whoosh-soft" volume={0.16} />
      ))}
      <Sfx at={T.start('s27') + 4} name="shimmer" volume={0.28} />
      <Grain />
    </AbsoluteFill>
  );
};

export const demoDuration = (lang: Lang) => new Timing(lang).total;
