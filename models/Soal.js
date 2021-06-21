module.exports = (sequelize, DataTypes) => {
  const Soal = sequelize.define('Soal',
    {
      soal_id: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      nomor: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      soal: DataTypes.TEXT({length: 'long'}),
      kelompok_tes_id: DataTypes.INTEGER
    },
    {
      tableName: 'soal'
    }
  )

  Soal.associate = ({Kelompok_tes, Opsi_soal, Jawaban_user}) => {
    Soal.hasMany(Opsi_soal, {foreignKey: 'soal_id', as: 'opsi'})
    Soal.hasMany(Jawaban_user, {foreignKey: 'soal_id', as: 'jawaban'})
    Soal.belongsTo(Kelompok_tes, {foreignKey: 'kelompok_tes_id', as: 'kelompok_tes'})
  }

  return Soal
}