const express = require('express');
const app = express();
const cors = require('cors');
const dbconnect = require('./db/dbconnect');
const PORT = process.env.PORT || 5500;

app.use(express.json());
app.use(cors());

dbconnect();

app.listen(PORT, () => { console.log(`Nodo del servidor levantado en http://localhost:${PORT}`)})