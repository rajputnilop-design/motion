import React from 'react';
import {useCurrentFrame} from 'remotion';
import {easeInOut, tween} from '../anim';
import {SfxName, Tap} from '../components/ui';
import {HEADER_H, MobileShell, Overlay, ScreenStack, Tab} from '../reels/mobile';
import {ChatHomeM, GeneratingM, LessonFormM, LessonPlanM, LessonPlannerM, VoiceCallM} from '../reels/screens1';
import {PaperM, PublishedM, QPBasicsM, QPBlueprintM, QPChapterM, QPFinishM, QPStudioM, ReportM, SubmissionsM} from '../reels/screens2';
import {CoursesM, EnglishHomeM, EnglishPracticeM, LabM, MahaTETM, MockQuestionM, RegisterToSheetM, StudentHubM} from '../reels/screens3';
import {Lang, Timing, UI} from './data';
import {AIToolsM, MoreMenuM, NavTour, Rect, Spotlight, Toast, toolRect} from './screens';

type Screen = {from: number; node: React.ReactNode; fade?: boolean};
type Over = {from: number; to: number; node: React.ReactNode};
type Spot = {rect: Rect; from: number; to: number; zoom?: number; radius?: number};
export type Sfx = {at: number; name: SfxName; volume?: number};
export type Focus = {from: number; to: number; y: number; s: number};

// Toasts sit above the bottom tab bar.
const NAV_SPACE = 80;

/** Content-area rectangle (below the app header) in screen coordinates. */
const c = (x: number, y: number, w: number, h: number): Rect => ({x, y: y + HEADER_H, w, h});

