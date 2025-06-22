import { DataTypes } from 'sequelize';

/**
 * Defines the Listing model.
 * @param {import('sequelize').Sequelize} sequelize - The Sequelize instance.
 * @returns {import('sequelize').ModelCtor<any>} The Listing model.
 */
export default (sequelize) => {
  const Listing = sequelize.define('Listing', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      comment: 'Unique identifier for the listing.'
    },
    storeName: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Name of the retail store (e.g., Amazon, Newegg).'
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Current price of the component at the store.'
    },
    url: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true,
      },
      comment: 'Direct URL to the product page on the store\'s website.'
    },
    // componentId is added automatically via associations in models/index.js
  }, {
    timestamps: true, // To track when the price was last updated
    tableName: 'Listings'
  });

  return Listing;
};
