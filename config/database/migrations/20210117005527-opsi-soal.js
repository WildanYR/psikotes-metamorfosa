'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('opsi_soal', {
      opsi_soal_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      opsi: {
        type: Sequelize.STRING,
        allowNull: false
      },
      text: {
        type: Sequelize.STRING,
        allowNull: false
      },
      soal_id: Sequelize.STRING
    });
    await queryInterface.addConstraint('opsi_soal', {
      fields: ['soal_id'],
      type: 'foreign key',
      name: 'opsi_soal_soal_fk',
      references: {
        table: 'soal',
        field: 'soal_id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('opsi_soal');
  }
};