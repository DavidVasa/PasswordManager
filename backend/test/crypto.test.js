const test = require('node:test');
const assert = require('node:assert');
const crypto = require('crypto');
const { deriveKey, encryptJSON, decryptJSON } = require('../src/utils/crypto');

test('KDF derivace klíče je stabilní', () => {
  const salt = crypto.randomBytes(16).toString('hex');
  const k1 = deriveKey('Master123!', salt);
  const k2 = deriveKey('Master123!', salt);
  assert.equal(k1.toString('hex'), k2.toString('hex'));
});

test('AES-256-GCM šifrování/dešifrování JSON funguje', () => {
  const salt = crypto.randomBytes(16).toString('hex');
  const key = deriveKey('Master123!', salt);
  const src = { serviceTypes: [], loginDetails: [{ id: '1', username: 'u', password: 'p', serviceTypeId: 's' }] };
  const enc = encryptJSON(src, key);
  const dec = decryptJSON(enc, key);
  assert.deepEqual(dec, src);
});

test('Špatný klíč způsobí chybu (tag mismatch)', () => {
  const salt = crypto.randomBytes(16).toString('hex');
  const key1 = deriveKey('ok', salt);
  const key2 = deriveKey('bad', salt);
  const enc = encryptJSON({ a: 1 }, key1);
  let dec = null;
  try {
    dec = decryptJSON(enc, key2);
  } catch {}
  assert.equal(dec, null);
});
