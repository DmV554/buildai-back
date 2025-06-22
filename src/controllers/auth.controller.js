import db from '../models/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Función para registrar un nuevo usuario
export const register = async (req, res) => {
  try {
    const { name, lastname, email, password } = req.body;

    if (!name || !lastname || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'El correo electrónico ya está en uso.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await db.User.create({
      name,
      lastname,
      email,
      passwordHash,
    });
    
    // Creamos el token JWT
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // En lugar de enviar el token en el JSON, lo establecemos como una cookie httpOnly
    res.cookie('token', token, {
      httpOnly: true, // La cookie no es accesible por JavaScript en el cliente
      secure: process.env.NODE_ENV === 'production', // Usar solo en HTTPS en producción
      sameSite: 'strict', // Mitiga ataques CSRF
      maxAge: 24 * 60 * 60 * 1000 // 1 día
    });

    // Enviamos una respuesta exitosa sin el token en el cuerpo
    res.status(201).json({ 
        message: 'Usuario registrado exitosamente.',
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
        }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor al registrar el usuario.' });
  }
};

// Función para iniciar sesión
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email y contraseña son obligatorios.' });
        }

        const user = await db.User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Establecemos la cookie al iniciar sesión
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: "Inicio de sesión exitoso.",
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor al iniciar sesión.' });
    }
};

// Función para cerrar sesión
export const logout = (req, res) => {
    // Limpiamos la cookie para cerrar la sesión
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0) // La cookie expira inmediatamente
    });
    res.status(200).json({ message: 'Sesión cerrada exitosamente.' });
};

// Función para obtener el perfil del usuario autenticado
export const profile = async (req, res) => {
    // El middleware 'protect' ya ha verificado el token y adjuntado el usuario a 'req.user'
    res.status(200).json(req.user);
};
