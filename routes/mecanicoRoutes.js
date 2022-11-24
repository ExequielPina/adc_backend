import express from 'express';
const router = express.Router();
import { registrar, perfil, confirmar, autenticar, restablecerPass, comprobarToken, nuevaPass, actualizarPerfil, actualizarPass } 
from '../controllers/mecanicoController.js';
import checkAuth from '../middleware/authMiddleware.js';

// Rutas publica 
router.post("/", registrar);
router.get("/confirmar/:token", confirmar);
router.post("/login", autenticar);
router.post("/restablecer-pass", restablecerPass);
router.route("/restablecer-pass/:token").get(comprobarToken).post(nuevaPass);

// Rutas privadas
router.get("/perfil", checkAuth, perfil);
router.put('/perfil/:id', checkAuth, actualizarPerfil);
router.put('/actualizar-pass', checkAuth, actualizarPass);



export default router;