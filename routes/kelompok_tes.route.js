const router = require('express').Router()
const authMiddleware = require('../middlewares/auth_middleware')
const kelompokTesController = require('../controllers/kelompok_tes.controller')
//################################################################################
//get kelompok tes endpoint
router.get('/', [authMiddleware.checkLogin(), authMiddleware.checkRole('admin')], async (req, res) => {
  const { kelompok_tes_id, alat_tes_id } = req.query
  const result = await kelompokTesController.findKelompokTes(kelompok_tes_id, alat_tes_id)
  res.status(result.code).json(result.response)
})
//################################################################################
//add kelompok tes endpoint
router.post('/', [authMiddleware.checkLogin(), authMiddleware.checkRole('admin')], async (req, res) => {
  const { nama, waktu, jenis_soal, petunjuk, alat_tes_id } = req.body
  const result = await kelompokTesController.addKelompokTes(nama, waktu, jenis_soal, petunjuk, alat_tes_id)
  res.status(result.code).json(result.response)
})
//################################################################################
//update kelompok tes endpoint
router.patch('/:kelompok_tes_id', [authMiddleware.checkLogin(), authMiddleware.checkRole('admin')], async (req, res) => {
  const { nama, waktu, jenis_soal, petunjuk } = req.body
  const result = await kelompokTesController.updateKelompokTes(req.params.kelompok_tes_id, nama, waktu, jenis_soal, petunjuk)
  res.status(result.code).json(result.response)
})
//################################################################################
//delete kelompok tes endpoint
router.delete('/:kelompok_tes_id', [authMiddleware.checkLogin(), authMiddleware.checkRole('admin')], async (req, res) => {
  const result = await kelompokTesController.deleteKelompokTes(req.params.kelompok_tes_id)
  res.status(result.code).json(result.response)
})

module.exports = { url: '/kelompok-tes', router }