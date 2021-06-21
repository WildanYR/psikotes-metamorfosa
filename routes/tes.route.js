const router = require('express').Router()
const authMiddleware = require('../middlewares/auth_middleware')
const tesController = require('../controllers/tes.controller')

//################################################################################
//get soal untuk dikerjakan
router.get('/:alat_tes_id', [authMiddleware.checkLogin()], async (req, res) => {
  const { kelompok_tes } = req.query
  const { user_id } = res.locals.decodedToken
  const result = await tesController.getTes(user_id, req.params.alat_tes_id, kelompok_tes)
  res.status(result.code).json(result.response)
})
//################################################################################
//submit jawaban endpoint
router.post('/submit/jawaban', [authMiddleware.checkLogin()], async (req, res) => {
  const { jawaban } = req.body
  const { user_id } = res.locals.decodedToken
  const result = await tesController.submitJawaban(user_id, jawaban)
  res.status(result.code).json(result.response)
})
//################################################################################
//submit soal / selesai mengerjakan soal endpoint
router.post('/submit/:alat_tes_id', [authMiddleware.checkLogin()], async (req, res) => {
  const { user_id } = res.locals.decodedToken
  const result = await tesController.submitSoal(user_id, req.params.alat_tes_id)
  res.status(result.code).json(result.response)
})
//################################################################################
//get status user sudah/belum mengerjakan alat tes endpoint
router.get('/selesai', [authMiddleware.checkLogin()], async (req, res) => {
  const { user_id } = res.locals.decodedToken
  const result = await tesController.alatTesUser(user_id)
  res.status(result.code).json(result.response)
})
//################################################################################
//get user yang sudah mengerjakan soal dalam sesi endpoint
router.get('/:alat_tes_id/sesi/:sesi_id', [authMiddleware.checkLogin(), authMiddleware.checkRole('admin')], async (req, res) => {
  const result = await tesController.getUsersSesi(req.params.alat_tes_id, req.params.sesi_id)
  res.status(result.code).json(result.response)
})
//################################################################################
//get jawaban user dari soal yang sudah dikerjakan endpoint
router.get('/jawaban/:alat_tes_id/user/:user_id', [authMiddleware.checkLogin(), authMiddleware.checkRole('admin')], async (req, res) => {
  const {sesi_id} = req.query
  const result = await tesController.getJawabanUser(req.params.alat_tes_id, req.params.user_id, sesi_id)
  res.status(result.code).json(result.response)
})

module.exports = { url: '/tes', router }