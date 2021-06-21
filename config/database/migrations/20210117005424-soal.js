'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('soal', {
      soal_id: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      nomor: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      soal: Sequelize.TEXT({length: 'long'}),
      kelompok_tes_id: Sequelize.INTEGER
    });
    await queryInterface.addConstraint('soal', {
      fields: ['kelompok_tes_id'],
      type: 'foreign key',
      name: 'soal_kelompok_tes_fk',
      references: {
        table: 'kelompok_tes',
        field: 'kelompok_tes_id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('soal');
  }
};