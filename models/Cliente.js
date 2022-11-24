import mongoose from "mongoose";


const clienteSchema = mongoose.Schema(
    {
    nombre: {
        type: String,
        required: true,
    },
    matricula: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    fecha: {
        type: Date,
        required: true,
        default: Date.now(),
    },
    averia: {
        type: String,
        required: true,
    },
    mecanico: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mecanico'
    },
    },

    {
     timestamps: true,
    }
    
);

const Cliente = mongoose.model("Cliente", clienteSchema);

export default Cliente;