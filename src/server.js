import 'dotenv/config';
import app from './app.js';
// Importamos la instancia de sequelize y los modelos para la sincronización
import db from './models/index.js'; 

const {sequelize} = db;

const PORT = process.env.PORT || 3000;

async function main() {
  try {
    // 1. Autenticar la conexión a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');

    await sequelize.sync({ force: false }); 
    console.log('📦 Modelos sincronizados con la base de datos.');

    // 3. Iniciar el servidor Express
    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ No se pudo conectar a la base de datos:', error);
  }
}

main();
