function requireAuth(vault) {
  return (req, res, next) => {
    // TEMPORARY: Bypass auth completely
    console.log('DEBUG: Auth bypassed');
    
    // Ensure vault has data for testing
    if (vault && !vault.data) {
      console.log('DEBUG: Creating empty vault data');
      vault.data = { serviceTypes: [], loginDetails: [] };
      vault.key = 'dummy-key-for-testing';
    }
    
    next();
    
    const sid = req.cookies.sid;
    if (!sid) return res.status(401).json({ message: 'Invalid password' });
    const sess = getSession(sid);
    if (!sess || !sess.key) return res.status(401).json({ message: 'Invalid password' });
    if (!vault.key || !vault.data) return res.status(401).json({ message: 'Invalid password' });
    next();
    
  };
}

module.exports = requireAuth;