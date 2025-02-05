const app = require('../../server');
const mongoose = require('mongoose');
const request = require('supertest');

const clave = process.env.DB_CLAVE;
const database = process.env.DB_DATABASE_TEST;
const usuario = process.env.DB_USUARIO;
const cluster = process.env.DB_CLUSTER;

const url = `mongodb+srv://${usuario}:${clave}@${cluster}.lfcn0.mongodb.net/${database}?retryWrites=true&w=majority`;

const URLBase = '/usuarios';
const URLHilos = '/hilos';


let usuarioBase;
let otraResConOtroUsuario;
let hiloBase;

let resBase;
let resHiloBase;

beforeAll((done) => {
    mongoose.connect(url, {
        useNewUrlPArser: true,
        useUnifiedTopology: true,
    }, async () => {
        usuarioBase = {
            nombre: 'Test',
            apellidos: 'Testing',
            edad: '2002-08-17T07:32:37.341Z',
            correo: 'test@mail.com',
            clave: '1234',
            telefono: '+34123456789',
            ciudad: 'here',
            foto: 'http://blank.page',
        };
        resBase = await request(app)
            .post(URLBase)
            .send(usuarioBase);
        hiloBase = {
            titulo: 'Test',
            cuerpo: 'Testing',
            fecha: '2022-03-03T07:32:37.341Z',
            usuario: {
                usuarioId: resBase.body._id,
                nombre: resBase.body.nombre,
                apellidos: resBase.body?.apellidos,
                foto: resBase.body?.foto
            },
            comentarios: [],
            likes: [],
        };
        resHiloBase = await request(app).post(URLHilos).send(hiloBase);
        done();
    });
});

afterAll((done) => {
    mongoose.connection.db.dropDatabase(() => {
        mongoose.connection.close(() => done());
    });
});

describe('POST endpoint "/"', () => {
    /*
     * Tenemos 15 campos (contando __v y _id) pero el retorno tiene 14 porque la clave no viene la clave
        {
            "__v": 0
            "_id": "623dc93c9dd1ac34798780f6",
            "nombre": "Test",
            "apellidos": "Testing",
            "edad": "2002-08-17T07:32:37.341Z",
            "correo": "test@mail.com",
            "telefono": "+34123456789",
            "ciudad": "here",
            "foto": "http://blank.page",
            "esAdministrador": false,
            "siguiendo": Array [],
            "seguidores": Array [],
            "publicaciones": Array [],
            "likes": Array [],
        }
    */
    test("CREA usuario con todos los campos rellenados y retorna 201", async () => {

        expect(resBase.body).toHaveProperty('[]', {
            "__v": resBase.body.__v,
            "_id": resBase.body._id,
            nombre: usuarioBase.nombre,
            apellidos: usuarioBase.apellidos,
            edad: usuarioBase.edad,
            correo: usuarioBase.correo,
            telefono: usuarioBase.telefono,
            ciudad: usuarioBase.ciudad,
            foto: usuarioBase.foto,
            esAdministrador: false,
            siguiendo: [],
            seguidores: [],
            publicaciones: [],
            likes: [],
        });
        expect(resBase.statusCode).toEqual(201);
    });

    test("NO crea usuario porque no has pasado la contraseña y retorna 400", async () => {
        let datos = {
            nombre: 'Test',
            edad: '2002-08-17T07:32:37.341Z',
            correo: 'test@mail.com',
        }
        const res = await request(app)
            .post(URLBase)
            .send(datos);

        expect(res.body).toMatchObject({ "message": "data and salt arguments required" })
        expect(res.statusCode).toEqual(400);
    });

    test("NO crea usuario porque no has pasado o el nombre, o el correo o la edad y retorna 400", async () => {
        let datosSinNombre = {
            edad: '2002-08-17T07:32:37.341Z',
            correo: 'test@mail.com',
            clave: '1234'
        }
        let datosSinEdad = {
            nombre: 'Test',
            correo: 'test@mail.com',
            clave: '1234'
        }
        let datosSinCorreo = {
            nombre: 'Test',
            edad: '2002-08-17T07:32:37.341Z',
            clave: '1234'
        }
        const resNombre = await request(app).post(URLBase).send(datosSinNombre);

        expect(resNombre.body).toMatchObject({ "error": "Usuario validation failed: nombre: Path `nombre` is required." })
        expect(resNombre.statusCode).toEqual(400);

        const resEdad = await request(app).post(URLBase).send(datosSinEdad);

        expect(resEdad.body).toMatchObject({ "error": "Usuario validation failed: edad: Path `edad` is required." })
        expect(resEdad.statusCode).toEqual(400);

        const resCorreo = await request(app).post(URLBase).send(datosSinCorreo);

        expect(resCorreo.body).toMatchObject({ "error": "Usuario validation failed: correo: Path `correo` is required." })
        expect(resCorreo.statusCode).toEqual(400);
    });

    // test("NO crea usuario porque ya existe un usuario con ese correo y retorna 400", async () => {
    // TODO: Preguntar porque ese test falla
    // ! en insomnia va bien, si comenta el models/hilo va bien, si comenta en controllers/HiloController va bien
    // await request(app).post(URLBase).send(usuarioBase);
    // const res = await request(app).post(URLBase).send(usuarioBase);
    // let res2 = await request(app).get(URLBase)
    // console.log(res2.body)
    // expect(res.body).toMatchObject({ "error": "E11000 duplicate key error collection: testing.usuarios index: correo_1 dup key: { correo: \"test@mail.com\" }" })
    // });
});

