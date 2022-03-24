const router = require('express').Router();
const UsuarioRouter = require('./views/UsuarioRouter');


router.use('/usuarios', UsuarioRouter);


module.exports = router;
