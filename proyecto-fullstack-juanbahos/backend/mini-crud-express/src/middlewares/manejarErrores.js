const HttpError = require('../utils/HttpError');
function rutaNoEncontrada(req, res, next) {
    next(new HttpError(404, `La ruta ${req.method} ${req.originalUrl} no existe`));
}

function manejarErrores(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }

    if (err instanceof HttpError) {
        return res.status(err.statusCode).json({ error: err.message });
    }

    if (err instanceof SyntaxError) {
        return res.status(400).json({ error: 'Error de sintaxis en la solicitud' });
    }

    console.error(err);
    return res.status(500).json({ error: 'Error interno del servidor' });
}


module.exports = {
    rutaNoEncontrada,
    manejarErrores
};