describe('POST endpoint "/login"', () => {
    test('LOGUEA el usuario por su correo y retorna 200', async () => {
        let datos = {
            correo: 'test@mail.com',
            clave: '1234'
        }
        const res = await request(app)
            .post(`${URLBase}/login`)
            .send(datos);

        expect(res.body).toHaveProperty('usuario', {
            "__v": res.body.usuario.__v,
            "_id": res.body.usuario._id,
            nombre: usuarioBase.nombre,
            apellidos: usuarioBase.apellidos,
            edad: usuarioBase.edad,
            correo: usuarioBase.correo,
            telefono: usuarioBase.telefono,
            ciudad: usuarioBase.ciudad,
            foto: usuarioBase.foto,
            esAdministrador: false,
            siguiendo: [],
            seguidores: [],
            publicaciones: [
                [
                    {
                        "__v": 0,
                        "_id": resHiloBase.body[0]._id,
                        "comentarios": [],
                        "cuerpo": "Testing",
                        "fecha": "2022-03-03T07:32:37.341Z",
                        "likes": [],
                        "titulo": "Test",
                        "usuario": {
                            "apellidos": "Testing",
                            "foto": "http://blank.page",
                            "nombre": "Test",
                            "usuarioId": res.body.usuario._id,
                        },
                    },
                ],
            ],
            likes: [],
        });
        expect(res.body).toHaveProperty('token')
        expect(res.statusCode).toEqual(200);
    });

    test('NO loguea el usuario por la contraseña no estar correcta y retorna 401', async () => {
        let loginInfo = {
            correo: 'test@mail.com',
            clave: '123'
        }
        const res = await request(app)
            .post(`${URLBase}/login`)
            .send(loginInfo);

        expect(res.body).toMatchObject({ msg: 'Usuario o contraseña inválido' });  // retorno de "clave no es correcta" del metodo
        expect(res.statusCode).toEqual(401);
    });

    test('NO loguea usuario por el no existir y retorna 401', async () => {
        let loginInfo = {
            correo: 'test2@mail.com',
            clave: '1234'
        }
        const res = await request(app)
            .post(`${URLBase}/login`)
            .send(loginInfo);

        expect(res.body).toMatchObject({ msg: 'Usuario o contraseña inválido' });  // retorno de "usuario no existe" del metodo
        expect(res.statusCode).toEqual(401);
    });
});

