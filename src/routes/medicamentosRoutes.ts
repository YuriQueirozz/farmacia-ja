import { Router } from 'express';
import { getAllMedicamentos, getMedicamentoById } from '../controller/medicamentosController';

const router = Router();

router.get('/', getAllMedicamentos);
router.get('/:id', getMedicamentoById);

export default router;