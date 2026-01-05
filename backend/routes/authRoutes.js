const { Router } = require('express');
const buildAuthController = require('../controllers/authController');

function authRoutes(deps) {
  const router = Router();
  const ctrl = buildAuthController(deps);

  router.post('/setup', ctrl.setup);
  router.post('/login', ctrl.login);
  router.post('/logout', ctrl.logout);

  return router;
}

module.exports = authRoutes;
