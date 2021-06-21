'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('fitur', {
      fitur_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nama: {
        type: Sequelize.STRING,
        allowNull: false
      },
      value: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });
    await queryInterface.bulkInsert('fitur', [
      {
        nama: 'tes_aktif',
        value: '1'
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('fitur');
  }
};