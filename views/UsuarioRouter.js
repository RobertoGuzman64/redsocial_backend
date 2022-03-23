const router = require("express").Router();

const UsuarioController = require('../controllers/UsuarioController');


//GET - Encuentra todos los datos de todos los Usuarios.

router.get("/", async(req, res) => {
    try {
        res.json(await UsuarioController.TraerUsuarios());
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});







module.exports = router;