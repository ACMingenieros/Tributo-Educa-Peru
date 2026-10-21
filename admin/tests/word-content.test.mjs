import assert from 'node:assert/strict';
import test from 'node:test';

import { initialCurriculum, slugify } from '../lib/firebase/curriculum.ts';
import { wordContentLegacyTitles, wordLessons } from '../lib/firebase/word-content.ts';

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

test('all editorial blocks use Firestore-compatible arrays', () => {
  function inspect(value) {
    if (Array.isArray(value)) {
      for (const item of value) {
        assert.equal(Array.isArray(item), false, 'Firestore rejects an array directly inside another array');
        inspect(item);
      }
    } else if (value && typeof value === 'object') {
      Object.values(value).forEach(inspect);
    }
  }
  wordLessons.forEach((lesson) => lesson.blocks.forEach((block) => inspect(block.data)));
});

test('lessons vary their teaching formats instead of repeating one template', () => {
  const allTypes = new Set();
  for (const lesson of wordLessons) {
    const types = new Set(lesson.blocks.map((block) => block.type));
    types.forEach((type) => allTypes.add(type));
    assert.ok(types.size >= 3, `${lesson.submoduleSlug} should use at least three block types`);
  }
  assert.ok(allTypes.size >= 7);
});

test('refresh signatures cover every lesson and only the original import blocks', () => {
  assert.deepEqual(Object.keys(wordContentLegacyTitles).sort(), wordLessons
    .map((lesson) => lesson.submoduleSlug).sort());
  for (const lesson of wordLessons) {
    assert.ok(wordContentLegacyTitles[lesson.submoduleSlug].length >= 2);
  }
});
