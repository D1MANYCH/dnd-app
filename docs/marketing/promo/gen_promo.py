# -*- coding: utf-8 -*-
"""Генератор промо-графики DnD-Лист для постов на DTF/VC.
Цвета взяты из style.css (тёмная тема). Выводит PNG в эту же папку."""
import math, os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUT = os.path.dirname(os.path.abspath(__file__))
F = "C:/Windows/Fonts/"

# --- палитра приложения ---
BG0=(15,14,20); BG1=(24,23,34); BG2=(34,32,46); PANEL=(30,28,42)
BORDER=(58,56,80); BORDER_SOFT=(42,40,56)
TEXT=(236,230,214); DIM=(163,155,134); MUTE=(111,106,93)
ACC=(224,179,88); ACC_HI=(240,198,116); ACC_LO=(199,153,65)
DANGER=(224,117,102); SUCCESS=(108,186,131)

def font(name, size):
    return ImageFont.truetype(F+name, size)

BOLD="segoeuib.ttf"; REG="segoeui.ttf"; SEMI="segoeui.ttf"; EMJ="seguiemj.ttf"

def grad_bg(w, h, glow=None):
    """вертикальный градиент BG1(верх)->BG0(низ) + золотое сияние. glow=(cx,cy,r) для своего центра."""
    base = Image.new("RGB",(w,h),BG0)
    top=(20,18,30); bot=(12,11,17)
    px=base.load()
    for y in range(h):
        t=y/(h-1)
        r=int(top[0]+(bot[0]-top[0])*t); g=int(top[1]+(bot[1]-top[1])*t); b=int(top[2]+(bot[2]-top[2])*t)
        for x in range(w): px[x,y]=(r,g,b)
    # сияние
    gl=Image.new("RGBA",(w,h),(0,0,0,0))
    gd=ImageDraw.Draw(gl)
    if glow is None:
        gd.ellipse([w*0.30,-h*0.55,w*0.95,h*0.55],fill=ACC+(46,))
    else:
        cx,cy,r=glow; gd.ellipse([cx-r,cy-r,cx+r,cy+r],fill=ACC+(60,))
    gl=gl.filter(ImageFilter.GaussianBlur(140))
    base=Image.alpha_composite(base.convert("RGBA"),gl)
    return base.convert("RGB")

def tracked(d, xy, text, fnt, fill, tracking=0):
    x,y=xy
    for ch in text:
        d.text((x,y),ch,font=fnt,fill=fill)
        x += d.textlength(ch,font=fnt)+tracking
    return x

def emoji(img, xy, ch, size):
    """Цветной эмодзи, отцентрированный в боксе size×size, без обрезания краёв."""
    fnt=font(EMJ,size)
    pad=size
    big=Image.new("RGBA",(size+2*pad,size+2*pad),(0,0,0,0))
    ImageDraw.Draw(big).text((pad,pad),ch,font=fnt,embedded_color=True)
    bbox=big.getbbox()
    glyph=big.crop(bbox) if bbox else big
    gw,gh=glyph.size
    scale=min(size/gw,size/gh,1.0)
    if scale<1.0:
        glyph=glyph.resize((max(1,int(gw*scale)),max(1,int(gh*scale))),Image.LANCZOS)
    gw,gh=glyph.size
    ox=int(xy[0]+(size-gw)/2); oy=int(xy[1]+(size-gh)/2)
    img.paste(glyph,(ox,oy),glyph)

def d20(d, cx, cy, R, col=ACC, lw=6):
    pts=[(cx+R*math.cos(math.radians(-90+60*k)), cy+R*math.sin(math.radians(-90+60*k))) for k in range(6)]
    d.polygon(pts, outline=col, width=lw)
    tri=[pts[0],pts[2],pts[4]]
    d.polygon(tri, outline=col, width=max(2,lw-2))
    for i in (1,3,5):
        d.line([pts[i],(cx,cy)], fill=col, width=max(2,lw-3))
    f=font(BOLD,int(R*0.55))
    tw=d.textlength("20",font=f); _,_,_,th=d.textbbox((0,0),"20",font=f)
    d.text((cx-tw/2,cy-th/2-R*0.02),"20",font=f,fill=col)

