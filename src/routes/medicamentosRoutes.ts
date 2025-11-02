import { Router } from "express";
import { MedicamentosController } from "../controllers/MedicamentosController";

const router = Router();
const medicamentosController = new MedicamentosController();

//GET Medicamentos
router.get("/", (req, res) =>
  medicamentosController.listarMedicamentos(req, res)
);

//GET Medicamentos por ID

router.get("/:id", (req, res) =>
  medicamentosController.buscarMedicamentoPorId(req, res)
);

// POST Medicamentos
router.post("/", (req, res) =>
  medicamentosController.criarMedicamento(req, res)
);

export default router;
