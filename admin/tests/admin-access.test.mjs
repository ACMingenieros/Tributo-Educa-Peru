import test from 'node:test';
import assert from 'node:assert/strict';

import { ADMIN_UID, resolvePanelRole } from '../lib/auth/access.mjs';

test('grants admin access to the configured Firebase UID', () => {
  assert.equal(resolvePanelRole(ADMIN_UID, null), 'admin');
});

test('does not grant admin access to another UID using the bootstrap email', () => {
  assert.equal(resolvePanelRole('different-uid', 'admin@gmail.com', null), null);
});

test('does not let an admin claim bypass the allowlisted UID', () => {
  assert.equal(resolvePanelRole('different-uid', 'admin@gmail.com', 'admin'), null);
});

test('keeps editor access claim-based', () => {
  assert.equal(resolvePanelRole('editor-uid', 'editor@example.com', 'editor'), 'editor');
});
