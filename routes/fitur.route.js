const router = require('express').Router()
const authMiddleware = require('../middlewares/auth_middleware')
const fiturController = require('../controllers/fitur.controller')
//################################################################################
//get fitur endpoint
router.get('/', [authMiddleware.checkLogin()], async (req, res) => {
  const { nama } = req.query
  const result = await fiturController.findFitur(nama)
  res.status(result.code).json(result.response)
})
//################################################################################
//set fitur endpoint
router.post('/', [authMiddleware.checkLogin(), authMiddleware.checkRole('admin')], async (req, res) => {
  const { nama, value } = req.body
  const result = await fiturController.setFitur(nama, value)
  res.status(result.code).json(result.response)
})

module.exports = { url: '/fitur', router }