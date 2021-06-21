module.exports = (sequelize, DataTypes) => {
  const Opsi_soal = sequelize.define('Opsi_soal',
    {
      opsi_soal_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      opsi: {
        type: DataTypes.STRING,
        allowNull: false
      },
      text: {
        type: DataTypes.STRING,
        allowNull: false
      },
      soal_id: DataTypes.INTEGER
    },
    {
      tableName: 'opsi_soal'
    }
  )

  Opsi_soal.associate = ({Soal}) => {
    Opsi_soal.belongsTo(Soal, {foreignKey: 'soal_id', as: 'soal'})
  }

  return Opsi_soal
}