'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('sesi', {
      sesi_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nama: {
        type: Sequelize.STRING,
        allowNull: false
      },
      active: Sequelize.BOOLEAN
    });
    //constraint user_tes ke sesi
    await queryInterface.addConstraint('user_tes', {
      fields: ['sesi_id'],
      type: 'foreign key',
      name: 'user_tes_sesi_fk',
      references: {
        table: 'sesi',
        field: 'sesi_id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });

    await queryInterface.bulkInsert('sesi', [{
      nama: `tes ${(new Date()).toISOString().substr(0, 10)}`,
      active: true,
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('sesi');
  }
};