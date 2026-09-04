(() => {
  const controls = [...document.querySelectorAll('[data-language]')]
  const panels = [...document.querySelectorAll('[data-language-panel]')]
  if (!controls.length || !panels.length)
    return

  const available = new Set(controls.map(control => control.dataset.language))
  const browserLanguage = navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en'
  const savedLanguage = localStorage.getItem('thread-language')
  const initialLanguage = available.has(savedLanguage) ? savedLanguage : browserLanguage

  function setLanguage(language) {
    if (!available.has(language))
      return

    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en'
    controls.forEach((control) => {
      control.setAttribute('aria-pressed', String(control.dataset.language === language))
    })
    panels.forEach((panel) => {
      panel.hidden = panel.dataset.languagePanel !== language
    })
    localStorage.setItem('thread-language', language)
  }

  controls.forEach((control) => {
    control.addEventListener('click', () => setLanguage(control.dataset.language))
  })

  setLanguage(initialLanguage)
})()