describe('POST endpoint "/:id/siguiendo"', () => {
    test('AÑADE un nuevo usuario a tu lista de usuarios que sigues y retorna 200', async () => {
        let usuario = {
            nombre: 'Test',
            edad: '2002-08-17T07:32:37.341Z',
            correo: 'test2@mail.com',
            clave: '1234',
        }
        otraResConOtroUsuario = await request(app).post(URLBase).send(usuario);
        let datos = {
            siguiendo: {
                _id: resBase.body._id,
                nombre: resBase.body.nombre,
                apellidos: resBase.body.apellidos,
                foto: resBase.body.foto
            },
            usuario: {
                _id: otraResConOtroUsuario.body._id,
                nombre: otraResConOtroUsuario.body.nombre,
                apellidos: otraResConOtroUsuario.body.apellidos,
                foto: otraResConOtroUsuario.body.foto
            },
        }
        let res = await request(app).post(`${URLBase}/${otraResConOtroUsuario.body._id}/siguiendo`).send(datos);
        expect(res.body).toMatchObject({
            usuario: {
                _id: otraResConOtroUsuario.body._id,
                nombre: 'Test',
                edad: '2002-08-17T07:32:37.341Z',
                correo: 'test2@mail.com',
                esAdministrador: false,
                siguiendo: [
                    {
                        "_id": resBase.body._id,
                        "apellidos": "Testing",
                        "foto": "http://blank.page",
                        "nombre": "Test",
                    },
                ],
                seguidores: [],
                publicaciones: [],
                likes: [],
                __v: 0
            }
        });
        expect(res.statusCode).toEqual(200);
    })
})

describe('POST endpoint "/:id/like/:pk"', () => {
    test('AÑADE un nuevo hilo a tu lista de hilos que gusta y retorna 200', async () => {
        const res = await request(app).post(`${URLBase}/${otraResConOtroUsuario.body._id}/like/${resHiloBase.body[0]._id}`);
        expect(res.body).toMatchObject({
            usuario: {
                _id: otraResConOtroUsuario.body._id,
                nombre: 'Test',
                edad: '2002-08-17T07:32:37.341Z',
                correo: 'test2@mail.com',
                esAdministrador: false,
                siguiendo: [{
                    "_id": resBase.body._id,
                    "apellidos": "Testing",
                    "foto": "http://blank.page",
                    "nombre": "Test",
                },],
                seguidores: [],
                publicaciones: [],
                likes: [{
                    "_id": resHiloBase.body[0]._id,
                    "fecha": "2022-03-03T07:32:37.341Z",
                    "titulo": "Test",
                    "usuario": {
                        "_id": resBase.body._id,
                        "apellidos": "Testing",
                        "foto": "http://blank.page",
                        "nombre": "Test",
                    },
                }],
                __v: 0
            }
        })
        expect(res.statusCode).toEqual(200);

        const res2 = await request(app).get(`${URLHilos}/${resHiloBase.body[0]._id}`);
        expect(res2.body).toMatchObject({
            usuario: {
                usuarioId: resBase.body._id,
                nombre: 'Test',
                apellidos: 'Testing',
                foto: 'http://blank.page'
            },
            _id: resHiloBase.body[0]._id,
            titulo: 'Test',
            cuerpo: 'Testing',
            fecha: '2022-03-03T07:32:37.341Z',
            comentarios: [],
            likes: [otraResConOtroUsuario.body._id],
            __v: 0
        });
        expect(res2.statusCode).toEqual(200);
    });
});

