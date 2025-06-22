import { Sequelize } from 'sequelize';
import 'dotenv/config';

const sequelize = new Sequelize(
  process.env.DB_NAME,      // Nombre de la base de datos
  process.env.DB_USER,      // Usuario de la base de datos
  process.env.DB_PASSWORD,  // Contraseña de la base de datos
  {
    host: process.env.DB_HOST || 'localhost', // Host de la base de datos
    dialect: 'postgres',                      // Especificamos que estamos usando PostgreSQL
    logging: process.env.NODE_ENV === 'development' ? console.log : false, // Muestra logs SQL en desarrollo
  }
);

export default sequelize;
