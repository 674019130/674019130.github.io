import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeLocale, readLocale, saveLocale, followLocale } from '../public/lab/shared/locale.js';

test('accept theme and experiment locale aliases without accepting unknown languages', () => {
  for (const value of ['zh', 'zh-CN', 'ZH-cn']) assert.equal(normalizeLocale(value), 'zh');
  for (const value of ['en', 'en-US']) assert.equal(normalizeLocale(value), 'en');
  for (const value of [null, [], 'fr', 'english', 'zhang']) assert.equal(normalizeLocale(value), null);
});

test('repeated switches, deep links, storage events and previews preserve one preference', () => {
  const values = new Map([['valaxy-locale', 'zh-CN']]);
  const listeners = new Map();
  globalThis.location = new URL('https://example.com/lab/answer-length/');
  globalThis.localStorage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  globalThis.history = { state: { retained: true }, replaceState(state, _, url) { assert.equal(state.retained, true); globalThis.location = new URL(url); } };
  globalThis.window = { addEventListener: (key, handler) => listeners.set(key, handler) };
  assert.equal(readLocale(), 'zh');
  for (let i = 0; i < 20; i++) {
    const lang = i % 2 ? 'zh' : 'en';
    saveLocale(lang);
    assert.equal(readLocale(), lang);
    assert.equal(values.get('valaxy-locale'), lang === 'zh' ? 'zh-CN' : 'en');
  }
  let current;
  followLocale(lang => { current = lang; });
  listeners.get('storage')({ key: 'valaxy-locale', newValue: 'en' });
  assert.equal(current, 'en');
  assert.equal(readLocale(), 'en');
  globalThis.location = new URL('https://example.com/lab/answer-length/?lang=zh-CN');
  listeners.get('popstate')();
  assert.equal(current, 'zh');
  listeners.get('pageshow')({ persisted: true });
  assert.equal(current, 'en', 'back-forward cache restores the latest preference');
  assert.equal(readLocale(), 'en');
  globalThis.location = new URL('https://example.com/lab/answer-length/?preview=1&lang=zh');
  saveLocale('zh');
  listeners.get('storage')({ key: 'valaxy-locale', newValue: 'zh-CN' });
  assert.equal(values.get('valaxy-locale'), 'en', 'preview must not overwrite the parent language');
  assert.equal(readLocale(), 'zh');
  globalThis.localStorage = { getItem() { throw Error('disabled'); }, setItem() { throw Error('disabled'); } };
  globalThis.location = new URL('https://example.com/lab/answer-length/');
  assert.equal(readLocale(), 'en');
  saveLocale('zh');
  assert.equal(readLocale(), 'zh');
});
