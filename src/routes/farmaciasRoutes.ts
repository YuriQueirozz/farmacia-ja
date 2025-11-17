import { Router } from "express";
import { FarmaciasController } from "../controllers/FarmaciasController";

const router = Router();
const farmaciasController = new FarmaciasController();

// GET /farmacias
router.get("/", farmaciasController.listarFarmacias);

// GET /farmacias/bairro/:bairro
router.get("/bairro/:bairro", farmaciasController.buscarFarmaciasPorBairro);

// GET /farmacias/:id
router.get("/:id", farmaciasController.buscarFarmaciaPorId);

// POST /farmacias
router.post("/", farmaciasController.criarFarmacia);

// PUT /farmacias/:id
router.put("/:id", farmaciasController.atualizarFarmacia);

export default router;