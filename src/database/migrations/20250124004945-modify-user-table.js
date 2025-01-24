'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Modify the table by adding googleId and making password nullable
    await queryInterface.addColumn('users', 'googleId', {
      type: Sequelize.STRING,
      allowNull: true,  // Google ID is optional
    });

    await queryInterface.changeColumn('users', 'password', {
      type: Sequelize.STRING,
      allowNull: true,  // Make password nullable
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Rollback changes (remove googleId and make password non-nullable again)
    await queryInterface.removeColumn('users', 'googleId');

    await queryInterface.changeColumn('users', 'password', {
      type: Sequelize.STRING,
      allowNull: false,  // Reverting password to non-nullable
    });
  }
};
