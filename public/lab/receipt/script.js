const printer = document.querySelector('#printer');
const paper = document.querySelector('#paper');
const printButton = document.querySelector('#print');
const status = document.querySelector('#status');
const machineStatus = document.querySelector('#machine-status');
let timer;
let loopTimer;
function cancel() { clearTimeout(timer); clearTimeout(loopTimer); }
function setState(state) {
  printer.dataset.state = state;
  paper.setAttribute('aria-hidden', String(state === 'idle'));
  machineStatus.textContent = { idle: 'READY', printing: 'PRINTING', printed: 'PRINTED' }[state];
  status.textContent = { idle: 'Ready to print', printing: 'Printing your receipt…', printed: 'Printed · your sample receipt is ready' }[state];
  printButton.disabled = state === 'printing';
  printButton.textContent = state === 'printed' ? 'Print again' : 'Print receipt';
}
function reset() { cancel(); setState('idle'); }
function print() {
  cancel();
  setState('idle');
  void paper.offsetWidth;
  setState(isStill() ? 'printed' : 'printing');
  if (!isStill()) timer = setTimeout(() => {
    setState('printed');
    if (preview) loopTimer = setTimeout(print, 1800);
  }, 2550);
}
printButton.addEventListener('click', print);
document.querySelector('#reset').addEventListener('click', reset);
motionQuery.addEventListener('change', () => {
  if (isStill()) { cancel(); if (printer.dataset.state !== 'idle') setState('printed'); }
});
window.addEventListener('pagehide', cancel);
if (preview) {
  if (isStill()) setState('printed');
  else loopTimer = setTimeout(print, 300);
}
