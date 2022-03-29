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


module.exports = router;