const db = require('../models')
const responseUtil = require('../utils/response')
const handleInternalError = require('./errorHandler')
const path = '/soal'

const generateSoalIDs = () => {
  const prefix = Math.random().toString(36).slice(2, 6)
  const dateId = Date.now().toString()
  return prefix + dateId
}

module.exports.findSoal = async (soal_id, kelompok_tes_id, alat_tes_id) => {
  let condition = { soal: {}, kelompok_tes: {} }
  if (soal_id) condition.soal.soal_id = soal_id
  if (kelompok_tes_id) condition.soal.kelompok_tes_id = kelompok_tes_id
  if (alat_tes_id) condition.kelompok_tes.alat_tes_id = alat_tes_id
  try {
    const soal = await db.models.Soal.findAll({
      where: condition.soal,
      include: [
        {
          model: db.models.Opsi_soal,
          as: "opsi",
          attributes: ["opsi", "text"],
        },
        {
          model: db.models.Kelompok_tes,
          where: condition.kelompok_tes,
          as: "kelompok_tes",
          attributes: [],
        },
      ],
      order: [
        ["kelompok_tes_id", "ASC"],
        ["nomor", "ASC"],
        ["opsi", "opsi", "ASC"],
      ],
    })
    return responseUtil.success({ soal })
  } catch (e) {
    //handle error
    return handleInternalError(e.toString(), `${path}/find`)
  }
}

module.exports.upsetSoal = async (data) => {
  const transaction = await db.dbInstance.transaction()
  try {
    let inputData = []
    let opsiArr = []
    let soalIds = []
    let kelompokIds = []
    data.forEach((soalData) => {
      const soal_id = soalData.soal_id || generateSoalIDs()
      soalIds.push(soal_id)
      let soal = {
        soal_id,
        nomor: soalData.nomor,
        soal: soalData.soal,
        kelompok_tes_id: soalData.kelompok_tes_id,
      }
      if (soalData.opsi) {
        opsiArr = soalData.opsi.map(item => {
          return {soal_id, opsi: item.opsi, text: item.text}
        })
      }
      if (!kelompokIds.includes(soalData.kelompok_tes_id)) kelompokIds.push(soalData.kelompok_tes_id)
      inputData.push(soal)
    })
    await db.models.Soal.destroy({
      where: { kelompok_tes_id: { [db.Sequelize.Op.in]: kelompokIds } },
      transaction,
    })
    await db.models.Soal.bulkCreate(inputData, { transaction })
    if (opsiArr.length)
      await db.models.Opsi_soal.bulkCreate(opsiArr, { transaction })
    const soal = await db.models.Soal.findAll({
      where: {soal_id: {[db.Sequelize.Op.in]: soalIds}},
      include: [
        {
          model: db.models.Opsi_soal,
          as: "opsi",
          attributes: ["opsi", "text"],
        },
        {
          model: db.models.Kelompok_tes,
          as: "kelompok_tes",
          attributes: [],
        },
      ],
      order: [
        ["kelompok_tes_id", "ASC"],
        ["nomor", "ASC"],
        ["opsi", "opsi", "ASC"],
      ],
      transaction
    })
    await transaction.commit()
    return responseUtil.success({ soal })
  } catch (e) {
    //transaction rollback
    await transaction.rollback()
    //handle error
    return handleInternalError(e.toString(), `${path}/upset`)
  }
}

module.exports.deleteSoal = async (soal_id) => {
  if (!soal_id) return responseUtil.missingData()
  try {
    await db.models.Soal.destroy({ where: { soal_id }})
    return responseUtil.success()
  } catch (e) {
    //handle error
    return handleInternalError(e.toString(), `${path}/delete`)
  }
}