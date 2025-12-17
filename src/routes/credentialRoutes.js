const { Router } = require('express');
const buildCredentialController = require('../controllers/credentialController');
const requireAuth = require('../middleware/requireAuth');

function credentialRoutes(deps) {
  const router = Router();
  const ctrl = buildCredentialController(deps);

  router.get('/', requireAuth(deps.vault), ctrl.list);
  router.get('/:id', requireAuth(deps.vault), ctrl.getById);
  router.post('/', requireAuth(deps.vault), ctrl.create);
  router.delete('/:id', requireAuth(deps.vault), ctrl.remove);

  return router;
}

module.exports = credentialRoutes;
