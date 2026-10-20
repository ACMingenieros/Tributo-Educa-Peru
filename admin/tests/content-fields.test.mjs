import assert from 'node:assert/strict';
import test from 'node:test';

import { fieldValuesFromComponent, parseFieldValues } from '../lib/content-fields.ts';

test('comparison table rows round-trip without nested Firestore arrays', () => {
  const data = parseFieldValues('comparison_table', {
    columns: 'Régimen\nDetalle',
    rows: 'RMT | MYPE\nGeneral | Todos',
    source: 'SUNAT',
  });
  assert.deepEqual(data.rows, [
    { cells: ['RMT', 'MYPE'] },
    { cells: ['General', 'Todos'] },
  ]);
  const values = fieldValuesFromComponent({type: 'comparison_table', data});
  assert.equal(values.rows, 'RMT | MYPE\nGeneral | Todos');
});
