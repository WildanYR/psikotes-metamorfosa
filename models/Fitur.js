module.exports = (sequelize, DataTypes) => {
  const Fitur = sequelize.define('Fitur',
    {
      fitur_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nama: {
        type: DataTypes.STRING,
        allowNull: false
      },
      value: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      tableName: 'fitur'
    }
  )

  // Alat_tes.associate = ({Kelompok_tes, User_tes}) => {
  //   Alat_tes.hasMany(Kelompok_tes, {foreignKey: 'alat_tes_id', as: 'kategori'})
  //   Alat_tes.hasMany(User_tes, {foreignKey: 'alat_tes_id', as: 'user_tes'})
  // }

  return Fitur
}