describe('GET endpoint "/"', () => {
    test('MUESTRA todos los usuarios de la base de datos y retorna 200', async () => {
        const res = await request(app).get(URLBase)
        expect(res.body).toHaveProperty('[][0].publicaciones');
        expect(res.body).toHaveProperty('[][1].nombre');
        expect(res.body).toHaveProperty('[][2]', {
            "__v": 0,
            "_id": otraResConOtroUsuario.body._id,
            "nombre": 'Test',
            "edad": '2002-08-17T07:32:37.341Z',
            "correo": 'test2@mail.com',
            "esAdministrador": false,
            "likes": [res.body[2].likes[0]],
            "publicaciones": [],
            "seguidores": [],
            "siguiendo": [
                {
                    "_id": resBase.body._id,
                    "apellidos": "Testing",
                    "foto": "http://blank.page",
                    "nombre": "Test",
                },
            ]
        });
        expect(res.statusCode).toEqual(200);
    });
});

describe('GET endpoint "/:id"', () => {
    test('MUESTRA el usuario del id pasado y retorna 200', async () => {
        const res = await request(app).get(`${URLBase}/${resBase.body._id}`)
        expect(res.body).toMatchObject({
            "__v": resBase.body.__v,
            "_id": resBase.body._id,
            "nombre": usuarioBase.nombre,
            "apellidos": usuarioBase.apellidos,
            "telefono": usuarioBase.telefono,
            "ciudad": usuarioBase.ciudad,
            "correo": usuarioBase.correo,
            "edad": usuarioBase.edad,
            "esAdministrador": resBase.body.esAdministrador,
            "foto": usuarioBase.foto,
            "likes": resBase.body.likes,
            "publicaciones": [
                [
                    {
                        "__v": 0,
                        "_id": res.body.publicaciones[0][0]._id,
                        "comentarios": [],
                        "cuerpo": "Testing",
                        "fecha": "2022-03-03T07:32:37.341Z",
                        "likes": [],
                        "titulo": "Test",
                        "usuario": {
                            "apellidos": "Testing",
                            "foto": "http://blank.page",
                            "nombre": "Test",
                            "usuarioId": resBase.body._id,
                        },
                    },
                ],
            ],
            "seguidores": [
                {
                    "_id": otraResConOtroUsuario.body._id,
                    "nombre": "Test",
                },
            ],
            "siguiendo": resBase.body.siguiendo
        })
        expect(res.statusCode).toEqual(200);
    });
    test('NO muestra el usuario del id pasado porque el id no es valido y retorna 404', async () => {
        const res = await request(app).get(`${URLBase}/idInvalido`)

        expect(res.body).toMatchObject({ "error": "Cast to ObjectId failed for value \"idInvalido\" (type string) at path \"_id\" for model \"Usuario\"" })
        expect(res.statusCode).toEqual(404);
    });
});

describe('GET endpoint "/:id/siguiendo"', () => {
    test('MUESTRA los seguidores del usuario con el id pasado y retorna 200', async () => {
        const res = await request(app).get(`${URLBase}/${otraResConOtroUsuario.body._id}/siguiendo`)
        expect(res.body).toMatchObject({
            "_id": otraResConOtroUsuario.body._id,
            "siguiendo": [
                {
                    "_id": resBase.body._id,
                    "nombre": "Test",
                    "apellidos": "Testing",
                    "foto": "http://blank.page",
                },
            ],
        })
        expect(res.statusCode).toEqual(200);
    });
    // TODO: Hacer funcionar 
    // test('NO muestra el usuario del id pasado porque el id no es valido y retorna 404', async () => {
    //     const res = await request(app).get(`${URLBase}/idInvalido/siguiendo`)

    //     expect(res.body).toMatchObject({ "error": "Cast to ObjectId failed for value \"idInvalido\" (type string) at path \"_id\" for model \"Usuario\"" })
    //     expect(res.statusCode).toEqual(404);
    // });
});

