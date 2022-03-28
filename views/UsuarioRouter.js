const router = require("express").Router();

const UsuarioController = require('../controllers/UsuarioController');


// GET 
// Endpoint de mostrar Todos los Usuarios.
// http://localhost:5500/usuarios

router.get("/", async (req, res) => {
    try {
        res.json(await UsuarioController.traerUsuarios());
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});

// GET
// Edpoint de mostrar un Usuario por ID.
// http://localhost:5500/usuarios/:id

router.get("/:id", async (req, res) => {
    try {
        let id = req.params.id
        let respuesta = await UsuarioController.traerUsuarioId(id);
        res.status(respuesta.status).json(respuesta.datos)
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});

// POST
// Endpoint de crear un Usuario.
// http://localhost:5500/usuarios

router.post("/", async (req, res) => {
    try {
        const body = req.body;
        res.status(201).json(await UsuarioController.crearUsuario(body));
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
        res.status(respuesta.status).json(respuesta.datos)
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});

// POST
// Endpoint de Seguir a un Usuario.
// http://localhost:5500/usuarios/siguiendo

router.post("/siguiendo", async (req, res) => {
    try {
        const body = req.body;
        let respuesta = await UsuarioController.seguirUsuario(body);
        res.status(respuesta.status).json(respuesta.datos)
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});

// PATCH
// Endpoint de Modificar el perfil por ID.
// http://localhost:5500/usuarios

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
// http://localhost:5500/usuarios
router.patch("/:id", async (req, res) => {
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
// http://localhost:5500/usuarios

router.delete("/", async (req, res) => {
    try {
        const body = req.body;
        res.json(await UsuarioController.borrarUsuario(body));
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});

// DELETE
// Endpoint de dejar de seguir a un Usuario.
// http://localhost:5500/usuarios/siguiendo

router.delete("/siguiendo", async (req, res) => {
    try {
        const body = req.body;
        let respuesta = await UsuarioController.dejarDeSeguirUsuario(body);
        res.status(respuesta.status).json(respuesta.datos)
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});


module.exports = router;