import { setupCopy } from '../shared/i18n.js';

export const copy = {
  en: {
    back: '← UI lab', title: 'Live numbers',
    intro: 'Prices that keep changing, in columns that stay put. Only the digits that changed move.',
    stage: 'Live numbers experiment', caption: 'Fictional assets, simulated prices and percentage changes',
    asset: 'Asset', symbol: 'Symbol', price: 'Price', change: 'Change', range: 'Time range',
    live: 'Live', hour: '1H', day: '1D', week: '1W',
    feedLive: 'Simulated live feed', feedPaused: 'Feed paused', feedSnapshot: 'Simulated snapshot',
    tabular: 'Tabular numbers', animate: 'Animate changes', pause: 'Pause', resume: 'Resume',
    tabularOn: 'Equal-width digits keep the columns steady.',
    tabularOff: 'Proportional digits: watch the columns shift as values update.',
    selected: '{range} selected.',
    demo: 'Fictional assets and simulated data.',
    tricks: 'Key CSS & implementation tricks', source: 'View the source', inspired: 'Inspired by',
    notes: [
      ['Equal-width digits', 'With proportional figures a 1 is narrower than an 8, so every update nudges the whole column sideways. tabular-nums gives each digit the same advance width; right-aligned prices then only ever change in place. Turn the option off to see the jitter it removes.'],
      ['Roll only what changed', 'Each update compares the new string with the previous one from the right, so decimal places line up. Only positions whose digit actually changed get an old and a new span; the new digit slides in from the direction of the move and the old one leaves the other way. Unchanged characters are not animated at all.'],
      ['A calm feed', 'A real ticker does not move every row at once. Each asset trades on its own cadence of two to four ticks, offset per row, and a trade only moves the last digits. At any moment one or two cells are rolling, which is what keeps the table readable.'],
      ['Interruptible and optional', 'If a new value arrives mid-roll, the running Web Animations are cancelled and the cell is rebuilt from the latest value, so rolls never queue up. Reduced motion, the Animate option and a hidden tab all skip the animation and write the value directly.'],
    ],
  },
  zh: {
    back: '← UI 实验室', title: '动态数字',
    intro: '价格一直在变，列却纹丝不动。只有变化的那几位数字会滚动。',
    stage: '动态数字实验', caption: '虚构资产、模拟价格与涨跌幅',
    asset: '资产', symbol: '代码', price: '价格', change: '涨跌', range: '时间范围',
    live: '实时', hour: '1 小时', day: '1 天', week: '1 周',
    feedLive: '模拟实时行情', feedPaused: '行情已暂停', feedSnapshot: '模拟快照',
    tabular: '等宽数字', animate: '变化动画', pause: '暂停', resume: '继续',
    tabularOn: '等宽数字让每一列保持稳定。',
    tabularOff: '比例数字：数值更新时，留意列宽的晃动。',
    selected: '已选择 {range}。',
    demo: '资产为虚构，数据为模拟。',
    tricks: '关键 CSS 与实现诀窍', source: '查看源码', inspired: '灵感来自',
    notes: [
      ['等宽数字', '比例数字里 1 比 8 窄，每次更新都会让整列左右挪动。tabular-nums 让每个数字占用相同的宽度，右对齐的价格只会原地变化。关掉这个选项，就能看到它消除的抖动。'],
      ['只滚动变化的位', '每次更新都从右往左对比新旧字符串，让小数位对齐。只有数字真正变了的位置才会生成新旧两个 span：新数字顺着涨跌方向滑入，旧数字朝反方向离开，没变的字符完全不做动画。'],
      ['安静的行情', '真实的行情不会让所有行同时跳动。每个资产按各自 2 到 4 个周期的节奏成交，并按行错开，一次成交只改动末尾几位。任何时刻只有一两个格子在滚动，表格因此保持可读。'],
      ['可打断，也可关闭', '滚到一半来了新值，就取消正在运行的 Web Animations，按最新值重建这个格子，滚动不会排队。开启减少动态效果、关闭“变化动画”或切到后台标签页时，都会跳过动画直接写入数值。'],
    ],
  },
};
setupCopy(copy);
