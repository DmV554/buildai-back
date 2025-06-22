import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.routes.js';
import buildRoutes from './routes/build.routes.js'; // <-- AÑADIDO

const app = express();

app.use(express.json());
app.use(cookieParser());


const corsOptions = {
  // CAMBIO: No uses '*', especifica el origen de tu app Ionic.
  origin: 'http://localhost:4200', // O el puerto que use `ionic serve`
  
  // NUEVO: Esta opción es OBLIGATORIA para que las cookies funcionen.
  credentials: true 
};

app.use(cors(corsOptions));
app.use(helmet());
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
//app.use('/api/components', componentRoutes);
app.use('/api/builds', buildRoutes); // <-- AÑADIDO

app.get('/', (_, res) => res.send('API funcionando correctamente ✅'));

app.use((_, res) => res.status(404).json({ message: 'Ruta no encontrada' }));



app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Error interno del servidor' });
});

export default app;