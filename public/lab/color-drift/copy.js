import { setupCopy } from '../shared/i18n.js';

export const copy = {
  en: {
    back: '← UI lab', title: 'Color drift', intro: 'Move through the space and leave a little colour. Four small studies of how a field can answer a gesture.',
    flowLabel: 'Flowing color study', heroTitle: 'A passing gesture.<br>A trace of color.', heroNote: 'Move to stir.<br>Pause to watch it settle.<br>Start somewhere new.', heroFoot: 'Color follows your gesture,<br>then finds its own way.',
    palette: 'Color palette', rose: 'Rose', tide: 'Tide', amber: 'Amber', clear: 'Clear', pause: 'Pause', resume: 'Resume',
    sMove: 'Move your pointer through the canvas, or drag with a finger.', sStill: 'Still mode: gestures leave a static trace.', sPaused: 'Paused. Resume to stir the color.', sNoCanvas: 'Canvas unavailable.',
    pName: 'Particle field', pTitle: 'A little pull.<br>A different pattern.', pBody: 'Move through the dots. Watch them curl around you, then settle back.', pHint: 'Move, curl, release.',
    pLabel: 'Interactive particle field. Move the pointer, drag a finger, or use the arrow keys while focused.',
    cName: 'Contours', cTitle: 'The same space.<br>Another shape.', cBody: 'Choose a landscape. Move across it to bend the lines.', landscape: 'Landscape', islands: 'Islands', ridges: 'Ridges', ripples: 'Ripples',
    cLabel: 'Interactive contour field. Move the pointer, drag a finger, or use the arrow keys while focused.',
    aName: 'Afterglow', aTitle: 'One last gesture.<br>Then let it go.', aBody: 'Leave a little color on your way out.', aLabel: 'Closing color field', explore: 'Explore the UI lab ↗',
    tricks: 'Key CSS & implementation tricks', source: 'View the source', inspired: 'Inspired by',
    notes: [
      ['A real, if tiny, fluid', 'The colour is dye in a 180 × 110 incompressible velocity field. Each step adds vorticity confinement to keep small eddies alive, advects velocity semi-Lagrangian style (look back along the flow and sample there), removes divergence with fourteen Jacobi pressure iterations, then advects the dye. That is why colour keeps moving after the pointer stops.'],
      ['Gestures become many small splats', 'Pointer events arrive far apart on a fast swipe. Each move is split into up to sixteen Gaussian splats along the segment, each carrying a share of the velocity, so a quick stroke leaves a continuous ribbon instead of beads. The Rose palette drifts its hue with the distance travelled.'],
      ['Particles on springs', 'Each dot has a home position. Near the pointer, its target is rotated around the cursor by an angle that grows with proximity and time, which makes the curl; a spring with damping (0.035, 0.86) pulls it there. When you leave, the same spring brings every dot back to its home, so the field always recovers.'],
      ['Contours with marching squares', 'The landscape is value noise sampled on a 120 × 60 grid. For each contour level, every cell finds where the level crosses its four edges by linear interpolation and draws the segments between crossings. Switching landscapes blends the two height fields over a few frames, so the lines morph instead of jumping. Off-screen and reduced-motion studies stop animating.'],
    ],
  },
  zh: {
    back: '← UI 实验室', title: '流动色彩', intro: '在空间里移动，留下一点颜色。四个小实验，看一片场如何回应一个手势。',
    flowLabel: '流动色彩实验', heroTitle: '一个经过的手势，<br>一道颜色的痕迹。', heroNote: '移动来搅动，<br>停下看它沉静，<br>再从别处开始。', heroFoot: '颜色跟随你的手势，<br>然后自己找到去处。',
    palette: '色板', rose: '玫瑰', tide: '潮汐', amber: '琥珀', clear: '清空', pause: '暂停', resume: '继续',
    sMove: '在画布上移动指针，或用手指拖动。', sStill: '静止模式：手势只留下静态痕迹。', sPaused: '已暂停。继续后可以搅动颜色。', sNoCanvas: '画布不可用。',
    pName: '粒子场', pTitle: '轻轻一拉，<br>图案就变了。', pBody: '在点阵里移动，看它们绕着你卷起，再慢慢归位。', pHint: '移动、卷起、松开。',
    pLabel: '可交互的粒子场。移动指针、用手指拖动，或在聚焦后使用方向键。',
    cName: '等高线', cTitle: '同一片空间，<br>另一种形状。', cBody: '选一种地貌，在上面移动，线条会随之弯曲。', landscape: '地貌', islands: '岛屿', ridges: '山脊', ripples: '涟漪',
    cLabel: '可交互的等高线场。移动指针、用手指拖动，或在聚焦后使用方向键。',
    aName: '余晖', aTitle: '最后一个手势，<br>然后放手。', aBody: '离开前，留下一点颜色。', aLabel: '收尾的色彩场', explore: '逛逛 UI 实验室 ↗',
    tricks: '关键 CSS 与实现诀窍', source: '查看源码', inspired: '灵感来自',
    notes: [
      ['一个真正的小流体', '颜色是 180 × 110 不可压缩速度场里的染料。每一步先做涡度约束，保留细小的涡旋；再用半拉格朗日方式平流速度（沿流向往回看，在那里采样）；接着用 14 次 Jacobi 迭代求压力、去掉散度；最后平流染料。所以指针停下后，颜色还会继续流动。'],
      ['一个手势拆成许多小喷点', '快速划过时，指针事件之间的距离很大。每次移动会沿线段拆成最多 16 个高斯喷点，各自分摊一部分速度，快速的一笔会留下连续的色带，而不是一串珠子。玫瑰色板会随移动距离慢慢偏移色相。'],
      ['挂在弹簧上的粒子', '每个点都有自己的原位。靠近指针时，它的目标位置会绕着光标旋转一个角度，角度随距离和时间增大，于是卷了起来；带阻尼的弹簧（0.035, 0.86）把它拉过去。指针离开后，同一个弹簧把所有点拉回原位，所以这片场总能复原。'],
      ['用 marching squares 画等高线', '地貌是在 120 × 60 网格上采样的值噪声。对每个等高线层级，每个格子用线性插值找出层级穿过四条边的位置，再连接这些交点。切换地貌时，两份高度场会在几帧内混合，线条是变形过去的，而不是跳变。不在视野内或开启减少动态效果时，实验停止动画。'],
    ],
  },
};
setupCopy(copy);
