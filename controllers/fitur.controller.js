const db = require('../models')
const responseUtil = require('../utils/response')
const handleInternalError = require('./errorHandler')
const path = '/fitur'

module.exports.findFitur = async (nama) => {
  let condition = {}
  if(nama) condition.nama = nama
  try {
    let fitur = null
    if(nama){
      fitur = await db.models.Fitur.findOne({where: {nama}})
    }else{
      fitur = await db.models.Fitur.findAll()
    }
    return responseUtil.success({fitur})
  }
  catch (e) {
    return handleInternalError(e.toString, `${path}/find`)
  }
}

module.exports.setFitur = async (nama, value) => {
  if (!(nama && value)) throw responseUtil.missingData()
  try {
    await db.models.Fitur.update({value}, {where: {nama}})
    const fitur = await db.models.Fitur.findOne({where: {nama}})
    return responseUtil.success({fitur})
  }
  catch (e) {
    return handleInternalError(e.toString, `${path}/set`)
  }
}