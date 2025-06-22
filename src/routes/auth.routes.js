import { Router } from 'express';
import { register, login, logout, profile } from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

// --- Rutas Públicas ---
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// --- Rutas Protegidas ---
// Cuando se recibe una petición GET en /api/auth/profile:
// 1. Se ejecuta el middleware 'protect'.
// 2. Si el token es válido, se ejecuta la función 'profile' del controlador.
router.get('/profile', protect, profile);

export default router;