def chip(d, x, y, text, fnt, pad=18, h=52):
    w=d.textlength(text,font=fnt)+pad*2
    d.rounded_rectangle([x,y,x+w,y+h], radius=h//2, outline=ACC_LO, width=2, fill=(*ACC,18))
    d.text((x+pad, y+(h-fnt.size)//2-2), text, font=fnt, fill=ACC_HI)
    return x+w

# ============================ COVER ============================
def cover():
    W,H=1280,720
    img=grad_bg(W,H)
    d=ImageDraw.Draw(img,"RGBA")
    # рамка
    d.rounded_rectangle([26,26,W-26,H-26], radius=26, outline=(*ACC_LO,120), width=2)
    d.rounded_rectangle([34,34,W-34,H-34], radius=20, outline=(*BORDER,90), width=1)

    LX=92
    # kicker
    tracked(d,(LX,92),"DUNGEONS & DRAGONS 5E  ·  НА РУССКОМ",font(SEMI,24),ACC,tracking=2)
    # заголовок
    d.text((LX-4,140),"DnD-Лист",font=font(BOLD,158),fill=TEXT)
    d.rounded_rectangle([LX,322,LX+250,330],radius=4,fill=ACC)
    # подзаголовок
    sub=font(REG,40)
    d.text((LX,360),"Цифровой лист персонажа D&D 5e:",font=sub,fill=TEXT)
    d.text((LX,408),"офлайн, без регистрации, бесплатно.",font=sub,fill=DIM)
    # чипы
    cf=font(SEMI,26)
    x=LX; y=486
    for t in ["36 готовых билдов","706 заклинаний","3D-кубики","PWA · офлайн"]:
        x=chip(d,x,y,t,cf)+14
    # URL
    uf=font(BOLD,34)
    emoji(img,(LX-2,592),"🎲",40)
    d.text((LX+52,594),"d1manych.github.io/dnd-app",font=uf,fill=ACC_HI)
    # d20 справа
    d20(d, W-250, 300, 150, col=ACC, lw=7)
    # мягкое золотое кольцо вокруг d20
    d.ellipse([W-250-186,300-186,W-250+186,300+186],outline=(*ACC,40),width=3)
    img.save(os.path.join(OUT,"01-cover.png"))
    print("saved 01-cover.png")

# ========================== FEATURES ==========================
def fit_font(d, text, maxw, start=34, lo=26):
    for s in range(start, lo-1, -1):
        f=font(BOLD,s)
        if d.textlength(text,font=f) <= maxw: return f
    return font(BOLD,lo)

def features():
    W,H=1320,910
    img=grad_bg(W,H)
    d=ImageDraw.Draw(img,"RGBA")
    d.text((80,60),"Что внутри",font=font(BOLD,64),fill=TEXT)
    d.text((84,146),"Всё для игрока за столом — в одном листе, который работает офлайн.",font=font(REG,30),fill=DIM)

    cards=[
        ("🆓","Бесплатно, без регистрации","Данные хранятся только на вашем устройстве."),
        ("📱","Работает офлайн (PWA)","Ставится как приложение, играет без интернета."),
        ("📜","36 готовых билдов","С планом развития персонажа на уровни 1–20."),
        ("✨","706 заклинаний","Поиск, фильтры по классу и уровню, карточки."),
        ("🎲","3D-кубики","Честные броски d4–d20 прямо в листе."),
        ("💾","Импорт / экспорт","Резервная копия персонажа — один JSON-файл."),
    ]
    cols=2; cw=580; ch=190; gx=40; gy=36; x0=80; y0=228
    df=font(REG,27); tx_off=140
    for i,(ic,title,desc) in enumerate(cards):
        r=i//cols; c=i%cols
        x=x0+c*(cw+gx); y=y0+r*(ch+gy)
        d.rounded_rectangle([x,y,x+cw,y+ch],radius=22,fill=(*BG2,180),outline=BORDER,width=2)
        d.rounded_rectangle([x,y,x+8,y+ch],radius=4,fill=ACC)
        emoji(img,(x+34,y+38),ic,72)
        tf=fit_font(d,title,cw-tx_off-24)
        d.text((x+tx_off,y+40),title,font=tf,fill=TEXT)
        # перенос описания по ширине
        words=desc.split(); line=""; ty=y+96
        for wd in words:
            test=(line+" "+wd).strip()
            if d.textlength(test,font=df) > cw-tx_off-24:
                d.text((x+tx_off,ty),line,font=df,fill=DIM); ty+=38; line=wd
            else: line=test
        if line: d.text((x+tx_off,ty),line,font=df,fill=DIM)
    img.save(os.path.join(OUT,"02-features.png"))
    print("saved 02-features.png")

# ========================== AVATAR ==========================
def avatar():
    S=512
    img=grad_bg(S,S,glow=(S/2,S/2,300))
    d=ImageDraw.Draw(img,"RGBA")
    d.ellipse([26,26,S-26,S-26],outline=(*ACC_LO,110),width=5)
    d20(d, S//2, S//2+8, 168, col=ACC, lw=12)
    img.save(os.path.join(OUT,"avatar.png"))
    print("saved avatar.png")

# ======================= VC PROFILE BANNER ==================
def banner():
    W,H=1600,500
    img=grad_bg(W,H)
    d=ImageDraw.Draw(img,"RGBA")
    d.rounded_rectangle([14,14,W-14,H-14],radius=22,outline=(*ACC_LO,70),width=2)
    LX=96
    tracked(d,(LX,70),"DUNGEONS & DRAGONS 5E  ·  НА РУССКОМ",font(SEMI,24),ACC,tracking=2)
    d.text((LX-4,108),"DnD-Лист",font=font(BOLD,118),fill=TEXT)
    d.rounded_rectangle([LX,250,LX+190,258],radius=4,fill=ACC)
    d.text((LX,288),"Лист персонажа D&D 5e: офлайн, без регистрации, бесплатно.",font=font(REG,36),fill=DIM)
    # URL вверху справа (низ-слева оставляем под аватар)
    uf=font(SEMI,26); url="d1manych.github.io/dnd-app"
    d.text((W-96-d.textlength(url,font=uf),72),url,font=uf,fill=ACC_HI)
    # d20 справа по центру
    d20(d, W-230, H//2, 150, col=ACC, lw=7)
    img.save(os.path.join(OUT,"vc-banner.png"))
    print("saved vc-banner.png")

# ===================== OG / SOCIAL CARD ======================
def og():
    """Карточка превью при шеринге ссылки (Open Graph / Twitter). 1200×630 — каноничный размер.
    Сохраняется в assets/og-cover.png (корень репо), сослана из index.html абсолютным URL."""
    W,H=1200,630
    img=grad_bg(W,H)
    d=ImageDraw.Draw(img,"RGBA")
    d.rounded_rectangle([22,22,W-22,H-22], radius=22, outline=(*ACC_LO,110), width=2)
    LX=80
    tracked(d,(LX,76),"DUNGEONS & DRAGONS 5E  ·  НА РУССКОМ",font(SEMI,22),ACC,tracking=2)
    d.text((LX-4,116),"DnD-Лист",font=font(BOLD,140),fill=TEXT)
    d.rounded_rectangle([LX,290,LX+220,298],radius=4,fill=ACC)
    sub=font(REG,34)
    d.text((LX,330),"Цифровой лист персонажа D&D 5e:",font=sub,fill=TEXT)
    d.text((LX,374),"офлайн, без регистрации, бесплатно.",font=sub,fill=DIM)
    cf=font(SEMI,23)
    x=LX; y=448
    for t in ["36 готовых билдов","706 заклинаний","3D-кубики","PWA · офлайн"]:
        x=chip(d,x,y,t,cf,pad=15,h=46)+12
    uf=font(BOLD,30)
    emoji(img,(LX-2,536),"🎲",36)
    d.text((LX+48,538),"d1manych.github.io/dnd-app",font=uf,fill=ACC_HI)
    d20(d, W-200, 286, 130, col=ACC, lw=7)
    d.ellipse([W-200-160,286-160,W-200+160,286+160],outline=(*ACC,40),width=3)
    root=os.path.abspath(os.path.join(OUT,"..","..",".."))
    dst=os.path.join(root,"assets","og-cover.png")
    img.save(dst)
    print("saved", dst)

if __name__=="__main__":
    cover(); features(); avatar(); banner(); og()
    print("done ->", OUT)
