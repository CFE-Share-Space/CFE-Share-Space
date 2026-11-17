import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { annotation, origin } from './core.ts';
test('custom annotations retain their version and reject incomplete answers', () => {
 assert.deepEqual(annotation('yes'), [{task:'cfe',value:{schema_version:1,answer:'yes'}}]);
 assert.throws(() => annotation('')); assert.throws(() => origin('typo'));
});
