const HttpError = require("../utils/HttpError");

let tareas = [
  { id: 1, titulo: "Realizar avances de Proyecto desarrollo web", completado: false },
  { id: 2, titulo: "Hacer tareas de Real", completado: true },
  { id: 3, titulo: "Estudiar para compleja", completado: true },
];

let siguienteId = 4;
function listar(){
    return tareas;
}

function listar(){
    return tareas;
}

function obtener(id){
    const tarea = tareas.find((t)  => t.id === id);
    if (!tarea) {
        throw new HttpError(404, `No existe la tarea con el id ${id}`);
    }
    return tarea;
}

function crear(titulo) {
    const nuevaTarea = {
        id: siguienteId++,
        titulo,
        completado: false,
    };
    tareas.push(nuevaTarea);
    return nuevaTarea;
}
    
function actualizar(id, cambios) {
    const tarea = obtener(id);
    object.assign(tarea, cambios);
    return tarea;
}

function eliminar(id) {
    obtener(id);
    tareas = tareas.filter((t) => t.id !== id);
}

module.exports = {
    listar,
    obtener,
    crear,
    actualizar,
    eliminar,
};