import { Request, Response } from 'express';
import db from '../database/knex';

// GET /usuarios
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await db('usuarios').select('*').orderBy('id', 'asc');
    return res.status(200).json(users);
  } catch (err) {
    console.error('Erro ao buscar usuários:', err);
    return res.status(500).json({ error: 'Erro ao buscar usuários.' });
  }
};