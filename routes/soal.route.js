const router = require('express').Router()
const authMiddleware = require('../middlewares/auth_middleware')
const soalController = require('../controllers/soal.controller')
//################################################################################
//get soal endpoint
router.get('/', [authMiddleware.checkLogin(), authMiddleware.checkRole('admin')], async (req, res) => {
  const { soal_id, kelompok_tes_id, alat_tes_id } = req.query
  const result = await soalController.findSoal(soal_id, kelompok_tes_id, alat_tes_id)
  res.status(result.code).json(result.response)
})
//################################################################################
//upset soal endpoint
router.put('/', [authMiddleware.checkLogin(), authMiddleware.checkRole('admin')], async (req, res) => {
  const { soals } = req.body
  const result = await soalController.upsetSoal(soals)
  res.status(result.code).json(result.response)
})
//################################################################################
//delete soal endpoint
router.delete('/:soal_id', [authMiddleware.checkLogin(), authMiddleware.checkRole('admin')], async (req, res) => {
  const result = await soalController.deleteSoal(req.params.soal_id)
  res.status(result.code).json(result.response)
})

module.exports = { url: '/soal', router }