describe('GET endpoint "/:id/seguidores"', () => {
    test('MUESTRA el usuario del id pasado y retorna 200', async () => {
        const res = await request(app).get(`${URLBase}/${resBase.body._id}/seguidores`)
        expect(res.body).toMatchObject({
            "_id": resBase.body._id,
            "seguidores": [
                {
                    "_id": otraResConOtroUsuario.body._id,
                    "nombre": "Test",
                },
            ],
        })
        expect(res.statusCode).toEqual(200);
    });
    // TODO: hacer funcionar
    // test('NO muestra el usuario del id pasado porque el id no es valido y retorna 404', async () => {
    //     const res = await request(app).get(`${URLBase}/idInvalido/seguidores`)

    //     expect(res.body).toMatchObject({ "error": "Cast to ObjectId failed for value \"idInvalido\" (type string) at path \"_id\" for model \"Usuario\"" })
    //     expect(res.statusCode).toEqual(404);
    // });
});

describe('GET endpoint "/:id/publicaciones"', () => {
    test('MUESTRA los posts del usuario con el id pasado y retorna 200', async () => {
        const res = await request(app).get(`${URLBase}/${resBase.body._id}/publicaciones`);
        expect(res.body).toMatchObject({
            "_id": resBase.body._id,
            "publicaciones": [
                [{
                    "__v": 0,
                    "_id": res.body.publicaciones[0][0]._id,
                    "comentarios": [],
                    "cuerpo": "Testing",
                    "fecha": "2022-03-03T07:32:37.341Z",
                    "likes": [],
                    "titulo": "Test",
                    usuario: {
                        usuarioId: resBase.body._id,
                        nombre: resBase.body.nombre,
                        apellidos: resBase.body?.apellidos,
                        foto: resBase.body?.foto
                    },
                },]
            ],
        })
        expect(res.statusCode).toEqual(200);
    })
})

describe('GET endpoint "/:id/likes"', () => {
    test('MUESTRA los likes del usuario con el id pasado y retorna 200', async () => {
        const res = await request(app).get(`${URLBase}/${otraResConOtroUsuario.body._id}/likes`);
        expect(res.body).toMatchObject({
            usuario: {
                "_id": otraResConOtroUsuario.body._id,
                "likes": [
                    {
                        "_id": resHiloBase.body[0]._id,
                        "fecha": "2022-03-03T07:32:37.341Z",
                        "titulo": "Test",
                        "usuario": {
                            "_id": resBase.body._id,
                            "apellidos": "Testing",
                            "foto": "http://blank.page",
                            "nombre": "Test",
                        },
                    },
                ],
            }
        })
        expect(res.statusCode).toEqual(200);
    })
})

