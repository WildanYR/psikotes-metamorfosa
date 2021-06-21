'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('jawaban_user', {
      jawaban_user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      jawaban: {
        type: Sequelize.STRING,
        allowNull: false
      },
      soal_id: Sequelize.STRING,
      user_id: Sequelize.INTEGER
    });
    await queryInterface.addConstraint('jawaban_user', {
      fields: ['soal_id'],
      type: 'foreign key',
      name: 'jawaban_user_soal_fk',
      references: {
        table: 'soal',
        field: 'soal_id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    await queryInterface.addConstraint('jawaban_user', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'jawaban_user_user_fk',
      references: {
        table: 'user',
        field: 'user_id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('jawaban_user');
  }
};