const tokenService = require('../services/token.services')
const createError = require(`http-errors`)

//This middleware will validate the user's jwt token
exports.authenticate = async (req, res, next) => {
    try {
      //check if authorization header exist
    const data = req.headers[`authorization`]
    if (!data) {
      throw createError.BadRequest({ message: `Token not found` })
    }
        //splitting token to seperate bearer and token value
    const token = data.split(' ')[1]
    console.log('token', token)

    const isVerified = await tokenService.verifyToken(res, token)
    next()
  } catch (err) {
    next(err)
  }
}

//checking the user is admin or not
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

//checking whether the user is normal user 
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
