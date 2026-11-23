// Page-level language switch for experiments whose copy lives in a `copy = { en, zh }` table.
// Static text uses data-copy (textContent) and data-copy-label (aria-label); implementation
// notes use #note-title-N / #note-body-N. Scripts that render dynamic text read window.labCopy
// and listen for the `lab:language` event, so interaction state is never rebuilt on a switch.
import { readLocale, saveLocale, followLocale } from './locale.js';

export function setupCopy(copy) {
  const root = document.documentElement;
  const preview = new URLSearchParams(location.search).get('preview') === '1';
  let language = readLocale();
  if (!preview) saveLocale(language);

  function apply() {
    const t = copy[language];
    window.labCopy = t;
    root.lang = language === 'zh' ? 'zh-CN' : 'en';
    document.title = `${t.title} · ${language === 'zh' ? 'Su UI 实验室' : 'Su UI lab'}`;
    for (const el of document.querySelectorAll('[data-copy]')) if (t[el.dataset.copy] != null) el.textContent = t[el.dataset.copy];
    for (const el of document.querySelectorAll('[data-copy-html]')) if (t[el.dataset.copyHtml] != null) el.innerHTML = t[el.dataset.copyHtml];
    for (const el of document.querySelectorAll('[data-copy-label]')) if (t[el.dataset.copyLabel] != null) el.setAttribute('aria-label', t[el.dataset.copyLabel]);
    (t.notes || []).forEach(([title, body], i) => {
      const h = document.getElementById(`note-title-${i}`), p = document.getElementById(`note-body-${i}`);
      if (h) h.textContent = title;
      if (p) p.textContent = body;
    });
    const button = document.getElementById('language');
    if (button) {
      button.textContent = language === 'zh' ? 'EN' : '中';
      button.setAttribute('aria-label', language === 'zh' ? 'Switch to English' : '切换为中文');
    }
    window.dispatchEvent(new CustomEvent('lab:language', { detail: { language, copy: t } }));
  }

  document.getElementById('language')?.addEventListener('click', () => {
    language = language === 'en' ? 'zh' : 'en';
    saveLocale(language);
    apply();
  });
  followLocale(next => { if (next !== language) { language = next; apply(); } });
  apply();
  return { get language() { return language; }, t: () => copy[language] };
}
