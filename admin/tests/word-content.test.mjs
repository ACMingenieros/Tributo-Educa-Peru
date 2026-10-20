import assert from 'node:assert/strict';
import test from 'node:test';

import { initialCurriculum, slugify } from '../lib/firebase/curriculum.ts';
import { wordLessons } from '../lib/firebase/word-content.ts';

test('Word content covers every curriculum submodule exactly once', () => {
  const expected = initialCurriculum.flatMap((module) =>
    module.submodules.map((submodule) => `${slugify(module.title)}/${slugify(submodule)}`));
  const actual = wordLessons.map((lesson) => `${lesson.moduleSlug}/${lesson.submoduleSlug}`);
  assert.deepEqual(actual.sort(), expected.sort());
  assert.equal(new Set(actual).size, 15);
});

test('every lesson has editable blocks and an official source', () => {
  for (const lesson of wordLessons) {
    assert.ok(lesson.blocks.length >= 3);
    const source = lesson.blocks.at(-1);
    assert.equal(source.type, 'legal_notice');
    assert.match(source.data.source, /^https:\/\/(?:www\.|emprender\.)?(?:gob\.pe|sunat\.gob\.pe|leyes\.congreso\.gob\.pe)/);
    lesson.blocks.forEach((block) => assert.ok(block.title.trim()));
  }
});
