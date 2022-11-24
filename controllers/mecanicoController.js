import Mecanico from "../models/Mecanico.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import newPass from "../helpers/newPass.js";

const registrar = async (req, res) =>{
    
 const { email, nombre } = req.body;

    // prevenir usuarios duplicados
    const existeUsuario = await Mecanico.findOne({ email });

    if (existeUsuario) {
        const error = new Error("Usuario ya registrado");
        return res.status(400).json({ msg: error.message });
    } 

    try {
        // Guardar registro
        const mecanico = new Mecanico(req.body);
        const mecanicoGuardar = await mecanico.save();

        // Envio de email
        emailRegistro({
            email,
            nombre,
            token: mecanicoGuardar.token
        });

        res.json(mecanicoGuardar);
    }   catch (error) {
        console.log(error)

    }   
};

const perfil = (req, res) =>{
    const { mecanico } = req;
    res.json(mecanico );
};

const confirmar = async (req, res) => {
    const { token } = req.params;

    const usuarioConfirmar = await Mecanico.findOne({token})

    if(!usuarioConfirmar) {
        const error = new Error("Token no valido");
        return res.status(404).json({ msg: error.message});
    }

   try {
    usuarioConfirmar.token = null; // Borra el token para que no pueda ser reutilizado 
    usuarioConfirmar.confirmado = true;
    await usuarioConfirmar.save()

    res.json({ msg: "Usuario confirmado correctamente" });
    
   } catch (error) {
    
   }

    
};

const autenticar = async (req, res) => {
    const { email, password } = req.body

    // comprobar si el usuario existe
    const usuario = await Mecanico.findOne({ email });

    if(!usuario) {
        const error = new Error("El usuario no existe");
        return res.status(404).json({ msg: error.message });
    }
    // Comprobar si confirmo el correo
    if (!usuario.confirmado) {
        const error = new Error("Tu cuenta no ha sido confirmada");
        return res.status(403).json({ msg: error.message});
    } 
    // Comprobar el password
    if ( await usuario.comprobarPassword(password)) {
        // Autenticar
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id),
        });
    }else{
        const error = new Error("Contraseña incorrecta");
        return res.status(403).json({ msg: error.message});
    }

};

const restablecerPass = async (req, res) => {
    const {email} = req.body;

    const existeMecanico = await Mecanico.findOne({email});

    if (!existeMecanico) {
        const error = new Error("El usuario no existe");
        return res.status(400).json({ msg: error.message});
    }

    try {
        existeMecanico.token = generarId();
        await existeMecanico.save();

        // Enviar email para restablecer contraseña
        newPass({
            email,
            nombre: existeMecanico.nombre,
            token: existeMecanico.token,

        });

        res.json({ msg: "Hemos enviado un email con las instrucciones"})
    } catch (error) {
        console.log(error);
        
    }
};

const comprobarToken = async (req, res) => {
    const { token } = req.params;
    const tokenValido = await Mecanico.findOne({token});

    if (tokenValido) {
        res.json({ msg: "Token válido, el usuario existe"})
    }else{
        const error = new Error("Token no valido");
        return res.status(400).json({ msg: error.message});
    }
};

const nuevaPass = async (req, res) => {
    const { token } = req.params
    const { password} = req.body

    const mecanico = await Mecanico.findOne({ token })
    if(!mecanico) {
        const error = new Error('Hubo un error')
        return res.status(400).json({msg: error.message});
    }

    try {
        mecanico.token = null;
        mecanico.password = password;
        await mecanico.save();
        res.json({ msg: "Password modificado correctamente"});
    } catch (error) {
        
    }
};

const actualizarPerfil = async (req, res) => {
    const mecanico = await Mecanico.findById(req.params.id);
    if (!mecanico) {
        const error = new Error("Hubo un error");
        return res.status(400).json({msg: error.message});
    }

    const { email} = req.body
    if (mecanico.email !== req.body.email) {
        const existeEmail = await Mecanico.findOne({email})
        if(existeEmail){
        const error = new Error("Email ya registrado");
        return res.status(400).json({msg: error.message});
       } 
    }


    try {
        mecanico.nombre = req.body.nombre || mecanico.nombre;
        mecanico.telefono = req.body.telefono || mecanico.telefono;
        mecanico.email = req.body.email || mecanico.email;
        mecanico.web = req.body.web || mecanico.web;

        const mecanicoActualizado = await mecanico.save();
        res.json(mecanicoActualizado)
    } catch (error) {
        console.log(error)
    }
};

const actualizarPass = async (req, res) => {

    // leer los datos
    const { id } = req.mecanico
    const { passActual, nuevaPass} = req.body

    const mecanico = await Mecanico.findById(id);
    if (!mecanico) {
        const error = new Error("Hubo un error");
        return res.status(400).json({msg: error.message});
    } 

    // Se comprueba su password actual
    if (await mecanico.comprobarPassword(passActual)) {
        // Almacenar nueva contraseña
        mecanico.password = nuevaPass;
        await mecanico.save();
        res.json({msg: "Contraseña actualizada correctamente"})
    } else {
        const error = new Error("La contraseña es incorrecta");
        return res.status(400).json({msg: error.message});
    }

    
};


export { registrar, 
         perfil, 
         confirmar, 
         autenticar, 
         restablecerPass, 
         comprobarToken, 
         nuevaPass, 
         actualizarPerfil,
         actualizarPass }