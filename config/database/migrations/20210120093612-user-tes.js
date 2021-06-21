'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_tes', {
      user_tes_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: Sequelize.INTEGER,
      alat_tes_id: Sequelize.INTEGER,
      sesi_id: Sequelize.INTEGER,
    });
    await queryInterface.addConstraint('user_tes', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'user_tes_user_fk',
      references: {
        table: 'user',
        field: 'user_id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    await queryInterface.addConstraint('user_tes', {
      fields: ['alat_tes_id'],
      type: 'foreign key',
      name: 'user_tes_alat_tes_fk',
      references: {
        table: 'alat_tes',
        field: 'alat_tes_id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_tes');
  }
};