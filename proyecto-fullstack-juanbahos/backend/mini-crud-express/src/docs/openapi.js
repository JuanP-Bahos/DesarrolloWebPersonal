// Documentation for the API using OpenAPI Specification (Swagger)
module.exports = {
    openapi: "3.0.0",
    info: {
        title: "Tareas API",
        version: "1.0.0",
        description: 'Mini CRUD de tareas con Express, organizado en rutas, controladores y servicios.',
    },
    servers: [
        {
            url: "http://localhost:3000/api", description: "Servidor local de desarrollo"
        }],
    tags: [{ name: "Tareas", description: "Creación, consultar, actualización y eliminación de tareas" }],

    //piezas reutilizables para formar una tarea 
    components: {
        schemas: {
            Tarea: {
                type: "object",
                properties: {
                    id: { type: 'integer', description: "Identificador único de la tarea", example: 1 },
                    titulo: { type: "string", description: "Título de la tarea", minLength: 3, example: "Explicar OpenAPI" },
                    completada: { type: "boolean", description: "Indica si la tarea está completada o no", example: false },
                },
            },
            NuevaTarea: {
                type: "object",
                required: ["titulo"],
                properties: {
                    titulo: { type: "string", description: "Título de la tarea", minLength: 3, example: "Aprender OpenAPI" },
                },
            },
            CambioTarea: {
                type: "object",
                properties: {
                    titulo: { type: "string", description: "Título de la tarea", minLength: 3, example: "Aprender OpenAPI" },
                    completada: { type: "boolean", description: "Indica si la tarea está completada o no", example: true },
                },
            },
            Error: {
                type: "object",
                properties: {
                    mensaje: { type: 'string', example: 'No existe la tarea con el id 1' },
                },
            },
        },
        parameters: {
            IdTarea: {
                name: "id",
                in: "path",
                required: true,
                description: "Identificador único de la tarea",
                schema: { type: "integer", example: 1 },
            },
        },
    },
    paths: {
        "/tareas": {
            get: {
                tags: ["Tareas"],
                summary: "Obtener todas las tareas",
                responses: {
                    "200": {
                        description: "Lista de tareas",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: { $ref: "#/components/schemas/Tarea" },
                                },
                            },
                        },
                        post: {
                            tags: ["Tareas"],
                            summary: "Crear una nueva tarea",
                            requestBody: {
                                required: true,
                                content: {
                                    "application/json": {
                                        schema: { $ref: "#/components/schemas/NuevaTarea" }
                                    }
                                }
                            },
                            responses: {
                                "201": {
                                    description: "Tarea creada exitosamente",
                                    content: {
                                        "application/json": {
                                            schema: { $ref: "#/components/schemas/Tarea" }
                                        }
                                    }
                                }
                            },
                            "400": {
                                description: "Solicitud inválida",
                                content: {
                                    "application/json": {
                                        schema: { $ref: "#/components/schemas/Error" }
                                    }
                                }
                            }
                        },
                    },
                },
            },
            '/tareas/{id}': {
                parameters: [{ $ref: '#/components/parameters/IdTarea' }],
                get: {
                    tags: ['Tareas'],
                    summary: 'Consultar una tarea',
                    responses: {
                        200: { description: 'La tarea', content: { 'application/json': { schema: { $ref: '#/components/schemas/Tarea' } } } },
                        404: { description: 'No existe', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                    },
                },
                patch: {
                    tags: ['Tareas'],
                    summary: 'Modificar el título o marcar como completada',
                    requestBody: {
                        required: true,
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/CambiosTarea' } } },
                    },
                    responses: {
                        200: { description: 'Tarea modificada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Tarea' } } } },
                        400: { description: 'Datos inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                        404: { description: 'No existe', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                    },
                },
                delete: {
                    tags: ['Tareas'],
                    summary: 'Eliminar una tarea',
                    responses: {
                        204: { description: 'Eliminada (sin cuerpo)' },
                        404: { description: 'No existe', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                    },
                },
            },
        },
    },
};