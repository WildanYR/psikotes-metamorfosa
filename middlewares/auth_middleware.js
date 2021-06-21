const config = require('../config')
const logger = require('../utils/logger')
const responseUtil = require('../utils/response')
const jwt = require('jsonwebtoken')

const checkLogin = () => {
  return (req, res, next) => {
    //get token dari request header
    const bearer = req.header('Authorization')
    const token = bearer? bearer.split(' ')[1] : undefined
    //jika tidak ada token
    if(!token){
      const response = responseUtil.badRequest('silahkan login')
      return res.status(response.code).json(response.response)
    }
    //cek kesalahan token
    jwt.verify(token, config.jwt.secret, (err) => {
      if(err){
        //jika token invalid
        if(err.name == 'JsonWebTokenError'){
          const response = responseUtil.badRequest('token invalid')
          return res.status(response.code).json(response.response)
        }
        //jika token expired
        if(err.name == 'TokenExpiredError'){
          const response = responseUtil.badRequest('silahkan login kembali')
          return res.status(response.code).json(response.response)
        }
        //jika error undefined
        const response = responseUtil.internalServerError()
        //log error
        logger.error(err.name, {message: err.message, requesterIP: req.ip, user_agent: req.header('User-Agent')})
        //response error
        console.log('cek login')
        return res.status(response.code).json(response.response)
      }
    })
    //decode token
    const decodedToken = jwt.decode(token)
    //masukkan decodedToken ke request data
    res.locals.decodedToken = decodedToken
    //next middleware
    next()
  }
}

const checkRole = (role) => {
  return (req, res, next) => {
    if(res.locals.decodedToken.role !== role){
      const response = responseUtil.forbidden()
      return res.status(response.code).json(response.response)
    }
    next()
  }
}

module.exports = {checkLogin, checkRole}