const { AUTH_STATE_PATH, LOCKOUT_DURATION_MS, LOCKOUT_THRESHOLD } = require('../config/config');
const { readJSONSafe, writeJSONSafe } = require('../utils/file');

class AuthState {
  constructor(statePath = AUTH_STATE_PATH) {
    const st = readJSONSafe(statePath, { failedCount: 0, lockedUntil: 0 }) || {};
    this.statePath = statePath;
    this.failedCount = st.failedCount || 0;
    this.lockedUntil = st.lockedUntil || 0;
  }

  isLocked() {
    return Date.now() < this.lockedUntil;
  }

  recordFailure() {
    this.failedCount += 1;
    if (this.failedCount >= LOCKOUT_THRESHOLD) {
      this.lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
      this.failedCount = 0;
    }
    this.persist();
  }

  recordSuccess() {
    this.failedCount = 0;
    this.lockedUntil = 0;
    this.persist();
  }

  persist() {
    writeJSONSafe(this.statePath, {
      failedCount: this.failedCount,
      lockedUntil: this.lockedUntil
    });
  }
}

module.exports = AuthState;
