// Render review stills: node scripts/stills.mjs <outDir> <CompositionId>:<frame>,<frame> ...
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';

const [outDir, ...jobs] = process.argv.slice(2);
const browserExecutable = process.env.REMOTION_BROWSER || null;
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
for (const job of jobs) {
  const [id, frames] = job.split(':');
  const inputProps = process.env.PROPS ? JSON.parse(process.env.PROPS) : {};
  const composition = await selectComposition({serveUrl, id, browserExecutable, inputProps});
  for (const f of frames.split(',').map(Number)) {
    const output = path.join(outDir, `${id}-${String(f).padStart(3, '0')}.png`);
    await renderStill({serveUrl, composition, frame: f, output, browserExecutable, inputProps, scale: Number(process.env.SCALE || 0.5)});
    console.log(output);
  }
}
