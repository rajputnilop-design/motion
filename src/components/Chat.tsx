import {ArrowUp, AudioLines, Mic, Paperclip, Pencil, Plus, Trash2, MessageCircle} from 'lucide-react';
import React from 'react';
import {Img, staticFile, useCurrentFrame} from 'remotion';
import {caretVisible, tween, typed} from '../anim';
import {C, gradientText, namasteGradient, SANS, SERIF} from '../theme';

const CHATS = ['hii', 'Content Assistant', 'hii', 'how can you help me', '🎙️ Voice call'];

export const ChatsPanel: React.FC<{items?: string[]}> = ({items = CHATS}) => (
  <div
    style={{
      position: 'absolute',
      left: 16,
      top: 16,
      bottom: 16,
      width: 248,
      borderRadius: 18,
      background: C.panel,
      border: `1px solid ${C.line}`,
      fontFamily: SANS,
      padding: '18px 14px',
    }}
  >
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px 14px'}}>
      <span style={{fontFamily: SERIF, fontSize: 20, color: C.text}}>Chats</span>
      <Plus size={18} color="#A1A1AA" />
    </div>
    {items.map((t, i) => (
      <div key={i} style={{display: 'flex', alignItems: 'center', gap: 10, height: 44, padding: '0 4px', color: '#D4D4D8', fontSize: 14}}>
        <MessageCircle size={15} color="#8E8C99" />
        <span style={{flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{t}</span>
        <Pencil size={14} color="#5B5A63" />
        <Trash2 size={14} color="#5B5A63" />
      </div>
    ))}
  </div>
);

/** The chat composer: "Ask ShikshakMitra AI..." with attach / mic / voice and the Auto | Pro toggle. */
export const Composer: React.FC<{text?: string; typeAt?: number; cpf?: number; sendAt?: number; width?: number}> = ({
  text = '',
  typeAt = 0,
  cpf = 1,
  sendAt = 99999,
  width = 780,
}) => {
  const frame = useCurrentFrame();
  const sent = frame >= sendAt;
  const shown = sent ? '' : typed(text, frame, typeAt, cpf);
  const typing = !sent && frame >= typeAt - 4 && frame < sendAt;
  const ready = shown.length > 0;
  return (
    <div style={{width, fontFamily: SANS}}>
      <div
        style={{
          height: 112,
          borderRadius: 18,
          background: '#131315',
          border: `1px solid ${typing ? 'rgba(139,108,246,0.6)' : '#26262A'}`,
          boxShadow: typing ? '0 0 0 4px rgba(116,80,239,0.12)' : undefined,
          padding: '16px 18px 12px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div style={{fontSize: 16, color: ready ? C.text : '#8E8C99', whiteSpace: 'nowrap', overflow: 'hidden'}}>
          {ready ? shown : 'Ask ShikshakMitra AI...'}
          {typing && caretVisible(frame) ? <span style={{color: '#8B6CF6'}}>|</span> : null}
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
          <Paperclip size={19} color="#A1A1AA" />
          <Mic size={19} color="#A1A1AA" />
          <AudioLines size={19} color="#8B6CF6" />
          <div style={{display: 'flex', padding: 3, borderRadius: 999, background: '#1D1D20', border: '1px solid #2A2A2E'}}>
            <span style={{padding: '6px 14px', borderRadius: 999, background: '#3B2A6B', color: '#9B7CF8', fontSize: 13, fontWeight: 500}}>Auto</span>
            <span style={{padding: '6px 14px', color: '#6B6974', fontSize: 13, fontWeight: 500}}>Pro</span>
          </div>
          <div style={{flex: 1}} />
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: ready ? C.purple : '#2E2650',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `scale(${frame >= sendAt - 2 && frame <= sendAt + 3 ? 0.9 : 1})`,
            }}
          >
            <ArrowUp size={20} color={ready ? C.white : '#6E6A85'} />
          </div>
        </div>
      </div>
      <div style={{textAlign: 'center', fontSize: 11, color: '#71717A', marginTop: 10}}>
        AIShikshaMitra can make mistakes. Please check important information.
      </div>
    </div>
  );
};

/** Empty-chat welcome exactly as on aishikshamitra.com/chat. `at` staggers the entrance. */
export const ChatWelcome: React.FC<{at?: number; scale?: number; maxWidth?: number}> = ({at = -100, scale = 1, maxWidth = 520}) => {
  const frame = useCurrentFrame();
  const show = (d: number) => ({
    opacity: tween(frame, [at + d, at + d + 10], [0, 1]),
    transform: `translateY(${tween(frame, [at + d, at + d + 14], [18, 0])}px)`,
  });
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: SANS, zoom: scale}}>
      <Img
        src={staticFile('brand/logo.png')}
        style={{width: 78, height: 78, filter: 'drop-shadow(0 0 18px rgba(10,140,240,0.45))', ...show(0)}}
      />
      <div style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 18, ...show(4)}}>
        <span style={{fontFamily: SERIF, fontSize: 46, ...gradientText(namasteGradient)}}>Namaste</span>
        <span style={{fontSize: 38}}>👋</span>
      </div>
      <div style={{fontFamily: SERIF, fontSize: 30, color: C.text, marginTop: 4, ...show(8)}}>I’m ShikshakMitra AI</div>
      <div style={{fontSize: 17, color: '#8F8AA3', marginTop: 12, textAlign: 'center', maxWidth, lineHeight: 1.45, ...show(12)}}>
        Your teaching companion for papers, lessons, and more.
      </div>
    </div>
  );
};

export const VoiceFab: React.FC = () => (
  <div
    style={{
      width: 52,
      height: 52,
      borderRadius: 26,
      background: C.purple,
      boxShadow: '0 10px 30px -6px rgba(116,80,239,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <AudioLines size={24} color={C.white} />
  </div>
);

/** The full empty-chat page (chats list, welcome, composer, voice button) inside the app content area. */
export const ChatPage: React.FC<{at?: number; panel?: boolean; children?: React.ReactNode; composer?: React.ReactNode}> = ({
  at = -100,
  panel = true,
  children,
  composer,
}) => {
  const left = panel ? 280 : 0;
  return (
    <div style={{position: 'absolute', inset: 0, fontFamily: SANS}}>
      {panel ? <ChatsPanel /> : null}
      <div style={{position: 'absolute', left: left + 18, top: 18, fontSize: 15, color: '#D4D4D8'}}>New chat</div>
      <div style={{position: 'absolute', left, right: 0, top: 0, bottom: 0}}>
        {children ?? (
          <div style={{position: 'absolute', left: 0, right: 0, top: 200, display: 'flex', justifyContent: 'center'}}>
            <ChatWelcome at={at} />
          </div>
        )}
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 26, display: 'flex', justifyContent: 'center'}}>
          {composer ?? <Composer width={680} />}
        </div>
      </div>
      <div style={{position: 'absolute', right: 30, bottom: 160}}>
        <VoiceFab />
      </div>
    </div>
  );
};
