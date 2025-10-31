import { Router } from 'express';
import { getAllUsers } from '../controller/UsuariosController';

const router = Router();

router.get('/', getAllUsers);

export default router;