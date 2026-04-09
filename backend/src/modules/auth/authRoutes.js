const { Router } = require('express');
const router = Router();
const { login } = require('./authController');

// Ruta pública para obtener el token
router.post('/login', login);

module.exports = router;