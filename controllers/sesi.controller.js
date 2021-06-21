const db = require('../models')
const responseUtil = require('../utils/response')
const handleInternalError = require('./errorHandler')
const path = '/sesi'

module.exports.findSesi = async (active) => {
  let condition = {}
  if(active) condition.active = active
  try {
    const sesi = await await db.models.Sesi.findAll({where: condition})
    return responseUtil.success({sesi})
  }
  catch (e) {
    return handleInternalError(e.toString(), `${path}/find`)
  }
}

module.exports.addSesi = async (nama) => {
  if(!nama) return responseUtil.missingData()
  try {
    const sesi = await db.models.Sesi.create({nama, active: false})
    return responseUtil.success({sesi})
  }
  catch (e) {
    //handle error
    return handleInternalError(e.toString(), `${path}/create`)
  }
}

module.exports.deleteSesi = async (sesi_id) => {
  if (!sesi_id) return responseUtil.missingData()
  try {
    await db.models.Sesi.destroy({where: {sesi_id}})
    return responseUtil.success()
  }
  catch (e) {
    //handle error
    return handleInternalError(e.toString(), `${path}/delete`)
  }
}

module.exports.setActive = async (sesi_id) => {
  if (!sesi_id) return responseUtil.missingData()
  const transaction = await db.dbInstance.transaction()
  try{
    await db.models.Sesi.update({active: false}, {where: {}, transaction})
    await db.models.Sesi.update({active: true}, {where: {sesi_id}, transaction})
    await transaction.commit()
    return responseUtil.success()
  }
  catch (e) {
    //transaction rollback
    await transaction.rollback()
    //handle error
    return handleInternalError(e.toString(), `${path}/set-status`)
  }
}