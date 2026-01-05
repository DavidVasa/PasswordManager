const { randomUUID } = require('crypto');

function buildCredentialController({ vault }) {
  return {
    list: (req, res) => {
      const creds = vault.data?.loginDetails || [];
      if (creds.length === 0) {
        return res.status(404).json({ message: 'No credentials found' });
      }
      const stMap = new Map((vault.data?.serviceTypes || []).map(s => [s.id, s.name]));
      const items = creds.map(c => ({
        id: c.id,
        serviceType: { id: c.serviceTypeId, name: stMap.get(c.serviceTypeId) || '(unknown)' }
      }));
      return res.status(200).json({ items });
    },

    getById: (req, res) => {
      const { id } = req.params;
      const rec = (vault.data?.loginDetails || []).find(r => r.id === id);
      if (!rec) return res.status(404).json({ message: 'Record not found' });
      return res.status(200).json({
        id: rec.id,
        username: rec.username,
        password: rec.password,
        serviceTypeId: rec.serviceTypeId
      });
    },

    create: (req, res) => {
      const { serviceTypeId, username, password } = req.body || {};
      if (!serviceTypeId || !username || !password) {
        return res.status(400).json({ message: 'Please fill all fields' });
      }
      const st = (vault.data?.serviceTypes || []).find(s => s.id === serviceTypeId);
      if (!st) return res.status(404).json({ message: 'Record not found' });
      const id = randomUUID();
      vault.data.loginDetails.push({
        id,
        username: String(username),
        password: String(password),
        serviceTypeId
      });
      vault.save();
      return res.status(201).json({ id });
    },

    remove: (req, res) => {
      const { id } = req.params;
      const idx = (vault.data?.loginDetails || []).findIndex(r => r.id === id);
      if (idx < 0) return res.status(404).json({ message: 'Record not found' });
      try {
        vault.data.loginDetails.splice(idx, 1);
        vault.save();
        return res.status(200).json({ message: 'Deleted' });
      } catch (e) {
        return res.status(500).json({ message: 'Error deleting record' });
      }
    }
  };
}

module.exports = buildCredentialController;
