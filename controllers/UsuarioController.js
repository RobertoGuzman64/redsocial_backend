const UsuarioModel = require('../models/usuario.js');
const bcrypt = require("bcrypt");
const authConfig = require('../config/auth.js');
const jwt = require('jsonwebtoken');

// Clase Usuario donde contiene todas las funciones.

class Usuario {
    constructor() {
    }

    crearUsuario(body) {
        body.clave = bcrypt.hashSync(body.clave, Number.parseInt(authConfig.rondas));
        return UsuarioModel.create(body);
    }

    traerUsuarios() {
        return UsuarioModel.find();
    }

    async traerUsuarioId(id) {
        let usuarioEncontrado = await UsuarioModel.findById(id);
        return { status:200, datos: usuarioEncontrado }
    }

    async loginUsuario(body) {
        let correo = body.correo;
        let clave = body.clave;

        const usuarioLogueado = await UsuarioModel.findOne({ correo: correo }).then(usuarioEncontrado => {
            if (!usuarioEncontrado) {
                return { // usuario no existe
                    status: 401,
                    datos: {
                        msg: "Usuario o contraseña inválido"
                    }
                }
            } else {
                //comprova clave
                if (bcrypt.compareSync(clave, usuarioEncontrado.clave)) {
                    let token = jwt.sign({ usuario: usuarioEncontrado }, authConfig.complemento, {
                        expiresIn: authConfig.expiracion
                    });
                    return { //clave es correcta
                        status: 200,
                        datos: {
                            usuario: usuarioEncontrado,
                            token
                        }
                    }
                } else {
                    return { // clave no es correcta
                        status: 401,
                        datos: {
                            msg: "Usuario o contraseña inválido"
                        }
                    };
                }
            };
        });
        return usuarioLogueado;
    }

    perfilUsuario(body) { // FUNCION AUN POR PROBAR Y HACER QUE FUNCIONE.
        let datos = body
        return (
            UsuarioModel.updateOne({ where: { _id: datos._id } }).then(actualizado => {
                console.log("Electrico", actualizado)
                res.send(actualizado);
            })
        )
    }

    async borrarUsuario(){ // FUNCION AUN POR PROBAR Y HACER QUE FUNCIONE.
        return UsuarioModel.findByIdAndRemove( { _id: req._id } );
    }


}


let UsuarioController = new Usuario();
module.exports = UsuarioController;