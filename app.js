const cors = require('cors')
const express = require('express')
const createError = require(`http-errors`)
var cookieParser = require('cookie-parser')
const logger = require('./config/logger')
const httpLogger = require('./config/httpLogger')
const helmet = require('helmet');
const bp = require('body-parser')

const app = express()
require('dotenv').config()

const db = require('./model')
db.sequelize.sync({ force: false}).then(() => {
  console.log('Drop and re-sync db.')
});


app.use(cors({ credentials: true, origin: '*', exposedHeaders: '*' }))

app.use(helmet())
app.use(httpLogger)

app.use(cookieParser())
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

// Routes
app.use('/', (require('./routes')));

app.use((req, res, next) => {
  next(createError.NotFound())
})

//Error Handler
app.use((err, req, res, next) => {
  logger.error(err)
  if (!isOperational(err)) {
    logger.error(`shutting down due to ${err.stack}`)
    process.exit(1)
  } else {
    res.status(err.status || 500)
    res.send({
      error: {
        status: err.status || 500,
        message: err.message
      }
    })
  }
})

const isOperational = err => {
  const errorType = createError.isHttpError(err)

  if (errorType || err.isJoi) return true
  else return false
}

//Exposing port
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  logger.info(`listening on port ${PORT}`)
})
