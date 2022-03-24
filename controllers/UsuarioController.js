const UsuarioModel = require('../models/usuario.js');
const bcrypt = require("bcrypt");
const authConfig = require('../config/auth.js');

// Clase Usuario donde contiene todas las funciones.

class Usuario{
    constructor(){
    }
    async crearUsuario(body) {
        body.clave = await bcrypt.hash( body.clave, authConfig.rondas );
        return UsuarioModel.create(body);
    }
    async traerUsuarios(){
        return UsuarioModel.find();
    }
    async loginUsuario(body) {
        let correo = body.correo;
        let clave = body.clave;
        let token = jwt.sign;
        UsuarioModel.findOne({where : {correo : correo}}).then(usuarioEncontrado => {
            if (!usuarioEncontrado){
                return "Usuario o contraseña inválido"
            }else {
                //el usuario existe, por lo tanto, vamos a comprobar
                //si el password es correcto
                if (bcrypt.compareSync(clave, UsuarioModel.clave)) {
                    let token = jwt.sign({ usuario: UsuarioModel }, authConfig.complemento, {
                        expiresIn: authConfig.expiracion
                    });
                    return{
                        usuario: UsuarioModel,
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