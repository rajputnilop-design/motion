import {
  BarChart3,
  BookOpen,
  ChartColumn,
  ChevronDown,
  ChevronUp,
  CircleCheck,
  CircleDollarSign,
  ClipboardCheck,
  CloudUpload,
  Compass,
  Copy,
  Database,
  Eye,
  FileText,
  GraduationCap,
  Info,
  KeyRound,
  Landmark,
  Library,
  Lock,
  Menu,
  MessageCircle,
  MoreVertical,
  Play,
  Plus,
  RotateCw,
  Settings,
  ShieldCheck,
  Speech,
  Trash2,
  TriangleAlert,
  Users,
  WandSparkles,
  X,
} from 'lucide-react';
import React from 'react';
import {Img, staticFile, useCurrentFrame} from 'remotion';
import {easeInOut, easeOut, tween, typed} from '../anim';
import {C, SANS, SERIF} from '../theme';
import {SCREEN_W} from '../reels/mobile';

export const SCREEN_H = 750;

/** Bottom sheet that slides up over a dimmed screen (screen coordinates). */
export const Sheet: React.FC<{from: number; to?: number; top: number | ((f: number) => number); children: React.ReactNode; dim?: number}> = ({
  from,
  to = 99999,
  top,
  children,
  dim = 0.6,
}) => {
  const frame = useCurrentFrame();
  if (frame < from - 1 || frame > to + 14) return null;
  const e = tween(frame, [from, from + 12], [0, 1], easeOut);
  const x = tween(frame, [to, to + 12], [0, 1], easeInOut);
  const t = typeof top === 'function' ? top(frame) : top;
  const off = (1 - e) * (SCREEN_H - t) + x * (SCREEN_H - t);
  return (
    <div style={{position: 'absolute', inset: 0, zIndex: 40, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: `rgba(0,0,0,${dim * e * (1 - x)})`}} />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: t + off,
          height: SCREEN_H + 400,
          borderRadius: '22px 22px 0 0',
          background: '#0E0E11',
          border: '1px solid #26262A',
          borderBottom: 'none',
          fontFamily: SANS,
        }}
      >
        <div style={{position: 'absolute', left: SCREEN_W / 2 - 22, top: 10, width: 44, height: 5, borderRadius: 3, background: '#3F3F46'}} />
        {children}
      </div>
    </div>
  );
};

const MORE: {t: string; I: typeof ChartColumn; color?: string}[] = [
  {t: 'Analytics', I: ChartColumn},
  {t: 'Assessment', I: ClipboardCheck},
  {t: 'MahaTET Practice', I: GraduationCap},
  {t: 'The Lab', I: WandSparkles},
  {t: 'Student Hub', I: Users},
  {t: 'MPSC Practice', I: Landmark},
  {t: 'App Guide', I: Compass},
  {t: 'Banks', I: Library},
  {t: 'English Speaking', I: Speech},
  {t: 'Books', I: BookOpen},
  {t: 'About', I: Info},
  {t: 'Settings', I: Settings},
  {t: 'Your API key', I: KeyRound},
  {t: 'WhatsApp Support', I: MessageCircle, color: '#25D366'},
];
export const MORE_TOP = 48;
const MORE_ROW = 47.4;
/** Screen-space centre of a More-menu row. */
export const moreRowY = (i: number) => MORE_TOP + 30 + i * MORE_ROW + MORE_ROW / 2;
export const API_KEY_ROW = MORE.findIndex((m) => m.t === 'Your API key');

