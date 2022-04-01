const UsuarioModel = require('../models/usuario.js');
const bcrypt = require("bcrypt");
const authConfig = require('../config/auth.js');
const jwt = require('jsonwebtoken');
const { db } = require('../models/usuario.js');

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
        }).catch(error => {
            return { status: 404, datos: error };
        });
        return usuario;
    }
    // Función de mostrar los Usuarios que te siguen.
    async traerUsuariosQueTeSiguen(id) {
        let usuario = await UsuarioModel.findById(id).select('seguidores').then(seguidores => {
            return { status: 200, datos: seguidores };
        }).catch(error => {
            return { status: 404, datos: error };
        });
        return usuario;
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
    async cambiaClaveUsuario(id, body) {
        let clave = body.clave;
        let claveNueva = body.claveNueva;

        if (!body.clave) {
            return {
                status: 422,
                datos: {
                    error: 'Para cambiar la clave necesita de pasar la clave actual.',
                }
            }
        }
        if (!body.claveNueva) {
            return {
                status: 422,
                datos: {
                    error: 'Para cambiar la clave necesita de pasar la nueva clave.',
                }
            }
        }

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
                    let usuarioCambiado = UsuarioModel.findByIdAndUpdate(id, { $set: { clave: claveNuevaHash } }).then(actualizado => {
                        return {
                            status: 200,
                            datos: {
                                mensaje: "Clave cambiada con sucesso"
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
        if (!body.usuario || !body.siguiendo) {
            return {
                status: 422,
                datos: {
                    error: 'Para seguir un usuario necesita pasar el usuario que quieres seguir y el usuario que va ser seguido. Mire el detalle del error para un ejemplo.',
                    detalle: {
                        body: {
                            usuario: {
                                _id: 'id tuyo',
                                nombre: 'nombre tuyo',
                                apellidos: 'apellido tuyo o null',
                                foto: 'foto tuya o null'
                            },
                            siguiendo: {
                                _id: 'id de quien quieres seguir',
                                nombre: 'nombre de quien quieres seguir',
                                apellidos: 'apellido de quien quieres seguir o null',
                                foto: 'foto de quien quieres seguir o null'
                            }
                        }
                    }
                }
            }
        }

        const session = await db.startSession();
        session.startTransaction();

        let usuario = await UsuarioModel.findByIdAndUpdate(id, { $push: { siguiendo: body.siguiendo } }, { new: true, session: session }).then(usuario => {
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

        let siguiendo = await UsuarioModel.findByIdAndUpdate(body.siguiendo._id, { $push: { seguidores: body.usuario } }, { new: true, session: session }).then(usuarioSeguido => {
            return { status: 200 }
        }).catch(error => {
            return { status: 400 }
        });

        if (usuario.status === 200 && siguiendo.status === 200) {
            await session.commitTransaction();
        } else {
            await session.abortTransaction();
        }
        return usuario;
    }
    // Funcion de dejar de seguir a un usuario
    async dejarDeSeguirUsuario(id_usuario, id_por_borrar) {
        const session = await db.startSession();
        session.startTransaction();

        let usuario = await UsuarioModel
            .findByIdAndUpdate(
                id_usuario,
                { $pull: { siguiendo: { _id: id_por_borrar } } },
                { new: true, session: session }
            ).then(usuario => {
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
            });

        let antiguoSeguido = await UsuarioModel
            .findByIdAndUpdate(
                id_por_borrar,
                { $pull: { seguidores: { _id: id_usuario } } },
                { new: true, session: session }
            ).then(antiguo => {
                return { status: 200 }
            }).catch(error => { return { status: 400 } });

        if (usuario.status === 200 && antiguoSeguido.status === 200) {
            await session.commitTransaction();
        } else {
            await session.abortTransaction();
        }

        return usuario;
    }
}


let UsuarioController = new Usuario();
module.exports = UsuarioController;