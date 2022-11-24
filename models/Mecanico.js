import mongoose from "mongoose";
import generarId from "../helpers/generarId.js";
import bcrypt from 'bcrypt';

const mecanicoShema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    telefono: {
        type: String,
        default: null,
        trim: null
    },
    web: {
        type: String,
        default: null
    },
    token: {
        type: String,
        default: generarId(),
    },
    confirmado: {
        type: Boolean,
        default: false
    },
});

mecanicoShema.pre("save", async function (next) {
    if(!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

mecanicoShema.methods.comprobarPassword = async function (passwordForm) {
    return await bcrypt.compare(passwordForm, this.password);
};

const Mecanico = mongoose.model("Mecanico", mecanicoShema);
export default Mecanico;