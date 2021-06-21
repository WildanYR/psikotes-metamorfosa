'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('profil', {
      profil_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nama_lengkap: Sequelize.STRING,
      tempat_lahir: Sequelize.STRING,
      tanggal_lahir: Sequelize.STRING,
      jenis_kelamin: Sequelize.STRING,
      alamat: Sequelize.STRING,
      agama: Sequelize.STRING,
      pendidikan_terakhir: Sequelize.STRING,
      user_id: Sequelize.INTEGER
    });

    await queryInterface.addConstraint('profil', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'profil_user_fk',
      references: {
        table: 'user',
        field: 'user_id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('profil');
  }
};