/** Every phone screen, overlay, spotlight, tab change and sound of the walkthrough, timed from the narration. */
export const buildPhone = (T: Timing, lang: Lang) => {
  const screens: Screen[] = [];
  const overlays: Over[] = [];
  const spots: Spot[] = [];
  const tabs: {from: number; tab: Tab}[] = [{from: 0, tab: 'chat'}];
  const extra: React.ReactNode[] = [];
  const sfx: Sfx[] = [];
  const v = T.v.bind(T);
  const tap = (f: number) => {
    sfx.push({at: f, name: 'tap', volume: 0.45});
    return f;
  };
  const spot = (rect: Rect, from: number, to: number, zoom?: number, radius?: number) => {
    spots.push({rect, from, to, zoom, radius});
    sfx.push({at: from, name: 'pop', volume: 0.16});
  };
  const push = (from: number, node: React.ReactNode, fade = false) => {
    screens.push({from, node, fade});
    if (!fade) sfx.push({at: from, name: 'swipe', volume: 0.12});
  };
  const explainIn = lang === 'hi' ? 'Hindi' : 'Marathi';

  // Chat home, tabs, composer.
  const fabAt = tap(v('s05', 0.08));
  push(0, <ChatHomeM tapFabAt={fabAt} draft={UI.draft[lang]} typeAt={v('s04', 0.4)} />);
  extra.push(<NavTour key="nav" from={v('s03', 0.25)} to={T.end('s03') - 6} marks={[0.42, 0.55, 0.67, 0.79, 0.9].map((f) => v('s03', f))} />);
  spot(c(40, 112, 296, 222), v('s04', 0), v('s04', 0.36));
  spot(c(14, 486, 348, 100), v('s04', 0.4), v('s04', 0.58), 1.18);
  spot(c(24, 523, 26, 26), v('s04', 0.6), v('s04', 0.82), 1.18, 8);
  spot(c(55, 523, 26, 26), v('s04', 0.84), T.end('s04') - 4, 1.18, 8);

  // Voice call (full screen) — hello, then the lesson-plan request.
  const callFrom = fabAt + 6;
  const callTo = T.end('s06') - 10;
  overlays.push({
    from: callFrom,
    to: callTo,
    node: (
      <VoiceCallM
        listenAt={callFrom + 22}
        speakAt={[v('s05', 0.55), T.end('s05') - 2, v('s06', 0.42), callTo]}
        lines={[
          {who: 'You', text: UI.callHello[lang], at: callFrom + 30},
          {who: 'Aasha', text: UI.callHi[lang], at: v('s05', 0.55)},
          {who: 'You', text: UI.callAsk[lang], at: v('s06', 0.02)},
          {who: 'Aasha', text: UI.callGuide[lang], at: v('s06', 0.42)},
        ]}
      />
    ),
  });
  sfx.push({at: callFrom, name: 'whoosh-soft', volume: 0.25}, {at: callFrom + 22, name: 'ding', volume: 0.22}, {at: callTo, name: 'swipe', volume: 0.18});
  spot({x: 12, y: 422, w: 352, h: 130}, v('s05', 0.86), T.end('s05') - 2, 1.2);
  spot({x: 12, y: 422, w: 352, h: 150}, v('s06', 0.5), callTo - 8, 1.2);

  // Tools → Lesson Planner.
  tabs.push({from: callTo - 20, tab: 'tools'});
  const plannerTap = tap(v('s07', 0.75));
  push(callTo - 20, <AIToolsM tapAt={plannerTap} />, true);
  spot(toolRect(0), v('s07', 0.2), plannerTap - 2);
  const pl = {cls: tap(v('s08', 0.6)), subj: tap(v('s08', 0.77)), chap: tap(v('s08', 0.93))};
  push(plannerTap + 8, <LessonPlannerM classAt={pl.cls} subjectAt={pl.subj} chapterAt={pl.chap} />);
  spot(c(14, 123, 348, 56), v('s08', 0.02), v('s08', 0.5));
  const genLesson = tap(v('s09', 0.9));
  push(T.start('s09'), <LessonFormM generateAt={genLesson} />);
  spot(c(20, 316, 336, 50), v('s09', 0.02), v('s09', 0.32), 1.15);
  spot(c(20, 412, 336, 62), v('s09', 0.4), v('s09', 0.75), 1.15);
  const orbL = genLesson + 8;
  push(orbL, <GeneratingM caption="Creating your lesson plan..." />, true);
  sfx.push({at: orbL, name: 'shimmer', volume: 0.3});
  const planAt = Math.max(orbL + 36, T.start('s10') + 20);
  const scrollA = [v('s10', 0.3), v('s10', 0.7)];
  const scrollB = [v('s10', 0.74), v('s10', 0.9)];
  const local = v('s10', 0.88);
  push(planAt, <PlanScroll at={planAt} a={scrollA} b={scrollB} hl={local} />, true);
  sfx.push({at: planAt, name: 'success', volume: 0.3});
  const sendAt = tap(v('s11', 0.75));
  spot(c(12, 419, 250, 44), v('s11', 0.05), sendAt - 2, 1.15, 22);
  extra.push(<Tap key="send" x={180} y={HEADER_H + 441} at={sendAt} />, <Toast key="sent" at={sendAt + 6} label={UI.sentToChat[lang]} y={NAV_SPACE} />);

  // Studio → Question Paper Studio.
  tabs.push({from: T.start('s12'), tab: 'studio'});
  const createAt = tap(v('s12', 0.82));
  push(T.start('s12'), <QPStudioM createAt={createAt} />, true);
  spot(c(14, 78, 348, 46), v('s12', 0.45), createAt - 2, 1.12);
  const b = {board: tap(v('s13', 0.2)), cls: tap(v('s13', 0.3)), subj: tap(v('s13', 0.42)), next: tap(v('s13', 0.54))};
  push(createAt + 8, <QPBasicsM boardAt={b.board} classAt={b.cls} subjectAt={b.subj} nextAt={b.next} />);
  const ch = {pick: tap(v('s13', 0.84)), next: tap(T.end('s13') - 10)};
  push(b.next + 8, <QPChapterM chapterAt={ch.pick} nextAt={ch.next} />);
  const bp = {mcq: tap(v('s14', 0.36)), long: tap(v('s14', 0.56)), next: tap(T.end('s14') - 12)};
  push(ch.next + 8, <QPBlueprintM mcqAt={bp.mcq} longAt={bp.long} nextAt={bp.next} />);
  spot(c(14, 478, 348, 34), v('s14', 0.74), bp.next - 4, 1.15);
  const genPaper = tap(v('s15', 0.9));
  push(bp.next + 8, <QPFinishM generateAt={genPaper} />);
  spot(c(14, 97, 300, 38), v('s15', 0.02), v('s15', 0.45), 1.15, 19);
  spot(c(14, 166, 348, 48), v('s15', 0.48), v('s15', 0.8), 1.15);
  const orbP = genPaper + 8;
  push(orbP, <GeneratingM caption="Creating your question paper..." />, true);
  sfx.push({at: orbP, name: 'shimmer', volume: 0.3});
  const paperAt = Math.max(orbP + 36, T.start('s16') + 18);
  const pdfAt = tap(v('s16', 0.8));
  const docxAt = tap(v('s16', 0.94));
  const publishAt = tap(v('s17', 0.12));
  push(
    paperAt,
    <>
      <PaperM at={paperAt + 2} scroll={0} pdfAt={pdfAt} docxAt={docxAt} publishAt={publishAt} />
      <PublishedM at={publishAt + 8} />
    </>,
    true,
  );
  sfx.push({at: paperAt, name: 'success', volume: 0.3}, {at: publishAt + 8, name: 'success', volume: 0.3});
  spot(c(14, 66, 98, 30), v('s16', 0.3), v('s16', 0.62), 1.15, 15);
  spot(c(30, 252, 316, 52), v('s17', 0.36), v('s17', 0.72), 1.15);
  spot(c(30, 316, 316, 120), v('s17', 0.74), T.end('s17') - 4, 1.12);
  const viewAt = tap(v('s18', 0.42));
  const waAt = tap(v('s18', 0.93));
  push(T.start('s18'), <SubmissionsM at={T.start('s18') + 4} viewAt={viewAt} />);
  push(viewAt + 8, <ReportM at={viewAt + 12} whatsappAt={waAt} />);
  spot(c(14, 60, 194, 46), v('s18', 0.72), waAt - 2, 1.15, 23);

  // Tools tab again: the other helpers.
  tabs.push({from: T.start('s19'), tab: 'tools'});
  push(T.start('s19'), <AIToolsM />, true);
  spot(toolRect(1), v('s19', 0.42), v('s19', 0.6));
  spot(toolRect(2), v('s19', 0.62), v('s19', 0.82));
  spot(toolRect(3), v('s19', 0.84), T.end('s19') - 4);

  // More → The Lab.
  tabs.push({from: T.start('s20'), tab: 'more'});
  const labHl = [
    {tool: 'Marks → Report', at: tap(v('s21', 0.22))},
    {tool: 'Attendance', at: tap(v('s21', 0.42))},
    {tool: 'Notes → Word', at: tap(v('s21', 0.6))},
  ];
  push(T.start('s20'), <LabM hl={labHl} />, true);
  spot(c(14, 12, 348, 230), v('s20', 0.02), v('s20', 0.36));
  const camFrom = v('s20', 0.42);
  const shutter = camFrom + 26;
  overlays.push({from: camFrom, to: T.start('s21') + 4, node: <RegisterToSheetM shutterAt={shutter} sheetAt={shutter + 40} />});
  sfx.push({at: camFrom, name: 'whoosh-soft', volume: 0.2}, {at: shutter, name: 'tap', volume: 0.5}, {at: shutter + 2, name: 'impact', volume: 0.12}, {at: shutter + 12, name: 'shimmer', volume: 0.22}, {at: shutter + 40, name: 'success', volume: 0.3});
  spot(c(14, 484, 348, 118), v('s21', 0.8), T.end('s21') - 4);

  // More → English Speaking.
  const eng = {level: tap(v('s22', 0.2)), scroll: v('s22', 0.3), lesson: tap(v('s22', 0.44))};
  push(T.start('s22'), <EnglishHomeM levelAt={eng.level} scrollAt={eng.scroll} lessonAt={eng.lesson} explainIn={explainIn} />, true);
  push(eng.lesson + 8, <EnglishPracticeM at={eng.lesson + 12} explainIn={explainIn} />);
  sfx.push({at: eng.lesson + 12, name: 'pop', volume: 0.2}, {at: eng.lesson + 26, name: 'pop', volume: 0.2}, {at: eng.lesson + 80, name: 'ding', volume: 0.22});

  // More → MahaTET Practice.
  const tet = {p1: tap(v('s23', 0.24)), mock: tap(v('s23', 0.4)), start: tap(v('s23', 0.7)), answer: tap(v('s23', 0.95))};
  push(T.start('s23'), <MahaTETM p1At={tet.p1} mockAt={tet.mock} startAt={tet.start} />, true);
  spot(c(14 + 170 + 8, 358, 170, 58), v('s23', 0.5), v('s23', 0.68), 1.12);
  push(tet.start + 8, <MockQuestionM at={tet.start + 10} answerAt={tet.answer} />);
  sfx.push({at: tet.answer + 4, name: 'success', volume: 0.3});

  // More → Student Hub, then the Courses tab.
  const hub = {add: tap(v('s24', 0.28)), create: tap(Math.min(T.end('s24') - 10, v('s24', 0.85)))};
  push(T.start('s24'), <StudentHubM addAt={hub.add} createAt={hub.create} />);
  tabs.push({from: T.start('s25'), tab: 'courses'});
  push(T.start('s25'), <CoursesM at={T.start('s25') + 2} />, true);
  spot(c(14, 152, 348, 68), v('s25', 0.55), T.end('s25') - 4);

  // More menu.
  tabs.push({from: T.start('s26'), tab: 'more'});
  const moreHl = [
    {t: 'Analytics', at: v('s26', 0.2)},
    {t: 'Assessment', at: v('s26', 0.32)},
    {t: 'Banks', at: v('s26', 0.44)},
    {t: 'Books', at: v('s26', 0.53)},
    {t: 'App Guide', at: v('s26', 0.64)},
    {t: 'WhatsApp Support', at: v('s26', 0.82)},
  ];
  push(T.start('s26'), <MoreMenuM hl={moreHl} until={T.end('s26') + 30} />, true);
  moreHl.forEach((h) => sfx.push({at: h.at, name: 'pop', volume: 0.14}));

  const focus: Focus[] = spots.filter((s) => s.zoom).map((s) => ({from: s.from, to: s.to, y: s.rect.y + s.rect.h / 2, s: s.zoom ?? 1}));
  return {screens, overlays, spots, tabs, extra, sfx, focus};
};

/** The lesson plan, scrolled in two moves, highlighting the local examples. */
const PlanScroll: React.FC<{at: number; a: number[]; b: number[]; hl: number}> = ({at, a, b, hl}) => {
  const frame = useCurrentFrame();
  const scroll = tween(frame, [a[0], a[1]], [0, 250], easeInOut) + tween(frame, [b[0], b[1]], [0, 230], easeInOut);
  return <LessonPlanM at={at + 2} scroll={scroll} highlightAt={hl} />;
};

export const DemoPhone: React.FC<{build: ReturnType<typeof buildPhone>; frame: number}> = ({build, frame}) => {
  const tab = [...build.tabs].reverse().find((t) => frame >= t.from)?.tab ?? 'chat';
  return (
    <>
      <MobileShell tab={tab}>
        <ScreenStack screens={build.screens} />
      </MobileShell>
      {build.overlays.map((o, i) => (
        <Overlay key={i} from={o.from} to={o.to}>
          {o.node}
        </Overlay>
      ))}
      {build.spots.map((s, i) => (
        <Spotlight key={i} rect={s.rect} from={s.from} to={s.to} radius={s.radius} />
      ))}
      {build.extra}
    </>
  );
};
