import { Router } from "express";
import { UsuariosController } from "../controllers/UsuariosController";

const router = Router();
const usuariosController = new UsuariosController();

// GET todos ou com filtros
router.get("/", (req, res) => {
  if (Object.keys(req.query).length > 0) {
    console.log("Rota: GET /usuarios -> filtrando com query params");
    return usuariosController.filtrarUsuarios(req, res);
  }
  console.log("Rota: GET /usuarios -> listando todos os usuários");
  return usuariosController.listarUsuarios(req, res);
});

//GET por ID
router.get("/:id", (req, res) => usuariosController.buscarUsuarioPorId(req, res));

// POST
router.post("/", (req, res) => usuariosController.criarUsuario(req, res));

export default router;
