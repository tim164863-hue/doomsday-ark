# 前後對照圖：python3 tools/side-by-side.py <before.png> <after.png> <out.png>  （左＝前、右＝後）
import sys
from PIL import Image, ImageDraw
a,b=Image.open(sys.argv[1]).convert('RGB'),Image.open(sys.argv[2]).convert('RGB')
h=max(a.height,b.height); o=Image.new('RGB',(a.width+b.width+8,h+24),(20,20,20)); o.paste(a,(0,24)); o.paste(b,(a.width+8,24))
d=ImageDraw.Draw(o); d.text((6,6),'BEFORE',fill=(255,200,120)); d.text((a.width+14,6),'AFTER',fill=(160,255,160)); o.save(sys.argv[3])
