import { Router } from "express";
import { UsuariosController } from "../controllers/UsuariosController";

const router = Router();
const usuariosController = new UsuariosController();

router.get("/", (req, res) => usuariosController.listarUsuarios(req, res));

export default router;
