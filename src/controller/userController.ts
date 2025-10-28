import { Request, Response } from "express";
import { pool } from "../database/data";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { nome, cpf, email, bairro } = req.query;

    let query = "SELECT id, nome, email, cpf, endereco, tipo, criadoem, atualizadoem FROM usuarios WHERE 1=1";
    const params: any[] = [];

    if (nome) {
      params.push(`%${String(nome)}%`);
      query += ` AND nome ILIKE $${params.length}`;
    }
    if (cpf) {
      params.push(String(cpf));
      query += ` AND cpf = $${params.length}`;
    }
    if (email) {
      params.push(String(email));
      query += ` AND email = $${params.length}`;
    }
    if (bairro) {
      // supondo que endereco armazene bairro ou contenha bairro
      params.push(`%${String(bairro)}%`);
      query += ` AND endereco ILIKE $${params.length}`;
    }

    const result = await pool.query(query, params);
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: "Erro ao buscar usuários." });
  }
};