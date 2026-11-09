// capa de rutas : traduce la peticion http a una llamada a un controlador

const { Router } = require('express');

const controlador = require('../controllers/tareas.controller');

const router = Router();

router.get('/api/tareas', controlador.listar);

router.get('/api/tareas/:id', controlador.obtener);

router.post('/api/tareas', controlador.crear);

router.patch('/api/tareas/:id', controlador.actualizar);

router.delete('/api/tareas/:id', controlador.eliminar);

module.exports = router;