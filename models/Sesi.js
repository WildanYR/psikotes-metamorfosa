module.exports = (sequelize, DataTypes) => {
  const Sesi = sequelize.define('Sesi',
    {
      sesi_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nama: {
        type: DataTypes.STRING,
        allowNull: false
      },
      active: DataTypes.BOOLEAN
    },
    {
      tableName: 'sesi'
    }
  )

  Sesi.associate = ({User_tes}) => {
    Sesi.hasMany(User_tes, {foreignKey: 'sesi_id', as: 'user_tes'})
  }

  return Sesi
}