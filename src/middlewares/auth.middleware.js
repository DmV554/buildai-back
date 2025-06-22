import jwt from 'jsonwebtoken';
import db from '../models/index.js';

export const protect = async (req, res, next) => {
  // 1. Obtenemos el token de las cookies de la petición
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'No autorizado, no se encontró token.' });
  }

  try {
    // 2. Verificamos el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Obtenemos el usuario de la BD (sin la contraseña) y lo adjuntamos a la petición
    req.user = await db.User.findByPk(decoded.id, {
      attributes: { exclude: ['passwordHash'] }
    });

    if (!req.user) {
      // Limpiamos la cookie si el usuario ya no existe
      res.clearCookie('token');
      return res.status(401).json({ message: 'Usuario no encontrado.' });
    }

    // 4. Continuamos al controlador
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'No autorizado, el token es inválido.' });
  }
};
