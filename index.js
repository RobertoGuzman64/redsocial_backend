const dbconnect = require('./db/dbconnect');
const PORT = process.env.PORT || 5500;
const app = require('./server');

dbconnect();

app.listen(PORT, () => { console.log(`Nodo del servidor levantado en http://localhost:${PORT}`)})