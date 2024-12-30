import mongoose from "mongoose";

// se define el esquema para las tareas...
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true, // Título obligatorio
    },
    description: {
        type: String,
        default: '', // Descripción opcional
    },
    completed: {
        type: Boolean,
        default: false, // Estado por defecto false
    },
    createdAt: {
        type: Date,
        default: Date.now, // Fecha de creación, por defecto la fecha actual
    },
});

const Task = mongoose.model('Task', taskSchema);

export default Task;