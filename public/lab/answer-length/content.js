export const copy = {
 en: {
  title: 'A little less', back: '← UI lab', edition: '09 / Answer length', intro: 'An answer with room to breathe. Pull upward to make it shorter.',
  question: 'How can I make a small room feel bigger?', levels: ['Just the answer', 'Brief', 'A little context', 'In detail'],
  shorter: 'Shorter', longer: 'Longer', reset: 'Reset', hint: 'Drag the little handle up or down. Or use the arrow keys.',
  demo: 'Four prewritten versions. An interaction study, not a live AI service.',
  handle: 'Answer detail', time: 's read', ready: 'Choose how much detail you need.', copied: 'Detail level',
  tricks: 'Key CSS & implementation tricks', inspired: 'Inspired by', source: 'View the source',
  notes: [
   ['Keep the words that survive', 'Match unchanged English words or Chinese characters in reading order. Measure their old and new positions, then animate only the difference. The text stays the same size; it travels to its next line instead of shrinking with the card.'],
   ['Give the container its own timeline', 'The card’s top edge stays anchored. Its height follows the pointer during a drag, then settles to the measured content height on release. The handle belongs to the bottom edge, so it never drifts away from the card.'],
   ['Keep the drag within a frame', 'Coalesce pointer events with requestAnimationFrame. Read every word position before starting animations, skip words that do not move, and fade new or removed words without per-character blur. A small threshold dead band prevents repeated rewrites near a boundary.'],
   ['Make interruption part of the interaction', 'Capture the pointer so a drag continues outside the handle. Before interrupting an animation, read its visible position. Escape or a cancelled pointer restores the starting level. Reduced motion changes the content immediately.']
  ],
  answers: [
   [['p','Clear the floor. Let the light in.']],
   [['p','Clear the floor and let the light in. Use fewer, well-sized pieces and keep a clear path through the room.']],
   [['p','A small room feels bigger when the eye can travel without interruption.'],['ul',['Clear the floor and keep a clear path.','Let the light in with lighter curtains.','Use fewer, well-sized pieces.']],['p','Start with what you can remove, not what you can buy.']],
   [['h','Why it works'],['p','A small room feels bigger when the eye can travel without interruption. Visible floor space, natural light, and a clear path all make the room feel more open.'],['h','A few things to try'],['ul',['Clear the floor and keep a clear path.','Let the light in with lighter curtains.','Use fewer, well-sized pieces.','Choose storage that keeps everyday clutter out of sight.']],['h','The simplest place to start'],['p','Start with what you can remove, not what you can buy. Clear one corner, then see how the room feels.']]
  ]
 },
 zh: {
  title: '再简短一点', back: '← UI 实验室', edition: '09 / 回答长度', intro: '回答也可以留白。向上拖动，让它更简短。',
  question: '怎样让小房间显得更宽敞？', levels: ['只要结论','简短回答','补充背景','详细说明'],
  shorter: '更简短', longer: '更详细', reset: '重置', hint: '上下拖动底部的小把手，也可以使用方向键。',
  demo: '四档预写回答。这是交互实验，不调用实时 AI 服务。',
  handle: '回答详细程度', time: '秒阅读', ready: '选择你需要的详细程度。', copied: '当前详细程度',
  tricks: '关键 CSS 与实现诀窍', inspired: '灵感来自', source: '查看源码',
  notes: [
   ['让保留下来的词接着走', '按阅读顺序匹配没有改变的英文单词或汉字，测量它们前后的位置，再只动画这段位移。文字字号不变，只是移到新的行里，不会随卡片一起被压扁。'],
   ['容器高度单独交接', '卡片顶边保持固定。拖动时高度跟随指针，松手后再收拢到内容的实测高度。把手属于卡片底边，因此始终贴着边缘，不会与卡片脱节。'],
   ['把拖动更新合并到每一帧', '用 requestAnimationFrame 合并密集的指针事件。先统一读取所有文字位置，再启动动画；没有位移的文字不启动动画，新增和删除的文字只淡入淡出，不再逐字模糊。档位边界保留一小段缓冲，避免轻微抖动反复重排。'],
   ['把中断也当作交互的一部分', '用指针捕获让拖动在离开把手后继续。打断动画之前，先读取它当前可见的位置。按 Escape 或指针被取消时恢复拖动前的档位；减少动态效果时直接切换内容。']
  ],
  answers: [
   [['p','腾出地面，让光进来。']],
   [['p','腾出地面，让光进来。减少家具数量，选择尺寸合适的单品，并留出畅通的走道。']],
   [['p','视线能够顺畅延伸，小房间就会显得更宽敞。'],['ul',['腾出地面，留出畅通的走道。','换上轻薄窗帘，让光进来。','减少家具数量，选择尺寸合适的单品。']],['p','先想想能拿走什么，再考虑添置什么。']],
   [['h','为什么有效'],['p','视线能够顺畅延伸，小房间就会显得更宽敞。看得见的地面、充足的自然光和畅通的走道，都能让空间更加开阔。'],['h','可以试试这些做法'],['ul',['腾出地面，留出畅通的走道。','换上轻薄窗帘，让光进来。','减少家具数量，选择尺寸合适的单品。','把日常杂物收进柜子，减少视觉干扰。']],['h','最简单的起点'],['p','先想想能拿走什么，再考虑添置什么。清理一个角落，感受房间的变化。']]
  ]
 }
};
