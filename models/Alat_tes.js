module.exports = (sequelize, DataTypes) => {
  const Alat_tes = sequelize.define('Alat_tes',
    {
      alat_tes_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nama: {
        type: DataTypes.STRING,
        allowNull: false
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {
      tableName: 'alat_tes'
    }
  )

  Alat_tes.associate = ({Kelompok_tes, User_tes}) => {
    Alat_tes.hasMany(Kelompok_tes, {foreignKey: 'alat_tes_id', as: 'kategori'})
    Alat_tes.hasMany(User_tes, {foreignKey: 'alat_tes_id', as: 'user_tes'})
  }

  return Alat_tes
}