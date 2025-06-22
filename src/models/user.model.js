import { DataTypes } from 'sequelize';

/**
 * Defines the User model.
 * @param {import('sequelize').Sequelize} sequelize - The Sequelize instance.
 * @returns {import('sequelize').ModelCtor<any>} The User model.
 */
export default (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      comment: 'Unique identifier for the user.'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'First name of the user.'
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Last name of the user.'
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
      comment: 'Unique email address for the user.'
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Hashed password for security.'
    },
    experienceLevel: {
      type: DataTypes.ENUM('Principiante', 'Intermedio', 'Avanzado'),
      comment: 'User\'s self-reported experience level with PC building.'
    },
    bio: {
      type: DataTypes.TEXT,
      comment: 'A short biography or description of the user.'
    },
  }, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    tableName: 'Users'
  });

  return User;
};
