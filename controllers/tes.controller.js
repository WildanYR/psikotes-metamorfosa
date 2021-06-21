const db = require('../models')
const responseUtil = require('../utils/response')
const handleInternalError = require('./errorHandler')
const path = '/tes'

module.exports.getTes = async (user_id, alat_tes_id, urutan_kelompok_tes) => {
  if (!(user_id && alat_tes_id)) return responseUtil.missingData()
  if(urutan_kelompok_tes) urutan_kelompok_tes = urutan_kelompok_tes.split(',').map(item => item-1)
  try {
    // get sesi aktif saat ini
    const sesi = await db.models.Sesi.findOne({where: {active: true}})
    //cek apakah user telah mengerjakan alat tes
    const tes_sudah_dikerjakan = await db.models.User_tes.count({
      where: { user_id, alat_tes_id, sesi_id: sesi.sesi_id },
    })
    if (tes_sudah_dikerjakan) return responseUtil.badRequest("sudah dikerjakan")
    //get data soal dari database
    const alat_tes = await db.models.Alat_tes.findOne({
      where: { alat_tes_id },
      raw: true
    })
    const kelompok_tes = await db.models.Kelompok_tes.findAll({
      where: { alat_tes_id },
      order: [["kelompok_tes_id", "ASC"]],
      raw: true
    })
    // filter index dari kelompok tes
    let kelompok_tes_filter = []
    if(urutan_kelompok_tes){
      kelompok_tes_filter = kelompok_tes.filter((_, index) => urutan_kelompok_tes.includes(index))
    }else{
      kelompok_tes_filter = kelompok_tes
    }
    let kelompok_tes_ids = kelompok_tes_filter.map(item => item.kelompok_tes_id)
    
    const soal = await db.models.Soal.findAll({
      include: [
        {
          model: db.models.Kelompok_tes,
          where: { kelompok_tes_id: {[db.Sequelize.Op.in]: kelompok_tes_ids} },
          attributes: [],
          as: "kelompok_tes",
          include: [
            {
              model: db.models.Alat_tes,
              where: { alat_tes_id },
              required: true,
              as: "alat_tes",
              attributes: [],
            },
          ],
        },
        {
          model: db.models.Opsi_soal,
          as: "opsi"
        },
      ],
      order: [
        ["kelompok_tes_id", "ASC"],
        ["nomor", "ASC"],
        ["opsi", "opsi", "ASC"],
      ],
    })

    kelompok_tes_filter.forEach((kelompokLoop) => {
      kelompokLoop.soal = []
      soal.forEach((soalLoop) => {
        const soal_temp = soalLoop.get({plain: true})
        if (soal_temp.kelompok_tes_id === kelompokLoop.kelompok_tes_id) {
          kelompokLoop.soal.push(soal_temp)
        }
      })
    })
    alat_tes.jumlah_kelompok_tes = kelompok_tes.length
    alat_tes.kelompok_tes = kelompok_tes_filter
    return responseUtil.success({ alat_tes })
  } catch (e) {
    //handle error
    return handleInternalError(e.toString(), `${path}/get`)
  }
}

module.exports.submitJawaban = async (user_id, jawaban) => {
  if (!(user_id && jawaban)) return responseUtil.missingData()
  try {
    const inputData = jawaban.map((jawabanLoop) => {
      return {
        user_id,
        jawaban: jawabanLoop.jawaban,
        soal_id: jawabanLoop.soal_id,
      }
    })
    await db.models.Jawaban_user.bulkCreate(inputData)
    return responseUtil.success()
  } catch (e) {
    //handle error
    return handleInternalError(e.toString(), `${path}/submit-jawaban`)
  }
}

module.exports.submitSoal = async (user_id, alat_tes_id) => {
  if (!(user_id && alat_tes_id)) return responseUtil.missingData()
  try {
    const {sesi_id} = await db.models.Sesi.findOne({where: { active: true }, raw: true})
    await db.models.User_tes.create({ user_id, alat_tes_id, sesi_id })
    return responseUtil.success()
  } catch (e) {
    //handle error
    return handleInternalError(e.toString(), `${path}/selesai-tes`)
  }
}

