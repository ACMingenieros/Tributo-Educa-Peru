import test from 'node:test';
import assert from 'node:assert/strict';

import { createAsyncActionLock } from '../lib/async-action-lock.mjs';

test('ignores a second action while the first action is still pending', async () => {
  const runOnce = createAsyncActionLock();
  let finishFirst;
  let secondActionRan = false;

  const firstRun = runOnce(() => new Promise((resolve) => { finishFirst = resolve; }));
  const secondRun = await runOnce(async () => { secondActionRan = true; });

  assert.equal(secondRun, false);
  assert.equal(secondActionRan, false);

  finishFirst();
  assert.equal(await firstRun, true);
});

test('allows another action after the previous action rejects', async () => {
  const runOnce = createAsyncActionLock();

  await assert.rejects(runOnce(async () => { throw new Error('save failed'); }), /save failed/);
  assert.equal(await runOnce(async () => {}), true);
});
