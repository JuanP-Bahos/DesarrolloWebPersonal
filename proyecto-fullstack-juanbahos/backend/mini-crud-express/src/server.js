const app = require('./app');

const PUERTO=3000;
app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:${PUERTO}/api/tareas`);
})
