"""Generate AppealMate PNG icons (192, 512, maskable) from the brand design.
Matches icon.svg: blue rounded square + white envelope + green check badge."""
from PIL import Image, ImageDraw

BLUE = (31, 111, 235, 255)
WHITE = (255, 255, 255, 255)
GREEN = (21, 196, 126, 255)

def draw_icon(size, maskable=False):
    # supersample for smooth edges
    S = size * 4
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    # background: full-bleed for maskable, rounded for normal
    if maskable:
        d.rectangle([0, 0, S, S], fill=BLUE)
    else:
        d.rounded_rectangle([0, 0, S, S], radius=int(S * 0.22), fill=BLUE)
    # content sits in the central safe zone (esp. for maskable)
    pad = S * (0.26 if maskable else 0.22)
    w = S - pad * 2
    # envelope body
    ex0, ey0 = pad, pad + w * 0.12
    ex1, ey1 = pad + w, pad + w * 0.12 + w * 0.62
    d.rounded_rectangle([ex0, ey0, ex1, ey1], radius=int(w * 0.06), fill=WHITE)
    # envelope flap (V)
    midx = (ex0 + ex1) / 2
    flap_y = ey0 + (ey1 - ey0) * 0.45
    lw = int(w * 0.05)
    d.line([ex0 + w*0.04, ey0 + w*0.04, midx, flap_y], fill=BLUE, width=lw, joint="curve")
    d.line([midx, flap_y, ex1 - w*0.04, ey0 + w*0.04], fill=BLUE, width=lw, joint="curve")
    # green check badge bottom-right
    r = w * 0.26
    cx, cy = ex1 - r * 0.35, ey1 - r * 0.15
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=GREEN, outline=WHITE, width=int(r*0.16))
    # check mark
    cw = int(r * 0.22)
    d.line([cx - r*0.45, cy, cx - r*0.08, cy + r*0.38], fill=WHITE, width=cw, joint="curve")
    d.line([cx - r*0.08, cy + r*0.38, cx + r*0.5, cy - r*0.32], fill=WHITE, width=cw, joint="curve")
    return img.resize((size, size), Image.LANCZOS)

for sz in (192, 512):
    draw_icon(sz).save(f"public/icon-{sz}.png")
    print(f"wrote public/icon-{sz}.png")
draw_icon(512, maskable=True).save("public/icon-512-maskable.png")
print("wrote public/icon-512-maskable.png")
