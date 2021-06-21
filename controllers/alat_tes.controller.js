const db = require('../models')
const responseUtil = require('../utils/response')
const handleInternalError = require('./errorHandler')
const path = 'alat-tes'

module.exports.findAlatTes = async (alat_tes_id, active) => {
  let condition = {}
  if(alat_tes_id) condition.alat_tes_id = alat_tes_id
  if(active) condition.active = true
  try {
    const alat_tes = await db.models.Alat_tes.findAll({where: condition})
    return responseUtil.success({alat_tes})
  }
  catch (e) {
    return handleInternalError(e.toString(), `${path}/find`)
  }
}

module.exports.addAlatTes = async (nama) => {
  if(!nama) return responseUtil.missingData()
  try {
    const alat_tes = await db.models.Alat_tes.create({nama})
    return responseUtil.success({alat_tes})
  }
  catch (e) {
    //handle error
    return handleInternalError(e.toString(), `${path}/create`)
  }
}

module.exports.updateAlatTes = async (alat_tes_id, nama, active) => {
  if(!(alat_tes_id && (nama || active))) return responseUtil.missingData()
  try {
    await db.models.Alat_tes.update({nama, active}, {where: {alat_tes_id}})
    const alat_tes = await db.models.Alat_tes.findAll({where: {alat_tes_id}})
    return responseUtil.success({alat_tes})
  }
  catch (e) {
    //handle error
    return handleInternalError(e.toString(), `${path}/update`)
  }
}

module.exports.deleteAlatTes = async (alat_tes_id) => {
  if (!alat_tes_id) return responseUtil.missingData()
  try {
    await db.models.Alat_tes.destroy({where: {alat_tes_id}})
    return responseUtil.success()
  }
  catch (e) {
    //handle error
    return handleInternalError(e.toString(), `${path}/delete`)
  }
}