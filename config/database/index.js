const dbConfig = {
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'database',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  dialect: 'mysql',
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: false,
    underscored: true,
    freezeTableName: true
  },
  logging: process.env.NODE_ENV === 'production' ? false : console.log
}

module.exports = {
  production: dbConfig,
  development: dbConfig,
  test: dbConfig
}