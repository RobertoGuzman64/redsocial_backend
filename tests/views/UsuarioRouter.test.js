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
        {
            nombre: 'Luigi',
            edad: '2022-03-25T07:24:06.079Z',
            correo: 'ligi@python.com',
            esAdministrador: false,
            siguiendo: [],
            seguidores: [],
            publicaciones: [],
            _id: '623d6e16177deb21bcd116ba',
            __v: 0
        }
    */
    test("Crea usuario y retorna 201", async () => {
        let data = {
            nombre: 'test',
            edad: '2002-08-17T07:32:37.341Z',
            correo: 'test@mail.com',
            clave: '1234'
        }
        const res = await request(app)
            .post('/usuarios')
            .send(data);

        expect(res.body).toHaveProperty('nombre', data.nombre);
        expect(res.body).toHaveProperty('edad', data.edad);
        expect(res.body).toHaveProperty('correo', data.correo);
        expect(res.body).toHaveProperty('esAdministrador', false);
        expect(res.body).toHaveProperty('siguiendo', []);
        expect(res.body).toHaveProperty('seguidores', []);
        expect(res.body).toHaveProperty('publicaciones', []);
        expect(res.statusCode).toEqual(201);
    });

    test("NO crea usuario porque no has pasado la contraseña y retorna 400", async () => {
        let data = {
            nombre: 'Luigi',
            edad: '2002-08-17T07:32:37.341Z',
            correo: 'luigi@python.com',
        }
        const res = await request(app)
            .post('/usuarios')
            .send(data);

        expect(res.body).toMatchObject({ "message": "data and salt arguments required" })
        expect(res.statusCode).toEqual(400);
    });

    test("NO crea usuario porque no has pasado el nombre y retorna 400", async () => {
        let data = {
            edad: '2002-08-17T07:32:37.341Z',
            correo: 'luigi@python.com',
            clave: '1234'
        }
        const res = await request(app)
            .post('/usuarios')
            .send(data);

        expect(res.body).toMatchObject({ "message": "Usuario validation failed: nombre: Path `nombre` is required." })
        expect(res.statusCode).toEqual(400);
    });

    // test("NO crea usuario porque ya existe un usuario con ese correo y retorna 400", async () => {
    //     let data = {
    //         nombre: 'Luigi',
    //         edad: '2002-08-17T07:32:37.341Z',
    //         correo: 'test@test.com',
    //         clave: '1234'
    //     }
    //     await request(app).post('/usuarios').send(data);
    //     const res = await request(app).post('/usuarios').send(data); 
    // TODO: Hacer con que el banco salve los 2 usuarios y mostre un error al inves de salvar, borrar la base y salvar otra vez.
    //     expect(res.body).toMatchObject({ "message": "E11000 duplicate key error collection: testing.usuarios index: correo_1 dup key: { correo: \"test@test.com\" }" })
    //     expect(res.statusCode).toEqual(500); // TODO: Hacer con que retorne 400
    // });
}
)
