'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addIndex('orders', ['createdAt', 'status'], {
      name: 'idx_orders_createdAt_status',
    });
    await queryInterface.addIndex('products', ['createdAt', 'id'], {
      name: 'idx_products_createdAt_id',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('orders', 'idx_orders_createdAt_status');
    await queryInterface.removeIndex('products', 'idx_products_createdAt_id');
  }
};
