const app = require('../../server')
const mongoose = require('mongoose');
const request = require('supertest');

const clave = process.env.DB_CLAVE;
const database = process.env.DB_DATABASE_TEST;
const usuario = process.env.DB_USUARIO;
const cluster = process.env.DB_CLUSTER;

const url = `mongodb+srv://${usuario}:${clave}@${cluster}.lfcn0.mongodb.net/${database}?retryWrites=true&w=majority`;

beforeEach((done) => {
    mongoose.connect(url, {
        useNewUrlPArser: true,
        useUnifiedTopology: true,
    }, () => done());
});

afterEach((done) => {
    mongoose.connection.db.dropDatabase(() => {
        mongoose.connection.close(() => done())
    });
});

describe('POST endpoint /', () => {
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
    test("CREA usuario y retorna 201", async () => {
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

    // test("NO crea usuario porque ya existe un usuario con ese correo y retorna 400", async () => {
    //     let data = {
    //         nombre: 'Test',
    //         edad: '2002-08-17T07:32:37.341Z',
    //         correo: 'test@mail.com',
    //         clave: '1234'
    //     }
    //     await request(app).post('/usuarios').send(data);
    //     const res = await request(app).post('/usuarios').send(data);
    ////TODO: Hacer con que el banco salve los 2 usuarios y mostre un error al inves de salvar, borrar la base y salvar otra vez.
    //     expect(res.body).toMatchObject({ "message": "E11000 duplicate key error collection: testing.usuarios index: correo_1 dup key: { correo: \"test@test.com\" }" })
    //     expect(res.statusCode).toEqual(500); // TODO: Hacer con que retorne 400
    // });
}
)
