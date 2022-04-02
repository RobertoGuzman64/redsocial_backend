const router = require("express").Router();

const UsuarioController = require('../controllers/UsuarioController');

// POST
// Endpoint de crear un Usuario.
// http://localhost:5500/usuarios

router.post("/", async (req, res) => {
    try {
        const body = req.body;
        let respuesta = await UsuarioController.crearUsuario(body);
        res.status(respuesta.status).json(respuesta.datos);
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
});

// POST
// Endpoint de Login de Usuario.
// http://localhost:5500/usuarios/login

router.post("/login", async (req, res) => {
    try {
        const body = req.body;
        let respuesta = await UsuarioController.loginUsuario(body);
        res.status(respuesta.status).json(respuesta.datos);
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});

// POST
// Endpoint de Seguir a un Usuario.
// http://localhost:5500/usuarios/:id/siguiendo

router.post("/:id/siguiendo", async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        let respuesta = await UsuarioController.seguirUsuario(id, body);
        res.status(respuesta.status).json(respuesta.datos);
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});

// GET
// Endpoint de mostrar Todos los Usuarios.
// http://localhost:5500/usuarios

router.get("/", async (req, res) => {
    try {
        let respuesta = await UsuarioController.traerUsuarios();
        res.status(respuesta.status).json(respuesta.datos);
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});

// GET
// Endpoint de mostrar los Usuarios que sigues.
// http://localhost:5500/usuarios/:id/siguiendo

router.get("/:id/siguiendo", async (req, res) => {
    try {
        const id = req.params.id;
        let respuesta = await UsuarioController.traerUsuariosQueSigues(id);
        res.status(respuesta.status).json(respuesta.datos);
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});

// GET
// Endpoint de motrar los Usuarios que te siguen.
// http://localhost:5500/usuarios/:id/seguidores

router.get("/:id/seguidores", async (req, res) => {
    try {
        const id = req.params.id;
        let respuesta = await UsuarioController.traerUsuariosQueTeSiguen(id);
        res.status(respuesta.status).json(respuesta.datos);
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});

// GET
// Endpoint de mostrar un Usuario por ID.
// http://localhost:5500/usuarios/:id

router.get("/:id", async (req, res) => {
    try {
        let id = req.params.id
        let respuesta = await UsuarioController.traerUsuarioId(id);
        res.status(respuesta.status).json(respuesta.datos);
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});

// GET
// Endpoint de buscar un Usuario por nombre, apellido o correo.
// http://localhost:5500/usuarios/busqueda

router.get("/busqueda", async (req, res) => {
    try {
        let busqueda = req.query.busqueda;
        let respuesta = await UsuarioController.buscarUsuario(busqueda);
        res.status(respuesta.status).json(respuesta.datos);
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});

// PATCH
// Endpoint de Modificar el perfil por ID.
// http://localhost:5500/usuarios/:id

router.patch("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        let respuesta = await UsuarioController.cambiaUsuario(id, body)
        res.status(respuesta.status).json(respuesta.datos);
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});

// PATCH
// Endpoint de Modificar la contraseña por ID.
// http://localhost:5500/usuarios/:id/cambiar-clave
router.patch("/:id/cambiar-clave", async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        let respuesta = await UsuarioController.cambiaClaveUsuario(id, body)
        res.status(respuesta.status).json(respuesta.datos);
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});

// DELETE
// Endpoint de borrar un Usuario por ID.
// http://localhost:5500/usuarios/:id

router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        let respuesta = await UsuarioController.borrarUsuario(id);
        res.status(respuesta.status).json(respuesta.datos);
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});

// DELETE
// Endpoint de dejar de seguir a un Usuario.
// http://localhost:5500/usuarios/:id/siguiendo/:pk

router.delete("/:id/siguiendo/:pk", async (req, res) => {
    try {
        const id = req.params.id;
        const pk = req.params.pk;
        let respuesta = await UsuarioController.dejarDeSeguirUsuario(id, pk);
        res.status(respuesta.status).json(respuesta.datos);
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;