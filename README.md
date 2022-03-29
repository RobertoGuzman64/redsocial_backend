# Endpoints:


- [ ] Middlewares
  - [ ] Auth
  - [ ] Admin

## Usuario
- [ ] GET
  - [x] '/' traerUsuarios
    - [x] Test

  - [x] '/:id' traerUsuarioId
    - [x] Test

  - [x] '/siguiendo' traerUsuariosQueSigues
    - [ ] Test

  - [x] '/siguiendo' traerUsuariosQueTeSiguen
    - [ ] Test

- [ ] POST
  - [x] '/' crearUsuario
    - [x] Test
 
  - [x] '/login' loginUsuario
    - [x] Test

  - [x] '/siguiendo' sigueUsuario
    - [ ] Test

- [ ] PUT/PATCH
  - [x] '/:id' cambiaUsuario
    - [x] Test
  
  - [x] '/:id' cambiaClavedeUsuario
    - [ ] Test
  

- [ ] DELETE
  - [x] '/:id' borrarUsuarioId
    - [ ] Test

  - [x] '/siguiendo' sigueUsuario
    - [ ] Test
  
## Post
- [ ] GET
  - [x] '/' traerPosts
    - [ ] Test
  
  - [x] '/:id' traerPostId
    - [ ] Test

- [ ] POST
  - [x] '/' crearPost
    - [ ] Test

- [ ] PUT/PATCH
  - [x] '/:id' cambiaPost
    - [ ] Test

- [ ] DELETE
  - [ ] '/:id' borrarPostId
    - [ ] Test

## Extra
### Usuario

- [ ] GET
  - [x] '/busqueda' traerUsuarioPorNombreOPorEmail (query param) (?nombre=Nombre) (?email=email@mail.any) (?apellidos=apellidos)
    - [ ] Test

- [ ] GET
  - [ ] '/:id/posts' traerPostsDeUnUsuario
    - [ ] Test

### Post

- [ ] GET
  - [ ] '/busqueda' traerPostPorTituloDataOEdad (query param) (?titulo=Titulo) (?data=DDMMYYYY) (?edad=adulto(bool))
    - [ ] Test

