import test from 'node:test';
import assert from 'node:assert/strict';

import { resolvePanelRole } from '../lib/auth/access.mjs';

test('grants admin access to the verified bootstrap email', () => {
  assert.equal(resolvePanelRole('admin@gmail.com', true, null), 'admin');
});

test('denies admin access when the bootstrap email is not verified', () => {
  assert.equal(resolvePanelRole('admin@gmail.com', false, null), null);
});

test('does not grant admin access to another email', () => {
  assert.equal(resolvePanelRole('someone@example.com', true, null), null);
});

test('does not let an admin claim bypass the allowlisted email', () => {
  assert.equal(resolvePanelRole('someone@example.com', true, 'admin'), null);
});

test('keeps editor access claim-based', () => {
  assert.equal(resolvePanelRole('editor@example.com', true, 'editor'), 'editor');
});
