# Contact sheet of review stills: python scripts/sheet.py out.jpg cols width a.png b.png ...
import sys
from PIL import Image, ImageDraw
out, cols, w = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
ims = [Image.open(p).convert('RGB') for p in sys.argv[4:]]
h = int(ims[0].height * w / ims[0].width)
rows = (len(ims) + cols - 1) // cols
sheet = Image.new('RGB', (cols * w, rows * h), 'white')
for i, (im, p) in enumerate(zip(ims, sys.argv[4:])):
    x, y = (i % cols) * w, (i // cols) * h
    sheet.paste(im.resize((w, h), Image.LANCZOS), (x, y))
    ImageDraw.Draw(sheet).text((x + 6, y + 6), p.rsplit('-', 1)[-1][:-4], fill='yellow')
sheet.save(out, quality=88)
