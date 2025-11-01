import { Router } from "express";
import { MedicamentosController } from "../controllers/MedicamentosController";

const router = Router();
const medicamentosController = new MedicamentosController();

router.get("/", (req, res) =>
  medicamentosController.listarMedicamentos(req, res)
);

export default router;
