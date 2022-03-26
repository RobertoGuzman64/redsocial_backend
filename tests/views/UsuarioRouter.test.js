const app = require('../../server')
const mongoose = require('mongoose');
const request = require('supertest');

const clave = process.env.DB_CLAVE;
const database = process.env.DB_DATABASE_TEST;
const usuario = process.env.DB_USUARIO;
const cluster = process.env.DB_CLUSTER;

const url = `mongodb+srv://${usuario}:${clave}@${cluster}.lfcn0.mongodb.net/${database}?retryWrites=true&w=majority`;

beforeAll((done) => {
    mongoose.connect(url, {
        useNewUrlPArser: true,
        useUnifiedTopology: true,
    }, () => done());
});

afterAll((done) => {
    mongoose.connection.db.dropDatabase(() => {
        mongoose.connection.close(() => done())
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
        let data = {
            nombre: 'Test',
            apellidos: 'Testing',
            edad: '2002-08-17T07:32:37.341Z',
            correo: 'test@mail.com',
            clave: '1234',
            telefono: '+34123456789',
            ciudad: 'here',
            foto: 'http://blank.page',
        }
        const res = await request(app)
            .post('/usuarios')
            .send(data);

        expect(res.body).toHaveProperty('[]', {
            "__v": res.body.__v,
            "_id": res.body._id,
            nombre: data.nombre,
            apellidos: data.apellidos,
            edad: data.edad,
            correo: data.correo,
            telefono: data.telefono,
            ciudad: data.ciudad,
            foto: data.foto,
            esAdministrador: false,
            siguiendo: [],
            seguidores: [],
            publicaciones: [],
            likes: [],
        });
        expect(res.statusCode).toEqual(201);
    });

    test("NO crea usuario porque no has pasado la contraseña y retorna 400", async () => {
        let data = {
            nombre: 'Test',
            edad: '2002-08-17T07:32:37.341Z',
            correo: 'test@mail.com',
        }
        const res = await request(app)
            .post('/usuarios')
            .send(data);

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
        const resNombre = await request(app).post('/usuarios').send(datosSinNombre);

        expect(resNombre.body).toMatchObject({ "message": "Usuario validation failed: nombre: Path `nombre` is required." })
        expect(resNombre.statusCode).toEqual(400);

        const resEdad = await request(app).post('/usuarios').send(datosSinEdad);

        expect(resEdad.body).toMatchObject({ "message": "Usuario validation failed: edad: Path `edad` is required." })
        expect(resEdad.statusCode).toEqual(400);

        const resCorreo = await request(app).post('/usuarios').send(datosSinCorreo);

        expect(resCorreo.body).toMatchObject({ "message": "Usuario validation failed: correo: Path `correo` is required." })
        expect(resCorreo.statusCode).toEqual(400);
    });

    test("NO crea usuario porque ya existe un usuario con ese correo y retorna 400", async () => {
        let data = {
            nombre: 'Test',
            edad: '2002-08-17T07:32:37.341Z',
            correo: 'test@mail.com',
            clave: '1234'
        }
        const res = await request(app).post('/usuarios').send(data);
        expect(res.body).toMatchObject({ "message": "E11000 duplicate key error collection: testing.usuarios index: correo_1 dup key: { correo: \"test@mail.com\" }" })
        expect(res.statusCode).toEqual(400);
    });
})

describe('POST endpoint "/login"', () => {
    test('LOGUEA el usuario por su correo y retorna 200', async () => {
        let usuario = {
            nombre: 'Test',
            apellidos: 'Testing',
            edad: '2002-08-17T07:32:37.341Z',
            correo: 'test@mail.com',
            clave: '1234',
            telefono: '+34123456789',
            ciudad: 'here',
            foto: 'http://blank.page',
        }
        await request(app).post('/usuarios').send(usuario);
        let data = {
            correo: 'test@mail.com',
            clave: '1234'
        }
        const res = await request(app)
            .post('/usuarios/login')
            .send(data);

        expect(res.body).toHaveProperty('usuario', {
            "__v": res.body.usuario.__v,
            "_id": res.body.usuario._id,
            nombre: usuario.nombre,
            apellidos: usuario.apellidos,
            edad: usuario.edad,
            correo: usuario.correo,
            telefono: usuario.telefono,
            ciudad: usuario.ciudad,
            foto: usuario.foto,
            esAdministrador: false,
            siguiendo: [],
            seguidores: [],
            publicaciones: [],
            likes: [],
        });
        expect(res.body).toHaveProperty('token')
        expect(res.statusCode).toEqual(200);
    })

    test('NO loguea el usuario por la contraseña no estar correcta y retorna 401', async () => {
        let usuario = {
            nombre: 'Test',
            edad: '2002-08-17T07:32:37.341Z',
            correo: 'test2@mail.com',
            clave: '1234',
        }
        await request(app).post('/usuarios').send(usuario);

        let loginInfo = {
            correo: 'test2@mail.com',
            clave: '123'
        }
        const res = await request(app)
            .post('/usuarios/login')
            .send(loginInfo);

        expect(res.body).toMatchObject({ msg: 'Usuario o contraseña inválido' });  // retorno de "clave no es correcta" del metodo
        expect(res.statusCode).toEqual(401);
    })

    test('NO loguea usuario por el no existir y retorna 401', async () => {
        let loginInfo = {
            correo: 'test3@mail.com',
            clave: '1234'
        }
        const res = await request(app)
            .post('/usuarios/login')
            .send(loginInfo);

        expect(res.body).toMatchObject({ msg: 'Usuario o contraseña inválido' });  // retorno de "usuario no existe" del metodo
        expect(res.statusCode).toEqual(401);
    })
})

describe('GET endpoint "/"', () => {
    test('MOSTRA todos los usuarios en la base de datos y retorna 200', async () => {
        const res = await request(app).get('/usuarios')
        expect(res.body).toMatchObject([
            {
                "__v": 0,
                "_id": res.body[0]._id,
                "apellidos": "Testing",
                "ciudad": "here",
                "correo": "test@mail.com",
                "edad": "2002-08-17T07:32:37.341Z",
                "esAdministrador": false,
                "foto": "http://blank.page",
                "likes": [],
                "nombre": "Test",
                "publicaciones": [],
                "seguidores": [],
                "siguiendo": [],
                "telefono": "+34123456789"
            }, {
                "__v": 0,
                "_id": res.body[1]._id,
                "correo": "test2@mail.com",
                "edad": "2002-08-17T07:32:37.341Z",
                "esAdministrador": false,
                "likes": [],
                "nombre": "Test",
                "publicaciones": [],
                "seguidores": [],
                "siguiendo": []
            }])
        expect(res.statusCode).toEqual(200);
    })
})