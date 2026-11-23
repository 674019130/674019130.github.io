import { readLocale, saveLocale, followLocale } from '../shared/locale.js';
const scene = document.querySelector('.scene');
const art = document.querySelector('.artwork');
const landscape = document.querySelector('#landscape');
const letters = document.querySelector('#letters');
const base = landscape.getContext('2d');
const text = letters.getContext('2d');
const sampler = document.createElement('canvas');
const sample = sampler.getContext('2d', { willReadFrequently: true });
const status = document.querySelector('#status');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const still = new URLSearchParams(location.search).get('still') === '1';
const presets = {
  haze: { file: 'clouds', label: '01 — Haze', colors: [[197, 51, 29], [213, 115, 139], [179, 172, 213], [119, 156, 206]] },
  ember: { file: 'clouds', label: '02 — Ember', colors: [[40, 49, 68], [73, 93, 126], [163, 68, 60], [247, 89, 41]] },
  grove: { file: 'forest', label: '03 — Grove', colors: [[75, 31, 24], [143, 65, 62], [144, 146, 190], [146, 180, 220]] },
};
const images = new Map();
let active = 'haze';
let photograph = false;
let generation = 0;
let resizeFrame = 0;
const ramp = ' .,:;iloahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>!I;:MW#&8%B@$';
const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
const copy = {
  en: {
    back: '← UI lab', title: 'ASCII atmosphere', edition: '08 / ASCII atmosphere', intro: 'Somewhere between a photograph and a signal.',
    tagline: 'Light becomes language.', haze: 'Haze', ember: 'Ember', grove: 'Grove', drift: 'Drift', portrait: 'Portrait', texture: 'Character texture',
    tricks: 'Key CSS & implementation tricks', source: 'View the source', inspired: 'Inspired by',
    n0t: 'A photograph remapped to three colours', n0b: 'The landscape is drawn once into an offscreen canvas, softened with a canvas blur, then every pixel’s luminance is mapped onto a four-stop colour ramp. A deterministic grain is added from the pixel index, so it never shimmers between frames or scene changes. Pixels are read only on resize or scene change, never in an animation loop.',
    n1t: 'Characters chosen by brightness', n1b: 'A monospaced grid samples the same luminance values. Brighter cells pick denser glyphs from a 70-character ramp, so the texture follows the landscape’s contours. Opacity rises in the middle band and along edges, and fades in the brightest and darkest areas, which keeps the photograph readable underneath.',
    n2t: 'Drift moves the plane, not the characters', n2b: 'Characters and photograph live on one plane. Drift is a slow CSS keyframe on that plane, so nothing is re-sampled or randomly refreshed and there is no flicker. The animation is paused in hidden tabs and with reduced motion. The reference images are static; this movement is an extension made for the lab.', photos: 'Photographs:', photograph: 'View photograph', treatment: 'View treatment',
    loading: 'Loading the landscape…', error: 'The photograph could not load. Choose a scene to retry.',
    originalStatus: 'Original photograph. Choose View treatment to return.', still: 'Still mode. Motion is disabled.',
    moving: 'Drifting slowly. Press Drift again to pause.', idle: 'A still study. Turn on Drift for a slow, continuous movement.', paused: 'Paused. The characters stay anchored to the photograph.',
    scene: 'Soft photographic background with a luminance-mapped ASCII texture', landscape: 'Landscape',
    description: 'Soft photographic landscapes, false color, and light rendered as ASCII.'
  },
  zh: {
    back: '← UI 实验室', title: '字符氛围', edition: '08 / 字符氛围', intro: '介于风景照片与字符信号之间。',
    tagline: '让光成为语言。', haze: '薄雾', ember: '余晖', grove: '树林', drift: '漂移', portrait: '竖屏', texture: '字符强度',
    tricks: '关键 CSS 与实现诀窍', source: '查看源码', inspired: '灵感来自',
    n0t: '把照片重映射成三种颜色', n0b: '风景只在离屏画布上绘制一次，先用画布模糊柔化，再把每个像素的亮度映射到四段色阶上。颗粒感由像素序号决定，所以在帧之间、切换场景时都不会闪动。像素只在尺寸变化或切换场景时读取，从不在动画循环里读取。',
    n1t: '按亮度挑选字符', n1b: '等宽字符网格采样同一份亮度。越亮的格子从 70 个字符的序列里挑越密的字形，纹理因此贴合风景的轮廓。不透明度在中间带和边缘处更高，在最亮和最暗处减弱，底下的照片始终看得清。',
    n2t: '漂移移动的是平面，不是字符', n2b: '字符和照片在同一个平面上。“漂移”只是这个平面上一段缓慢的 CSS 关键帧，不重新采样，也不随机刷新字符，所以没有闪烁。后台标签页和减少动态效果时动画暂停。原参考是静态图，这段移动是实验室自己的延伸。', photos: '摄影素材：', photograph: '查看原图', treatment: '查看效果',
    loading: '正在载入风景…', error: '照片未能加载，请选择背景重试。',
    originalStatus: '原始照片。点击「查看效果」返回。', still: '静态模式，已关闭动态效果。',
    moving: '正在缓慢漂移，再次点击「漂移」可暂停。', idle: '默认静止。开启「漂移」，让画面缓慢、连续地移动。', paused: '已暂停，字符仍与照片的轮廓保持一致。',
    scene: '柔焦风景背景，叠加随明暗变化的 ASCII 字符纹理', landscape: '风景',
    description: '柔焦风景、蓝紫与朱红调色，以及随明暗变化的 ASCII 字符纹理。'
  }
};
let language = readLocale();
saveLocale(language);
let statusKey = 'loading';
const t = key => copy[language][key];
function say(key) { statusKey = key; status.textContent = t(key); }
function updateSceneLabel() {
  document.querySelector('#scene-name').textContent = t(active);
}
function applyLanguage() {
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  document.title = `${t('title')} · Su UI lab`;
  document.querySelector('meta[name="description"]').content = t('description');
  for (const el of document.querySelectorAll('[data-i18n]')) el.textContent = t(el.dataset.i18n);
  for (const el of document.querySelectorAll('[data-language]')) el.hidden = el.dataset.language !== language;
  const toggle = document.querySelector('#language');
  toggle.textContent = language === 'zh' ? 'EN' : '中';
  toggle.setAttribute('aria-label', language === 'zh' ? 'Switch to English' : '切换为中文');
  scene.setAttribute('aria-label', t('scene'));
  document.querySelector('.presets').setAttribute('aria-label', t('landscape'));
  document.querySelector('#original').textContent = t(photograph ? 'treatment' : 'photograph');
  updateSceneLabel(); say(statusKey);
}
document.querySelector('#language').addEventListener('click', () => {
  language = language === 'en' ? 'zh' : 'en';
  saveLocale(language);
  applyLanguage();
});
followLocale(next => { if (next !== language) { language = next; applyLanguage(); } });
applyLanguage();
function colorAt(value, colors) {
  const p = clamp(value) * (colors.length - 1);
  const i = Math.min(colors.length - 2, Math.floor(p));
  const t = p - i;
  return colors[i].map((c, channel) => c + (colors[i + 1][channel] - c) * t);
}
async function load(file) {
  if (!images.has(file)) {
    const image = new Image();
    image.src = `./assets/${file}.jpg`;
    images.set(file, image.decode().then(() => image).catch(error => { images.delete(file); throw error; }));
  }
  return images.get(file);
}
async function render() {
  const token = ++generation;
  const preset = presets[active];
  let image;
  try { image = await load(preset.file); }
  catch { if (token === generation) say('error'); return; }
  if (token !== generation) return;
  const w = Math.round(art.clientWidth), h = Math.round(art.clientHeight);
  if (!w || !h) return;
  const ratio = Math.min(devicePixelRatio || 1, 2);
  for (const canvas of [landscape, letters]) { canvas.width = Math.round(w * ratio); canvas.height = Math.round(h * ratio); }
  base.setTransform(ratio, 0, 0, ratio, 0, 0);
  text.setTransform(ratio, 0, 0, ratio, 0, 0);
  // Sample a single, bounded image only on resize or scene changes. No pixel reads in an animation loop.
  sampler.width = Math.min(w, 960); sampler.height = Math.round(h * sampler.width / w);
  const sw = sampler.width, sh = sampler.height;
  const cover = Math.max(sw / image.width, sh / image.height);
  sample.filter = photograph ? 'none' : `blur(${sw * (active === 'grove' ? .004 : .009)}px)`;
  sample.drawImage(image, (sw-image.width*cover)/2, (sh-image.height*cover)/2, image.width*cover, image.height*cover);
  sample.filter = 'none';
  if (photograph) { base.drawImage(sampler, 0, 0, w, h); say('originalStatus'); return; }
  const pixels = sample.getImageData(0, 0, sw, sh);
  const values = new Float32Array(sw * sh);
  for (let i = 0; i < values.length; i++) {
    const p = i * 4;
    const luminance = (pixels.data[p]*.2126 + pixels.data[p+1]*.7152 + pixels.data[p+2]*.0722)/255;
    const value = active === 'grove' ? clamp((luminance-.09)*1.85)**.8 : clamp((luminance-.07)*1.35);
    values[i] = value;
    const color = colorAt(value, preset.colors);
    // Stable film grain: it does not change between frames or scene visits.
    const grain = (Math.sin(i*127.1+31.7)*43758.5453 % 1)*1.7;
    for (let c=0; c<3; c++) pixels.data[p+c] = clamp(color[c]+grain, 0, 255);
    pixels.data[p+3] = 255;
  }
  sample.putImageData(pixels, 0, 0);
  base.drawImage(sampler, 0, 0, w, h);
  const cell = Math.max(7, w / 112);
  const row = cell * 1.25;
  text.font = `${cell*1.1}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
  text.textBaseline = 'middle'; text.textAlign = 'center';
  for (let y=row/2; y<h; y+=row) for (let x=cell/2; x<w; x+=cell) {
    const i = Math.min(sh-1, Math.floor(y/h*sh))*sw + Math.min(sw-1, Math.floor(x/w*sw));
    const value = values[i];
    const band = Math.sin(Math.PI * y/h)**1.3;
    const edge = Math.abs(value-values[Math.min(values.length-1,i+Math.round(cell/w*sw))]);
    const alpha = (.1 + band*.27 + Math.min(.16,edge*3)) * (1-Math.abs(value-.5)*.75);
    text.fillStyle = `rgba(237,224,243,${alpha})`;
    text.fillText(ramp[Math.floor(value*(ramp.length-1))], x, y);
  }
  say(motion.matches || still ? 'still' : scene.hasAttribute('data-drift') ? 'moving' : 'idle');
}
for (const button of document.querySelectorAll('[data-scene]')) button.addEventListener('click', () => {
  active = button.dataset.scene;
  for (const other of document.querySelectorAll('[data-scene]')) other.setAttribute('aria-pressed', String(other === button));
  updateSceneLabel();
  render();
});
document.querySelector('#strength').addEventListener('input', event => {
  letters.style.opacity = Number(event.target.value)/100;
  document.querySelector('#strength-value').value = `${event.target.value}%`;
});
const drift = document.querySelector('#drift');
drift.addEventListener('click', () => {
  const enabled = !scene.hasAttribute('data-drift');
  scene.toggleAttribute('data-drift', enabled);
  drift.setAttribute('aria-pressed', String(enabled));
  syncPlayback();
  say(photograph ? 'originalStatus' : enabled ? 'moving' : 'paused');
});
function syncPlayback() {
  art.style.animationPlayState = scene.hasAttribute('data-drift') && !document.hidden && !motion.matches && !still ? 'running' : 'paused';
}
function syncMotion() {
  drift.disabled = motion.matches || still;
  if (drift.disabled) { scene.removeAttribute('data-drift'); drift.setAttribute('aria-pressed','false'); }
  syncPlayback();
}
motion.addEventListener('change', syncMotion); syncMotion();
document.addEventListener('visibilitychange', syncPlayback);
document.querySelector('#portrait').addEventListener('click', event => {
  const enabled = scene.toggleAttribute('data-portrait');
  event.currentTarget.setAttribute('aria-pressed', String(enabled));
});
document.querySelector('#original').addEventListener('click', event => {
  photograph = !photograph;
  scene.toggleAttribute('data-original', photograph);
  event.currentTarget.setAttribute('aria-pressed', String(photograph));
  event.currentTarget.textContent = t(photograph ? 'treatment' : 'photograph');
  render();
});
new ResizeObserver(() => { cancelAnimationFrame(resizeFrame); resizeFrame = requestAnimationFrame(render); }).observe(art);
