module.exports = {
  HOST: process.env.HOST,
  USER: process.env.USER_NAME,
  PASSWORD: process.env.PASSWORD,
  DB: process.env.DB,
  dialect: process.env.dialect,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  ssl: true
}
