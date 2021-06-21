module.exports = (sequelize, DataTypes) => {
  const User_tes = sequelize.define('User_tes',
    {
      user_tes_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: DataTypes.INTEGER,
      alat_tes_id: DataTypes.INTEGER,
      sesi_id: DataTypes.INTEGER
    },
    {
      tableName: 'user_tes'
    }
  )

  User_tes.associate = ({User, Alat_tes, Sesi}) => {
    User_tes.belongsTo(User, {foreignKey: 'user_id', as: 'user'})
    User_tes.belongsTo(Alat_tes, {foreignKey: 'alat_tes_id', as: 'alat_tes'})
    User_tes.belongsTo(Sesi, {foreignKey: 'sesi_id', as: 'sesi'})
  }

  return User_tes
}