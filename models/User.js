module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User',
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {isEmail: true}
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      role: DataTypes.STRING
    },
    {
      tableName: 'user'
    }
  )

  User.associate = ({Jawaban_user, User_tes, Profil}) => {
    User.hasMany(Jawaban_user, {foreignKey: 'user_id', as: 'jawaban'})
    User.hasMany(User_tes, {foreignKey: 'user_id', as: 'user_tes'})
    User.hasOne(Profil, {foreignKey: 'user_id', as: 'profil'})
  }

  return User
}