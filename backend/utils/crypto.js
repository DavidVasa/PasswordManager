const crypto = require('crypto');

function deriveKey(masterPassword, saltHex) {
  const salt = Buffer.from(saltHex, 'hex');
  // scrypt – synchronní, 32B klíč
  return crypto.scryptSync(masterPassword, salt, 32);
}

function encryptJSON(obj, key) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const plaintext = Buffer.from(JSON.stringify(obj), 'utf8');
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    iv: iv.toString('hex'),
    tag: tag.toString('hex'),
    data: ciphertext.toString('hex')
  };
}

function decryptJSON(enc, key) {
  try {
    const iv = Buffer.from(enc.iv, 'hex');
    const tag = Buffer.from(enc.tag, 'hex');
    const data = Buffer.from(enc.data, 'hex');
    const decipher = require('crypto').createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    const plaintext = Buffer.concat([decipher.update(data), decipher.final()]);
    return JSON.parse(plaintext.toString('utf8'));
  } catch {
    return null; // špatný klíč / poškozená data
  }
}

module.exports = {
  deriveKey,
  encryptJSON,
  decryptJSON
};
