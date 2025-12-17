const { randomUUID } = require('crypto');

function buildServiceTypeController({ vault }) {
  return {
    list: (req, res) => {
      const list = vault.data?.serviceTypes || [];
      return res.status(200).json({ items: list });
    },

    create: (req, res) => {
      const { name } = req.body || {};
      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({ message: 'Please fill all fields' });
      }
      const id = randomUUID();
      vault.data.serviceTypes.push({ id, name: name.trim() });
      vault.save();
      return res.status(201).json({ id, name: name.trim() });
    }
  };
}

module.exports = buildServiceTypeController;
