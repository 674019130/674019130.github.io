// A single set of paths survives every expression; interpolate from the visible geometry.
const leftEye = document.querySelector('#eye-left');
const rightEye = document.querySelector('#eye-right');
const faceMouth = document.querySelector('#face-mouth');
const cheeks = document.querySelector('#face-cheeks');
const eye = (x, shape = 'open') => ({
  open: [x,65,x,69,x,72,x,76,10],
  smile: [x-6,75,x-2,68,x+2,68,x+6,75,4.5],
  sleep: [x-6,75,x-2,79,x+2,79,x+6,75,4.5],
  wide: [x,64,x,68,x,74,x,78,12],
}[shape]);
const mouth = (x1,y1,c1x,c1y,c2x,c2y,x2,y2) => [x1,y1,c1x,c1y,c2x,c2y,x2,y2,c2x,c2y,c1x,c1y,x1,y1];
const smile = mouth(73,91,77,99,83,99,87,91);
const neutral = mouth(74,93,78,96,82,96,86,93);
const faces = {
  idle: [...eye(64),...eye(96),...neutral,0],
  thinking: [...eye(64),...eye(96,'sleep'),...mouth(77,94,79,94,83,94,85,94),0],
  happy: [...eye(64,'smile'),...eye(96,'smile'),...smile,.6],
  proud: [...eye(64,'smile'),...eye(96,'smile'),...mouth(74,93,79,97,84,95,88,90),0],
  sleepy: [...eye(64,'sleep'),...eye(96,'sleep'),...mouth(76,96,79,98,81,98,84,96),0],
  notice: [...eye(64,'wide'),...eye(96,'wide'),...neutral,0],
  consider: [...eye(64,'sleep'),...eye(96),...mouth(77,94,79,94,83,92,85,92),0],
  wink: [...eye(64,'smile'),...eye(96),...smile,.3],
  surprised: [...eye(64,'wide'),...eye(96,'wide'),76,95,76,88,84,88,84,95,84,102,76,102,76,95,0],
  approve: [...eye(64,'smile'),...eye(96,'smile'),...smile,.6],
};
let visibleFace = [...faces.idle];
let faceFrame;
function drawFace(values) {
  [leftEye,rightEye].forEach((node,index) => {
    const v = values.slice(index*9,index*9+9);
    node.setAttribute('d', `M${v[0]} ${v[1]} C${v.slice(2,8).join(' ')}`);
    node.setAttribute('style', `stroke-width:${v[8]}`);
  });
  const m = values.slice(18,32);
  faceMouth.setAttribute('d', `M${m[0]} ${m[1]} C${m.slice(2,8).join(' ')} C${m.slice(8).join(' ')} Z`);
  cheeks.setAttribute('opacity', String(values[32]));
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
const descriptions = { idle: 'Idle · looking around', thinking: 'Thinking · weighing the options', happy: 'Happy · found something good', proud: 'Proud · a decision well made', sleepy: 'Sleepy · time for a rest' };
function stop() {
  sequenceToken++;
  clearTimeout(sequenceTimer);
  clearTimeout(reactionTimer);
  cancelAnimationFrame(reactionFrame);
  delete mascot.dataset.reaction;
  running = false;
  playButton.textContent = 'Play sequence';
}
function mood(value) {
  mascot.dataset.mood = value;
  morphFace(value);
  status.textContent = descriptions[value];
  moodButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.mood === value)));
}
function reaction(value) {
  stop();
  reactionFrame = requestAnimationFrame(() => {
    mascot.dataset.reaction = value;
    morphFace(value);
    status.textContent = `Reaction · ${value}`;
    reactionTimer = setTimeout(() => {
      delete mascot.dataset.reaction;
      morphFace(mascot.dataset.mood);
      status.textContent = descriptions[mascot.dataset.mood];
    }, 1050);
  });
}
function sequence() {
  stop();
  running = true;
  playButton.textContent = 'Stop sequence';
  const token = sequenceToken;
  const steps = ['idle', 'thinking', 'happy', 'proud', 'sleepy'];
  let index = 0;
  function next() {
    if (token !== sequenceToken) return;
    mood(steps[index++]);
    if (index < steps.length) sequenceTimer = setTimeout(next, isStill() ? 1200 : 1900);
    else if (preview && !isStill()) sequenceTimer = setTimeout(sequence, 1900);
    else { running = false; playButton.textContent = 'Play sequence'; }
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
playButton.addEventListener('click', () => { if (running) { stop(); morphFace(mascot.dataset.mood); status.textContent = descriptions[mascot.dataset.mood]; } else sequence(); });
document.querySelector('#reset').addEventListener('click', () => { stop(); mood('idle'); });
motionQuery.addEventListener('change', applyMotion);
window.addEventListener('pagehide', () => { stop(); cancelAnimationFrame(faceFrame); });
applyMotion();
if (preview && !isStill()) sequence();