module.exports.getUsersSesi = async (alat_tes_id, sesi_id) => {
  try {
    if (!sesi_id) sesi_id = (await db.models.Sesi.findOne({ where: { active: true }, raw: true })).sesi_id
    const user = await db.models.User.findAll({
      attributes: {
        exclude: ["password", "role"],
        include: [[db.Sequelize.col("profil.nama_lengkap"), "nama_lengkap"]]
      },
      include: [
        {
          model: db.models.User_tes,
          as: "user_tes",
          where: { alat_tes_id, sesi_id },
          attributes: [],
          required: true,
        },
        {
          model: db.models.Profil,
          as: "profil",
          attributes: []
        },
      ],
    })
    return responseUtil.success({ user })
  } catch (e) {
    //handle error
    return handleInternalError(e.toString(), `${path}/get-status-tes-user-sesi`)
  }
}

module.exports.getJawabanUser = async (alat_tes_id, user_id, sesi_id) => {
  if (!alat_tes_id) return responseUtil.missingData()
  try {
    if (!sesi_id) sesi_id = (await db.models.Sesi.findOne({ where: { active: true } })).sesi_id
    const user = await db.models.User.findOne({
      where: {user_id},
      attributes: {
        exclude: ["password", "role"],
      },
      include: [
        {
          model: db.models.User_tes,
          as: "user_tes",
          where: { alat_tes_id, sesi_id },
          attributes: [],
          required: true,
        },
        {
          model: db.models.Profil,
          as: "profil",
          attributes: {
            exclude: ["profil_id", "user_id"],
          },
        },
      ],
      raw: true,
      nest: true
    })

    const kelompok_tes = await db.models.Kelompok_tes.findAll({
      where: { alat_tes_id },
      attributes: ["kelompok_tes_id", "nama", "jenis_soal"],
      raw: true
    })

    const jawaban_user = await db.models.Jawaban_user.findAll({
      where: { user_id },
      attributes: {
        include: [
          [db.Sequelize.col("soal.soal_id"), "soal_id"],
          [db.Sequelize.col("soal.nomor"), "nomor"],
          [db.Sequelize.col("soal.kelompok_tes_id"), "kelompok_tes_id"],
        ],
        exclude: ['user_id']
      },
      include: [
        {
          model: db.models.Soal,
          as: "soal",
          attributes: [],
        },
      ],
      raw: true
    })

    user.kelompok_tes = kelompok_tes.map((kelompok_tes_loop) => {
      kelompok_tes_loop.jawaban_user = []
      jawaban_user.forEach((jawaban_user_loop) => {
        if (kelompok_tes_loop.kelompok_tes_id === jawaban_user_loop.kelompok_tes_id) {
          if (kelompok_tes_loop.jenis_soal === "opini") {
            kelompok_tes_loop.jawaban_user.push({
              ...jawaban_user_loop,
              jawaban:
              jawaban_user_loop.jawaban === "A"
              ? "Tidak Setuju"
                  : jawaban_user_loop.jawaban === "B"
                  ? "Ragu-Ragu"
                  : jawaban_user_loop.jawaban === "C"
                  ? "Setuju"
                  : "",
                })
          } else {
            kelompok_tes_loop.jawaban_user.push(jawaban_user_loop)
          }
        }
      })
      kelompok_tes_loop.jawaban_user = [...new Map(kelompok_tes_loop.jawaban_user.map((item) => [item["nomor"], item])).values()]
      if (kelompok_tes_loop.jenis_soal === "custom") {
        const cTmp = kelompok_tes_loop.jawaban_user.map((item) => item.jawaban)
        const cKey = [...new Set(cTmp)].filter(key => {
          return key && key !== '-'
        })
        let cVal = []
        cKey.forEach((key) => {
          let counter = 0
          cTmp.forEach((c) => {
            if (key === c) counter++
          })
          cVal.push({ nomor: key, jawaban: counter })
        })
        kelompok_tes_loop.jawaban_user = cVal
      }
      return kelompok_tes_loop
    })
    return responseUtil.success({ user })
  } catch (e) {
    //handle error
    return handleInternalError(e.toString(), `${path}/get-jawaban-user`)
  }
}

module.exports.alatTesUser = async (user_id) => {
  try {
    const sesi_active = await db.models.Sesi.findOne({ where: { active: true } })
    const alat_tes = await db.models.User_tes.findAll({
      where: { user_id, sesi_id: sesi_active.sesi_id },
    })
    return responseUtil.success({ alat_tes })
  } catch (e) {
    return handleInternalError(e.toString(), `${path}/status-tes-user-selesai`)
  }
}