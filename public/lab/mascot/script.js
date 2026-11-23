// A single set of paths survives every expression; interpolate from the visible geometry.
const leftEye = document.querySelector('#eye-left');
const rightEye = document.querySelector('#eye-right');
const eye = (x, shape = 'open') => ({
  open: [x,65,x,69,x,72,x,76,10],
  smile: [x-6,75,x-2,68,x+2,68,x+6,75,4.5],
  sleep: [x-6,75,x-2,79,x+2,79,x+6,75,4.5],
  wide: [x,64,x,68,x,74,x,78,12],
}[shape]);
const faces = {
  idle: [...eye(64),...eye(96)],
  thinking: [...eye(66),...eye(98,'sleep')],
  happy: [...eye(64,'smile'),...eye(96,'smile')],
  proud: [58,73,62,70,66,70,70,73,5,90,73,94,70,98,70,102,73,5],
  sleepy: [...eye(64,'sleep'),...eye(96,'sleep')],
  notice: [...eye(66,'wide'),...eye(98,'wide')],
  consider: [...eye(62,'sleep'),...eye(94)],
  wink: [...eye(64,'smile'),...eye(96)],
  surprised: [63,61,63,66,63,75,63,80,14,97,61,97,66,97,75,97,80,14],
  approve: [58,74,62,66,66,66,70,74,5,90,74,94,66,98,66,102,74,5],
};
let visibleFace = [...faces.idle];
let faceFrame;
function drawFace(values) {
  [leftEye,rightEye].forEach((node,index) => {
    const v = values.slice(index*9,index*9+9);
    node.setAttribute('d', `M${v[0]} ${v[1]} C${v.slice(2,8).join(' ')}`);
    node.setAttribute('style', `stroke-width:${v[8]}`);
  });

}
function morphFace(name) {
  cancelAnimationFrame(faceFrame);
  const target = faces[name];
  if (isStill()) { visibleFace = [...target]; drawFace(visibleFace); return; }
  const source = [...visibleFace];
  const started = performance.now();
  function frame(now) {
    const t = Math.min(1, (now-started)/420);
    const eased = t*t*(3-2*t);
    visibleFace = source.map((value,index) => value+(target[index]-value)*eased);
    drawFace(visibleFace);
    if (t < 1) faceFrame = requestAnimationFrame(frame);
  }
  faceFrame = requestAnimationFrame(frame);
}
drawFace(visibleFace);
const mascot = document.querySelector('#mascot');
const status = document.querySelector('#status');
const playButton = document.querySelector('#play');
const moodButtons = [...document.querySelectorAll('button[data-mood]')];
let sequenceTimer;
let reactionTimer;
let reactionFrame;
let sequenceToken = 0;
let running = false;
// Copy comes from copy.js (window.labCopy); English is the fallback.
const EN = { dIdle: 'Idle, looking around.', dThinking: 'Thinking, weighing the options.', dHappy: 'Happy, found something good.', dProud: 'Proud of a decision well made.', dSleepy: 'Sleepy, time for a rest.',
  rNotice: 'Noticed something.', rConsider: 'Considering it.', rWink: 'A wink.', rSurprised: 'Surprised.', rApprove: 'Approves.', play: 'Play sequence', stopSeq: 'Stop sequence' };
const t = k => (window.labCopy && window.labCopy[k]) || EN[k];
const cap = s => s[0].toUpperCase() + s.slice(1);
const describe = value => t('d' + cap(value));
function stop() {
  sequenceToken++;
  clearTimeout(sequenceTimer);
  clearTimeout(reactionTimer);
  cancelAnimationFrame(reactionFrame);
  delete mascot.dataset.reaction;
  running = false;
  playButton.textContent = t('play');
}
function mood(value) {
  mascot.dataset.mood = value;
  morphFace(value);
  status.textContent = describe(value);
  moodButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.mood === value)));
}
function reaction(value) {
  stop();
  reactionFrame = requestAnimationFrame(() => {
    mascot.dataset.reaction = value;
    morphFace(value);
    status.textContent = t('r' + cap(value));
    reactionTimer = setTimeout(() => {
      delete mascot.dataset.reaction;
      morphFace(mascot.dataset.mood);
      status.textContent = describe(mascot.dataset.mood);
    }, 1050);
  });
}
function sequence() {
  stop();
  running = true;
  playButton.textContent = t('stopSeq');
  const token = sequenceToken;
  const steps = ['idle', 'thinking', 'happy', 'proud', 'sleepy'];
  let index = 0;
  function next() {
    if (token !== sequenceToken) return;
    mood(steps[index++]);
    if (index < steps.length) sequenceTimer = setTimeout(next, isStill() ? 1200 : 1900);
    else if (preview && !isStill()) sequenceTimer = setTimeout(sequence, 1900);
    else { running = false; playButton.textContent = t('play'); }
  }
  next();
}
function applyMotion() {
  mascot.toggleAttribute('data-still', isStill());
  if (isStill()) morphFace(mascot.dataset.reaction || mascot.dataset.mood);
  if (isStill() && preview) { stop(); mood('happy'); }
}
moodButtons.forEach(button => button.addEventListener('click', () => { stop(); mood(button.dataset.mood); }));
document.querySelectorAll('button[data-reaction]').forEach(button => button.addEventListener('click', () => reaction(button.dataset.reaction)));
playButton.addEventListener('click', () => { if (running) { stop(); morphFace(mascot.dataset.mood); status.textContent = describe(mascot.dataset.mood); } else sequence(); });
document.querySelector('#reset').addEventListener('click', () => { stop(); mood('idle'); });
motionQuery.addEventListener('change', applyMotion);
window.addEventListener('pagehide', () => { stop(); cancelAnimationFrame(faceFrame); });
window.addEventListener('lab:language', () => {
  playButton.textContent = running ? t('stopSeq') : t('play');
  status.textContent = mascot.dataset.reaction ? t('r' + cap(mascot.dataset.reaction)) : describe(mascot.dataset.mood);
});
applyMotion();
if (preview && !isStill()) sequence();
