import React from 'react';
import {useCurrentFrame} from 'remotion';
import {easeInOut, tween} from '../anim';
import {MobileShell, Overlay, ScreenStack} from './mobile';
import {Reel, ReelSpec} from './Reel';
import {ChatHomeM, GeneratingM, LessonFormM, LessonPlanM, LessonPlannerM, VoiceCallM} from './screens1';
import {LockScreenM, PaperM, PublishedM, QPBasicsM, QPBlueprintM, QPChapterM, QPFinishM, QPStudioM, ReportM, SubmissionsM} from './screens2';
import {CoursesM, EnglishHomeM, EnglishPracticeM, LabM, MahaTETM, MockQuestionM, RegisterToSheetM, StudentHubM} from './screens3';

// ---------------------------------------------------------------- Reel 1: Aasha + Lesson Planner

const AashaScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const scroll = tween(frame, [530, 590], [0, 250], easeInOut) + tween(frame, [612, 640], [0, 230], easeInOut);
  return (
    <>
      <MobileShell tab={frame < 300 ? 'chat' : 'tools'}>
        <ScreenStack
          screens={[
            {from: 0, node: <ChatHomeM tapFabAt={82} />},
            {from: 296, node: <LessonPlannerM classAt={344} subjectAt={370} chapterAt={398} />},
            {from: 410, node: <LessonFormM generateAt={444} />},
            {from: 452, node: <GeneratingM caption="Creating your lesson plan..." />, fade: true},
            {from: 494, node: <LessonPlanM at={496} scroll={scroll} highlightAt={640} />, fade: true},
          ]}
        />
      </MobileShell>
      <Overlay from={90} to={310}>
        <VoiceCallM
          listenAt={120}
          speakAt={[226, 300]}
          lines={[
            {who: 'You', text: 'Create a lesson plan for Class 6 Science.', at: 134},
            {who: 'Aasha', text: 'Sure! Let’s open the Lesson Planner and pick your chapter.', at: 228},
          ]}
        />
      </Overlay>
    </>
  );
};

export const aashaSpec: ReelSpec = {
  id: 'aasha',
  Screen: AashaScreen,
  beats: [
    {from: 0, to: 100, kicker: 'FOR TEACHERS', text: 'Lesson planning in one sentence?', italic: [3, 4]},
    {from: 100, to: 216, kicker: 'MEET AASHA', text: 'Your AI teaching assistant. Just talk.', italic: [4, 5]},
    {from: 216, to: 322, text: 'Ask for a lesson plan, out loud.', italic: [5, 6]},
    {from: 322, to: 460, kicker: 'LESSON PLANNER', text: 'Straight from the NCERT syllabus.', italic: [3, 4]},
    {from: 460, to: 540, text: 'A period-by-period plan.', italic: [1]},
    {from: 540, to: 616, text: 'Board plan, questions & homework.', italic: [3, 4]},
    {from: 616, to: 756, text: 'Even local examples.', italic: [1, 2]},
  ],
  cam: [
    {f: 0, s: 1},
    {f: 60, s: 1.04, fy: 420},
    {f: 96, s: 1},
    {f: 150, s: 1},
    {f: 190, s: 1.07, fy: 560},
    {f: 300, s: 1.07, fy: 560},
    {f: 320, s: 1},
    {f: 600, s: 1},
    {f: 650, s: 1.1, fy: 640},
    {f: 740, s: 1.12, fy: 640},
    {f: 760, s: 1},
  ],
  sfx: [
    {at: 0, name: 'whoosh-soft', volume: 0.35},
    {at: 82, name: 'tap'},
    {at: 90, name: 'whoosh-soft', volume: 0.3},
    {at: 120, name: 'ding', volume: 0.3},
    {at: 312, name: 'swipe', volume: 0.22},
    {at: 344, name: 'tap'},
    {at: 370, name: 'tap'},
    {at: 398, name: 'tap'},
    {at: 410, name: 'swipe', volume: 0.25},
    {at: 444, name: 'tap'},
    {at: 452, name: 'shimmer', volume: 0.35},
    {at: 494, name: 'success', volume: 0.35},
    {at: 640, name: 'pop-high', volume: 0.3},
    {at: 752, name: 'whoosh', volume: 0.35},
    {at: 764, name: 'shimmer', volume: 0.3},
    {at: 818, name: 'pop', volume: 0.35},
  ],
  endLine: 'Plan smarter, starting today.',
  endItalic: [2, 3],
};

// ---------------------------------------------------------------- Reel 2: Question Paper Studio

const PapersScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const scroll = tween(frame, [372, 430], [0, 150], easeInOut);
  return (
    <>
      <MobileShell tab="studio">
        <ScreenStack
          screens={[
            {from: 0, node: <QPStudioM createAt={140} />},
            {from: 148, node: <QPBasicsM boardAt={160} classAt={172} subjectAt={184} nextAt={196} />},
            {from: 204, node: <QPChapterM chapterAt={216} nextAt={226} />},
            {from: 232, node: <QPBlueprintM mcqAt={246} longAt={258} nextAt={272} />},
            {from: 280, node: <QPFinishM generateAt={300} />},
            {from: 306, node: <GeneratingM caption="Creating your question paper..." />, fade: true},
            {
              from: 340,
              node: (
                <>
                  <PaperM at={342} scroll={scroll} pdfAt={446} docxAt={474} publishAt={500} />
                  <PublishedM at={508} />
                </>
              ),
              fade: true,
            },
            {from: 584, node: <SubmissionsM at={588} viewAt={626} />},
            {from: 632, node: <ReportM at={636} whatsappAt={692} />},
          ]}
        />
      </MobileShell>
      <Overlay from={-20} to={80} enter="none" exit="up">
        <LockScreenM tickAt={44} />
      </Overlay>
    </>
  );
};

export const papersSpec: ReelSpec = {
  id: 'papers',
  Screen: PapersScreen,
  time: (f) => (f < 44 ? '11:58' : '11:59'),
  beats: [
    {from: 0, to: 86, text: 'Still making papers at midnight?', italic: [3, 4]},
    {from: 86, to: 148, kicker: 'QUESTION PAPER STUDIO', text: 'There’s a faster way.', italic: [2, 3]},
    {from: 148, to: 234, text: 'Pick board, class & chapter.', italic: [4]},
    {from: 234, to: 330, text: 'Set the marks you want.', italic: [2, 3, 4]},
    {from: 330, to: 420, text: 'A board-aligned paper, in minutes.', italic: [3, 4]},
    {from: 420, to: 500, text: 'Download as PDF or Word.', italic: [2, 3, 4]},
    {from: 500, to: 584, text: 'Publish. Students join with a code.', italic: [3, 4, 5]},
    {from: 584, to: 664, text: 'Answers checked for you.', italic: [2, 3]},
    {from: 664, to: 756, text: 'AI report, shared on WhatsApp.', italic: [3, 4]},
  ],
  cam: [
    {f: 0, s: 1.05, fy: 260},
    {f: 70, s: 1.05, fy: 260},
    {f: 96, s: 1},
    {f: 500, s: 1},
    {f: 530, s: 1.08, fy: 330},
    {f: 580, s: 1.08, fy: 330},
    {f: 600, s: 1},
    {f: 670, s: 1},
    {f: 700, s: 1.07, fy: 160},
    {f: 745, s: 1.07, fy: 160},
    {f: 760, s: 1},
  ],
  sfx: [
    {at: 0, name: 'tick', volume: 0.35},
    {at: 14, name: 'ding', volume: 0.3},
    {at: 30, name: 'tick', volume: 0.3},
    {at: 44, name: 'tick', volume: 0.35},
    {at: 80, name: 'swipe', volume: 0.35},
    {at: 140, name: 'tap'},
    {at: 148, name: 'swipe', volume: 0.25},
    {at: 160, name: 'tap'},
    {at: 172, name: 'tap'},
    {at: 184, name: 'tap'},
    {at: 196, name: 'tap'},
    {at: 216, name: 'tap'},
    {at: 226, name: 'tap'},
    {at: 246, name: 'tap'},
    {at: 258, name: 'tap'},
    {at: 272, name: 'tap'},
    {at: 300, name: 'tap'},
    {at: 306, name: 'shimmer', volume: 0.35},
    {at: 340, name: 'success', volume: 0.35},
    {at: 446, name: 'tap'},
    {at: 452, name: 'pop', volume: 0.3},
    {at: 474, name: 'tap'},
    {at: 480, name: 'pop', volume: 0.3},
    {at: 500, name: 'tap'},
    {at: 508, name: 'success', volume: 0.35},
    {at: 584, name: 'swipe', volume: 0.25},
    {at: 588, name: 'pop', volume: 0.25},
    {at: 602, name: 'pop', volume: 0.25},
    {at: 626, name: 'tap'},
    {at: 692, name: 'tap'},
    {at: 752, name: 'whoosh', volume: 0.35},
    {at: 764, name: 'shimmer', volume: 0.3},
    {at: 818, name: 'pop', volume: 0.35},
  ],
  endLine: 'Papers in minutes, not evenings.',
  endItalic: [3, 4],
};

// ---------------------------------------------------------------- Reel 3: the toolkit

