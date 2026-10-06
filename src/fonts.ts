import {loadFont} from '@remotion/fonts';
import {continueRender, delayRender, staticFile} from 'remotion';

const KALAM_DEVA = 'U+0900-097F,U+1CD0-1CF9,U+200C-200D,U+20A8,U+20B9,U+20F0,U+25CC,U+A830-A839,U+A8E0-A8FF';

const faces: {family: string; file: string; weight: string; style?: string; unicodeRange?: string}[] = [
  ...['400', '500', '600', '700', '800'].map((w) => ({family: 'Inter', file: `inter-latin-${w}-normal.woff2`, weight: w})),
  ...['400', '500', '600', '700', '800'].map((w) => ({
    family: 'Playfair Display',
    file: `playfair-display-latin-${w}-normal.woff2`,
    weight: w,
  })),
  ...['400', '600', '700'].map((w) => ({
    family: 'Playfair Display',
    file: `playfair-display-latin-${w}-italic.woff2`,
    weight: w,
    style: 'italic',
  })),
  ...['400', '700'].map((w) => ({family: 'Kalam', file: `kalam-latin-${w}-normal.woff2`, weight: w, unicodeRange: 'U+0000-00FF,U+2000-206F,U+2190-21FF,U+2212'})),
  ...['400', '700'].map((w) => ({family: 'Kalam', file: `kalam-devanagari-${w}-normal.woff2`, weight: w, unicodeRange: KALAM_DEVA})),
  ...['400', '500', '600', '700'].map((w) => ({
    family: 'Noto Serif Devanagari',
    file: `noto-serif-devanagari-devanagari-${w}-normal.woff2`,
    weight: w,
  })),
  ...['400', '500', '600', '700'].map((w) => ({
    family: 'Noto Sans Devanagari',
    file: `noto-sans-devanagari-devanagari-${w}-normal.woff2`,
    weight: w,
  })),
];

const handle = delayRender('Loading fonts');
Promise.all(faces.map((f) => loadFont({family: f.family, url: staticFile(`fonts/${f.file}`), weight: f.weight, style: f.style, unicodeRange: f.unicodeRange})))
  .then(() => continueRender(handle))
  .catch((err) => {
    console.error(err);
    continueRender(handle);
  });
