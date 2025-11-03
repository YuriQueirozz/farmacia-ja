import { Router } from "express";
import { UsuariosController } from "../controllers/UsuariosController";

const router = Router();
const usuariosController = new UsuariosController();

// GET
router.get("/", (req, res) => usuariosController.listarUsuarios(req, res));

//GET por ID
router.get("/:id", (req, res) => usuariosController.buscarUsuarioPorId(req, res));

// POST
router.post("/", (req, res) => usuariosController.criarUsuario(req, res));

export default router;