describe('PATCH endpoint "/:id"', () => {
    test('CAMBIA los datos del usuario con el id pasado y retorna 200', async () => {
        let datos = {
            "apellidos": "Test",
            "ciudad": "aqui",
            "correo": "test1@mail.com",
            "edad": "2002-09-17T07:32:37.341Z",
            "esAdministrador": true,
            "foto": "http://github.com",
            "nombre": "Test2",
            "likes": [{ id: '1', postId: '1' }],
            "publicaciones": [{ postId: '1' }],
            // TODO: Impedir que el seguidores y el siguiendo se pueda cambiar en el patch.
            //"seguidores": [{ id: '1' }],
            //"siguiendo": [{ id: '1' }],
            "telefono": "+34123456799",
        }
        const res = await request(app).patch(`${URLBase}/${resBase.body._id}`).send(datos)
        expect(res.body).toMatchObject({
            usuario: {
                "__v": 0,
                "_id": resBase.body._id,
                "apellidos": datos.apellidos,
                "ciudad": datos.ciudad,
                "correo": datos.correo,
                "edad": datos.edad,
                "esAdministrador": true,
                "foto": datos.foto,
                "nombre": datos.nombre,
                "likes": datos.likes,
                "publicaciones": datos.publicaciones,
                // "seguidores": datos.seguidores,
                // "siguiendo": datos.siguiendo,
                "telefono": datos.telefono,
            }
        })
        expect(res.statusCode).toEqual(200);
        resBase = { body: res.body.usuario }
    })

    test('NO cambia la clave del usuario con el id pasado y retorna 200', async () => {
        let datos = {
            "clave": "12345"
        }
        const res = await request(app).patch(`${URLBase}/${resBase.body._id}`).send(datos)

        expect(res.body).toHaveProperty("error", "Para cambiar la clave necesita de acceder el endpoint de cambiar clave.");
        expect(res.statusCode).toEqual(200);

        const res2 = await request(app).post(`${URLBase}/login`).send({ correo: datos.correo, clave: datos.clave })

        expect(res2.body).toMatchObject({ msg: 'Usuario o contraseña inválido' });
        expect(res2.statusCode).toEqual(401);
    })

    test('NO cambia el usuario por no tener cambios por hacer y retorna 422', async () => {
        const res = await request(app).patch(`${URLBase}/${resBase.body._id}`).send({})

        expect(res.body).toMatchObject({
            "error": "Para cambiar los datos del usuario necesita pasar algun dato para ser cambiado."
        });
        expect(res.statusCode).toEqual(422);
    })

    test('NO cambia el usuario por estar intentando cambiar su id y retorna 422', async () => {
        const res = await request(app).patch(`${URLBase}/${resBase.body._id}`).send({ _id: "1" })

        expect(res.body).toMatchObject({
            "error": "Tu no puedes cambiar el id del usuario"
        });
        expect(res.statusCode).toEqual(422);
    })

    test('NO cambia el usuario por estar intentando cambiar su version y retorna 422', async () => {
        const res = await request(app).patch(`${URLBase}/${resBase.body._id}`).send({ __v: "1" })

        expect(res.body).toMatchObject({
            "error": "Tu no puedes cambiar la version del usuario"
        });
        expect(res.statusCode).toEqual(422);
    })

    test('NO cambia el usuario del id pasado porque el id no es valido y retorna 404', async () => {
        const res = await request(app).patch(`${URLBase}/idInvalido`).send({ apellidos: "Test" })

        expect(res.body).toMatchObject({ "error": "Cast to ObjectId failed for value \"idInvalido\" (type string) at path \"_id\" for model \"Usuario\"" })
        expect(res.statusCode).toEqual(404);
    });
})

describe('PATCH endpoint "/:id/cambiar-clave"', () => {
    test('CAMBIA los datos del usuario con el id pasado y retorna 200', async () => {
        let datos = {
            "clave": "1234",
            "claveNueva": "12345",
        }
        const res = await request(app).patch(`${URLBase}/${resBase.body._id}/cambiar-clave`).send(datos)
        expect(res.body).toMatchObject({
            mensaje: "Clave cambiada con sucesso"
        })
        expect(res.statusCode).toEqual(200);

        const res2 = await request(app).post(`${URLBase}/login`).send({ correo: resBase.body.correo, clave: datos.claveNueva });
        expect(res2.body).toMatchObject({
            usuario: {
                "__v": 0,
                "_id": resBase.body._id,
                "apellidos": resBase.body.apellidos,
                "ciudad": resBase.body.ciudad,
                "correo": resBase.body.correo,
                "edad": resBase.body.edad,
                "esAdministrador": resBase.body.esAdministrador,
                "foto": resBase.body.foto,
                "nombre": resBase.body.nombre,
                "likes": resBase.body.likes,
                "publicaciones": resBase.body.publicaciones,
                "seguidores": resBase.body.seguidores,
                "siguiendo": resBase.body.siguiendo,
                "telefono": resBase.body.telefono,
            }
        })
        expect(res2.statusCode).toEqual(200);
    })
})

