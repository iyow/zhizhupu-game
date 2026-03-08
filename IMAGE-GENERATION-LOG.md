# 纸扎铺 - AI图片生成记录

> 生成时间：2026-03-08
> 工具：Pollinations.ai（https://image.pollinations.ai）
> 模型：flux
> 参数：nologo=true

---

## 生成工具说明

| 项目 | 内容 |
|------|------|
| **API** | `https://image.pollinations.ai/prompt/{encoded_prompt}` |
| **模型** | `flux`（最高质量） |
| **调用方式** | Python `requests.get(url, timeout=150)` |
| **Skill** | `pollinations-ai`（路径：`~/.agents/skills/pollinations-ai/SKILL.md`） |
| **重试逻辑** | 最多3次，遇到429/500自动等待5秒重试 |

---

## 图片清单

### 1. 标题封面背景

| 字段 | 内容 |
|------|------|
| **文件名** | `images/title-bg.jpg` |
| **尺寸** | 1280×720 |
| **Seed** | 8888 |
| **大小** | 68KB |

**Prompt：**
```
Chinese horror game title screen, ancient paper effigy shop at night, red lanterns glowing, paper figures silhouettes, ink wash painting style, dark atmosphere, moody indigo and crimson tones, mist, traditional Chinese architecture, cinematic composition, ultra detailed, atmospheric horror
```

---

### 2. 主角陈安 立绘

| 字段 | 内容 |
|------|------|
| **文件名** | `images/char-chen-an.jpg` |
| **尺寸** | 512×768 |
| **Seed** | 1001 |
| **大小** | 48KB |

**Prompt：**
```
Chinese young man character portrait, 25 years old, calm rational expression, white dress shirt slightly wrinkled, short black hair, standing half body portrait, ink wash illustration style, Chinese horror visual novel character art, dark background, detailed
```

---

### 3. 张意 立绘

| 字段 | 内容 |
|------|------|
| **文件名** | `images/char-zhang-yi.jpg` |
| **尺寸** | 512×768 |
| **Seed** | 2002 |
| **大小** | 57KB |

**Prompt：**
```
mysterious Chinese woman, indigo blue dress, bamboo hairpin, pale skin, calm eyes, half body portrait, ink wash style, dark background, visual novel art
```

---

### 4. 张老头 立绘

| 字段 | 内容 |
|------|------|
| **文件名** | `images/char-zhang-lao.jpg` |
| **尺寸** | 512×768 |
| **Seed** | 3003 |
| **大小** | 44KB |

**Prompt：**
```
old Chinese man, paper effigy shop owner, aged weathered face, sunken eyes like dry wells, grey hair, traditional dark robe, half body portrait, ink wash style, mysterious sinister aura, dark background, visual novel art
```

---

### 5. 场景·清溪镇入口

| 字段 | 内容 |
|------|------|
| **文件名** | `images/scene-town-entrance.jpg` |
| **尺寸** | 1280×720 |
| **Seed** | 4004 |
| **大小** | 104KB |

**Prompt：**
```
ancient Chinese small town entrance at dusk, stone path leading into misty village, bare poplar trees silhouettes, old street lamps with yellow glow, full moon in deep grey-blue sky, white paper funeral wreaths on doorways, gloomy oppressive atmosphere, ink wash style, cinematic wide shot
```

---

### 6. 场景·老宅院子

| 字段 | 内容 |
|------|------|
| **文件名** | `images/scene-old-house-yard.jpg` |
| **尺寸** | 1280×720 |
| **Seed** | 5005 |
| **大小** | 110KB |

**Prompt：**
```
old Chinese courtyard at night, cracked stone tile ground with weeds, large clay water vat on side, peeling red lacquer wooden gate, candlelight from funeral hall, paper figure standing near water vat, dark red spider lily flowers in corner, gloomy eerie atmosphere, ink wash horror style
```

---

### 7. 场景·张记纸扎铺门面

| 字段 | 内容 |
|------|------|
| **文件名** | `images/scene-shop-exterior.jpg` |
| **尺寸** | 1280×720 |
| **Seed** | 6006 |
| **大小** | 94KB |

**Prompt：**
```
Chinese paper effigy shop front at night, dark wooden signboard with traditional characters, two glowing red lanterns at door, two white paper figures standing at entrance with unsettling slight smiles, warm candlelight leaking through door crack, cramped alley between closed shops, mysterious sinister atmosphere, ink wash horror style
```

---

### 8. 场景·梦境纸人街道

| 字段 | 内容 |
|------|------|
| **文件名** | `images/scene-dream-street.jpg` |
| **尺寸** | 1280×720 |
| **Seed** | 7007 |
| **大小** | 89KB |

**Prompt：**
```
surreal dreamscape street filled with white paper figures, all-white paper buildings glowing amber from within, hundreds of paper effigies walking the street, single red lantern hanging on a pole at center, infinite white void sky, ethereal dreamlike horror atmosphere, ink wash style, wide cinematic shot
```

---

### 9. 场景·老宅阁楼

| 字段 | 内容 |
|------|------|
| **文件名** | `images/scene-attic.jpg` |
| **尺寸** | 1280×720 |
| **Seed** | 8008 |
| **大小** | 110KB |

**Prompt：**
```
dusty old attic, low slanted ceiling, small window with single beam of light, old wooden trunks covered in cobwebs, floating dust particles, forgotten abandoned space, dim oppressive atmosphere, ink wash horror style
```

---

### 10. 场景·老槐树下·雨中（终章）

| 字段 | 内容 |
|------|------|
| **文件名** | `images/scene-old-tree.jpg` |
| **尺寸** | 1280×720 |
| **Seed** | 9009 |
| **大小** | 118KB |

**Prompt：**
```
massive old tree split by lightning, one side charred black one side green, rainy grey sky, wet stone ground puddles, dim street lamp, red spider lily at roots, Chinese horror scene, ink wash style
```

---

## 集成方式

### 场景背景（7张）
在各 `<div id="scene-xxx">` 内第一个子元素前注入：
```html
<img src="images/xxx.jpg"
     style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;opacity:0.7;"
     alt="">
```
原有 CSS 特效元素（灯笼、纸人等动画）叠加在图片之上，不影响交互。

### 角色立绘（3张）
修改 `game.js` 的 `showPortrait()` 函数，添加图片优先逻辑：
```js
const PORTRAIT_IMAGES = {
  chengan:    'images/char-chen-an.jpg',
  zhangyi:    'images/char-zhang-yi.jpg',
  zhanglaotou:'images/char-zhang-lao.jpg',
};
```
图片加载失败时自动降级回原 CSS 几何绘制。

---

## 可复现命令

```python
import requests, urllib.parse, time

def gen(prompt, filename, w=1280, h=720, seed=0):
    encoded = urllib.parse.quote(prompt)
    url = f'https://image.pollinations.ai/prompt/{encoded}?width={w}&height={h}&model=flux&nologo=true&seed={seed}'
    for i in range(3):
        try:
            r = requests.get(url, timeout=150)
            if r.status_code == 200 and len(r.content) > 5000:
                with open(filename, 'wb') as f: f.write(r.content)
                return True
        except Exception as e:
            time.sleep(5)
    return False
```

---

*记录人：海绵宝宝🧽 | 2026-03-08*
