'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('kelompok_tes', {
      kelompok_tes_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nama: {
        type: Sequelize.STRING,
        allowNull: false
      },
      waktu: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      jenis_soal: {
        type: Sequelize.STRING,
        allowNull: false
      },
      petunjuk: {
        type: Sequelize.TEXT({length: 'long'}),
        allowNull: false
      },
      alat_tes_id: Sequelize.INTEGER
    });
    await queryInterface.addConstraint('kelompok_tes', {
      fields: ['alat_tes_id'],
      type: 'foreign key',
      name: 'kelompok_tes_alat_tes_fk',
      references: {
        table: 'alat_tes',
        field: 'alat_tes_id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('kelompok_tes');
  }
};