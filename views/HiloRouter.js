const router = require("express").Router();

const HiloController = require('../controllers/HiloController');

// GET 
// Endpoint de mostrar Todos los Hilos.
// http://localhost:5500/

router.get("/", async (req, res) => {
    try {
        let respuesta = await HiloController.traerHilos();
        res.status(respuesta.status).json(respuesta.datos);
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});

// GET
// Endpoint de mostrar un Hilo por ID.
// http://localhost:5500/hilos/:id

router.get("/:id", async (req, res) => {
    try {
        let id = req.params.id
        let respuesta = await HiloController.traerHiloId(id);
        res.status(respuesta.status).json(respuesta.datos);
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});

// POST
// Endpoint de crear un Hilo.
// http://localhost:5500/hilos

router.post("/", async (req, res) => {
    try {
        const body = req.body;
        let respuesta = await HiloController.crearHilo(body);
        res.status(respuesta.status).json(respuesta.datos);
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
});

// PATCH
// Endpoint de Modificar el Hilo por ID.
// http://localhost:5500/hilos/:id

router.patch("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        let respuesta = await HiloController.cambiaHilo(id, body)
        res.status(respuesta.status).json(respuesta.datos);
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});

// DELETE
// Endpoint de borrar un Hilo por ID.
// http://localhost:5500/hilos/:id

router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        let respuesta = await UsuarioController.borrarUsuario(id)
        res.status(respuesta.status).json(respuesta.datos);
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});





module.exports = router;