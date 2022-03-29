const router = require('express').Router();
const UsuarioRouter = require('./views/UsuarioRouter');
const HiloRouter = require('./views/HiloRouter');


router.use('/usuarios', UsuarioRouter);
router.use('/hilos', HiloRouter);


module.exports = router;
