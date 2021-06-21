const router = require('express').Router()
const authMiddleware = require('../middlewares/auth_middleware')
const authController = require('../controllers/auth.controller')
//################################################################################
//login endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const result = await authController.login(email, password)
  res.status(result.code).json(result.response)
})
//################################################################################
//register endpoint
router.post('/register', async (req, res) => {
  const { email, password, nama_lengkap, tempat_lahir, tanggal_lahir, jenis_kelamin, alamat, agama, pendidikan_terakhir } = req.body
  const result = await authController.register(email, password, 'user', nama_lengkap, tempat_lahir, tanggal_lahir, jenis_kelamin, alamat, agama, pendidikan_terakhir)
  res.status(result.code).json(result.response)
})
//################################################################################
//change admin endpoint
router.patch('/user/admin', [authMiddleware.checkLogin(), authMiddleware.checkRole('admin')], async (req, res) => {
  const { email, password, new_password } = req.body
  const result = await authController.changeAdmin(res.locals.decodedToken.email, email, password, new_password)
  res.status(result.code).json(result.response)
})

module.exports = { url: '/auth', router }