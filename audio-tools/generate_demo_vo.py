"""Generate the how-to demo narration (English, Hindi, Marathi) with ElevenLabs.

    export ELEVENLABS_API_KEY=...            # never commit the key
    python audio-tools/generate_demo_vo.py --lang en hi mr            # all lines
    python audio-tools/generate_demo_vo.py --lang hi --only s10 s14   # retake a few lines
    python audio-tools/generate_demo_vo.py --list-voices hi           # browse Indian voices

What it does
  * picks the newest ElevenLabs text-to-speech model that supports each language (Eleven v3 or later; override
    with --model), and checks the remaining credits before spending any (1 credit ~ 1 character),
  * uses the voice IDs in audio-tools/demo_voices.json (edit them to taste) or, if a language has none, searches the
    Voice Library for a native female narrator for that language and adds it to your voices,
  * generates one request per line from src/demo/script.json, keeps the MP3 in voiceover/demo/<lang>/ and writes a
    trimmed, loudness-matched WAV to public/audio/demo/<lang>/<id>.wav,
  * then rebuilds src/demo/timeline.json (python audio-tools/demo_timeline.py) so the video follows the new lengths.
  --convert-only redoes the WAVs and the timeline from the saved MP3s without calling the API (fresh checkouts).

Generated lines are skipped on re-runs unless --force is given, so a failed run never pays twice.

No API access? Generate each language yourself on elevenlabs.io (paste the text from voiceover/demo/<lang>.txt,
one paragraph per line) and split the download with:  --from-audio hi=/path/to/hindi.mp3
A recording kept as voiceover/demo/<lang>-full.mp3 with cut times in voiceover/demo/<lang>-cuts.json (id, start,
end in seconds) is used instead of per-line MP3s; --convert-only re-cuts it.
"""
import argparse
import json
import os
import re
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
SCRIPT = json.loads((ROOT / 'src/demo/script.json').read_text())
VOICES_FILE = ROOT / 'audio-tools/demo_voices.json'
RAW = ROOT / 'voiceover/demo'
OUT = ROOT / 'public/audio/demo'
API = os.environ.get('ELEVENLABS_API_BASE', 'https://api.elevenlabs.io')  # override only for testing
LANG_NAME = {'en': 'English (India)', 'hi': 'Hindi', 'mr': 'Marathi'}
# Library search hints per language: (language code, accent keyword).
SEARCH = {'en': ('en', 'indian'), 'hi': ('hi', None), 'mr': ('mr', None)}


def key() -> str:
    k = os.environ.get('ELEVENLABS_API_KEY', '').strip()
    if not k:
        sys.exit('ELEVENLABS_API_KEY is not set. Add it as an environment variable (never commit it).')
    return k


def call(method: str, path: str, body=None, query=None, raw=False):
    url = API + path + ('?' + urllib.parse.urlencode(query) if query else '')
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method, headers={'xi-api-key': key(), 'Content-Type': 'application/json', 'Accept': '*/*'})
    for attempt in range(5):
        try:
            with urllib.request.urlopen(req, timeout=180) as r:
                payload = r.read()
                return payload if raw else json.loads(payload or b'{}')
        except urllib.error.HTTPError as e:
            detail = e.read().decode(errors='replace')
            if e.code in (429, 500, 502, 503, 504) and attempt < 4:
                time.sleep(2 ** (attempt + 1))
                continue
            raise RuntimeError(f'{method} {path} -> HTTP {e.code}: {detail[:400]}') from None
        except urllib.error.URLError as e:
            if attempt < 4:
                time.sleep(2 ** (attempt + 1))
                continue
            raise RuntimeError(f'{method} {path} -> {e.reason} (is api.elevenlabs.io allowed in the network settings?)') from None


def credits_left() -> tuple[int, int]:
    s = call('GET', '/v1/user/subscription')
    return int(s.get('character_limit', 0)) - int(s.get('character_count', 0)), int(s.get('character_limit', 0))


