import { setupCopy } from '../shared/i18n.js';

export const copy = {
  en: {
    back: '← UI lab', title: 'Folding card',
    intro: 'A business card that opens like a book. Drag the cover, or tap it, and move your pointer to catch the light on the foil.',
    stage: 'Interactive folding business card', drag: 'Drag the cover or the slider.', angle: 'Card opening angle',
    open: 'Open card', close: 'Close card', reset: 'Reset', foil: 'Holographic', still: 'Still mode',
    sClosed: 'Closed. Tap the card to open it.', sOpen: 'Open. Tap the cover to close it.', sMoving: 'Unfolding. Drag to explore.',
    tricks: 'Key CSS & implementation tricks', source: 'View the source', inspired: 'An independent study of',
    credit: 'Chánh Đại’s folding business card ↗',
    notes: [
      ['A hinge drawn as a polygon', 'Nothing rotates in 3D. For each hinge angle the script projects the cover’s outer edge with a simple perspective, z = 220 sin θ, scale = 1100 / (1100 − z), and writes the resulting four corners into a clip-path polygon and an SVG outline. Text stays front-facing and is clipped by the surface instead of being skewed.'],
      ['The hinge angle drives every handoff', 'Cover opacity, inside opacity, blur and the fold shading are all smoothstep functions of the angle, not of time. Dragging, the slider and the spring therefore pass through exactly the same frames, and stopping halfway always shows a consistent state.'],
      ['One light, many surfaces', 'The pointer sets a single light position. Each surface computes its own normal from the hinge angle and turns the light into a highlight position, a foil spectrum offset and a specular strength, so the open leaf and the base catch the light differently.'],
      ['A spring that reverses mid-flight', 'Open and close set a target; a damped spring (k = 145, c = 23) moves the position each frame. Reversing mid-fold just changes the target, so the motion continues from where it is. Still mode, reduced motion and a hidden tab jump straight to the target.'],
    ],
  },
  zh: {
    back: '← UI 实验室', title: '折叠名片',
    intro: '一张像书一样打开的名片。拖动或轻点封面，移动指针看箔面上的光。',
    stage: '可交互的折叠名片', drag: '拖动封面或滑块。', angle: '名片打开角度',
    open: '打开名片', close: '合上名片', reset: '重置', foil: '镭射箔', still: '静止模式',
    sClosed: '已合上。轻点名片即可打开。', sOpen: '已打开。轻点封面即可合上。', sMoving: '正在展开。可以拖动查看。',
    tricks: '关键 CSS 与实现诀窍', source: '查看源码', inspired: '独立复刻自',
    credit: 'Chánh Đại 的折叠名片 ↗',
    notes: [
      ['用多边形画出合页', '没有任何元素做 3D 旋转。每个合页角度下，脚本用一个简单透视投影封面外缘：z = 220 sin θ，缩放 = 1100 / (1100 − z)，再把得到的四个角写进 clip-path 多边形和 SVG 轮廓。文字始终正对屏幕，由表面裁切，而不是被拉斜。'],
      ['合页角度驱动所有交接', '封面透明度、内页透明度、模糊和折痕阴影，都是角度的 smoothstep 函数，而不是时间的函数。拖动、滑块和弹簧因此经过完全相同的画面，停在半路也总是一个自洽的状态。'],
      ['一盏灯，多个表面', '指针只设定一个光源位置。每个表面根据合页角度算出自己的法线，再换算成高光位置、镭射色谱偏移和镜面强度，所以翻开的那页和底页受光各不相同。'],
      ['能在半空中掉头的弹簧', '打开和合上只是设置目标值，阻尼弹簧（k = 145，c = 23）每帧推动位置。折到一半反向，只是换了目标，动作会从当前位置继续。静止模式、减少动态效果和后台标签页都会直接跳到目标。'],
    ],
  },
};
setupCopy(copy);