const ToolkitScreen: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <MobileShell tab={frame < 680 ? 'more' : 'courses'}>
        <ScreenStack
          screens={[
            {
              from: 0,
              node: (
                <LabM
                  hl={[
                    {tool: 'Data → Sheet', at: 204},
                    {tool: 'Marks → Report', at: 226},
                    {tool: 'Notes → Word', at: 250},
                  ]}
                />
              ),
            },
            {from: 292, node: <EnglishHomeM levelAt={316} scrollAt={330} lessonAt={354} />},
            {from: 362, node: <EnglishPracticeM at={366} />},
            {from: 442, node: <MahaTETM p1At={462} mockAt={480} startAt={498} />},
            {from: 506, node: <MockQuestionM at={508} answerAt={556} />},
            {from: 606, node: <StudentHubM addAt={624} createAt={652} />},
            {from: 680, node: <CoursesM at={682} />, fade: true},
          ]}
        />
      </MobileShell>
      <Overlay from={-20} to={138} enter="none" exit="down">
        <RegisterToSheetM shutterAt={34} sheetAt={84} />
      </Overlay>
    </>
  );
};

export const toolkitSpec: ReelSpec = {
  id: 'toolkit',
  Screen: ToolkitScreen,
  beats: [
    {from: 0, to: 70, text: 'Snap your marks register…', italic: [2, 3]},
    {from: 70, to: 146, text: '…get a clean spreadsheet.', italic: [2, 3]},
    {from: 146, to: 290, kicker: 'THE LAB', text: 'Turn photos into files.', italic: [2, 3]},
    {from: 290, to: 440, kicker: 'ENGLISH WITH AASHA', text: 'Speak English, explained in your language.', italic: [4, 5]},
    {from: 440, to: 604, kicker: 'MAHATET PRACTICE', text: 'Real mock tests, official answer keys.', italic: [3, 4, 5]},
    {from: 604, to: 678, kicker: 'STUDENT HUB', text: 'Manage your classes.', italic: [1, 2]},
    {from: 678, to: 756, kicker: 'COURSES', text: 'Learn AI with live courses.', italic: [3, 4]},
  ],
  cam: [
    {f: 0, s: 1.06, fy: 330},
    {f: 120, s: 1.06, fy: 330},
    {f: 150, s: 1},
    {f: 380, s: 1},
    {f: 400, s: 1.06, fy: 300},
    {f: 436, s: 1.06, fy: 300},
    {f: 452, s: 1},
    {f: 530, s: 1},
    {f: 560, s: 1.06, fy: 470},
    {f: 600, s: 1.06, fy: 470},
    {f: 616, s: 1},
  ],
  sfx: [
    {at: 0, name: 'whoosh-soft', volume: 0.3},
    {at: 34, name: 'tap', volume: 0.5},
    {at: 35, name: 'impact', volume: 0.18},
    {at: 46, name: 'shimmer', volume: 0.3},
    {at: 84, name: 'success', volume: 0.35},
    {at: 138, name: 'swipe', volume: 0.3},
    {at: 204, name: 'tap'},
    {at: 226, name: 'tap'},
    {at: 250, name: 'tap'},
    {at: 292, name: 'swipe', volume: 0.25},
    {at: 316, name: 'tap'},
    {at: 354, name: 'tap'},
    {at: 362, name: 'swipe', volume: 0.25},
    {at: 366, name: 'pop', volume: 0.3},
    {at: 380, name: 'pop', volume: 0.3},
    {at: 434, name: 'ding', volume: 0.3},
    {at: 442, name: 'swipe', volume: 0.25},
    {at: 462, name: 'tap'},
    {at: 480, name: 'tap'},
    {at: 498, name: 'tap'},
    {at: 556, name: 'tap'},
    {at: 560, name: 'success', volume: 0.35},
    {at: 606, name: 'swipe', volume: 0.25},
    {at: 624, name: 'tap'},
    {at: 652, name: 'tap'},
    {at: 660, name: 'pop', volume: 0.3},
    {at: 680, name: 'whoosh-soft', volume: 0.25},
    {at: 752, name: 'whoosh', volume: 0.35},
    {at: 764, name: 'shimmer', volume: 0.3},
    {at: 818, name: 'pop', volume: 0.35},
  ],
  endLine: 'One app. Every teaching task.',
  endItalic: [2, 3, 4],
};

export const ReelAasha: React.FC<{music?: boolean; voiceover?: boolean; grid?: boolean}> = (p) => <Reel spec={aashaSpec} {...p} />;
export const ReelPapers: React.FC<{music?: boolean; voiceover?: boolean; grid?: boolean}> = (p) => <Reel spec={papersSpec} {...p} />;
export const ReelToolkit: React.FC<{music?: boolean; voiceover?: boolean; grid?: boolean}> = (p) => <Reel spec={toolkitSpec} {...p} />;
