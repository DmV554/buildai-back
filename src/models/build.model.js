import { DataTypes } from 'sequelize';

/**
 * Defines the Build model.
 * @param {import('sequelize').Sequelize} sequelize - The Sequelize instance.
 * @returns {import('sequelize').ModelCtor<any>} The Build model.
 */
export default (sequelize) => {
  const Build = sequelize.define('Build', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      comment: 'Unique identifier for the build.'
    },
    buildName: {
      type: DataTypes.STRING,
      defaultValue: 'Mi Nueva Configuración',
      comment: 'User-defined name for the build.'
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      comment: 'Calculated total price of all components in the build.'
    },
    // userId is added automatically via associations in models/index.js
  }, {
    timestamps: true,
    tableName: 'Builds'
  });

  return Build;
};
