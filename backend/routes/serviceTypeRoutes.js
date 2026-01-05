const { Router } = require('express');
const buildServiceTypeController = require('../controllers/serviceTypeController');
const requireAuth = require('../middleware/requireAuth');

function serviceTypeRoutes(deps) {
  const router = Router();
  const ctrl = buildServiceTypeController(deps);

  router.get('/', requireAuth(deps.vault), ctrl.list);
  router.post('/', requireAuth(deps.vault), ctrl.create);

  return router;
}

module.exports = serviceTypeRoutes;
