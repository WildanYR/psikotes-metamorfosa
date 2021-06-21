const router = require('express').Router()
const authMiddleware = require('../middlewares/auth_middleware')
const alatTesController = require('../controllers/alat_tes.controller')
//################################################################################
//get alat tes endpoint
router.get('/', [authMiddleware.checkLogin(), authMiddleware.checkRole('admin')], async (req, res) => {
  const { alat_tes_id, active } = req.query
  const result = await alatTesController.findAlatTes(alat_tes_id, active)
  res.status(result.code).json(result.response)
})
//################################################################################
//add alat tes endpoint
router.post('/', [authMiddleware.checkLogin(), authMiddleware.checkRole('admin')], async (req, res) => {
  const { nama } = req.body
  const result = await alatTesController.addAlatTes(nama)
  res.status(result.code).json(result.response)
})
//################################################################################
//update alat tes endpoint
router.patch('/:alat_tes_id', [authMiddleware.checkLogin(), authMiddleware.checkRole('admin')], async (req, res) => {
  const { nama, active } = req.body
  const result = await alatTesController.updateAlatTes(req.params.alat_tes_id, nama, active)
  res.status(result.code).json(result.response)
})
//################################################################################
//delete alat tes endpoint
router.delete('/:alat_tes_id', [authMiddleware.checkLogin(), authMiddleware.checkRole('admin')], async (req, res) => {
  const result = await alatTesController.deleteAlatTes(req.params.alat_tes_id)
  res.status(result.code).json(result.response)
})

module.exports = { url: '/alat-tes', router }