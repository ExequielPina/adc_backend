import Jwt  from "jsonwebtoken";
import Mecanico from "../models/Mecanico.js";

const checkAuth = async (req, res, next) => {
    let token;
    if (
        req.headers.authorization && 
        req.headers.authorization.startsWith("Bearer")
    ) {

        try {
            token = req.headers.authorization.split(' ')[1]

            const decoded = Jwt.verify(token, process.env.JWT_SECRET);

            req.mecanico = await Mecanico.findById(decoded.id).select("-password -token -confirmado");
            return next();

        } catch (error) {
            const e = new Error("Token no válido");   
            return res.status(403).json({ msg: e.message}); 
        }      
    }

    if (!token) {
        const error = new Error("Token no válido");   
        res.status(403).json({ msg: error.message}); 
    }
    next();    
};

export default checkAuth;