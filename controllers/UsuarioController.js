const UsuarioModel = require('../models/usuario.js');
const bcrypt = require("bcrypt");

class Usuario{
    constructor(){
    }
    async traerUsuarios(){
        return UsuarioModel.find();
    }
    
}

















let UsuarioController = new Usuario();
module.exports = UsuarioController;