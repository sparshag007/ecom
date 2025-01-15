'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('products', 'active', {
      type: Sequelize.BOOLEAN,
      defaultValue: true, // Default value is true
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('products', 'active');
  },
};
