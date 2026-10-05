import {
  BookOpen,
  ChartColumn,
  ChevronsLeft,
  ClipboardCheck,
  Compass,
  FileText,
  Gift,
  GraduationCap,
  Info,
  KeyRound,
  Library,
  MessageCircle,
  School,
  Sparkles,
  Speech,
  Users,
  WandSparkles,
} from 'lucide-react';
import React from 'react';
import {Img, staticFile} from 'remotion';
import {C, SANS, SERIF} from '../theme';

export const NAV = [
  {key: 'chat', label: 'Chat', Icon: MessageCircle},
  {key: 'studio', label: 'Studio', Icon: FileText},
  {key: 'tools', label: 'Tools', Icon: Sparkles},
  {key: 'courses', label: 'Courses', Icon: GraduationCap, badge: 'NEW'},
  {key: 'analytics', label: 'Analytics', Icon: ChartColumn},
  {key: 'assessment', label: 'Assessment', Icon: ClipboardCheck},
  {key: 'mahatet', label: 'MahaTET Practice', Icon: School},
  {key: 'lab', label: 'The Lab', Icon: WandSparkles},
  {key: 'students', label: 'Student Hub', Icon: Users},
  {key: 'guide', label: 'App Guide', Icon: Compass},
  {key: 'banks', label: 'Banks', Icon: Library},
  {key: 'english', label: 'English Speaking', Icon: Speech},
  {key: 'books', label: 'Books', Icon: BookOpen},
  {key: 'about', label: 'About', Icon: Info},
] as const;

export type NavKey = (typeof NAV)[number]['key'];

export const SIDEBAR_W = 236;
export const RAIL_W = 72;

const NavItem: React.FC<{item: (typeof NAV)[number]; active: boolean; collapsed: boolean; highlight?: number}> = ({
  item,
  active,
  collapsed,
  highlight = 0,
}) => {
  const color = active ? '#8B6CF6' : '#A8A6B3';
  return (
    <div
      style={{
        position: 'relative',
        height: 38,
        margin: '0 10px 4px',
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        gap: 13,
        padding: collapsed ? 0 : '0 14px',
        justifyContent: collapsed ? 'center' : 'flex-start',
        background: active ? C.activeNav : `rgba(139,108,246,${0.12 * highlight})`,
        boxShadow: active ? '0 0 24px -6px rgba(116,80,239,0.55)' : undefined,
        color,
        fontSize: 14.5,
        fontWeight: 500,
        whiteSpace: 'nowrap',
      }}
    >
      <div style={{position: 'relative', display: 'flex'}}>
        <item.Icon size={19} color={active ? '#8B6CF6' : '#8E8C99'} strokeWidth={1.9} />
        {'badge' in item ? (
          <div
            style={{
              position: 'absolute',
              left: 9,
              top: -8,
              width: 15,
              height: 15,
              borderRadius: 8,
              background: '#DABE47',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Gift size={9} color="#3F3510" strokeWidth={2.6} />
          </div>
        ) : null}
      </div>
      {!collapsed ? <span>{item.label}</span> : null}
      {!collapsed && 'badge' in item ? (
        <span
          style={{
            marginLeft: 'auto',
            padding: '3px 8px',
            borderRadius: 999,
            fontSize: 9.5,
            fontWeight: 700,
            color: '#DABE47',
            background: 'rgba(218,190,71,0.14)',
            letterSpacing: '0.06em',
          }}
        >
          NEW
        </span>
      ) : null}
    </div>
  );
};

/** The app's left navigation exactly as it appears on aishikshamitra.com. */
export const Sidebar: React.FC<{active: NavKey; collapsed?: boolean; highlight?: (k: NavKey) => number}> = ({
  active,
  collapsed = false,
  highlight,
}) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: collapsed ? RAIL_W : SIDEBAR_W,
      background: C.panel,
      borderRight: `1px solid ${C.line}`,
      fontFamily: SANS,
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <div style={{height: 66, display: 'flex', alignItems: 'center', gap: 10, padding: collapsed ? '0 0 0 18px' : '0 18px'}}>
      <Img src={staticFile('brand/logo.png')} style={{width: 34, height: 34}} />
      {!collapsed ? (
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <span style={{fontFamily: SERIF, fontSize: 20, fontWeight: 600, color: C.text, lineHeight: 1.1}}>AIShikshaMitra</span>
          <span style={{fontSize: 7.8, fontWeight: 600, color: '#7B60E1', letterSpacing: '0.2em', marginTop: 2}}>THE AI BUILT FOR BHARAT</span>
        </div>
      ) : null}
    </div>
    <div style={{paddingTop: 6}}>
      {NAV.slice(0, collapsed ? 9 : NAV.length).map((item) => (
        <NavItem key={item.key} item={item} active={item.key === active} collapsed={collapsed} highlight={highlight?.(item.key)} />
      ))}
    </div>
    <div style={{flex: 1}} />
    <div style={{borderTop: `1px solid ${C.line}`, paddingTop: 8, paddingBottom: 10}}>
      {[
        {label: 'WhatsApp Support', Icon: MessageCircle, color: '#25D366'},
        {label: 'Your API key', Icon: KeyRound, color: '#8E8C99'},
        {label: 'Collapse', Icon: ChevronsLeft, color: '#8E8C99'},
      ]
        .slice(collapsed ? 2 : 0)
        .map(({label, Icon, color}) => (
          <div
            key={label}
            style={{
              height: 38,
              margin: '0 10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-start',
              gap: 13,
              padding: collapsed ? 0 : '0 14px',
              color: '#A8A6B3',
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            <Icon size={18} color={color} style={collapsed ? {transform: 'rotate(180deg)'} : undefined} />
            {!collapsed ? label : null}
          </div>
        ))}
    </div>
  </div>
);

/** Sidebar + main content area. */
export const AppShell: React.FC<{active: NavKey; collapsed?: boolean; children: React.ReactNode; highlight?: (k: NavKey) => number}> = ({
  active,
  collapsed,
  children,
  highlight,
}) => (
  <div style={{position: 'absolute', inset: 0, background: C.app, fontFamily: SANS}}>
    <Sidebar active={active} collapsed={collapsed} highlight={highlight} />
    <div style={{position: 'absolute', left: collapsed ? RAIL_W : SIDEBAR_W, top: 0, right: 0, bottom: 0, overflow: 'hidden'}}>{children}</div>
  </div>
);
