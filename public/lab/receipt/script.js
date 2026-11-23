const printer = document.querySelector('#printer');
const paper = document.querySelector('#paper');
const printButton = document.querySelector('#print');
const status = document.querySelector('#status');
const machineStatus = document.querySelector('#machine-status');
// Copy comes from copy.js (window.labCopy); English is the fallback.
const EN = { sIdle: 'Ready to print.', sPrinting: 'Printing your receipt…', sPrinted: 'Printed. Scroll the paper to read it.',
  mIdle: 'READY', mPrinting: 'PRINTING', mPrinted: 'DONE', print: 'Print receipt', again: 'Print again' };
const t = k => (window.labCopy && window.labCopy[k]) || EN[k];
const KEY = { idle: 'Idle', printing: 'Printing', printed: 'Printed' };
let timer;
let loopTimer;
function cancel() { clearTimeout(timer); clearTimeout(loopTimer); }
function setState(state) {
  printer.dataset.state = state;
  paper.setAttribute('aria-hidden', String(state === 'idle'));
  machineStatus.textContent = t('m' + KEY[state]);
  status.textContent = t('s' + KEY[state]);
  printButton.disabled = state === 'printing';
  printButton.textContent = state === 'printed' ? t('again') : t('print');
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
window.addEventListener('lab:language', () => setState(printer.dataset.state));
if (preview) {
  if (isStill()) setState('printed');
  else loopTimer = setTimeout(print, 300);
}
