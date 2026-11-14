import assert from 'node:assert/strict';
import test from 'node:test';
import { installSourceDisclosure } from '../src/lib/source-disclosure.ts';

function fixture(t, reduced = false) {
  const preference = new EventTarget();
  preference.matches = reduced;
  const fonts = new EventTarget();
  const browser = new EventTarget();
  browser.matchMedia = () => preference;
  const restoreGlobals = [];
  for (const [key, value] of Object.entries({
    window: browser,
    document: { fonts, activeElement: null },
    getComputedStyle: (element) => ({ opacity: element.style.opacity || '1' }),
  })) {
    const original = Object.getOwnPropertyDescriptor(globalThis, key);
    Object.defineProperty(globalThis, key, { configurable: true, value });
    restoreGlobals.push(() =>
      original
        ? Object.defineProperty(globalThis, key, original)
        : delete globalThis[key],
    );
  }
  const animations = [];
  const element = () => {
    const node = new EventTarget();
    node.style = {
      removeProperty(key) {
        delete this[key];
      },
    };
    node.setAttribute = (key, value) => {
      node[key] = value;
    };
    node.removeAttribute = (key) => {
      delete node[key];
    };
    node.contains = () => false;
    node.animate = (frames) => {
      let finish;
      const finished = new Promise((resolve) => {
        finish = resolve;
      });
      const animation = { node, frames, finished, finish, cancel: finish };
      animations.push(animation);
      return animation;
    };
    return node;
  };
  const details = element();
  const body = element();
  const summary = element();
  details.open = false;
  details.querySelector = () => summary;
  details.getBoundingClientRect = () => ({
    width: 400,
    height:
      details.style.height && details.style.height !== 'auto'
        ? parseFloat(details.style.height)
        : details.open
          ? 180
          : 60,
  });
  const dispose = installSourceDisclosure(details, body);
  t.after(() => {
    dispose();
    restoreGlobals.forEach((restore) => restore());
  });
  return {
    details,
    body,
    preference,
    animations,
    click: () =>
      summary.dispatchEvent(new Event('click', { cancelable: true })),
  };
}
const flush = async () => {
  for (let i = 0; i < 8; i++) await Promise.resolve();
};

test('sources expand before fading in and fade out before collapsing', async (t) => {
  const { details, body, animations, click } = fixture(t);
  click();
  assert.equal(details.open, true);
  assert.equal(body.inert, true);
  assert.equal(animations.length, 1);
  assert.deepEqual(animations[0].frames, [
    { height: '60px' },
    { height: '180px' },
  ]);
  animations[0].finish();
  await flush();
  assert.equal(animations[1].node, body);
  assert.deepEqual(animations[1].frames, [{ opacity: 0 }, { opacity: 1 }]);
  animations[1].finish();
  await flush();
  assert.equal(body.inert, false);
  assert.equal(details.style.height, undefined);
  click();
  assert.equal(animations[2].node, body);
  assert.deepEqual(animations[2].frames, [{ opacity: 1 }, { opacity: 0 }]);
  animations[2].finish();
  await flush();
  assert.deepEqual(animations[3].frames, [
    { height: '180px' },
    { height: '60px' },
  ]);
  animations[3].finish();
  await flush();
  assert.equal(details.open, false);
  assert.equal(body.inert, true);
  assert.equal(details.style.height, undefined);
});

test('interrupted source transitions discard stale phases and settle on live reduced motion', async (t) => {
  const { details, body, preference, animations, click } = fixture(t);
  click();
  click();
  await flush();
  assert.equal(animations.length, 2);
  preference.matches = true;
  preference.dispatchEvent(new Event('change'));
  await flush();
  assert.equal(details.open, false);
  assert.equal(body.inert, true);
  assert.equal(animations.length, 2);
  click();
  assert.equal(details.open, true);
  assert.equal(body.inert, false);
  assert.equal(animations.length, 2);
});
