import db from '../models/index.js';
import bcrypt from 'bcryptjs';

// --- DATOS SINTÉTICOS ---

// Hasheamos contraseñas de ejemplo para los usuarios
const passwordHash = await bcrypt.hash('password123', 10);

const usersData = [
  { name: 'Juan', lastname: 'Pérez', email: 'juan.perez@example.com', passwordHash, experienceLevel: 'Intermedio', bio: 'Entusiasta del gaming y la edición de video.' },
  { name: 'Ana', lastname: 'García', email: 'ana.garcia@example.com', passwordHash, experienceLevel: 'Principiante', bio: 'Buscando mi primer PC para diseño gráfico.' },
];

const componentsData = [
  // CPUs
  { name: 'AMD Ryzen 7 7800X3D', componentType: 'CPU', brand: 'AMD', socket: 'AM5', performanceScore: 95, gamingScore: 98, workstationScore: 85 },
  { name: 'Intel Core i5-14600K', componentType: 'CPU', brand: 'Intel', socket: 'LGA1700', performanceScore: 92, gamingScore: 90, workstationScore: 93 },
  // GPUs
  { name: 'NVIDIA GeForce RTX 4070 Super', componentType: 'GPU', brand: 'NVIDIA', performanceScore: 88, gamingScore: 92, workstationScore: 85 },
  { name: 'AMD Radeon RX 7900 XT', componentType: 'GPU', brand: 'AMD', performanceScore: 90, gamingScore: 93, workstationScore: 88 },
  // Motherboards
  { name: 'ASUS ROG STRIX B650E-F', componentType: 'Motherboard', brand: 'ASUS', socket: 'AM5', memoryType: 'DDR5' },
  { name: 'MSI PRO Z790-P WIFI', componentType: 'Motherboard', brand: 'MSI', socket: 'LGA1700', memoryType: 'DDR5' },
  // RAM
  { name: 'Corsair Vengeance 32GB (2x16GB) DDR5 6000MHz', componentType: 'RAM', brand: 'Corsair', memoryType: 'DDR5' },
];

// Los Listings dependen de los componentes, así que los definiremos después
const listingsData = [
  // Listings para Ryzen 7 7800X3D
  { componentId: 1, storeName: 'Amazon', price: 449.99, url: 'http://example.com/amazon/ryzen7800x3d' },
  { componentId: 1, storeName: 'Newegg', price: 459.99, url: 'http://example.com/newegg/ryzen7800x3d' },
  // Listings para RTX 4070 Super
  { componentId: 3, storeName: 'Amazon', price: 599.99, url: 'http://example.com/amazon/rtx4070s' },
  // ...y así para los demás componentes
];


// --- FUNCIÓN DE SEEDING ---

const seedDatabase = async () => {
  try {
    // 1. Sincronizar la base de datos, BORRANDO todo lo existente (`force: true`)
    // Esto asegura que empezamos desde un estado limpio cada vez que ejecutamos el seed.
    await db.sequelize.sync({ force: true });
    console.log('📦 Base de datos limpiada y sincronizada.');

    // 2. Crear usuarios y componentes usando bulkCreate para eficiencia
    const users = await db.User.bulkCreate(usersData);
    const components = await db.Component.bulkCreate(componentsData);
    console.log('✅ Usuarios y Componentes creados.');

    // 3. Crear listings (precios)
    // Actualizamos los componentId para que coincidan con los IDs reales creados en la BD
    const listingsWithRealIds = [
      // Ryzen 7
      { componentId: components[0].id, storeName: 'Amazon', price: 449.99, url: '#' },
      { componentId: components[0].id, storeName: 'PC Factory', price: 469.90, url: '#' },
      // i5
      { componentId: components[1].id, storeName: 'Amazon', price: 329.99, url: '#' },
      // 4070 Super
      { componentId: components[2].id, storeName: 'Newegg', price: 599.00, url: '#' },
       // 7900 XT
      { componentId: components[3].id, storeName: 'Amazon', price: 749.99, url: '#' },
      // MB ASUS
      { componentId: components[4].id, storeName: 'Amazon', price: 259.99, url: '#' },
      // MB MSI
      { componentId: components[5].id, storeName: 'Amazon', price: 219.99, url: '#' },
      // RAM
      { componentId: components[6].id, storeName: 'Amazon', price: 114.99, url: '#' },
    ];
    await db.Listing.bulkCreate(listingsWithRealIds);
    console.log('✅ Listings (precios) creados.');

    // 4. Crear Builds y asociarlos a los componentes (Relación Muchos-a-Muchos)
    const build1 = await db.Build.create({
      userId: users[0].id, // Build de Juan Pérez
      buildName: 'Workstation de Edición',
      totalPrice: 1288.96
    });
    // Asociamos los componentes a este build
    await build1.addComponents([components[1], components[2], components[5], components[6]]); // i5, 4070S, MSI, RAM

    const build2 = await db.Build.create({
      userId: users[0].id, // Otro build de Juan
      buildName: 'PC Gaming Definitivo',
      totalPrice: 1304.87
    });
    await build2.addComponents([components[0], components[3], components[4], components[6]]); // R7, 7900XT, ASUS, RAM

    console.log('✅ Builds y sus relaciones creadas.');
    console.log('🎉 ¡Base de datos poblada con éxito!');

  } catch (error) {
    console.error('❌ Error al poblar la base de datos:', error);
  } finally {
    // Cerramos la conexión a la base de datos
    await db.sequelize.close();
  }
};

// Ejecutamos la función
seedDatabase();
