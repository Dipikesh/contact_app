const logger = require('../config/logger')
const tokenService = require('../services/token.services')
const validation = require('../validation/user.validation')
const createError = require(`http-errors`)
const hashing = require('../utils/generate')
const db = require('../model')
const User = db.users
const Contact = db.contact

//Login User by verifying email and password and sign in the jwt tokenService

exports.login = async (req, res, next) => {
  try {
    //validating login credentials 

    const result = await validation
      .login()
      .validateAsync(req.body, { abortEarly: false });

    const { email, password } = result
    console.log("Result",result);
    // Find whether email is register or not.
    const response = await User.findOne({ where: { email } });
    //if email is not registered, response will be null
    if (!response)
      return res.status(404).json({ message: 'User does not exist' })
    console.log('response', response.hash,response.salt)
    //if email exist, get the hash and salt to validate password
    const { hash, salt } = response;
    if (!hashing.validatePassword(password, hash, salt))
      return res.status(401).json({ message: 'Invalid credentials' });
    
    //if user credentials matches, then signToken
    const token = await tokenService.signToken(response)
    if (token) {
      res.cookie('authorization', token, {
        maxAge: 1000 * 60 * 60 * 24 * 1,
        httpOnly: true
      })

      return res.status(200).json({ status:"sucess",message: 'User Logined Successfully',data:{token} })
    } else {
      return res.status(403).json({ message: 'User Logined Failure' })
    }
  } catch (err) {
    logger.error(err)
    next(err)
  }
}

//Middleware to authenticate user and jwt token

exports.registerUser = async (req, res, next) => {
  try {
    //validate the user request
    const result = await validation
  .register()
  .validateAsync(req.body, { abortEarly: false })

    const { email, name, password } = result;
//check if the user already exists
    const isEmailExist = await User.findOne({ where: { email } });
  //if exists send the error message
    if (isEmailExist) {
      throw createError(400, "Email already exists");
    }

    //encrypt the password and save hash, salt to database
    const { hash, salt } = await hashing.genPassword(password)

    const user_detail = {
      role: 'user',
      name,
      email,
      hash,
      salt
    }
    // Save User in the database
    const data = await User.create(user_detail)
    logger.info('data', data)
    res
      .status(200)
      .json({ status: 'success', message: 'Successfully registerUser' })
  } catch (err) {
    logger.error(err)
    next(err)
  }
}

exports.updateUserProfile = async (req, res, next) => {
  try {

    const  id = res.locals.payload.sub.id
    
    const dataToUpdate = {}
    if (req.body.name) dataToUpdate.name = req.body.name
    if (req.body.password) dataToUpdate.password = req.body.password
    console.log(res.locals.payload)

    //find User BY id
    const user = await User.findByPk(id)
    if (!user) throw createError(404, 'User Not Found')
    const result = await User.update(dataToUpdate, { where: { id: id } })
    res.status(200).json({ status: 'Success', message: result })
  } catch (err) {
    console.log('err', err)
    res.status(500).json({ status: 'Error', message: err })
  }
}



exports.getUserInfo = async (req, res, next) => {
  try {
    const data = {}

    const userProfile = await User.findAll({
      attributes: { exclude: ['hash','salt'] }
    })

    return res.status(200).json({ status: 'success', data: userProfile })
  } catch (err) {
    console.log('Error', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

exports.deleteUser = async (req, res, next) => {
  try {
    const id = req.body.id

    const deleteUser = await User.destroy({
      where: {
        id
      }
    })
    const deleteContact = await Contact.destroy({ where: { userId: id } });
    res.status(200).json({status: 'success',message: "User data deleted successfully deleted"})
  } catch (err) {
    next(err)
  }
}
