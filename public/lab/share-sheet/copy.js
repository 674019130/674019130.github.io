import { setupCopy } from '../shared/i18n.js';

export const copy = {
  en: {
    back: '← UI lab', title: 'Share sheet', intro: 'One small button that opens into a full share panel, gathers people and settles into a confirmation.',
    stage: 'Share sheet experiment', share: 'Share', sheetTitle: 'Share “UI lab”', closePanel: 'Close share panel', linkLabel: 'Link to copy',
    copy: 'Copy', copied: 'Copied', retry: 'Retry', accessLabel: 'Demo access level', anyone: 'Anyone with the link', invited: 'People invited',
    canView: 'Can view. Demo setting.', onlySelected: 'Only selected people. Demo setting.', channels: 'Simulated sharing channels', email: 'Email',
    sendToLabel: 'Send to', pick: 'Pick people below', recipients: 'Demo recipients', send: 'Send', sending: 'Sending', sendPrefix: 'Send to ', person: ' person', people: ' people',
    sent: 'Sent', done: 'Done', undo: 'Undo', sentDetail: 'Demo complete. No message was sent.',
    outcome: 'Simulated send outcome', works: 'Send works', fails: 'Send fails', demo: 'Demo recipients and delivery. Copy link is real.',
    aCopied: 'Link copied.', aClipboard: 'Clipboard unavailable. Copy the selected link manually.', aUndone: 'Demo share undone. Recipients kept for editing.',
    aChannelFail: '{c}: simulated failure, try again.', aChannelOk: '{c}: demo complete, nothing sent.', sendFail: 'Demo delivery failed. Try again with “Send works”.',
    aSelected: '{p} selected.', aRemoved: '{p} removed.', select: 'Select {p}', remove: 'Remove {p}', aComplete: 'Demo complete. No message was sent.',
    tricks: 'Key CSS & implementation tricks', source: 'View the source',
    credit: 'Inspired by <a href="https://x.com/eliakuratli/status/2107743325294068148" target="_blank" rel="noopener noreferrer">Elia ↗</a> and <a href="https://uiarc.dev/components/share-sheet" target="_blank" rel="noopener noreferrer">UI Arc ↗</a>. Portraits from <a href="https://unsplash.com/license" target="_blank" rel="noopener noreferrer">Unsplash ↗</a>.',
    notes: [
      ['Copy: two layers hand over', 'Swapping Copy for Copied and fading the new text in makes the old state vanish. Here both layers live in one clipped window: Copy leaves upwards while ✓ Copied enters from below. The button is fixed at 92px and the track at 18px, so only transform and opacity change and nothing beside it reflows. An interrupted exit continues from its visible position.'],
      ['Avatars: settle the landing spot first', 'An earlier version also scaled the recipient chip from .85 to 1. When the flight started it measured the 22px target as about 18.7px, shrank to that, then snapped to the real 22px avatar. Now the chip only fades, so its size is stable; the flying copy shrinks along a curved path to the exact landing size, holds its last frame with fill: forwards, and is swapped for the real image in the same task.'],
      ['A spring for the shell, fixed layers for the content', 'The outer shape samples a damped spring into 61 keyframes for width, height and radius, so the button visibly grows into the sheet. The content faces keep their own fixed widths and only fade and scale, so text never reflows while the shell passes through intermediate sizes. Reduced motion switches states directly.'],
    ],
  },
  zh: {
    back: '← UI 实验室', title: '分享面板', intro: '一个小按钮展开成完整的分享面板，挑选收件人，最后收拢成一条确认。',
    stage: '分享面板实验', share: '分享', sheetTitle: '分享“UI 实验室”', closePanel: '关闭分享面板', linkLabel: '要复制的链接',
    copy: '复制', copied: '已复制', retry: '重试', accessLabel: '演示用访问权限', anyone: '获得链接的任何人', invited: '仅受邀的人',
    canView: '可以查看。演示设置。', onlySelected: '仅所选的人。演示设置。', channels: '模拟分享渠道', email: '邮件',
    sendToLabel: '发送给', pick: '从下方选择收件人', recipients: '演示收件人', send: '发送', sending: '发送中', sendPrefix: '发送给 ', person: ' 人', people: ' 人',
    sent: '已发送', done: '完成', undo: '撤销', sentDetail: '演示完成，没有发出任何消息。',
    outcome: '模拟发送结果', works: '发送成功', fails: '发送失败', demo: '收件人和投递均为演示，复制链接是真的。',
    aCopied: '链接已复制。', aClipboard: '无法访问剪贴板，请手动复制已选中的链接。', aUndone: '已撤销演示分享，收件人保留以便修改。',
    aChannelFail: '{c}：模拟失败，请重试。', aChannelOk: '{c}：演示完成，没有发出任何内容。', sendFail: '演示投递失败。切换到“发送成功”后再试一次。',
    aSelected: '已选择 {p}。', aRemoved: '已移除 {p}。', select: '选择 {p}', remove: '移除 {p}', aComplete: '演示完成，没有发出任何消息。',
    tricks: '关键 CSS 与实现诀窍', source: '查看源码',
    credit: '灵感来自 <a href="https://x.com/eliakuratli/status/2107743325294068148" target="_blank" rel="noopener noreferrer">Elia ↗</a> 和 <a href="https://uiarc.dev/components/share-sheet" target="_blank" rel="noopener noreferrer">UI Arc ↗</a>。头像来自 <a href="https://unsplash.com/license" target="_blank" rel="noopener noreferrer">Unsplash ↗</a>。',
    notes: [
      ['复制：让两层内容交接', '直接把“复制”换成“已复制”再淡入，旧状态会突然消失。这里两层内容放在同一个裁切窗口里：“复制”向上离开，“✓ 已复制”从下方进入。按钮固定为 92px 宽，文字轨道固定 18px 高，变化只发生在 transform 和 opacity 上，旁边的链接不必让位。被打断时，退出动画从当前可见位置继续。'],
      ['头像：落点先稳定，飞行层再交接', '上一版让收件人标签也从 .85 放大到 1。飞行开始时，22px 的目标头像被测成了约 18.7px，飞行层缩到这个尺寸后再切回真正的 22px 头像，就会一抖。现在标签只淡入，尺寸始终稳定；飞行层沿弧线连续缩小到准确的落点尺寸，用 fill: forwards 停在末帧，再在同一次更新里换成真实头像。'],
      ['外壳用弹簧，内容用固定层', '外形把阻尼弹簧采样成 61 个关键帧，驱动宽、高和圆角，按钮看起来是长成了面板。内容层各自保持固定宽度，只做淡入和缩放，外壳经过中间尺寸时文字不会重排。开启减少动态效果时直接切换状态。'],
    ],
  },
};
setupCopy(copy);
