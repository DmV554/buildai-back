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
  // CPUs (índices 0-1)
  { name: 'AMD Ryzen 7 7800X3D', componentType: 'CPU', brand: 'AMD', socket: 'AM5', performanceScore: 95, gamingScore: 98, workstationScore: 70 },
  { name: 'Intel Core i5-14600K', componentType: 'CPU', brand: 'Intel', socket: 'LGA1700', performanceScore: 80, gamingScore: 20, workstationScore: 93 },
  // GPUs (índices 2-3)
  { name: 'NVIDIA GeForce RTX 4070 Super', componentType: 'GPU', brand: 'NVIDIA', performanceScore: 88, gamingScore: 92, workstationScore: 51 },
  { name: 'AMD Radeon RX 7900 XT', componentType: 'GPU', brand: 'AMD', performanceScore: 80, gamingScore: 60, workstationScore: 97 },
  // Motherboards (índices 4-5)
  { name: 'ASUS ROG STRIX B650E-F', componentType: 'Motherboard', brand: 'ASUS', socket: 'AM5', memoryType: 'DDR5' },
  { name: 'MSI PRO Z790-P WIFI', componentType: 'Motherboard', brand: 'MSI', socket: 'LGA1700', memoryType: 'DDR5' },
  // RAM (índice 6)
  { name: 'Corsair Vengeance 32GB (2x16GB) DDR5 6000MHz', componentType: 'RAM', brand: 'Corsair', memoryType: 'DDR5' },
  
  // --- NUEVOS COMPONENTES AÑADIDOS ---
  // SSDs (índices 7-8)
  { name: 'Samsung 980 Pro 1TB NVMe', componentType: 'SSD', brand: 'Samsung', performanceScore: 96 },
  { name: 'Crucial P5 Plus 2TB NVMe', componentType: 'SSD', brand: 'Crucial', performanceScore: 94 },
  // PSUs (Fuentes de Poder) (índices 9-10)
  { name: 'Corsair RM850x 850W Gold', componentType: 'PSU', brand: 'Corsair', performanceScore: 95 },
  { name: 'SeaSonic FOCUS Plus Gold 750W', componentType: 'PSU', brand: 'SeaSonic', performanceScore: 93 },
  // Refrigeración (Cooling) (índices 11-12)
  { name: 'Noctua NH-D15', componentType: 'Cooling', brand: 'Noctua', socket: 'Universal', performanceScore: 98 },
  { name: 'Arctic Liquid Freezer II 240', componentType: 'Cooling', brand: 'Arctic', socket: 'Universal', performanceScore: 97 },
  // Gabinetes (Cases) (índices 13-14)
  { name: 'NZXT H5 Flow', componentType: 'Case', brand: 'NZXT', performanceScore: 90 },
  { name: 'Lian Li Lancool 215', componentType: 'Case', brand: 'Lian Li', performanceScore: 92 },
];

// --- FUNCIÓN DE SEEDING ---

const seedDatabase = async () => {
  try {
    // 1. Sincronizar la base de datos, BORRANDO todo lo existente (`force: true`)
    await db.sequelize.sync({ force: true });
    console.log('📦 Base de datos limpiada y sincronizada.');

    // 2. Crear usuarios y componentes usando bulkCreate para eficiencia
    const users = await db.User.bulkCreate(usersData);
    const components = await db.Component.bulkCreate(componentsData);
    console.log('✅ Usuarios y Componentes creados.');

    // 3. Crear listings (precios)
    const listingsWithRealIds = [
      // CPUs
      { componentId: components[0].id, storeName: 'Amazon', price: 449.99, url: '#' },
      { componentId: components[1].id, storeName: 'Amazon', price: 329.99, url: '#' },
      // GPUs
      { componentId: components[2].id, storeName: 'Newegg', price: 599.00, url: '#' },
      { componentId: components[3].id, storeName: 'Amazon', price: 749.99, url: '#' },
      // Motherboards
      { componentId: components[4].id, storeName: 'Amazon', price: 259.99, url: '#' },
      { componentId: components[5].id, storeName: 'Amazon', price: 219.99, url: '#' },
      // RAM
      { componentId: components[6].id, storeName: 'Amazon', price: 114.99, url: '#' },
      
      // --- LISTINGS PARA NUEVOS COMPONENTES ---
      // SSDs
      { componentId: components[7].id, storeName: 'Amazon', price: 99.99, url: '#' },
      { componentId: components[8].id, storeName: 'Newegg', price: 149.99, url: '#' },
      // PSUs
      { componentId: components[9].id, storeName: 'Amazon', price: 159.99, url: '#' },
      { componentId: components[10].id, storeName: 'Amazon', price: 129.99, url: '#' },
      // Cooling
      { componentId: components[11].id, storeName: 'Amazon', price: 109.95, url: '#' },
      { componentId: components[12].id, storeName: 'Amazon', price: 97.99, url: '#' },
      // Cases
      { componentId: components[13].id, storeName: 'Amazon', price: 94.99, url: '#' },
      { componentId: components[14].id, storeName: 'Newegg', price: 89.99, url: '#' },
    ];
    await db.Listing.bulkCreate(listingsWithRealIds);
    console.log('✅ Listings (precios) creados.');

    // 4. Crear Builds y asociarlos a los componentes (Relación Muchos-a-Muchos)
    const build1 = await db.Build.create({
      userId: users[0].id, // Build de Juan Pérez
      buildName: 'Workstation de Edición Completa',
      totalPrice: 1511.94 // Precio actualizado
    });
    // Asociamos los componentes a este build
    await build1.addComponents([
        components[1], // i5-14600K
        components[2], // RTX 4070 Super
        components[5], // MSI Z790
        components[6], // RAM 32GB
        components[8], // SSD 2TB
        components[10], // PSU 750W
        components[13] // NZXT H5 Flow
    ]);

    const build2 = await db.Build.create({
      userId: users[0].id, // Otro build de Juan
      buildName: 'PC Gaming Definitivo+',
      totalPrice: 1914.85 // Precio actualizado
    });
    await build2.addComponents([
        components[0], // R7 7800X3D
        components[3], // RX 7900 XT
        components[4], // ASUS B650E
        components[6], // RAM 32GB
        components[7], // SSD 1TB
        components[9], // PSU 850W
        components[11] // Noctua NH-D15
    ]);

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
