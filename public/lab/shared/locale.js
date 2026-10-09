// The static experiments use the same preference as the Vue blog.
export function normalizeLocale(value) {
  if (typeof value !== 'string') return null;
  return /^zh(?:-|$)/i.test(value) ? 'zh' : /^en(?:-|$)/i.test(value) ? 'en' : null;
}
export function readLocale() {
  let saved;
  try { saved = localStorage.getItem('valaxy-locale'); } catch { /* Private storage may be unavailable. */ }
  return normalizeLocale(new URLSearchParams(location.search).get('lang')) || normalizeLocale(saved) || 'en';
}
export function saveLocale(language) {
  if (new URLSearchParams(location.search).has('preview')) return;
  const url = new URL(location.href);
  url.searchParams.set('lang', language);
  history.replaceState(history.state, '', url);
  try { localStorage.setItem('valaxy-locale', language === 'zh' ? 'zh-CN' : 'en'); } catch { /* Selection still works without persistence. */ }
}
export function followLocale(apply) {
  window.addEventListener('pageshow', event => {
    if (!event.persisted || new URLSearchParams(location.search).has('preview')) return;
    try {
      const language = normalizeLocale(localStorage.getItem('valaxy-locale'));
      if (language) { saveLocale(language); apply(language); }
    } catch { /* Storage can be disabled. */ }
  });
  window.addEventListener('popstate', () => apply(readLocale()));
  window.addEventListener('storage', event => {
    if (event.key === 'valaxy-locale' && !new URLSearchParams(location.search).has('preview')) {
      const language = normalizeLocale(event.newValue);
      if (language) { saveLocale(language); apply(language); }
    }
  });
}
