import { Router } from 'express';
import { createAiBuild } from '../controllers/build.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

// POST /api/builds/generate-ai
// Esta ruta está protegida. El usuario debe estar autenticado.
// El middleware 'protect' se ejecuta primero para verificar el JWT.
router.post('/generate-ai', protect, createAiBuild);

export default router;
