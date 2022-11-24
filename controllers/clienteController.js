import Cliente from "../models/Cliente.js";


const agregarCliente = async (req, res) => {
    const cliente = new Cliente(req.body);
    cliente.mecanico = req.mecanico._id;
    
    try {
        const clienteGuardado = await cliente.save();
        res.json(clienteGuardado);
    } catch (error) {
        console.log(error)
        
    }
};
const obtenerClientes = async (req, res) => {
    const clientes = await Cliente.find().where('mecanico').equals(req.mecanico);
    res.json(clientes);
};

const obtenerCliente = async (req, res) => {
    const { id } = req.params;
    const cliente = await Cliente.findById(id);

    if (!cliente){
        return res.status(404).json({ msg: "No encontrado"});
    }

    if (cliente.mecanico._id.toString() !== req.mecanico._id.toString()) {
        return res.json({ msg: "accion no válida"});
    }
};


const actualizarCliente = async (req, res) => {
    const { id } = req.params;
    const cliente = await Cliente.findById(id);

    if (!cliente){
        return res.status(404).json({ msg: "No encontrado"});
    }
    if (cliente.mecanico._id.toString() !== req.mecanico._id.toString()) {
        return res.json({ msg: "accion no válida"});
    }
    // actualizar cliente 
    cliente.nombre = req.body.nombre || cliente.nombre;
    cliente.matricula = req.body.matricula || cliente.matricula;
    cliente.email = req.body.email || cliente.email;
    cliente.fecha = req.body.fecha || cliente.fecha;
    cliente.averia = req.body.averia || cliente.averia;

    try {
        const clienteActualizado = await cliente.save();
        res.json(clienteActualizado)
    }   catch (error) {
        console.log(error);
 }
};


const eliminarCliente = async (req, res) => {
    const { id } = req.params;
    const cliente = await Cliente.findById(id);

    if (!cliente){
        return res.status(404).json({ msg: "No encontrado"});
    }
    if (cliente.mecanico._id.toString() !== req.mecanico._id.toString()) {
        return res.json({ msg: "accion no válida"});
    }
    
    try {
        await cliente.deleteOne();
        res.json({ msg: "Cliente eliminado"});
    } catch (error) {
        console.log(error);
    }
};



export { agregarCliente, obtenerClientes, obtenerCliente, actualizarCliente, eliminarCliente};