describe('DELETE endpoint "/:id/siguiendo/:pk"', () => {
    test('BORRA de la lista de siguiendo el usuario que el usuario del id pasado ha pasado en el segundo param y retorna 200', async () => {
        const res = await request(app).delete(`${URLBase}/${otraResConOtroUsuario.body._id}/siguiendo/${resBase.body._id}`)
        expect(res.body).toMatchObject({
            usuario: {
                _id: otraResConOtroUsuario.body._id,
                nombre: 'Test',
                edad: '2002-08-17T07:32:37.341Z',
                correo: 'test2@mail.com',
                esAdministrador: false,
                siguiendo: [],
                seguidores: [],
                publicaciones: [],
                likes: [res.body.usuario.likes[0]],
                __v: 0
            }
        })
        expect(res.statusCode).toEqual(200);

        const res2 = await request(app).get(`${URLBase}/${resBase.body._id}`)
        expect(res2.body).toMatchObject({
            "__v": 0,
            "_id": resBase.body._id,
            "apellidos": "Test",
            "ciudad": "aqui",
            "correo": "test1@mail.com",
            "edad": "2002-09-17T07:32:37.341Z",
            "esAdministrador": true,
            "foto": "http://github.com",
            "likes": [
                {
                    "id": "1",
                    "postId": "1",
                },
            ],
            "nombre": "Test2",
            "publicaciones": [
                {
                    "postId": "1",
                },
            ],
            "seguidores": [],
            "siguiendo": [],
            "telefono": "+34123456799",
        })
        expect(res2.statusCode).toEqual(200);
    });
    test('NO borra el usuario del id pasado porque el id no es valido y retorna 404', async () => {
        const res = await request(app).delete(`${URLBase}/idInvalido/siguiendo/idInvalido`)

        expect(res.body).toMatchObject({ "error": "Cast to ObjectId failed for value \"idInvalido\" (type string) at path \"_id\" for model \"Usuario\"" })
        expect(res.statusCode).toEqual(404);
    });
});

describe('DELETE endpoint "/:id/like/:pk"', () => {
    test('BORRA de la lista de likes el usuario que el usuario del id pasado ha pasado en el segundo param y retorna 200', async () => {
        const res = await request(app).delete(`${URLBase}/${otraResConOtroUsuario.body._id}/like/${resBase.body._id}`)
        expect(res.body).toMatchObject({
            usuario: {
                _id: otraResConOtroUsuario.body._id,
                nombre: 'Test',
                edad: '2002-08-17T07:32:37.341Z',
                correo: "test2@mail.com",
            }
        });
        expect(res.statusCode).toEqual(200);

        const res2 = await request(app).get(`${URLHilos}/${resHiloBase.body[0]._id}`);
        expect(res2.body).toMatchObject({
            usuario: {
                usuarioId: resBase.body._id,
                nombre: 'Test',
                apellidos: 'Testing',
                foto: 'http://blank.page'
            },
            _id: resHiloBase.body[0]._id,
            titulo: 'Test',
            cuerpo: 'Testing',
            fecha: '2022-03-03T07:32:37.341Z',
            comentarios: [],
            likes: [otraResConOtroUsuario.body._id],
            __v: 0
        });
        expect(res2.statusCode).toEqual(200);
    });
})


describe('DELETE endpoint "/:id"', () => {
    test('BORRA el usuario del id pasado y retorna 200', async () => {
        const res = await request(app).delete(`${URLBase}/${resBase.body._id}`)
        expect(res.body).toMatchObject({ "usuario": "Usuario con el correo test1@mail.com ha sido borrado con suceso" })
        expect(res.statusCode).toEqual(200);
    });
    test('NO borra el usuario del id pasado porque el id no es valido y retorna 404', async () => {
        const res = await request(app).delete(`${URLBase}/idInvalido`)

        expect(res.body).toMatchObject({ "error": "Cast to ObjectId failed for value \"idInvalido\" (type string) at path \"_id\" for model \"Usuario\"" })
        expect(res.statusCode).toEqual(404);
    });
});