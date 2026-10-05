import {ArrowLeft, ArrowRight, Download, Ellipsis, MonitorDown, Plus, RotateCw, Star, X} from 'lucide-react';
import React from 'react';
import {Img, staticFile} from 'remotion';
import {C, SANS, windowShadow} from '../theme';

export const BROWSER_W = 1440;
export const CHROME_H = 86;
export const VIEW_H = 820;
export const BROWSER_H = CHROME_H + VIEW_H;

/** Dark Chrome-style window showing aishikshamitra.com. Children fill the 1440x820 viewport. */
export const Browser: React.FC<{url: string; children: React.ReactNode; style?: React.CSSProperties}> = ({url, children, style}) => (
  <div
    style={{
      position: 'relative',
      width: BROWSER_W,
      height: BROWSER_H,
      borderRadius: 18,
      overflow: 'hidden',
      background: C.app,
      boxShadow: windowShadow,
      fontFamily: SANS,
      ...style,
    }}
  >
    <div style={{height: 40, background: '#1B1D23', display: 'flex', alignItems: 'flex-end', padding: '0 12px', gap: 6}}>
      <div style={{display: 'flex', gap: 8, alignSelf: 'center', marginRight: 10}}>
        {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
          <div key={c} style={{width: 12, height: 12, borderRadius: 6, background: c}} />
        ))}
      </div>
      <div
        style={{
          width: 250,
          height: 32,
          borderRadius: '10px 10px 0 0',
          background: '#32333A',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '0 12px',
          color: '#E4E4E7',
          fontSize: 12.5,
          fontWeight: 500,
        }}
      >
        <Img src={staticFile('brand/logo.png')} style={{width: 16, height: 16}} />
        <span style={{flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>AIShikshaMitra | AI Assistant for Teachers</span>
        <X size={13} color="#A1A1AA" />
      </div>
      <Plus size={16} color="#A1A1AA" style={{alignSelf: 'center', marginLeft: 6}} />
    </div>
    <div style={{height: CHROME_H - 40, background: '#32333A', display: 'flex', alignItems: 'center', gap: 14, padding: '0 14px', color: '#C4C4CC'}}>
      <ArrowLeft size={17} />
      <ArrowRight size={17} color="#71717A" />
      <RotateCw size={15} />
      <div
        style={{
          flex: 1,
          height: 32,
          borderRadius: 16,
          background: '#202228',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '0 14px',
          fontSize: 14,
          color: '#E4E4E7',
        }}
      >
        <div style={{width: 14, height: 14, borderRadius: 7, border: '1.5px solid #A1A1AA'}} />
        <span>{url}</span>
        <div style={{flex: 1}} />
        <MonitorDown size={16} />
        <Star size={15} />
      </div>
      <Download size={17} />
      <Ellipsis size={17} />
    </div>
    <div style={{position: 'relative', width: BROWSER_W, height: VIEW_H, overflow: 'hidden', background: C.app}}>{children}</div>
  </div>
);
