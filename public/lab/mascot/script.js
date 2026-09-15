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
  status.textContent = descriptions[value];
  moodButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.mood === value)));
}
function reaction(value) {
  stop();
  reactionFrame = requestAnimationFrame(() => {
    mascot.dataset.reaction = value;
    status.textContent = `Reaction · ${value}`;
    reactionTimer = setTimeout(() => {
      delete mascot.dataset.reaction;
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
  if (isStill() && preview) { stop(); mood('happy'); }
}
moodButtons.forEach(button => button.addEventListener('click', () => { stop(); mood(button.dataset.mood); }));
document.querySelectorAll('button[data-reaction]').forEach(button => button.addEventListener('click', () => reaction(button.dataset.reaction)));
playButton.addEventListener('click', () => { if (running) { stop(); status.textContent = descriptions[mascot.dataset.mood]; } else sequence(); });
document.querySelector('#reset').addEventListener('click', () => { stop(); mood('idle'); });
motionQuery.addEventListener('change', applyMotion);
window.addEventListener('pagehide', stop);
applyMotion();
if (preview && !isStill()) sequence();
