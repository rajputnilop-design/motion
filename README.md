# AIShikshaMitra — Your AI Teaching Assistant (motion graphic)

A 66-second, 1920×1080 / 30 fps promo video built in code with [Remotion](https://www.remotion.dev/) (React).
Narration, music and sound effects are generated offline by the scripts in `audio-tools/`.

**Rendered video:** [`out/AIShikshaMitra.mp4`](out/AIShikshaMitra.mp4)

## Scenes

| # | Scene | Length | What happens |
|---|-------|--------|--------------|
| 1 | The Problem | 7.0 s | Browser tabs and documents pile up while a clock races to 11:58 PM; everything freezes and gets swept away. |
| 2 | AIShikshaMitra Appears | 6.0 s | Logo reveal with a light burst, wordmark and tagline, the phone rises with the app home screen. |
| 3 | Lesson Plans | 6.5 s | Class 8 → Science → Light is picked on the phone; a lesson plan builds itself section by section. |
| 4 | Question Papers | 7.0 s | Class → Subject → Chapter → Difficulty; questions populate, one is regenerated, then the PDF downloads. |
| 5 | Images & Diagrams | 6.5 s | The prompt "Create a diagram explaining the water cycle." turns into an animated diagram, surrounded by six more. |
| 6 | Presentations | 7.0 s | The topic "The Solar System" becomes a five-slide deck. |
| 7 | Educational Videos | 7.5 s | Topic → Script → Visuals → Video pipeline; a chalkboard explainer video assembles itself. |
| 8 | Everything in One Place | 7.0 s | Seven tool tiles orbit the phone, then fly into their slots on the home screen. |
| 9 | Built for Teachers | 6.5 s | Six teacher cards from across India fly in around the headline. |
| 10 | Final CTA | 10.0 s | Logo hit → TEACH SMARTER. CREATE FASTER. INSPIRE MORE. → lock-up → DOWNLOAD THE APP. |

Scenes are joined by 0.5 s dip-and-zoom transitions; all durations, voice-over offsets and music cue points live in
[`src/timeline.json`](src/timeline.json).

## Working on it

```bash
npm install
npm run studio        # live preview + scrubbing in the browser
npm run render        # renders out/raw.mp4, then masters it to out/AIShikshaMitra.mp4 (−16 LUFS)
npm run still -- out/frame.png --frame=520   # single frame
```

Remotion downloads its own headless Chrome on first render. If that is not possible (e.g. an offline
machine), point it at an existing one with `--browser-executable=/path/to/chrome-headless-shell`.

Render a music-and-effects-only version (for recording your own voice-over) with:

```bash
npx remotion render AIShikshaMitra out/AIShikshaMitra-no-vo.mp4 --props='{"voiceover":false,"music":true}'
```

### Project layout

```
src/
  timeline.json        scene lengths, VO placement, music cues (shared with the Python audio scripts)
  Video.tsx            background, scene sequence with transitions, music ducking, VO
  theme.ts             colours, gradients, font stack
  scenes/              one file per scene (Scene01Problem.tsx … Scene10Cta.tsx)
  components/          Logo, Phone mockup, home screen, form fields, tap indicator, text animations
  illustrations/       water cycle, mini diagrams, Solar System slides, chalkboard explainer
public/
  fonts/               Poppins + Noto Sans Devanagari (SIL OFL)
  audio/vo/            narration lines
  audio/sfx/           UI and transition sounds
  audio/music.wav      music bed
audio-tools/           Python generators for all of the audio
```

## Audio

```bash
pip install -r audio-tools/requirements.txt
python audio-tools/generate_sfx.py
python audio-tools/generate_music.py      # reads src/timeline.json, so re-run it after changing timings
# narration: needs the Kokoro model files from
# https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0
python audio-tools/generate_vo.py --models /path/to/kokoro-models --voice af_heart
```

- **Voice-over** is synthesised with the open-source Kokoro TTS (Apache-2.0), voice `af_heart`. "Shiksha" is
  nudged towards the Hindi pronunciation. If a line changes, regenerate it and update its `seconds` in
  `timeline.json`. To use a recorded voice instead, drop WAV files with the same names into `public/audio/vo/`.
- **Music and SFX** are synthesised from scratch (no samples), so there are no licensing strings attached. The
  music is locked to the timeline: tension until the freeze, a reverse swell into the logo reveal, a 100 bpm
  I–V–vi–IV groove under the feature scenes, a breakdown for "Built for Teachers", and a build into the final hit.
  It is automatically ducked under each narration line in `Video.tsx`.

## Before publishing

- The logo, app screens and teacher profiles are **illustrative placeholders**: swap in the real brand assets,
  screenshots and (with consent) real teachers if you have them. The teacher names are fictional.
- Lesson, exam and slide content is sample content written for the video (NCERT-style topics).
- Remotion is free for individuals and companies with up to 3 employees; larger companies need a
  [Remotion company licence](https://www.remotion.dev/license).