def model_rank(m: dict) -> tuple:
    mid = m.get('model_id', '')
    nums = [int(n) for n in re.findall(r'v(\d+)', mid)] or [0]
    fast = any(t in mid for t in ('flash', 'turbo'))
    return (not fast, max(nums), mid)


def pick_model(lang: str, override: str | None) -> str:
    if override:
        return override
    models = [m for m in call('GET', '/v1/models') if m.get('can_do_text_to_speech')]
    ok = [m for m in models if any(l.get('language_id', '').split('-')[0] == lang for l in m.get('languages', []))]
    if not ok:
        sys.exit(f'No ElevenLabs model lists {LANG_NAME[lang]}. Pass --model explicitly.')
    best = max(ok, key=model_rank)
    return best['model_id']


def load_voices() -> dict:
    return json.loads(VOICES_FILE.read_text()) if VOICES_FILE.exists() else {}


def library_search(lang: str, n: int = 10) -> list[dict]:
    code, accent = SEARCH[lang]
    q = {'page_size': n, 'language': code, 'gender': 'female', 'sort': 'usage_character_count_1y'}
    if accent:
        q['accent'] = accent
    for loosen in ([], ['sort'], ['sort', 'gender'], ['sort', 'gender', 'accent']):
        qq = {k: v for k, v in q.items() if k not in loosen}
        try:
            voices = call('GET', '/v1/shared-voices', query=qq).get('voices', [])
        except RuntimeError as e:  # an unsupported filter value: try with fewer filters
            print(f'  voice search: {e}')
            continue
        if voices:
            return voices
    return []


def choose_voice(lang: str) -> str:
    voices = load_voices()
    if voices.get(lang):
        return voices[lang]
    found = library_search(lang)
    if not found:
        sys.exit(f'No library voice found for {LANG_NAME[lang]}; put a voice_id for "{lang}" in {VOICES_FILE}.')
    v = found[0]
    print(f'  [{lang}] using library voice "{v.get("name")}" ({v.get("accent")}, {v.get("language")}) — change it in {VOICES_FILE.name}')
    try:
        added = call('POST', f'/v1/voices/add/{v["public_owner_id"]}/{v["voice_id"]}', body={'new_name': f'AISM demo {lang} - {v.get("name")}'})
        vid = added.get('voice_id', v['voice_id'])
    except RuntimeError as e:
        print(f'  could not add it to your voices ({e}); trying it directly')
        vid = v['voice_id']
    voices[lang] = vid
    VOICES_FILE.write_text(json.dumps(voices, indent=2, ensure_ascii=False) + '\n')
    return vid


def tts(voice: str, model: str, lang: str, text: str, prev: str | None, nxt: str | None) -> bytes:
    body = {
        'text': text,
        'model_id': model,
        'language_code': lang,
        'seed': 4242,
        'voice_settings': {'stability': 0.5, 'similarity_boost': 0.8, 'style': 0.25, 'use_speaker_boost': True},
    }
    if prev:
        body['previous_text'] = prev
    if nxt:
        body['next_text'] = nxt
    q = {'output_format': 'mp3_44100_128'}
    # Not every model accepts every field; a rejected request costs nothing, so drop the optional ones and retry.
    last = None
    for drop in ([], ['previous_text', 'next_text'], ['language_code'], ['style'], ['seed']):
        b = dict(body)
        for d in drop:
            b.pop(d, None)
            if d == 'style':
                b['voice_settings'] = {k: v for k, v in b['voice_settings'].items() if k != 'style'}
        try:
            return call('POST', f'/v1/text-to-speech/{voice}', body=b, query=q, raw=True)
        except RuntimeError as e:
            if 'HTTP 400' in str(e) or 'HTTP 422' in str(e):
                body = b
                last = e
                continue
            raise
    raise last


