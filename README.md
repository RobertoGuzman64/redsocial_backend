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

  - [ ] '/siguiendo' traerUsuariosSeguidos
    - [ ] Test

- [x] POST
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
  - [ ] '/' traerPosts
    - [ ] Test
  
  - [ ] '/:id' traerPostId
    - [ ] Test

- [ ] POST
  - [ ] '/' crearPost
    - [ ] Test

- [ ] PUT/PATCH
  - [ ] '/:id' cambiaPost
    - [ ] Test

- [ ] DELETE
  - [ ] '/:id' borrarPostId
    - [ ] Test

## Extra
### Usuario

- [ ] GET
  - [ ] '/busqueda' traerUsuarioPorNombreOPorEmail (query param) (?nombre=Nombre) (?email=email@mail.any) (?apellidos=apellidos)
    - [ ] Test

- [ ] GET
  - [ ] '/:id/posts' traerPostsDeUnUsuario
    - [ ] Test

### Post

- [ ] GET
  - [ ] '/busqueda' traerPostPorTituloDataOEdad (query param) (?titulo=Titulo) (?data=DDMMYYYY) (?edad=adulto(bool))
    - [ ] Test

