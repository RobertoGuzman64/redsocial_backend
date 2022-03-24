require('dotenv').config();

module.exports = {
    complemento: process.env.AUTH_COMPLEMENTO,
    expiracion: process.env.AUTH_EXPIRACION,
    rondas: process.env.AUTH_RONDAS
}