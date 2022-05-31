const logger = require('../config/logger')
const tokenService = require('../services/token.services')
const createError = require(`http-errors`)
exports.authenticate = async (req, res, next) => {
  try {
    const data = req.headers[`authorization`]
    if (!data) {
      throw createError.BadRequest({ message: `Token not found` })
    }
    const token = data.split(' ')[1]
    console.log('token', token)

    const isVerified = await tokenService.verifyToken(res, token)
    next()
  } catch (err) {
    next(err)
  }
}


exports.isAdmin = async (req, res,next) => {
  try {
    if (res.locals.payload.sub.role === 'admin') {
      next()
    } else {
      throw createError(401, 'Permission Denied')
    }
  } catch (err) {
    next(err)
  }
}

exports.isUser = async (req, res,next) => {
    try {
  if (res.locals.payload.sub.role === 'user') {
    next()
  } else {
    throw createError(401, 'Permission Denied')
  }
} catch (err) {
  next(err)
}

}
