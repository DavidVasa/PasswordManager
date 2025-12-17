const { readJSONSafe, writeJSONSafe } = require('../utils/file');
const { deriveKey, encryptJSON, decryptJSON } = require('../utils/crypto');
const { VAULT_PATH } = require('../config/config');
const crypto = require('crypto');
const fs = require('fs');

class VaultStore {
  constructor(vaultPath = VAULT_PATH) {
    this.vaultPath = vaultPath;
    this.key = null;   // odvozený klíč (v RAM po přihlášení)
    this.data = null;  // dešifrovaný JSON { serviceTypes: [], loginDetails: [] }
    this.meta = null;  // { version, kdf, salt, enc }
  }

  exists() {
    return fs.existsSync(this.vaultPath);
  }

  initialize(masterPassword) {
    const salt = crypto.randomBytes(16).toString('hex');
    const key = deriveKey(masterPassword, salt);
    const emptyData = { serviceTypes: [], loginDetails: [] };
    const enc = encryptJSON(emptyData, key);
    const meta = { version: 1, kdf: 'scrypt', salt, enc };
    writeJSONSafe(this.vaultPath, meta);
    this.key = key;
    this.data = emptyData;
    this.meta = meta;
  }

  unlock(masterPassword) {
    if (!this.exists()) return false;
    const meta = readJSONSafe(this.vaultPath);
    if (!meta || !meta.salt || !meta.enc) return false;
    const key = deriveKey(masterPassword, meta.salt);
    const data = decryptJSON(meta.enc, key);
    if (!data) return false;
    this.key = key;
    this.data = data;
    this.meta = meta;
    return true;
  }

  lock() {
    this.key = null;
    this.data = null;
  }

  save() {
    if (!this.key || !this.data || !this.meta) {
      throw new Error('Vault is not unlocked');
    }
    const enc = encryptJSON(this.data, this.key);
    this.meta = { version: 1, kdf: 'scrypt', salt: this.meta.salt, enc };
    writeJSONSafe(this.vaultPath, this.meta);
  }
}

module.exports = VaultStore;
