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

  - [x] '/:id/siguiendo' traerUsuariosQueSigues
    - [ ] Test
      - [x] Test si funciona
      - [ ] Test de errores

  - [x] '/:id/seguidores' traerUsuariosQueTeSiguen
    - [ ] Test
      - [ ] Test si funciona
      - [ ] Test de errores

- [ ] POST
  - [x] '/' crearUsuario
    - [x] Test
 
  - [x] '/login' loginUsuario
    - [x] Test

  - [x] '/:id/siguiendo' sigueUsuario
    - [ ] Test
      - [x] Test si funciona
      - [ ] Test de errores

- [ ] PUT/PATCH
  - [x] '/:id' cambiaUsuario
    - [x] Test
  
  - [x] '/:id' cambiaClavedeUsuario
    - [ ] Test
      - [ ] Test si funciona
      - [ ] Test de errores
  

- [ ] DELETE
  - [x] '/:id' borrarUsuarioId
    - [x] Test

  - [x] '/siguiendo' sigueUsuario
    - [ ] Test
      - [ ] Test si funciona
      - [ ] Test de errores
  
## Post
- [ ] GET
  - [x] '/' traerPosts
    - [ ] Test
      - [ ] Test si funciona
      - [ ] Test de errores
  
  - [x] '/:id' traerPostId
    - [ ] Test
      - [ ] Test si funciona
      - [ ] Test de errores

- [ ] POST
  - [x] '/' crearPost
    - [ ] Test
      - [ ] Test si funciona
      - [ ] Test de errores

- [ ] PUT/PATCH
  - [x] '/:id' cambiaPost
    - [ ] Test
      - [ ] Test si funciona
      - [ ] Test de errores

- [ ] DELETE
  - [x] '/:id' borrarPostId
    - [ ] Test
      - [ ] Test si funciona
      - [ ] Test de errores

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

