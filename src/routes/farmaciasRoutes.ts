import { Router } from "express";
import { FarmaciasController } from "../controllers/FarmaciasController";

const router = Router();
const farmaciasController = new FarmaciasController();

// GET /farmacias
router.get("/", farmaciasController.listarFarmacias);

// GET /farmacias/bairro/:bairro
router.get("/bairro/:bairro", farmaciasController.buscarFarmaciasPorBairro);

// POST /farmacias
router.post("/", farmaciasController.criarFarmacia);

export default router;