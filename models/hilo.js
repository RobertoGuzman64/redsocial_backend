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
    usuarioId: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    comentarios: {
        type: Array
    },
    likes: {
        type: Number
    },
})

const Hilo = mongoose.model("Hilo", hiloSchema);
module.exports = Hilo;