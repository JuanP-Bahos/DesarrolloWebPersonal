// conf express app.use le de una orden para cada peticion
const express = require('express');
const tareasRouter = require('./routes/tareas.routes');
const swaggerUi = require('swagger-ui-express');
const documentacion = require('./docs/openapi');
const { rutaNoEncontrada, manejarErrores } = require('./middlewares/manejarErrores');
const app = express();
// convertir el cuerpo json a la peticion a req.body, que viene del front
app.use(express.json());


//documentacion de la API
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(documentacion));
app.get('/api/docs.json', (req, res) => {
    res.json(documentacion);
});

// RUTAS
app.get('/api/salud', (req, res) => {
    res.json({estado: 'ok'})
});
app.use('/api/tareas', tareasRouter);


app.use(rutaNoEncontrada);
app.use(manejarErrores);

module.exports = app;