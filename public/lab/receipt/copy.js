import { setupCopy } from '../shared/i18n.js';

const items = {
  en: [['Graph paper', 2, '4.00'], ['Soft pencil', 3, '3.00'], ['Small notebook', 1, '6.00'], ['Paper clips', 1, '2.00'], ['Blank postcards', 4, '4.00'], ['Cotton string', 1, '2.00'], ['Kraft envelopes', 5, '5.00'], ['Blue ink refill', 1, '3.00']],
  zh: [['方格纸', 2, '4.00'], ['软芯铅笔', 3, '3.00'], ['小笔记本', 1, '6.00'], ['回形针', 1, '2.00'], ['空白明信片', 4, '4.00'], ['棉线', 1, '2.00'], ['牛皮纸信封', 5, '5.00'], ['蓝色墨水替芯', 1, '3.00']],
};
const list = (rows, qty) => rows.map(([n, q, p]) => `<li><span>${n}<small>${qty} ${q}</small></span><span>${p}</span></li>`).join('');

export const copy = {
  en: {
    back: '← UI lab', title: 'Receipt printer',
    intro: 'A long paper trail for an imaginary order. The receipt feeds out of the slot, then scrolls like the real thing.',
    stage: 'Receipt printer experiment', print: 'Print receipt', again: 'Print again', reset: 'Reset',
    sIdle: 'Ready to print.', sPrinting: 'Printing your receipt…', sPrinted: 'Printed. Scroll the paper to read it.',
    mIdle: 'READY', mPrinting: 'PRINTING', mPrinted: 'DONE', brand: 'PRINT',
    shop: 'Paper & Things', tagline: 'A fictional little shop', order: 'Sample order',
    items: list(items.en, 'Qty'), subtotal: 'Subtotal', discount: 'Discount', total: 'Total',
    thanks: 'Small things.<br>A little more possibility.', fine: 'Demo only, not a real purchase.<br>All items and amounts are fictional.',
    demo: 'Fictional items and amounts. No real order data.',
    tricks: 'Key CSS & implementation tricks', source: 'View the source', origin: 'Adapted from the receipt dialog in one of my own apps.',
    notes: [
      ['The paper slides out of a clipped window', 'The receipt is fully laid out from the start. It sits inside a viewport with overflow: hidden directly under the slot, translated up by its own height, and a linear keyframe brings it to zero, so it reads as paper being fed rather than content appearing. A linear curve matters: a printer feeds at a constant speed.'],
      ['A torn edge without an image', 'The serrated bottom is a clip-path polygon that alternates between 99% and 100% of the height every 2% of the width. It scales with the paper and costs nothing to render.'],
      ['A barcode from one gradient', 'Bars of different widths come from a single repeating-linear-gradient with hard stops. Changing a stop position changes a bar width; no SVG or font is needed.'],
      ['A small state machine', 'The printer has three states on one data-state attribute: idle, printing and printed. Printing starts the keyframe and one timer; Reset clears that timer, so a stale completion can never flip the state later. Once printed, the viewport switches to overflow-y: auto and the paper can be scrolled. With reduced motion, print goes straight to printed.'],
    ],
  },
  zh: {
    back: '← UI 实验室', title: '小票打印机',
    intro: '一张虚构订单的长长纸条。小票从出纸口送出，之后可以像真的一样上下滚动。',
    stage: '小票打印机实验', print: '打印小票', again: '再打印一张', reset: '重置',
    sIdle: '可以打印。', sPrinting: '正在打印小票…', sPrinted: '已打印。滚动纸条即可阅读。',
    mIdle: '就绪', mPrinting: '打印中', mPrinted: '完成', brand: 'PRINT',
    shop: '纸与物', tagline: '一家虚构的小店', order: '示例订单',
    items: list(items.zh, '数量'), subtotal: '小计', discount: '优惠', total: '合计',
    thanks: '小东西，<br>多一点可能。', fine: '仅为演示，并非真实购买。<br>所有商品与金额均为虚构。',
    demo: '商品和金额均为虚构，不含真实订单数据。',
    tricks: '关键 CSS 与实现诀窍', source: '查看源码', origin: '改编自我自己一个应用里的小票对话框。',
    notes: [
      ['纸从被裁切的窗口里滑出', '小票一开始就已经完整排版。它放在出纸口正下方一个 overflow: hidden 的视窗里，先向上平移自身高度，再用线性关键帧移回 0，看起来是纸被送出来，而不是内容突然出现。曲线必须是线性的：打印机送纸是匀速的。'],
      ['不用图片的撕纸边', '锯齿状的底边是一个 clip-path 多边形：宽度每隔 2%，高度就在 99% 和 100% 之间交替一次。它随纸张缩放，几乎没有渲染成本。'],
      ['一个渐变画出条形码', '宽窄不一的条纹来自同一个带硬停靠点的 repeating-linear-gradient。改一个停靠点的位置，就改了一根条的宽度，不需要 SVG 或字体。'],
      ['一个小状态机', '打印机在同一个 data-state 属性上有三种状态：idle、printing、printed。开始打印时启动关键帧和一个计时器；重置会清掉这个计时器，过期的完成回调不会在之后把状态改掉。打印完成后，视窗切换为 overflow-y: auto，纸条可以滚动。开启减少动态效果时，打印直接进入完成状态。'],
    ],
  },
};
setupCopy(copy);
