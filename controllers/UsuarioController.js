const UsuarioModel = require('../models/usuario.js');
const bcrypt = require("bcrypt");
const authConfig = require('../config/auth.js');
const jwt = require('jsonwebtoken');

// Clase Usuario donde contiene todos los metodos(funciones de clases llaman metodos).

class Usuario {
    constructor() {
    }

    // Función de crear un Usuario con contraseña encriptada.
    async crearUsuario(body) {
        body.clave = bcrypt.hashSync(body.clave, Number.parseInt(authConfig.rondas));
        let usuarioNuevo = await UsuarioModel.create(body).then(usuarioNuevo => {
            return { status: 201, datos: usuarioNuevo }
        }).catch(error => {
            return { status: 400, datos: { error: error.message } }
        });
        return usuarioNuevo;
    }

    // Función mostrar todos los Usuarios.
    async traerUsuarios() {
        let usuariosEncontrados = await UsuarioModel.find().then(usuario => {
            return { status: 200, datos: usuario }
        }).catch(error => {
            return { status: 404, datos: { error: error.message } }
        });
        return usuariosEncontrados;
    }

    // Funcion de mostrar los Usuarios que sigues.
    async traerUsuariosQueSigues(id) {
        let usuario = await UsuarioModel.findById(id).select('siguiendo').then(siguiendo => {
            return { status: 200, datos: siguiendo };
        }).catch(error=> {
            return { status: 404, datos: error };
        });
        return usuario;
    }
    // Función de mostrar los Usuarios que te siguen.
    async traerUsuariosQueTeSiguen(id) {
        let usuario = await UsuarioModel.findById(id);
        return usuario.seguidores;
    }
    // Función de buscar un Usuario por nombre, apellidos o correo.
    async buscarUsuario(body) {
        let usuario = await UsuarioModel.findOne(body);
        return usuario;
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
                    let usuarioCambiado = UsuarioModel.findByIdAndUpdate(id, { clave: claveNuevaHash }, { new: true }).then(actualizado => {
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
    async borrarUsuario(id) {
        return await UsuarioModel.findByIdAndRemove(id).then(usuarioBorrado => {
            return {
                status: 200,
                datos: {
                    usuario: `Usuario con el correo ${usuarioBorrado.correo} ha sido borrado con suceso`
                }
            }
        }).catch(error => {
            return {
                status: 404,
                datos: {
                    error: error.message
                }
            }
        });
    }
    // Funcion de seguir a un usuario
    async seguirUsuario(id, body) {
        let usuarioSeguido = await UsuarioModel.findByIdAndUpdate(id, { $push: { siguiendo: body } }, { new: true }).then(usuario => {
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