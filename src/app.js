const express = require('express');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const serviceTypeRoutes = require('./routes/serviceTypeRoutes');
const credentialRoutes = require('./routes/credentialRoutes');

function createApp(deps) {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());

  // Health
  app.get('/health', (req, res) => {
    const hasVault = deps.vault.exists();
    const AuthLocked = deps.authState.isLocked();
    const vaultUnlocked = !!(deps.vault.key && deps.vault.data);
    return res.status(200).json({ status: 'dobry', hasVault, AuthLocked, vaultUnlocked});
  });

  // DEBUG: Check auth status
  app.get('/check-auth', (req, res) => {
    const { getSession } = require('./services/sessionStore');
    const sid = req.cookies.sid;
    const session = sid ? getSession(sid) : null;
    
    res.json({
      hasCookie: !!sid,
      sessionExists: !!session,
      sessionKey: session ? '***HIDDEN***' : null,
      vaultExists: deps.vault.exists(),
      vaultHasKey: !!deps.vault.key,
      vaultHasData: !!deps.vault.data,
      now: Date.now()
    });
  });

  // Routes
  app.use('/auth', authRoutes(deps));
  app.use('/service-types', serviceTypeRoutes(deps));
  app.use('/credentials', credentialRoutes(deps));

  // Základní error handler (fallback)
  app.use((err, req, res, next) => {
    console.error('Unhandled error:', err?.message);
    res.status(500).json({ message: 'Internal Server Error' });
  });

  return app;
}

module.exports = createApp;