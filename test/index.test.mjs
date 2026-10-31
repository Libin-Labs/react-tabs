import { beforeEach, afterEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { setup, key } from './helpers.mjs';
import { Tabs } from '../dist/index.js';
let ui;
beforeEach(async () => (ui = await setup()));
afterEach(async () => ui.cleanup());
test('manual keyboard activation skips disabled tabs and links panels', async () => {
  await ui.render(
    createElement(Tabs, {
      activation: 'manual',
      tabs: [
        { id: 'a', label: 'A', content: 'Alpha' },
        { id: 'b', label: 'B', content: 'Beta', disabled: true },
        { id: 'c', label: 'C', content: 'Gamma' },
      ],
    }),
  );
  const tabs = ui.container.querySelectorAll('[role="tab"]');
  await key(tabs[0], 'ArrowRight');
  assert.equal(document.activeElement, tabs[2]);
  assert.equal(tabs[0].getAttribute('aria-selected'), 'true');
  await key(tabs[2], 'Enter');
  assert.equal(tabs[2].getAttribute('aria-selected'), 'true');
  assert.equal(document.getElementById(tabs[2].getAttribute('aria-controls')).hidden, false);
});
