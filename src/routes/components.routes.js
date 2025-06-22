import { Router } from 'express';
import { getAllComponents, getComponentById } from '../controllers/component.controller.js';

const router = Router();

// Ruta para obtener todos los componentes (ideal para la página de catálogo)
// GET /api/components
router.get('/', getAllComponents);

// Ruta para obtener un componente específico por su ID
// GET /api/components/:id
router.get('/:id', getComponentById);

// Aquí podrías añadir en el futuro rutas para crear, actualizar o eliminar componentes
// router.post('/', createComponent);
// router.put('/:id', updateComponent);
// router.delete('/:id', deleteComponent);

export default router;
