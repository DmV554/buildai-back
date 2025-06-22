import { DataTypes } from 'sequelize';

/**
 * Defines the Component model.
 * @param {import('sequelize').Sequelize} sequelize - The Sequelize instance.
 * @returns {import('sequelize').ModelCtor<any>} The Component model.
 */
export default (sequelize) => {
  const Component = sequelize.define('Component', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      comment: 'Unique identifier for the component.'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Name of the component (e.g., NVIDIA RTX 4070 Super).'
    },
    componentType: {
      type: DataTypes.ENUM('CPU', 'GPU', 'Motherboard', 'RAM', 'PSU', 'SSD', 'Case', 'Cooler'),
      allowNull: false,
      comment: 'The type of the hardware component.'
    },
    brand: {
      type: DataTypes.STRING,
      comment: 'The manufacturer brand (e.g., NVIDIA, AMD, Corsair).'
    },
    // Key specifications for compatibility and recommendation logic
    socket: {
      type: DataTypes.STRING,
      comment: 'CPU socket type (e.g., AM5, LGA1700), crucial for CPU/Motherboard compatibility.'
    },
    memoryType: {
      type: DataTypes.STRING,
      comment: 'Memory type (e.g., DDR5, DDR4), for Motherboard/RAM compatibility.'
    },
    // Scores for the recommendation engine (AI or algorithmic)
    performanceScore: {
      type: DataTypes.INTEGER,
      comment: 'A general performance score based on benchmarks.'
    },
    gamingScore: {
      type: DataTypes.INTEGER,
      comment: 'A specific performance score for gaming scenarios.'
    },
    workstationScore: {
      type: DataTypes.INTEGER,
      comment: 'A specific performance score for professional/workstation tasks.'
    },
  }, {
    timestamps: true,
    tableName: 'Components'
  });

  return Component;
};
