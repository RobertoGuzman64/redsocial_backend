const HiloModel = require('../models/hilo.js');
const UsuarioModel = require('../models/usuario.js');
const authConfig = require('../config/auth.js');
const jwt = require('jsonwebtoken');

// Clase Hilo donde contiene todos los metodos(funciones de clases llaman metodos).

class Hilo {
    constructor() {
    }

    // Función de crear un Hilo.
    async crearHilo(body) {
        const session = await HiloModel.startSession();
        session.startTransaction();

        let hiloNuevo = await HiloModel.create([body], { session: session }).then(hiloNuevo => {
            return { status: 201, datos: hiloNuevo }
        }).catch(error => {
            return { status: 400, datos: { error: error.message } }
        });
        
        let duenoDelHilo = await UsuarioModel.findByIdAndUpdate(body.usuarioId, { $push: { publicaciones: hiloNuevo.datos } }, { new: true, session: session }).then(dueno => {
            return { status: 200, usuario: dueno }
        }).catch(error => {
            return { status: 400 }
        })
        if (hiloNuevo.status === 201 && duenoDelHilo.status === 200) {
            await session.commitTransaction();
            session.endSession();
        } else {
            await session.abortTransaction();
            session.endSession();
        }
        return hiloNuevo;
    }

    // Función mostrar todos los Hilos.
    async traerHilos() {
        let hilosEncontrados = await HiloModel.find().then(hilo => {
            return { status: 200, datos: hilo }
        }).catch(error => {
            return { status: 404, datos: { error: error.message } }
        });
        return hilosEncontrados;
    }

    // Función mostrar un Hilo por ID.
    async traerHiloId(id) {
        let hiloEncontrado = await HiloModel.findById(id).then(hilo => {
            return { status: 200, datos: hilo }
        }).catch(error => {
            return { status: 404, datos: { error: error.message } }
        });
        return hiloEncontrado;
    }

    // Función de actualizar un Hilo.
    async cambiaHilo(id, body) {
        let hiloActualizado = await HiloModel.findByIdAndUpdate(id, body, {new: true}).then(hiloActualizado => {
            return { status: 200, datos: hiloActualizado }
        }).catch(error => {
            return { status: 400, datos: { error: error.message } }
        });
        return hiloActualizado;
    }

    // Funcion de borrar un Hilo por ID.
    async borrarHilo(id) {
        return await HiloModel.findByIdAndRemove(id).then(hiloBorrado => {
            return {
                status: 200,
                datos: {
                    hilo: `Hilo con el correo ${hiloBorrado.correo} ha sido eliminado`
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
}

let HiloController = new Hilo();
module.exports = HiloController;