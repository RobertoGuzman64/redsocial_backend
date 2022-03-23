const router = require('express').Router();
const UsuarioRouter = require('./views/UsuarioRouter');


router.use('/usuario', UsuarioRouter);


module.exports = router;
