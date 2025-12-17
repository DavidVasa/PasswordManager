const { createSession, destroySession } = require('../services/sessionStore');

function buildAuthController({ vault, authState }) {
  return {
    setup: (req, res) => {
      const { masterPassword } = req.body || {};
      if (!masterPassword || typeof masterPassword !== 'string' || masterPassword.length === 0) {
        return res.status(400).json({ message: 'Please fill all fields' });
      }
      if (vault.exists()) {
        return res.status(409).json({ message: 'Vault already exists' });
      }
      vault.initialize(masterPassword);
      authState.recordSuccess();
      const sid = createSession(vault.key);
      res.cookie('sid', sid, {
        httpOnly: true,
        sameSite: 'strict',
        path: '/'
      });
      return res.status(201).json({ message: 'Vault initialized and unlocked' });
    },

    login: (req, res) => {
      if (authState.isLocked()) {
        return res.status(423).json({ message: 'Locked for 5 minutes' });
      }
      const { masterPassword } = req.body || {};
      if (!masterPassword || typeof masterPassword !== 'string' || masterPassword.length === 0) {
        return res.status(400).json({ message: 'Please fill all fields' });
      }
      const ok = vault.unlock(masterPassword);
      if (!ok) {
        authState.recordFailure();
        return res.status(401).json({ message: 'Invalid password' });
      }
      authState.recordSuccess();
      const sid = createSession(vault.key);
      res.cookie('sid', sid, {
        httpOnly: true,
        sameSite: 'strict',
        path: '/'
      });
      return res.status(200).json({ message: 'Vault unlocked' });
    },

    logout: (req, res) => {
      const sid = req.cookies.sid;
      if (sid) destroySession(sid);
      vault.lock();
      return res.status(200).json({ message: 'Logged out' });
    }
  };
}

module.exports = buildAuthController;
