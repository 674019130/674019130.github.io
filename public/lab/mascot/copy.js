import { setupCopy } from '../shared/i18n.js';

export const copy = {
  en: {
    back: '← UI lab', title: 'Expressive mascot',
    intro: 'A character with two eyes and a body. Set a mood, trigger a short reaction, and let the face carry the story.',
    stage: 'Expressive mascot experiment', moodLabel: 'Mood', reactLabel: 'React',
    idle: 'Idle', thinking: 'Thinking', happy: 'Happy', proud: 'Proud', sleepy: 'Sleepy',
    notice: 'Notice', consider: 'Consider', wink: 'Wink', surprised: 'Surprised', approve: 'Approve',
    play: 'Play sequence', stopSeq: 'Stop sequence', reset: 'Reset',
    dIdle: 'Idle, looking around.', dThinking: 'Thinking, weighing the options.', dHappy: 'Happy, found something good.', dProud: 'Proud of a decision well made.', dSleepy: 'Sleepy, time for a rest.',
    rNotice: 'Noticed something.', rConsider: 'Considering it.', rWink: 'A wink.', rSurprised: 'Surprised.', rApprove: 'Approves.',
    tricks: 'Key CSS & implementation tricks', source: 'View the source', origin: 'Adapted from the mascot in one of my own apps.',
    notes: [
      ['One set of paths for every face', 'Each eye is a single cubic Bézier: a start point, two control points, an end point and a stroke width, nine numbers per eye. Open, smiling, sleepy and wide eyes are just different values, so any face can turn into any other by interpolating eighteen numbers.'],
      ['Morph from what is on screen', 'A morph always starts from the geometry currently drawn, not from the previous target. Clicking Sleepy halfway through Happy continues from the half-smile, so interrupted changes never snap back first. A smoothstep curve over 420 ms keeps it soft at both ends.'],
      ['Reactions sit on top of moods', 'A mood sets data-mood and its looping body motion. A reaction adds data-reaction, which switches the loop off, plays a one-shot tilt or nod, then removes itself after about a second and morphs back to the mood’s face.'],
      ['Sequences that cannot leak', 'Play sequence steps through the moods with timers. Every manual action increments a token and clears the timers, and each step checks its token before acting, so a stale timer can never overwrite a mood you just picked. Reduced motion skips the morph and the body loops.'],
    ],
  },
  zh: {
    back: '← UI 实验室', title: '表情角色',
    intro: '一个只有身体和两只眼睛的角色。设定情绪，触发一个短暂反应，让表情来讲故事。',
    stage: '表情角色实验', moodLabel: '情绪', reactLabel: '反应',
    idle: '待机', thinking: '思考', happy: '开心', proud: '得意', sleepy: '困倦',
    notice: '留意', consider: '琢磨', wink: '眨眼', surprised: '惊讶', approve: '认可',
    play: '播放序列', stopSeq: '停止序列', reset: '重置',
    dIdle: '待机，四处张望。', dThinking: '思考中，权衡各种选择。', dHappy: '开心，发现了好东西。', dProud: '得意，做了个好决定。', dSleepy: '困了，该歇一会儿。',
    rNotice: '注意到了什么。', rConsider: '正在琢磨。', rWink: '眨了下眼。', rSurprised: '吓了一跳。', rApprove: '点头认可。',
    tricks: '关键 CSS 与实现诀窍', source: '查看源码', origin: '改编自我自己一个应用里的角色。',
    notes: [
      ['所有表情共用一组路径', '每只眼睛都是一条三次贝塞尔曲线：起点、两个控制点、终点，再加描边宽度，每只眼睛九个数。睁眼、笑眼、困眼和瞪眼只是不同的数值，所以任何表情都能通过插值这十八个数变成另一个。'],
      ['从屏幕上的样子开始变形', '变形总是从当前画出来的形状出发，而不是上一个目标。开心变到一半时点“困倦”，会接着那半个笑眼继续变，打断时不会先跳回原样。420 ms 的 smoothstep 曲线让两端都很柔和。'],
      ['反应叠加在情绪之上', '情绪设置 data-mood 和循环的身体动作。反应添加 data-reaction：它关掉循环，播放一次歪头或点头，大约一秒后移除自己，再把脸变回当前情绪。'],
      ['不会泄漏的序列', '“播放序列”用计时器依次切换情绪。每次手动操作都会让令牌加一并清除计时器，每一步执行前都检查令牌，过期的计时器不会覆盖你刚选的情绪。开启减少动态效果时，跳过变形和身体循环。'],
    ],
  },
};
setupCopy(copy);