/** The More bottom sheet, as in the app. */
export const MoreSheetContent: React.FC<{pressAt?: number}> = ({pressAt = -99}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: 10, right: 10, top: 30}}>
      {MORE.map(({t, I, color}, i) => {
        const press = i === API_KEY_ROW ? tween(frame, [pressAt - 2, pressAt + 2], [0, 1]) * tween(frame, [pressAt + 4, pressAt + 14], [1, 0.6]) : 0;
        return (
          <div
            key={t}
            style={{
              height: MORE_ROW - 4,
              marginBottom: 4,
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '0 14px',
              fontSize: 15.5,
              fontWeight: 500,
              color: press > 0.3 ? '#C4B5FD' : '#E4E4E7',
              background: `rgba(116,80,239,${0.3 * press})`,
            }}
          >
            <I size={20} color={color ?? (press > 0.3 ? '#A88BFA' : '#D4D4D8')} strokeWidth={1.8} />
            {t}
          </div>
        );
      })}
    </div>
  );
};

// API Key Setup sheet layout (sheet coordinates).
export const SETUP = {link: 153, video: 190, privacy: 322, under18: 470, paste: 742, saved: 470, replace: 560};
const KEY_MASK = 'AQ.A••••••••x7Qa';

/** The app's "API Key Setup" sheet: before the key (consent + paste) and after (Using your key). */
export const SetupSheetContent: React.FC<{checkAt?: number; pasteAt?: number; saveAt?: number; linkAt?: number}> = ({
  checkAt = 99999,
  pasteAt = 99999,
  saveAt = 99999,
  linkAt = -99,
}) => {
  const frame = useCurrentFrame();
  const saved = frame >= saveAt + 3;
  const checked = frame >= checkAt + 2;
  const pasted = frame >= pasteAt + 3;
  const linkPress = tween(frame, [linkAt - 2, linkAt + 2], [0, 1]) * tween(frame, [linkAt + 4, linkAt + 14], [1, 0]);
  const savePress = frame >= saveAt - 2 && frame <= saveAt + 3 ? 0.94 : 1;
  const text: React.CSSProperties = {fontSize: 14.5, lineHeight: 1.55, color: '#C9C7D1'};
  const card: React.CSSProperties = {position: 'absolute', left: 18, right: 18, borderRadius: 14, border: '1px solid #2A2A2F', background: '#121216'};
  return (
    <>
      <div style={{position: 'absolute', left: 20, right: 20, top: 30, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <span style={{fontFamily: SERIF, fontSize: 21, color: C.text}}>API Key Setup</span>
        <X size={20} color="#A1A1AA" />
      </div>
      <div style={{position: 'absolute', left: 20, right: 20, top: 74, ...text}}>
        Get your free API key from Google AI Studio and paste it below. It powers chat, the tools and question papers. Get the key here:{' '}
        <span style={{color: '#8B74F2', textDecoration: 'underline', background: `rgba(139,116,242,${0.35 * linkPress})`, borderRadius: 4}}>aistudio.google.com/apikey</span>
      </div>
      <div style={{...card, top: SETUP.video, height: 116, display: 'flex', gap: 12, padding: 10}}>
        <div style={{width: 54, height: 96, borderRadius: 8, background: 'linear-gradient(160deg, #3A2F6B, #15131F)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
          <div style={{width: 28, height: 28, borderRadius: 14, background: C.purple, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Play size={14} color={C.white} fill={C.white} />
          </div>
        </div>
        <div>
          <div style={{fontSize: 15, fontWeight: 700, color: C.text, marginTop: 4}}>How to add your API key</div>
          <div style={{fontSize: 12.5, color: '#9C9AA8', marginTop: 4, lineHeight: 1.45}}>A short demo of switching on the AI features in AIShikshaMitra. In Marathi.</div>
        </div>
      </div>
      <div style={{...card, top: SETUP.privacy, padding: '12px 14px 12px 40px'}}>
        <ShieldCheck size={16} color="#8B74F2" style={{position: 'absolute', left: 14, top: 14}} />
        <div style={{fontSize: 13, lineHeight: 1.55, color: '#9C9AA8'}}>
          Your key is stored <b style={{color: C.text}}>only on this device</b> — never synced to any cloud account. It travels only to your AIShikshaMitra server to call Gemini, and is never logged or
          shared.
        </div>
      </div>
      {!saved ? (
        <>
          <div style={{...card, top: SETUP.under18, padding: '12px 14px 12px 40px', border: '1px solid rgba(218,190,71,0.35)', background: '#15130C'}}>
            <TriangleAlert size={16} color="#DABE47" style={{position: 'absolute', left: 14, top: 14}} />
            <div style={{fontSize: 13, lineHeight: 1.5, color: '#A8A69C'}}>
              <b style={{color: C.text}}>Under 18?</b> A Google AI key belongs to a Google account you must be 18+ to create. If you’re a student under 18, please ask a{' '}
              <b style={{color: C.text}}>parent or guardian</b> to add <i>their</i> key here — it’s linked to their account, so they can see and guide everything you do on the app.
            </div>
            <div style={{display: 'flex', gap: 10, marginTop: 12, marginLeft: -26}}>
              <div
                style={{
                  width: 18,
                  height: 18,
                  minWidth: 18,
                  borderRadius: 4,
                  marginTop: 2,
                  background: checked ? C.purple : '#F4F4F5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: checked ? '0 0 12px rgba(116,80,239,0.8)' : undefined,
                }}
              >
                {checked ? <span style={{color: C.white, fontSize: 13, fontWeight: 800}}>✓</span> : null}
              </div>
              <div style={{fontSize: 13, lineHeight: 1.5, color: '#E4E4E7'}}>
                I confirm I’m 18 or older. If this key is for a student under 18, I am their parent/guardian and I consent to and will supervise their use of the app.
              </div>
            </div>
          </div>
          <div style={{position: 'absolute', left: 18, right: 18, top: SETUP.paste, display: 'flex', gap: 10}}>
            <div
              style={{
                flex: 1,
                height: 48,
                borderRadius: 12,
                border: `1px solid ${pasted ? 'rgba(139,108,246,0.7)' : '#2A2A2F'}`,
                background: '#121216',
                display: 'flex',
                alignItems: 'center',
                padding: '0 14px',
                gap: 8,
                fontSize: 15,
                color: pasted ? C.text : '#8E8C99',
                fontFamily: pasted ? 'DejaVu Sans Mono, monospace' : SANS,
              }}
            >
              <span style={{flex: 1}}>{pasted ? KEY_MASK : 'Paste your key...'}</span>
              <Eye size={17} color="#8E8C99" />
            </div>
            <div
              style={{
                width: 78,
                height: 48,
                borderRadius: 12,
                background: pasted && checked ? C.purple : '#3A2F6B',
                color: pasted && checked ? C.white : '#8E84B8',
                fontSize: 15,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `scale(${savePress})`,
              }}
            >
              Save
            </div>
          </div>
        </>
      ) : (
        <>
          <div style={{...card, top: SETUP.saved, height: 74, display: 'flex', alignItems: 'center', padding: '0 14px', border: '1px solid rgba(34,197,94,0.45)'}}>
            <div style={{flex: 1}}>
              <div style={{fontSize: 15.5, fontWeight: 600, color: '#9B7CF8'}}>Using your key</div>
              <div style={{fontFamily: 'DejaVu Sans Mono, monospace', fontSize: 12.5, color: '#A1A1AA', marginTop: 3}}>{KEY_MASK}</div>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 10, border: '1px solid rgba(248,113,113,0.5)', background: 'rgba(127,29,29,0.25)', color: '#FCA5A5', fontSize: 14}}>
              <Trash2 size={15} /> Remove
            </div>
          </div>
          <div style={{position: 'absolute', left: 18, right: 18, top: SETUP.replace, display: 'flex', gap: 10}}>
            <div style={{flex: 1, height: 48, borderRadius: 12, border: '1px solid #2A2A2F', background: '#121216', display: 'flex', alignItems: 'center', padding: '0 14px', fontSize: 15, color: '#8E8C99'}}>
              <span style={{flex: 1}}>Replace key...</span>
              <Eye size={17} color="#8E8C99" />
            </div>
            <div style={{width: 78, height: 48, borderRadius: 12, background: '#3A2F6B', color: '#8E84B8', fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Save</div>
          </div>
        </>
      )}
    </>
  );
};

// ---------------------------------------------------------------- Browser + Google AI Studio (rebuilt)

export const BAR_H = 52;
const AIS = {bg: '#16171A', card: '#202124', field: '#28292D', line: '#34353A', text: '#E3E3E6', sub: '#A6A8AE', link: '#9AA8FF'};

export const BrowserBar: React.FC<{url: string}> = ({url}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: BAR_H, background: '#202124', display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px', zIndex: 5}}>
    <div style={{flex: 1, height: 36, borderRadius: 18, background: '#303134', display: 'flex', alignItems: 'center', gap: 8, padding: '0 14px', fontFamily: SANS, fontSize: 14, color: '#E8EAED'}}>
      <Lock size={13} color="#9AA0A6" />
      {url}
    </div>
    <RotateCw size={18} color="#9AA0A6" />
  </div>
);

/** "Choose an account" before AI Studio opens (neutral rebuild; account details are sample data). */
export const AccountChooser: React.FC<{pickAt: number}> = ({pickAt}) => {
  const frame = useCurrentFrame();
  const press = tween(frame, [pickAt - 2, pickAt + 2], [0, 1]) * tween(frame, [pickAt + 4, pickAt + 14], [1, 0]);
  return (
    <div style={{position: 'absolute', inset: 0, background: '#F8F9FA', fontFamily: SANS}}>
      <BrowserBar url="accounts.google.com" />
      <div style={{position: 'absolute', left: 22, right: 22, top: BAR_H + 70}}>
        <div style={{fontSize: 26, color: '#1F1F1F'}}>Choose an account</div>
        <div style={{fontSize: 15, color: '#444746', marginTop: 8}}>to continue to Google AI Studio</div>
        <div style={{marginTop: 34, borderTop: '1px solid #DADCE0', borderBottom: '1px solid #DADCE0'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14, height: 70, padding: '0 6px', background: `rgba(26,115,232,${0.08 + 0.12 * press})`}}>
            <div style={{width: 36, height: 36, borderRadius: 18, background: '#7B57F1', color: C.white, fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>P</div>
            <div>
              <div style={{fontSize: 15, fontWeight: 600, color: '#1F1F1F'}}>Priya Deshmukh</div>
              <div style={{fontSize: 13.5, color: '#444746'}}>priya.teacher@gmail.com</div>
            </div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 14, height: 60, padding: '0 6px', borderTop: '1px solid #DADCE0', fontSize: 15, color: '#1F1F1F'}}>
            <div style={{width: 36, display: 'flex', justifyContent: 'center'}}>
              <Users size={20} color="#444746" />
            </div>
            Use another account
          </div>
        </div>
      </div>
    </div>
  );
};

// AI Studio page layout (screen coordinates).
export const STUDIO = {title: 110, create: {x: 226, y: 104, w: 138, h: 38}, projects: 158, group: 208, list: 256};

const KeyCard: React.FC<{at: number; copyAt: number}> = ({at, copyAt}) => {
  const frame = useCurrentFrame();
  const p = tween(frame, [at, at + 12], [0, 1], easeOut);
  const press = tween(frame, [copyAt - 2, copyAt + 2], [0, 1]) * tween(frame, [copyAt + 4, copyAt + 16], [1, 0]);
  const row = (k: string, v: React.ReactNode, sub?: string) => (
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 14, fontSize: 13.5}}>
      <span style={{color: AIS.sub}}>{k}</span>
      <span style={{textAlign: 'right'}}>
        <span style={{color: typeof v === 'string' && v.startsWith('project-') ? AIS.text : AIS.link}}>{v}</span>
        {sub ? <div style={{fontSize: 12, color: AIS.sub, marginTop: 2}}>{sub}</div> : null}
      </span>
    </div>
  );
  return (
    <div style={{position: 'absolute', left: 14, right: 14, top: STUDIO.list, borderRadius: 14, background: AIS.card, padding: '14px 16px 16px', opacity: p, transform: `translateY(${(1 - p) * 20}px)`}}>
      <div style={{display: 'flex', alignItems: 'flex-start'}}>
        <div style={{flex: 1}}>
          <div style={{fontSize: 15, color: AIS.link}}>...x7Qa</div>
          <div style={{fontSize: 12.5, color: AIS.sub, marginTop: 2}}>Gemini API Key</div>
        </div>
        <div style={{display: 'flex', gap: 14, alignItems: 'center', marginTop: 4}}>
          <div style={{borderRadius: 8, padding: 4, margin: -4, background: `rgba(154,168,255,${0.35 * press})`}}>
            <Copy size={17} color={AIS.text} />
          </div>
          <CircleDollarSign size={17} color={AIS.text} />
          <BarChart3 size={17} color={AIS.text} />
          <Database size={17} color={AIS.text} />
          <MoreVertical size={17} color={AIS.text} />
        </div>
      </div>
      {row('Project', 'AIShikshaMitra')}
      {row('Project ID', 'project-3c41d9e2-7b0a')}
      {row('Created', <span style={{color: AIS.text}}>Oct 6, 2026</span>)}
      {row('Billing tier', 'Set up billing', 'Free tier')}
    </div>
  );
};
/** Screen-space rectangles on the AI Studio pages. */
export const KEY_COPY = {x: 14 + 16 + 205, y: STUDIO.list + 14 + 3, w: 26, h: 26};
export const KEY_TIER = {x: 236, y: STUDIO.list + 166, w: 112, h: 40};

/** aistudio.google.com/api-keys on a phone, with the new key appearing after `keyAt`. */
export const StudioPage: React.FC<{createPressAt?: number; keyAt?: number; copyAt?: number}> = ({createPressAt = -99, keyAt = 99999, copyAt = 99999}) => {
  const frame = useCurrentFrame();
  const press = frame >= createPressAt - 2 && frame <= createPressAt + 3 ? 0.94 : 1;
  return (
    <div style={{position: 'absolute', inset: 0, background: AIS.bg, fontFamily: SANS}}>
      <BrowserBar url="aistudio.google.com/api-keys" />
      <div style={{position: 'absolute', left: 14, top: BAR_H + 16, width: 32, height: 32, borderRadius: 9, background: AIS.field, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Menu size={17} color={AIS.text} />
      </div>
      <div style={{position: 'absolute', left: 14, top: STUDIO.title, fontSize: 25, color: AIS.text}}>API Keys</div>
      <FileText size={17} color={AIS.sub} style={{position: 'absolute', left: 196, top: STUDIO.create.y + 10}} />
      <div
        style={{
          position: 'absolute',
          left: STUDIO.create.x,
          top: STUDIO.create.y,
          width: STUDIO.create.w,
          height: STUDIO.create.h,
          borderRadius: 19,
          background: AIS.field,
          color: AIS.text,
          fontSize: 14.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${press})`,
        }}
      >
        Create API key
      </div>
      <div style={{position: 'absolute', left: 14, right: 14, top: STUDIO.projects, height: 38, borderRadius: 10, background: AIS.card, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', fontSize: 14.5, color: AIS.text}}>
        All projects <ChevronDown size={17} color={AIS.sub} />
      </div>
      <div style={{position: 'absolute', left: 14, top: STUDIO.group, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, color: AIS.sub}}>
        Group by
        <span style={{padding: '6px 12px', borderRadius: 8, background: AIS.card, color: AIS.text}}>• API Key</span>
        <span style={{padding: '6px 12px', borderRadius: 8, background: AIS.card, color: AIS.text}}>Project</span>
      </div>
      {frame >= keyAt ? <KeyCard at={keyAt} copyAt={copyAt} /> : null}
    </div>
  );
};

// Dialog layout (screen coordinates).
export const KEY_DLG = {top: 236, dropdown: 404, menu: 446, createProject: 506, createKey: {x: 262, y: 466, w: 92, h: 36}};
export const PROJ_DLG = {top: 250, input: 342, create: {x: 226, y: 410, w: 128, h: 36}};

const Dim: React.FC<{at: number; out?: number}> = ({at, out = 99999}) => {
  const frame = useCurrentFrame();
  return <div style={{position: 'absolute', inset: 0, background: `rgba(0,0,0,${0.55 * tween(frame, [at, at + 8], [0, 1]) * tween(frame, [out, out + 8], [1, 0])})`, backdropFilter: 'blur(2px)'}} />;
};

const DialogCard: React.FC<{top: number; at: number; out?: number; children: React.ReactNode}> = ({top, at, out = 99999, children}) => {
  const frame = useCurrentFrame();
  const p = tween(frame, [at, at + 10], [0, 1], easeOut) * tween(frame, [out, out + 8], [1, 0]);
  if (p <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: 16,
        right: 16,
        top,
        borderRadius: 16,
        background: '#1F2023',
        border: `1px solid ${AIS.line}`,
        boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
        padding: '20px 18px 18px',
        fontFamily: SANS,
        opacity: p,
        transform: `scale(${0.96 + 0.04 * p})`,
      }}
    >
      {children}
    </div>
  );
};

const Field: React.FC<{label: string; value: React.ReactNode; focus?: boolean; caret?: boolean; dropdown?: 'down' | 'up'}> = ({label, value, focus, caret, dropdown}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{marginTop: 16}}>
      <div style={{fontSize: 12.5, color: AIS.sub, marginBottom: 7}}>{label}</div>
      <div
        style={{
          height: 38,
          borderRadius: 9,
          border: `1px solid ${focus ? '#A8B4FF' : AIS.line}`,
          background: AIS.bg,
          display: 'flex',
          alignItems: 'center',
          padding: '0 10px',
          fontSize: 15,
          color: AIS.text,
        }}
      >
        <span style={{flex: 1}}>
          {value}
          {caret && Math.floor(frame / 8) % 2 === 0 ? <span style={{color: '#A8B4FF'}}>|</span> : null}
        </span>
        {dropdown === 'down' ? <ChevronDown size={16} color={AIS.sub} /> : dropdown === 'up' ? <ChevronUp size={16} color={AIS.sub} /> : null}
      </div>
    </div>
  );
};

const Btn: React.FC<{label: string; primary?: boolean; pressAt?: number}> = ({label, primary, pressAt = -99}) => {
  const frame = useCurrentFrame();
  const press = frame >= pressAt - 2 && frame <= pressAt + 3 ? 0.93 : 1;
  return (
    <span
      style={{
        padding: '8px 14px',
        borderRadius: 18,
        fontSize: 14.5,
        color: primary ? AIS.text : AIS.text,
        background: primary ? AIS.field : 'transparent',
        transform: `scale(${press})`,
        display: 'inline-block',
      }}
    >
      {label}
    </span>
  );
};

/** "Create a new key": open the project list, create a project, select it, then Create key. */
export const CreateKeyDialog: React.FC<{
  at: number;
  menuAt: number;
  createProjectAt: number;
  projectDoneAt: number;
  createKeyAt: number;
  typeFrom: number;
}> = ({at, menuAt, createProjectAt, projectDoneAt, createKeyAt, typeFrom}) => {
  const frame = useCurrentFrame();
  const menuOpen = frame >= menuAt + 2 && frame < createProjectAt + 6;
  const selected = frame >= projectDoneAt + 6;
  const projDlg = frame >= createProjectAt + 6 && frame < projectDoneAt + 10;
  const name = typed('AIShikshaMitra', frame, typeFrom, 0.55);
  const close = createKeyAt + 4;
  const createProjHl = tween(frame, [createProjectAt - 2, createProjectAt + 2], [0, 1]) * tween(frame, [createProjectAt + 4, createProjectAt + 12], [1, 0]);
  return (
    <>
      <Dim at={at} out={close} />
      <DialogCard top={KEY_DLG.top} at={at} out={close}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 18, color: AIS.text}}>
          Create a new key <X size={18} color={AIS.sub} />
        </div>
        <Field label="Name your key" value="Gemini API Key" />
        <Field
          label="Choose an imported project"
          value={selected ? 'AIShikshaMitra' : <span style={{color: AIS.sub}}>Choose a project</span>}
          focus={menuOpen || (selected && frame < createKeyAt)}
          dropdown={menuOpen ? 'up' : 'down'}
        />
        <div style={{display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 22}}>
          <Btn label="Cancel" />
          <Btn label="Create key" primary pressAt={createKeyAt} />
        </div>
      </DialogCard>
      {menuOpen ? (
        <div style={{position: 'absolute', left: 36, right: 36, top: KEY_DLG.menu, borderRadius: 10, background: '#2A2B2F', border: `1px solid ${AIS.line}`, padding: '6px 0', fontFamily: SANS, boxShadow: '0 12px 30px rgba(0,0,0,0.5)'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, height: 40, padding: '0 14px', fontSize: 15, color: AIS.text}}>
            <CloudUpload size={16} color={AIS.text} /> Import project
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, height: 40, padding: '0 14px', fontSize: 15, color: AIS.text, background: `rgba(154,168,255,${0.3 * createProjHl})`}}>
            <Plus size={16} color={AIS.text} /> Create project
          </div>
        </div>
      ) : null}
      {projDlg ? (
        <>
          <Dim at={createProjectAt + 6} out={projectDoneAt + 2} />
          <DialogCard top={PROJ_DLG.top} at={createProjectAt + 6} out={projectDoneAt + 2}>
            <div style={{fontSize: 18, color: AIS.text}}>Create a new project</div>
            <Field label="Project name" value={name} focus caret={name.length < 14} />
            <div style={{display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 22}}>
              <Btn label="Cancel" />
              <Btn label="Create project" primary pressAt={projectDoneAt} />
            </div>
          </DialogCard>
        </>
      ) : null}
    </>
  );
};

export const Toast: React.FC<{at: number; label: string; y?: number; light?: boolean}> = ({at, label, y = 40, light}) => {
  const frame = useCurrentFrame();
  const o = tween(frame, [at, at + 6], [0, 1]) * tween(frame, [at + 40, at + 48], [1, 0]);
  if (o <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: y, display: 'flex', justifyContent: 'center', opacity: o, transform: `translateY(${(1 - o) * 14}px)`, zIndex: 70}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 10, background: light ? '#E8EAED' : '#F4F4F5', color: '#111827', fontFamily: SANS, fontSize: 14, fontWeight: 600, boxShadow: '0 10px 30px rgba(0,0,0,0.5)'}}>
        <CircleCheck size={16} color="#16A34A" /> {label}
      </div>
    </div>
  );
};

/** App header badge used when the phone is showing the browser, so viewers know where they are. */
export const WhereBadge: React.FC<{label: string; logo?: boolean}> = ({label, logo}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 18px', borderRadius: 999, background: 'rgba(20,20,26,0.85)', border: '1px solid rgba(139,108,246,0.5)', fontFamily: SANS, fontSize: 26, fontWeight: 600, color: C.text}}>
    {logo ? <Img src={staticFile('brand/logo.png')} style={{width: 34, height: 34}} /> : <span style={{fontSize: 26}}>🌐</span>}
    {label}
  </div>
);
