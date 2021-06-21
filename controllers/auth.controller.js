const db = require('../models')
const responseUtil = require('../utils/response')
const logger = require('../utils/logger')
const handleInternalError = require('./errorHandler')
const config = require('../config')
const jwt = require('jsonwebtoken')
const md5 = require('md5')
const path = '/auth'

const generateToken = (user_id, email, role) => {
  return jwt.sign({ user_id, email, role }, config.jwt.secret)
}

module.exports.login = async (email, password) => {
  //cek data yang dibutuhkan
  if (!(email && password)) return responseUtil.missingData();
  try {
    //ambil data user sesuai email
    const user = await db.models.User.findOne({ where: { email } });
    //cek user terdaftar
    if (!user) return responseUtil.badRequest("user belum terdaftar");
    //cek tes aktif bagi user
    const fitur = await db.models.Fitur.findOne({
      where: { nama: "tes_aktif" },
    });
    if (fitur.value !== "1" && user.role !== "admin")
      return responseUtil.badRequest(
        "saat ini sedang tidak dilaksanakan psikotes"
      );
    //validasi password
    if (user.password !== md5(password))
      return responseUtil.badRequest("password salah");
    //generate token
    const token = generateToken(user.user_id, user.email, user.role);
    //resolve
    return responseUtil.success({ token });
  } catch (e) {
    //handle error
    return handleInternalError(e.toString(), `${path}/login`)
  }
}

module.exports.register = async (email, password, role, nama_lengkap, tempat_lahir, tanggal_lahir, jenis_kelamin, alamat, agama, pendidikan_terakhir) => {
  //cek data yang dibutuhkan
  if (
    !(
      email &&
      password &&
      nama_lengkap &&
      tempat_lahir &&
      tanggal_lahir &&
      jenis_kelamin &&
      alamat &&
      agama &&
      pendidikan_terakhir
    )
  )
    return responseUtil.missingData();
  if (
    !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email.toLowerCase()
    )
  )
    return responseUtil.badRequest("email tidak valid");
  if (!role) role = "user";
  try {
    //cek tes aktif bagi user
    const fitur = await db.models.Fitur.findOne({
      where: { nama: "tes_aktif" },
    });
    if (fitur.value !== "1")
      return responseUtil.badRequest(
        "saat ini sedang tidak dilaksanakan psikotes"
      );
    //cek apakah user sudah terdaftar
    const userCount = await db.models.User.count({ where: { email } });
    if (userCount) return responseUtil.badRequest("user sudah terdaftar");
    //cek panjang password
    if (password.length > config.user.maxPasswordLength)
      return responseUtil.badRequest("password terlalu panjang");
    //register user
    const hashPassword = md5(password);
    const user = await db.models.User.create({email, password: hashPassword, role});
    await db.models.Profil.create(
      {
        user_id: user.user_id,
        nama_lengkap,
        tempat_lahir,
        tanggal_lahir,
        jenis_kelamin,
        alamat,
        agama,
        pendidikan_terakhir,
      }
    )
    //cek apakah akan login
    const token = generateToken(user.user_id, user.email, user.role);
    //resolve
    return responseUtil.success({ token });
  } catch (e) {
    //handle error
    return handleInternalError(e.toString(), `${path}/register`)
  }
}

module.exports.changeAdmin = async (email, new_email, password, new_password) => {
  if(!(email && new_email && password && new_password)) return responseUtil.missingData();
  try{
    const user = await db.models.User.findOne({where: {email}})
    console.log(user)
    if(md5(password) != user.password) return responseUtil.badRequest("password tidak valid");
    await db.models.User.update({email: new_email, password: md5(new_password)}, {where: {email}})
    return responseUtil.success();
  } catch (e) {
    //handle error
    return handleInternalError(e.toString(), `${path}/change-admin`)
  }
}