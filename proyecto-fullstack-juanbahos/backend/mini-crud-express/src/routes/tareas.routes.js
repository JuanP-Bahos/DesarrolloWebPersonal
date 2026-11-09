// capa de rutas: metodo+url -> controlador

const { Router } = require ("express")

const controlador = require ( '../controllers/tareas.controller');

const router= Router();

router.get('/', controlador.listar)
router.get('/', controlador.obtener);;
router.post('/', controlador.crear);
router.patch('/', controlador.actualizar);
router.delete('/', controlador.eliminar);

module.exports = router;