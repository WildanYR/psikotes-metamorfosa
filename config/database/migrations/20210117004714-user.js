'use strict';
const md5 = require('md5')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user', {
      user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: {isEmail: true}
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      role: Sequelize.STRING
    });

    await queryInterface.bulkInsert('user', [{
      email: 'admin@metamorfosa.com',
      password: md5('admin'),
      role: 'admin',
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user');
  }
};