const router = require('express').Router()
const authMiddleware = require('../middlewares/auth_middleware')
const sesiController = require('../controllers/sesi.controller')
//################################################################################
//get sesi endpoint
router.get('/', [authMiddleware.checkLogin(), authMiddleware.checkRole('admin')], async (req, res) => {
  const { active } = req.query
  const result = await sesiController.findSesi(active)
  res.status(result.code).json(result.response)
})
//################################################################################
//add sesi endpoint
router.post('/', [authMiddleware.checkLogin(), authMiddleware.checkRole('admin')], async (req, res) => {
  const { nama } = req.body
  const result = await sesiController.addSesi(nama)
  res.status(result.code).json(result.response)
})
//################################################################################
//set sesi jadi aktif endpoint
router.patch('/aktif/:sesi_id', [authMiddleware.checkLogin(), authMiddleware.checkRole('admin')], async (req, res) => {
  const result = await sesiController.setActive(req.params.sesi_id)
  res.status(result.code).json(result.response)
})
//################################################################################
//delete sesi endpoint
router.delete('/:sesi_id', [authMiddleware.checkLogin(), authMiddleware.checkRole('admin')], async (req, res) => {
  const result = await sesiController.deleteSesi(req.params.sesi_id)
  res.status(result.code).json(result.response)
})

module.exports = { url: '/sesi', router }