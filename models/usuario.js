//Siguiendo, Seguidores, posts del usuario, likes
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usuarioSchema = new Schema ({
    nombre: {
        type: String,
        required: true
    },
    apellidos: {
        type: String
    },
    edad: {
        type: Data,
        required: true
    },
    correo: {
        type: String,
        required: true,
        unique: true
    },
    clave: {
        type: String,
        required: true
    },
    telefono: {
        type: String
    },
    ciudad: {
        type: String
    },
    esAdministrador: {
        type: Boolean,
        default: false
    },
    siguiendo: {
        type: Array
    },
    seguidores: {
        type: Array
    },
    publicaciones: {
        type: Array
    },
    likes: {
        type: Array
    },
})

const toJSONConfig = {
    transform: (doc,ret,opt) => {//transform es un metodo de mongoose
        delete ret['clave']//ret es un metodo encripta la password para enviarla con mas seguridad
        return ret
    }
}

userSchema.set('toJSON', toJSONConfig);

const Usuario = mongoose.model("Usuario", usuarioSchema);
module.exports = Usuario;