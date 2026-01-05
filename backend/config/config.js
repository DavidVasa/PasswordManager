const path = require('path');
const os = require('os');

const APP_HOST = process.env.APP_HOST || '127.0.0.1';
const APP_PORT = Number(process.env.APP_PORT || 3000);

const DATA_DIR = process.env.PM_DATA_DIR || path.join(os.homedir(), '.passwordmanager');
const VAULT_PATH = path.join(DATA_DIR, 'vault.pm');
const AUTH_STATE_PATH = path.join(DATA_DIR, 'auth.state.json');

const LOCKOUT_THRESHOLD = 3;                 // 3 chybné pokusy
const LOCKOUT_DURATION_MS = 5 * 60 * 1000;   // 5 minut

module.exports = {
  APP_HOST,
  APP_PORT,
  DATA_DIR,
  VAULT_PATH,
  AUTH_STATE_PATH,
  LOCKOUT_THRESHOLD,
  LOCKOUT_DURATION_MS
};
