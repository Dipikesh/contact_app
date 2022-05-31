const dbConfig = require('../config/db.config.js')
const Sequelize = require('sequelize')
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  },
  dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
     },
})
const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize
db.users = require('./user.model.js')(sequelize, Sequelize)
db.contact = require('./contact.model.js')(sequelize, Sequelize)
module.exports = db
