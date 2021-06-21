const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const config = require('../config')
const Sequelize = require('sequelize')

const sequelizeInstance = new Sequelize(config.database.database, config.database.username, config.database.password, config.database)

let models = []

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0 && (file !== basename) && (file.slice(-3) === '.js'))
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelizeInstance, Sequelize.DataTypes)
    models[model.name] = model
  })

Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
})

const db = {
  Sequelize,
  sequelizeInstance,
  models
}

module.exports = db