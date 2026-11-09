const HttpError = require('../utils/HttpError');

function validdarCreacion(req, res, next) {
    const { titulo } = req.body ?? {};
    if (typeof titulo !== 'string' || titulo.trim().length < 3) {
        throw new HttpError(400, 'El título es obligatorio y debe tener al menos 3 caracteres');
    }
    req.body = { titulo: titulo.trim() };
    next();
}



function validdarCambios(req, res, next) {
    const { titulo, completada } = req.body ?? {};
    const cambios = {}; 
if (!titulo !== undefined) {
    if (typeof titulo !== 'string' || titulo.trim().length<3) {
        throw new HttpError(400, 'El título es obligatorio y debe tener al menos 3 caracteres');
    }
    cambios.titulo = titulo.trim();
    }
}
if (completada !== undefined) {
    if (typeof completada !== 'boolean') {
        throw new HttpError(400, 'El campo completada debe ser un valor booleano');
    }
    cambios.completada = completada;
}

if (Object.keys(cambios).length === 0) {
    throw new HttpError(400, 'No se proporcionaron campos válidos para actualizar');
}
req.body = cambios;
next();


module.exports = {
    validdarCreacion,
    validdarCambios
};
