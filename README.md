# AIShikshaMitra — Your AI Teaching Assistant (motion graphic)

A 69-second, 1920×1080 / 30 fps promo video built in code with [Remotion](https://www.remotion.dev/) (React).
It recreates the real aishikshamitra.com web app (dark UI, sidebar, ShikshakMitra AI chat, Studio, the Marathi
question-paper view) and uses the official lotus-and-book logo, split into layers so it can bloom on screen.
Narration, music and sound effects are generated offline by the scripts in `audio-tools/`.

**Rendered video:** [`out/AIShikshaMitra.mp4`](out/AIShikshaMitra.mp4)

## Scenes

| # | Scene | Length | What happens |
|---|-------|--------|--------------|
| 1 | The Problem | 7.0 s | Browser tabs and documents pile up while a clock races to 11:58 PM; everything freezes and is swept away. |
| 2 | AIShikshaMitra Appears | 6.5 s | The logo blooms petal by petal; wordmark, "THE AI BUILT FOR BHARAT" and "Your AI Teaching Assistant"; the real chat page ("Namaste 👋 I'm ShikshakMitra AI") arrives in 3D with a phone. |
| 3 | Lesson Plans | 7.0 s | Studio → Lesson Plan: Class 8 → Science → Light, the Generating orb, then the lesson-plan document with Copy / PDF / DOCX / Publish. |
| 4 | Question Papers | 8.0 s | Studio → Question Paper: State Board, Class 4, Marathi, विशेषण, Medium → "Creating your question paper..." → the Marathi paper; the answer key is revealed and the PDF saved. |
| 5 | Images & Diagrams | 6.7 s | "Create a diagram explaining the water cycle." typed into "Ask ShikshakMitra AI...", answered with an animated diagram; six more visuals fly in. |
| 6 | Presentations | 7.0 s | Topic "The Solar System" becomes a five-slide deck with a quiz. |
| 7 | Educational Videos | 7.5 s | Topic → Script → Visuals → Video pipeline; a chalkboard explainer assembles itself. |
| 8 | Everything in One Place | 7.2 s | Seven tools orbit the app and land on the Tools page; the rest of the app (Courses, Analytics, Assessment, MahaTET Practice, The Lab, Student Hub, English Speaking, Books, Banks) lights up. |
| 9 | Built for Teachers | 6.7 s | Six teacher cards from across India (including a Marathi teacher from Pune) around the headline. |
| 10 | Final CTA | 10.0 s | Logo hit → TEACH SMARTER. CREATE FASTER. INSPIRE MORE. → lock-up → DOWNLOAD THE APP · aishikshamitra.com. |

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
  theme.ts             colours sampled from the live app and logo, Playfair Display / Inter font stack
  scenes/              one file per scene (Scene01Problem.tsx … Scene10Cta.tsx)
  components/          Browser window, AppShell (real sidebar), Chat, Studio form, Generating orb,
                       3D camera (Device), Logo bloom, phone, tap indicator, text animations
  illustrations/       Marathi question paper, lesson plan, water cycle, mini diagrams, slides, chalkboard
public/
  brand/               logo.png and its layers (logo-*.png) for the bloom, film-grain tile
  fonts/               Playfair Display, Inter, Noto Sans Devanagari (SIL OFL)
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

- The chat page, sidebar, Generating orb and question-paper view follow the real app's screenshots. Screens that
  weren't in the screenshots (the Studio form, Tools page, lesson-plan and slide views) were designed in the same
  style — check they match what the app really shows.
- Teacher names and avatars are fictional. Lesson, slide and diagram content is sample content written for the video.
- No statistics or claims beyond what the app itself shows are used (aishikshamitra.com could not be reached from
  the build environment).
- Remotion is free for individuals and companies with up to 3 employees; larger companies need a
  [Remotion company licence](https://www.remotion.dev/license).
