import sequelize from '../config/db.js';

// Importamos las funciones que definen cada modelo
import UserModel from './user.model.js';
import ComponentModel from './component.model.js';
import ListingModel from './listing.model.js';
import BuildModel from './build.model.js';

// Inicializamos cada modelo pasándole la instancia de sequelize
const User = UserModel(sequelize);
const Component = ComponentModel(sequelize);
const Listing = ListingModel(sequelize);
const Build = BuildModel(sequelize);

// --- DEFINICIÓN CENTRALIZADA DE RELACIONES ---
// Un lugar para ver cómo se conecta todo.

// User - Build (Uno a Muchos)
User.hasMany(Build, { foreignKey: 'userId', onDelete: 'CASCADE' });
Build.belongsTo(User, { foreignKey: 'userId' });

// Component - Listing (Uno a Muchos)
Component.hasMany(Listing, { foreignKey: 'componentId', onDelete: 'CASCADE' });
Listing.belongsTo(Component, { foreignKey: 'componentId' });

// Build - Component (Muchos a Muchos)
// La tabla intermedia 'BuildComponent' será creada automáticamente por Sequelize
Build.belongsToMany(Component, { through: 'BuildComponent' });
Component.belongsToMany(Build, { through: 'BuildComponent' });


// Creamos un objeto 'db' para exportar todos los modelos y la instancia de sequelize
const db = {
  sequelize,
  User,
  Component,
  Listing,
  Build,
};

export default db;
