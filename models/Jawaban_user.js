module.exports = (sequelize, DataTypes) => {
  const Jawaban_user = sequelize.define('Jawaban_user',
    {
      jawaban_user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      jawaban: {
        type: DataTypes.STRING,
        allowNull: false
      },
      user_id: DataTypes.INTEGER,
      soal_id: DataTypes.STRING
    },
    {
      tableName: 'jawaban_user'
    }
  )

  Jawaban_user.associate = ({User, Soal}) => {
    Jawaban_user.belongsTo(User, {foreignKey: 'user_id', as: 'user'})
    Jawaban_user.belongsTo(Soal, {foreignKey: 'soal_id', as: 'soal'})
  }

  return Jawaban_user
}