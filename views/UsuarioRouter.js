const router = require("express").Router();

const UsuarioController = require('../controllers/UsuarioController');


// GET 
// Endpoint de mostrar Todos los Usuarios.
// http://localhost:5500/usuarios

router.get("/", async(req, res) => {
    try {
        res.json(await UsuarioController.traerUsuarios());
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});

// POST
// Endpoint de crear un Usuario.
// http://localhost:5500/usuarios

router.post("/", async(req, res) => {
    try {
        const body = req.body;
        res.json(await UsuarioController.crearUsuario(body));
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});

// POST
// Endpoint de Login de Usuario.
// http://localhost:5500/usuario/login

router.post("/login", async(req, res) => {
    try {
        const body = req.body;
        res.status(200).json(await UsuarioController.loginUsuario(body));
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});


// Endpoint de Modificar el perfil por ID.




module.exports = router;