def finish(src: Path, dst: Path, gain_db: float | None = None, span: tuple[float, float] | None = None) -> float:
    """Trim silence, match loudness, write 48 kHz mono WAV. Returns seconds.

    With gain_db every line of a language gets the same gain (keeps the narrator's natural dynamics); without it
    each line is loudness-normalised on its own. span cuts [start, end] seconds out of a longer recording.
    """
    dst.parent.mkdir(parents=True, exist_ok=True)
    trim = 'silenceremove=start_periods=1:start_threshold=-48dB:start_silence=0.05'
    level = f'volume={gain_db:.2f}dB' if gain_db is not None else 'loudnorm=I=-19:TP=-2:LRA=9'
    af = f'{trim},areverse,{trim},areverse,{level},afade=t=in:d=0.01,areverse,afade=t=in:d=0.03,areverse,aresample=48000'
    cut = ['-ss', f'{span[0]:.3f}', '-to', f'{span[1]:.3f}'] if span else []
    subprocess.run(['ffmpeg', '-v', 'error', '-y', *cut, '-i', str(src), '-af', af, '-ac', '1', '-c:a', 'pcm_s16le', str(dst)], check=True)
    out = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(dst)], capture_output=True, text=True)
    return float(out.stdout.strip())


def integrated_lufs(path: Path) -> float:
    out = subprocess.run(['ffmpeg', '-hide_banner', '-i', str(path), '-af', 'loudnorm=print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
    return float(json.loads(out[out.rindex('{'):])['input_i'])


def extract_cuts(lang: str):
    """Cut every line out of voiceover/demo/<lang>-full.mp3 at the times in <lang>-cuts.json (one gain per language)."""
    full = RAW / f'{lang}-full.mp3'
    cuts = json.loads((RAW / f'{lang}-cuts.json').read_text())
    gain = -19.0 - integrated_lufs(full)
    for c in cuts:
        secs = finish(full, OUT / lang / f"{c['id']}.wav", gain_db=gain, span=(c['start'], c['end']))
        print(f"  {lang}/{c['id']}: {secs:.2f}s")


def write_text_files():
    RAW.mkdir(parents=True, exist_ok=True)
    for lang in ('en', 'hi', 'mr'):
        (RAW / f'{lang}.txt').write_text('\n\n'.join(s['vo'][lang] for s in SCRIPT['steps']) + '\n')


def split_long_audio(lang: str, path: str):
    """Split one file containing every line (in order) at the longest pauses."""
    steps = SCRIPT['steps']
    sr = 16000
    pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', str(sr), '-f', 's16le', '-'], capture_output=True, check=True).stdout
    x = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768
    hop = int(0.02 * sr)
    e = np.array([np.sqrt(np.mean(x[i:i + hop] ** 2) + 1e-12) for i in range(0, len(x) - hop, hop)])
    db = 20 * np.log10(e)
    silent = db < (np.percentile(db, 95) - 35)
    runs, i = [], 0
    while i < len(silent):
        if silent[i]:
            j = i
            while j < len(silent) and silent[j]:
                j += 1
            if i > 0 and j < len(silent):
                runs.append((j - i, i, j))
            i = j
        else:
            i += 1
    need = len(steps) - 1
    if len(runs) < need:
        sys.exit(f'Found only {len(runs)} pauses for {len(steps)} lines; leave a clear pause between paragraphs.')
    cuts = sorted(r for r in sorted(runs, reverse=True)[:need])
    bounds = [0] + [((a + b) // 2) * hop for _, a, b in sorted(cuts, key=lambda r: r[1])] + [len(x)]
    raw_dir = RAW / lang
    raw_dir.mkdir(parents=True, exist_ok=True)
    full = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', '48000', '-f', 's16le', '-'], capture_output=True, check=True).stdout
    y = np.frombuffer(full, np.int16)
    k = 48000 / sr
    for s, a, b in zip(steps, bounds[:-1], bounds[1:]):
        seg = raw_dir / (s['id'] + '.wav')
        with wave.open(str(seg), 'wb') as w:
            w.setnchannels(1)
            w.setsampwidth(2)
            w.setframerate(48000)
            w.writeframes(y[int(a * k):int(b * k)].tobytes())
        secs = finish(seg, OUT / lang / (s['id'] + '.wav'))
        print(f'  {s["id"]}: {secs:.2f}s')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--lang', nargs='+', default=['en', 'hi', 'mr'], choices=['en', 'hi', 'mr'])
    ap.add_argument('--only', nargs='*', help='step ids to (re)generate')
    ap.add_argument('--model', help='ElevenLabs model_id (default: newest that supports the language)')
    ap.add_argument('--force', action='store_true', help='regenerate lines that already exist')
    ap.add_argument('--list-voices', choices=['en', 'hi', 'mr'])
    ap.add_argument('--from-audio', nargs='+', metavar='LANG=FILE', help='split your own long recording instead of calling the API')
    ap.add_argument('--convert-only', action='store_true', help='only turn the saved MP3s into WAVs and rebuild the timeline (no API calls)')
    a = ap.parse_args()
    write_text_files()

    if a.convert_only:
        for lang in a.lang:
            if (RAW / f'{lang}-cuts.json').exists():
                extract_cuts(lang)
                continue
            for s in SCRIPT['steps']:
                mp3 = RAW / lang / f'{s["id"]}.mp3'
                if mp3.exists():
                    finish(mp3, OUT / lang / (s['id'] + '.wav'))
        subprocess.run([sys.executable, str(ROOT / 'audio-tools/demo_timeline.py')], check=True)
        return

    if a.from_audio:
        for item in a.from_audio:
            lang, path = item.split('=', 1)
            print(f'[{lang}] splitting {path}')
            split_long_audio(lang, path)
        subprocess.run([sys.executable, str(ROOT / 'audio-tools/demo_timeline.py')], check=True)
        return

    if a.list_voices:
        for v in library_search(a.list_voices, 20):
            print(f'{v["voice_id"]}  {v.get("name")!r:32} {v.get("gender")}, {v.get("accent")}, {v.get("age")}, {v.get("use_case")}')
        return

    steps = SCRIPT['steps']
    todo = []
    for lang in a.lang:
        for i, s in enumerate(steps):
            if a.only and s['id'] not in a.only:
                continue
            mp3 = RAW / lang / f'{s["id"]}.mp3'
            if mp3.exists() and not a.force:
                continue
            todo.append((lang, i, s))
    need = sum(len(s['vo'][lang]) for lang, _, s in todo)
    if not todo:
        print('Nothing to generate (use --force to redo lines).')
    else:
        left, limit = credits_left()
        print(f'{len(todo)} lines, {need} characters; {left} of {limit} credits left.')
        if need > left:
            sys.exit('Not enough credits for this run; generate fewer languages or lines (--lang / --only).')

    models, voices = {}, {}
    for lang, i, s in todo:
        if lang not in models:
            models[lang] = pick_model(lang, a.model)
            voices[lang] = choose_voice(lang)
            print(f'[{lang}] model {models[lang]}, voice {voices[lang]}')
        prev = steps[i - 1]['vo'][lang] if i > 0 else None
        nxt = steps[i + 1]['vo'][lang] if i + 1 < len(steps) else None
        audio = tts(voices[lang], models[lang], lang, s['vo'][lang], prev, nxt)
        mp3 = RAW / lang / f'{s["id"]}.mp3'
        mp3.parent.mkdir(parents=True, exist_ok=True)
        mp3.write_bytes(audio)
        secs = finish(mp3, OUT / lang / (s['id'] + '.wav'))
        print(f'  {lang}/{s["id"]}: {secs:.2f}s')

    # Lines generated earlier but not yet converted (e.g. after editing finish()).
    for lang in a.lang:
        for s in steps:
            mp3 = RAW / lang / f'{s["id"]}.mp3'
            wav = OUT / lang / f'{s["id"]}.wav'
            if mp3.exists() and (not wav.exists() or wav.stat().st_mtime < mp3.stat().st_mtime):
                finish(mp3, wav)
    if todo:
        left, _ = credits_left()
        print(f'Done. {left} credits left.')
    subprocess.run([sys.executable, str(ROOT / 'audio-tools/demo_timeline.py')], check=True)


if __name__ == '__main__':
    main()
