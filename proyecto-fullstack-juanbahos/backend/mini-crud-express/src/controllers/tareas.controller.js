// capa controladores : Traductor HTPP lee req llama el servicio y genera una respuesta

const servicio= require('../services/tareas.service');

function listar(req,res){
    res.status(200).json(servicio.listar())
}

function obtener (req,res){
    const id=Number(req.params,id);
    res.status(200).json(servicio.obtener(id));
}

function crear (req,res){
    const nueva = servicio.crear(req.body.titulo);
        res.status(201).json(servicio.crear(id));
}

function actualizar (req,res){
    const id=Number(req.params.id);
    res.status(200),json(servicio.actualizar(id,req.body));
}

function eliminar (req,res){
    servicio.eliminar(Number(req.params.id));
    res.status(204).send()
}

module.exports = {listar, obtener, crear, actualizar, eliminar}