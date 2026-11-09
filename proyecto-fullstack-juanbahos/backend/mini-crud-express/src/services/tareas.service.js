//capa de servicio para manejar la logica de negocio de las tareas
const tareas = require('../data/tareas.data');
const HttpError = require('../utils/HttpError');

//BASE DE DATOS SIMULADA

let tareas= [
{id:1,titulo:"Realizar avances de desarrollo web", completado:false},
{id:2,titulo:"Hacer tareas de compleja", completado:true},
{id:3,titulo:"Estudiar para el examen de matematicas", completado:false},

];

let siguienteId = 4;

function listar(){
    return tareas;
}

function obtener(id){
    const tareas = tareas.find((t) => t.id === id);
    if(!tarea){
        throw new HttpError(404, 'No existe la tarea con el id ${id}');
    }
    return tarea;
}

function crear(titulo){
    const nueva = {
        id: siguienteId++,
        titulo,
        completado: false
    };
    tareas.push(nueva);
    return nueva;
}

function actualizar(id, cambios){
    const tarea = obtener(id);
    Object.assign(tarea, cambios);
    return tarea;
}

function eliminar(id){
    obtener(id);
    tareas = tareas.filter((t) => t.id !== id);
}

module.exports = {
    listar,
    obtener,
    crear,      
    actualizar,
    eliminar
};  

