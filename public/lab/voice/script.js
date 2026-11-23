import { createElement } from 'https://esm.sh/react@19.2.0'
import { createRoot } from 'https://esm.sh/react-dom@19.2.0/client?deps=react@19.2.0'
import { VoiceBeam } from 'https://esm.sh/voice-glow@0.5.0?deps=react@19.2.0,react-dom@19.2.0'

const stage = document.querySelector('.voice-stage')
const controls = [...stage.querySelectorAll('[data-state]')]
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)')
const presets = { chat: 'default', pill: 'pill', phone: 'mobile' }

const samples = Object.entries(presets).map(([selector, type]) => {
  const field = stage.querySelector('.voice-field.' + selector)
  const mount = document.createElement('div')
  field.replaceWith(mount)
  const input = field.querySelector('input')
  const child = createElement('div', { className: field.className }, input
    ? createElement('input', { id: input.id, placeholder: input.placeholder, autoComplete: 'off' })
    : createElement('span', { 'aria-hidden': true }, field.textContent))
  return { root: createRoot(mount), type, child }
})

function simulatedLevel() {
  const now = performance.now()
  return .15 + .8 * Math.abs(Math.sin(now / 160)) * (.5 + .5 * Math.sin(now / 465))
}

function render() {
  const mode = stage.dataset.mode
  for (const { root, type, child } of samples) {
    root.render(createElement(VoiceBeam, {
      type,
      theme: 'dark',
      level: mode === 'listen' && !reducedMotion.matches ? simulatedLevel : .18,
      processing: mode === 'process' && !reducedMotion.matches,
      paused: reducedMotion.matches || document.hidden,
    }, child))
  }
}

for (const button of controls) {
  button.addEventListener('click', () => {
    stage.dataset.mode = button.dataset.state
    for (const control of controls) control.setAttribute('aria-pressed', String(control === button))
    render()
  })
}

reducedMotion.addEventListener('change', render)
document.addEventListener('visibilitychange', render)
render()
