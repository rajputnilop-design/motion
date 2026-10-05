import {loadFont} from '@remotion/fonts';
import {continueRender, delayRender, staticFile} from 'remotion';

const faces: {weight: string; file: string; family?: string}[] = [
  {weight: '400', file: 'poppins-latin-400-normal.woff2'},
  {weight: '500', file: 'poppins-latin-500-normal.woff2'},
  {weight: '600', file: 'poppins-latin-600-normal.woff2'},
  {weight: '700', file: 'poppins-latin-700-normal.woff2'},
  {weight: '800', file: 'poppins-latin-800-normal.woff2'},
  {weight: '700', file: 'noto-sans-devanagari-devanagari-700-normal.woff2', family: 'Noto Sans Devanagari'},
];

const handle = delayRender('Loading fonts');
Promise.all(
  faces.map((f) =>
    loadFont({family: f.family ?? 'Poppins', url: staticFile(`fonts/${f.file}`), weight: f.weight}),
  ),
)
  .then(() => continueRender(handle))
  .catch((err) => {
    console.error(err);
    continueRender(handle);
  });
