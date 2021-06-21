module.exports = (sequelize, DataTypes) => {
  const Profil = sequelize.define('Profil',
    {
      profil_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nama_lengkap: DataTypes.STRING,
      tempat_lahir: DataTypes.STRING,
      tanggal_lahir: DataTypes.STRING,
      jenis_kelamin: DataTypes.STRING,
      alamat: DataTypes.STRING,
      agama: DataTypes.STRING,
      pendidikan_terakhir: DataTypes.STRING
    },
    {
      tableName: 'profil'
    }
  )

  Profil.associate = ({User}) => {
    Profil.belongsTo(User, {foreignKey: 'user_id', as: 'user'})
  }

  return Profil
}