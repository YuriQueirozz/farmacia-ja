import { Router } from "express";
import { FarmaciasController } from "../controllers/FarmaciasController";

const router = Router();
const farmaciasController = new FarmaciasController();

// GET /farmacias
router.get("/", farmaciasController.listarFarmacias);

// POST /farmacias
router.post("/", farmaciasController.criarFarmacia);

export default router;