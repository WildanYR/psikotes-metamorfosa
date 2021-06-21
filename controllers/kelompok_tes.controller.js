const db = require('../models')
const responseUtil = require('../utils/response')
const handleInternalError = require('./errorHandler')
const path = '/kelompok-tes'

module.exports.findKelompokTes = async (kelompok_tes_id, alat_tes_id) => {
  let condition = {}
  if(kelompok_tes_id) condition.kelompok_tes_id = kelompok_tes_id
  if(alat_tes_id) condition.alat_tes_id = alat_tes_id
  try {
    const kelompok_tes = await db.models.Kelompok_tes.findAll({where: condition})
    return responseUtil.success({kelompok_tes})
  }
  catch (e) {
    return handleInternalError(e.toString(), `${path}/find`)
  }
}

module.exports.addKelompokTes = async (nama, waktu, jenis_soal, petunjuk, alat_tes_id) => {
  if(!(nama && (waktu || waktu === 0) && jenis_soal && petunjuk && alat_tes_id)) return responseUtil.missingData()
  try {
    const kelompok_tes = await db.models.Kelompok_tes.create({nama, waktu, jenis_soal, petunjuk, alat_tes_id})
    return responseUtil.success({kelompok_tes})
  }
  catch (e) {
    //handle error
    return handleInternalError(e.toString(), `${path}/create`)
  }
}

module.exports.updateKelompokTes = async (kelompok_tes_id, nama, waktu, jenis_soal, petunjuk, alat_tes_id) => {
  if(!kelompok_tes_id && !(nama || waktu || jenis_soal || petunjuk || alat_tes_id)) return responseUtil.missingData()
  try {
    await db.models.Kelompok_tes.update({nama, waktu, jenis_soal, petunjuk, alat_tes_id}, {where: {kelompok_tes_id}})
    const kelompok_tes = await db.models.Kelompok_tes.findOne({where: {kelompok_tes_id}})
    return responseUtil.success({kelompok_tes})
  }
  catch (e) {
    //handle error
    return handleInternalError(e.toString(), `${path}/update`)
  }
}

module.exports.deleteKelompokTes = async (kelompok_tes_id) => {
  if (!kelompok_tes_id) return responseUtil.missingData()
  try {
    await db.models.Kelompok_tes.destroy({where: {kelompok_tes_id}})
    return responseUtil.success()
  }
  catch (e) {
    //handle error
    return handleInternalError(e.toString(), `${path}/delete`)
  }
}