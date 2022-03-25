const UsuarioModel = require('../models/usuario.js');
const bcrypt = require("bcrypt");
const authConfig = require('../config/auth.js');
const jwt = require('jsonwebtoken');

// Clase Usuario donde contiene todas las funciones.

class Usuario {
    constructor(){
    }

    crearUsuario(body) {
        body.clave = bcrypt.hashSync(body.clave, Number.parseInt(authConfig.rondas));
        return UsuarioModel.create(body);
    }

    traerUsuarios(){
        return UsuarioModel.find();
    }

    loginUsuario(body) {
        let correo = body.correo;
        let clave = body.clave;
        
        UsuarioModel.findOne({where : {correo : correo}}).then(usuarioEncontrado => {
            if (!usuarioEncontrado){
                return "Usuario o contraseña inválido"
            }else {
                //el usuario existe, por lo tanto, vamos a comprobar
                //si el password es correcto
                console.log('usuarioEncontrado.clave',usuarioEncontrado.clave)
                console.log('Comprobacion',bcrypt.hashSync(clave, Number.parseInt(authConfig.rondas)))
                if (bcrypt.compareSync(clave, usuarioEncontrado.clave)) {
                    let token = jwt.sign({ usuario: usuarioEncontrado }, authConfig.complemento, {
                        expiresIn: authConfig.expiracion
                    });
                    return{
                        usuario: usuarioEncontrado,
                        token: token
                    }
                } else {
                    return { msg: "Usuario o contraseña inválidos" };
                }
            };
        });
    }
}


let UsuarioController = new Usuario();
module.exports = UsuarioController;