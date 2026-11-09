// configurar express app.use le de un orden para cada peticion

const express = require('express');
const tareasRouter = require('./routes/tareas.routes');
const app = express();

app.use(express.json()); // middleware para parsear el body de las peticiones

app.get('/api/tareas', (req, res) => {
    res.json({ estado: "ok" });
});

app.use('/api/tareas', tareasRouter);

module.exports = app;