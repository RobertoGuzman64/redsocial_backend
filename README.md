
# TODO
## Endpoints:

### Middlewares
- [ ] Middlewares
  - [ ] Auth
  - [ ] Admin

### Usuario

- [ ] GET
  - [x] GET CON LOS TESTS BASICOS
  - [ ] GET CON TODOS LOS TESTS
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
        - [x] Test si funciona
        - [ ] Test de errores

- [ ] POST
  - [x] POST CON LOS TESTS BASICOS
  - [ ] POST CON TODOS LOS TESTS
    - [x] '/' crearUsuario
      - [x] Test
   
    - [x] '/login' loginUsuario
      - [x] Test

    - [x] '/:id/siguiendo' sigueUsuario
      - [ ] Test
        - [x] Test si funciona
        - [ ] Test de errores

- [ ] PUT/PATCH
  - [x] PUT/PATCH CON LOS TESTS BASICOS
  - [ ] PUT/PATCH CON TODOS LOS TESTS
    - [x] '/:id' cambiaUsuario
      - [ ] Test
      <!-- TODO: Checkear si cuando se cambia el usuario se cambia las mensiones de el en los otros usuarios  (Creo que es con el Query Update multi https://mongoosejs.com/docs/api.html#query_Query-update)-->
        - [x] Test si funciona
        - [ ] Test de errores
          - [x] Test de errores basico
          - [ ] Test de errores avanzado

    - [x] '/:id' cambiaClavedeUsuario
      - [ ] Test
        - [x] Test si funciona
        - [ ] Test de errores

- [ ] DELETE
  - [x] DELETE CON LOS TESTS BASICOS
  - [ ] DELETE CON TODOS LOS TESTS
    - [x] '/:id' borrarUsuarioId
      <!-- TODO: Checkear si cuando se borra el usuario se borra las mensiones de el en los otros usuarios -->
      - [x] Test

    - [x] '/siguiendo' sigueUsuario
      - [ ] Test
        - [x] Test si funciona
        - [ ] Test de errores

### Hilo
- [ ] GET
  - [x] '/' traerPosts
    - [ ] Test
      - [x] Test si funciona
      - [ ] Test de errores

  - [x] '/:id' traerPostId
    - [ ] Test
      - [X] Test si funciona
      - [ ] Test de errores

- [ ] POST
  - [x] '/' crearPost
    - [ ] Test
      - [x] Test si funciona
      - [ ] Test de errores

  - [ ] '/:id/like' gustaDelPost
    - [ ] Test
      - [ ] Test si funciona
      - [ ] Test de errores 

- [ ] PUT/PATCH
  - [x] '/:id' cambiaPost
    - [ ] Test
      - [x] Test si funciona
      - [ ] Test de errores

- [ ] DELETE
  - [x] '/:id' borrarPostId
    - [ ] Test
      - [x] Test si funciona
      - [ ] Test de errores

## Extra Endpoints
### Usuario

- [ ] GET
  - [x] '/busqueda' traerUsuarioPorNombreOPorEmail (query param) (?nombre=Nombre) (?email=email@mail.any) (?apellidos=apellidos)
    - [ ] Test

- [ ] GET
  - [x] '/:id/posts' traerPostsDeUnUsuario
    - [ ] Test
      - [x] Test si funciona
      - [ ] Test de errores 

- [ ] GET
  - [ ] '/:id/likes' traerLikesDeUnUsuario
    - [ ] Test

### Hilo

- [ ] GET
  - [ ] '/busqueda' traerPostPorTituloDataOEdad (query param) (?titulo=Titulo) (?data=DDMMYYYY) (?edad=adulto(bool))
    - [ ] Test
