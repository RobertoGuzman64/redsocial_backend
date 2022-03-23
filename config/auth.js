require('dotenv').config();

module.exports = {
    secret: process.env.AUTH_COMPLEMENTO,
    expires: process.env.AUTH_EXPIRACION,
    rounds: process.env.AUTH_RONDAS
}