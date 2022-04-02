//Siguiendo, Seguidores, posts del usuario, likes
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hiloSchema = new Schema ({
    titulo: {
        type: String,
        required: true
    },
    cuerpo: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        required: true
    },
    usuario: {
        usuarioId: {
            type: Schema.Types.ObjectId,
            ref: 'Usuario',
            required: true
        },
        nombre: {
            type: String,
            required: true
        },
        apellidos: {
            type: String
        },
        foto: {
            type: String
        }
    },
    comentarios: {
        type: Array
    },
    likes: {
        type: Array
    },
})

const Hilo = mongoose.model("Hilo", hiloSchema);
module.exports = Hilo;