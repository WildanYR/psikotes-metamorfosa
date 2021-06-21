const router = require('express').Router()
const logger = require('../utils/logger')
const authMiddleware = require('../middlewares/auth_middleware')
const responseUtil = require('../utils/response')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const url = '/image'

//load multer for handling file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../images')
    fs.mkdir(dir, {recursive: true}, (err) => {
      if(err) throw err
    })
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    const filename = (Date.now()).toString() + '.' + file.originalname.split('.')[1]
    cb(null, filename)
  }
})
const upload = multer({storage}).single('image')

router.get('/', [authMiddleware.checkLogin()], (req, res) => {
  const images = fs.readdirSync(path.join(__dirname, '../images')).map(img => '/images/'+img)
  return res.status(200).json({images})
})

router.post('/', [authMiddleware.checkLogin(), authMiddleware.checkRole('admin')], (req, res) => {
  upload(req, res, (err) => {
    // A Multer error occurred when uploading.
    if (err instanceof multer.MulterError) {
      const errString = err.toString()
      //log error
      logger.error(errString, {path: url})
      //response error
      const resp = responseUtil.badRequest(errString)
      return res.status(resp.code).json(resp.response)
    }
    // An unknown error occurred when uploading.
    else if (err) {
      //log error
      logger.error(err.toString(), {path: url})
      //response error
      const resp = responseUtil.internalServerError()
      return res.status(resp.code).json(resp.response)
    }
    //upload success
    const resp = responseUtil.success({path: '/images/'+req.file.filename})
    return res.status(resp.code).json(resp.response)
  })
})

module.exports = {url, router}