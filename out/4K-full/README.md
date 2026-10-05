# Full 4K render (172 MB) in two parts

GitHub only accepts files up to 100 MB, so the original 3840×2160 render is split in two.
Download both parts into the same folder, then join them:

- **Windows** (Command Prompt, in that folder):
  `copy /b AIShikshaMitra-4K-full.mp4.part1+AIShikshaMitra-4K-full.mp4.part2 AIShikshaMitra-4K-full.mp4`
- **Mac / Linux** (Terminal, in that folder):
  `cat AIShikshaMitra-4K-full.mp4.part1 AIShikshaMitra-4K-full.mp4.part2 > AIShikshaMitra-4K-full.mp4`

The joined file should be 171,818,312 bytes, SHA-256
`1ececa8bbf7634d6a55faffe624ee4fec94a370ec86834cc925d58427794b183`.

If you only need to watch or post it, `../AIShikshaMitra-4K.mp4` (89 MB, also 4K) plays as-is and looks the same.
