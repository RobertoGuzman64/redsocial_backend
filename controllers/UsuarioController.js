const UsuarioModel = require('../models/usuario.js');
const bcrypt = require("bcrypt");
const authConfig = require('../config/auth.js');
const jwt = require('jsonwebtoken');

// Clase Usuario donde contiene todos los metodos(funciones de clases llaman metodos).

class Usuario {
    constructor() {
    }
    // Función de crear un Usuario.
    crearUsuario(body) {
        body.clave = bcrypt.hashSync(body.clave, Number.parseInt(authConfig.rondas));
        return UsuarioModel.create(body);
    }
    // Función mostrar todos los Usuarios.
    traerUsuarios() {
        return UsuarioModel.find();
    }
    // Función de buscar un usuario por ID.
    async traerUsuarioId(id) {
        let usuarioEncontrado = await UsuarioModel.findById(id).then(usuario => {
            return { status: 200, datos: usuario }
        }).catch(error => {
            return { status: 404, datos: { error: error.message } }
        });
        return usuarioEncontrado
    }
    // Función de login.
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
    // Función de modificar el perfil.
    async cambiaUsuario(id, body) {
        let clave = false;
        if (Object.entries(body).length === 0) {
            return {
                status: 422,
                datos: {
                    error: 'Para cambiar los datos del usuario necesita pasar algun dato para ser cambiado.',
                }
            }
        } else {
            if (body.clave) {
                delete body.clave;
                clave = true;

            }
            if (body._id) {
                return {
                    status: 422,
                    datos: {
                        error: 'Tu no puedes cambiar el id del usuario'
                    }
                };
            } else if (body.__v) {
                return {
                    status: 422,
                    datos: {
                        error: 'Tu no puedes cambiar la version del usuario'
                    }
                };
            }

            let usuarioCambiado = await UsuarioModel.findByIdAndUpdate(id, body, { new: true }).then(actualizado => {
                if (clave) {
                    return {
                        status: 200,
                        datos: {
                            error: 'Para cambiar la clave necesita de acceder el endpoint de cambiar clave.',
                            usuario: actualizado
                        }
                    }
                } else {
                    return {
                        status: 200,
                        datos: {
                            usuario: actualizado
                        }
                    }
                }
            }).catch(error => {
                return {
                    status: 404,
                    datos: {
                        error: error.message
                    }
                }
            })
            return usuarioCambiado;
        }
    }
    // Funcion de cambiar clave
    async cambiarClave(id, body) {
        let clave = body.clave;
        let claveNueva = body.claveNueva;
        let usuarioEncontrado = await UsuarioModel.findById(id).then(usuario => {
            if (!usuario) {
                return {
                    status: 404,
                    datos: {
                        error: 'El usuario no existe'
                    }
                }
            } else {
                if (bcrypt.compareSync(clave, usuario.clave)) {
                    let claveNuevaHash = bcrypt.hashSync(claveNueva, Number.parseInt(authConfig.rondas));
                    let usuarioCambiado = await UsuarioModel.findByIdAndUpdate(id, { clave: claveNuevaHash }, { new: true }).then(actualizado => {
                        return {
                            status: 200,
                            datos: {
                                usuario: actualizado
                            }
                        }
                    }).catch(error => {
                        return {
                            status: 404,
                            datos: {
                                error: error.message
                            }
                        }
                    })
                    return usuarioCambiado;
                } else {
                    return {
                        status: 401,
                        datos: {
                            error: 'La clave no es correcta'
                        }
                    }
                }
            }
        }).catch(error => {
            return {
                status: 404,
                datos: {
                    error: error.message
                }
            }
        })
        return usuarioEncontrado;
    }
    // Funcion de borrar un Usuario por ID.
    async borrarUsuario() { // FUNCION AUN POR PROBAR Y HACER QUE FUNCIONE.
        return UsuarioModel.findByIdAndRemove({ _id: req._id });
    }
    // Funcion de seguir a un usuario
    async seguirUsuario(id, body) {
        let usuarioSeguido = await UsuarioModel.findByIdAndUpdate(id, { $push: { siguiendo: body.siguiendo } }, { new: true }).then(usuario => {
            return {
                status: 200,
                datos: {
                    usuario: usuario
                }
            }
        }).catch(error => {
            return {
                status: 404,
                datos: {
                    error: error.message
                }
            }
        })
        return usuarioSeguido;
    }
    // Funcion de dejar de seguir a un usuario
    async dejarDeSeguirUsuario(id, body) {
        let usuarioDejado = await UsuarioModel.findByIdAndUpdate(id, { $pull: { siguiendo: body.siguiendo } }, { new: true }).then(usuario => {
            return {
                status: 200,
                datos: {
                    usuario: usuario
                }
            }
        }).catch(error => {
            return {
                status: 404,
                datos: {
                    error: error.message
                }
            }
        })
        return usuarioDejado;
    }
}


let UsuarioController = new Usuario();
module.exports = UsuarioController;