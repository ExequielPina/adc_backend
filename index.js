import express from "express";
import  dotenv from "dotenv";
import cors from "cors";
import connectionDB from "./config/db.js";
import mecanicoRoutes from './routes/mecanicoRoutes.js';
import clienteRoutes from './routes/clienteRoutes.js';

const app = express();
app.use(express.json());

dotenv.config();

connectionDB();

const dominiosPermitidos = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: function(origin, callback) {
        if (dominiosPermitidos.indexOf( origin ) !== -1 ) {
            callback(null, true)
        } else {
            callback( new Error("No permitido por cors"));
        }
    },
};

app.use(cors(corsOptions));

app.use("/api/mecanico", mecanicoRoutes);
app.use("/api/clientes", clienteRoutes);

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
});

