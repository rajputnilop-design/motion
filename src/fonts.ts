import {loadFont} from '@remotion/fonts';
import {continueRender, delayRender, staticFile} from 'remotion';

const faces: {family: string; file: string; weight: string; style?: string}[] = [
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
  ...['400', '700'].map((w) => ({family: 'Kalam', file: `kalam-latin-${w}-normal.woff2`, weight: w})),
  ...['400', '500', '600', '700'].map((w) => ({
    family: 'Noto Sans Devanagari',
    file: `noto-sans-devanagari-devanagari-${w}-normal.woff2`,
    weight: w,
  })),
];

const handle = delayRender('Loading fonts');
Promise.all(faces.map((f) => loadFont({family: f.family, url: staticFile(`fonts/${f.file}`), weight: f.weight, style: f.style})))
  .then(() => continueRender(handle))
  .catch((err) => {
    console.error(err);
    continueRender(handle);
  });
