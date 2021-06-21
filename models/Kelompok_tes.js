module.exports = (sequelize, DataTypes) => {
  const Kelompok_tes = sequelize.define('Kelompok_tes',
    {
      kelompok_tes_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nama: {
        type: DataTypes.STRING,
        allowNull: false
      },
      waktu: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      jenis_soal: {
        type: DataTypes.STRING,
        allowNull: false
      },
      petunjuk: {
        type: DataTypes.TEXT({length: 'long'}),
        allowNull: false
      },
      alat_tes_id: DataTypes.INTEGER
    },
    {
      tableName: 'kelompok_tes'
    }
  )

  Kelompok_tes.associate = ({Alat_tes, Soal, Petunjuk_pengerjaan}) => {
    Kelompok_tes.hasMany(Soal, {foreignKey: 'kelompok_tes_id', as: 'soal'})
    Kelompok_tes.belongsTo(Alat_tes, {foreignKey: 'alat_tes_id', as: 'alat_tes'})
  }

  return Kelompok_tes
}