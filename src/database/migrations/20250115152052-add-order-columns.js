module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('orders', 'address', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn('orders', 'location', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
  
  down: async (queryInterface) => {
    await queryInterface.removeColumn('orders', 'address');
    await queryInterface.removeColumn('orders', 'location');
  }
};
