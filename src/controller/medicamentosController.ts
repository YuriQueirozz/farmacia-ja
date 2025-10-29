import { Request, Response } from 'express';
import db from '../database/knex';

// GET /medicamentos
export const getAllMedicamentos = async (req: Request, res: Response) => {
  try {
    const users = await db('medicamentos').select('*').orderBy('id', 'asc');
    return res.status(200).json(users);
  } catch (err) {
    console.error('Erro ao buscar medicamentps:', err);
    return res.status(500).json({ error: 'Erro ao buscar medicamentos.' });
  }
};

// GET /medicamentos/:id
export const getMedicamentoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const medicamentos = await db('medicamentos')
      .select('*')
      .where('id', id)
      .first();

    if (!medicamentos) {
      return res.status(404).json({ error: 'Medicamento não encontrado.' });
    }

    return res.status(200).json(medicamentos);
  } catch (err) {
    console.error('Erro ao buscar medicamento:', err);
    return res.status(500).json({ error: 'Erro ao buscar medicamento.' });
  }
};