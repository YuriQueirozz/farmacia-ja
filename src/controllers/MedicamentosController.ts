import { Request, Response } from "express";
import { MedicamentosServices } from "../services/MedicamentosServices";

const medicamentosServices = new MedicamentosServices();

//Listar Medicamentos usando GET /medicamentos

export class MedicamentosController {
  public listarMedicamentos = async (req: Request, res: Response) => {
    console.log("Controller: recebida requisição GET /medicamentos");
    try {
      const response = await medicamentosServices.listarMedicamentos();
      console.log("Controller: resposta enviada");
      return res.status(200).json(response);
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: "Erro ao listar medicamentos.",
        error: error.message,
      });
    }
  };

  // Buscar medicamento por ID

  public buscarMedicamentoPorId = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res
          .status(400)
          .json({ success: false, message: "ID não fornecido" });
      }
      const response = await medicamentosServices.buscarMedicamentoPorId(
        Number(id)
      );

      if (!response) {
        return res
          .status(404)
          .json({ success: false, message: "Medicamento não encontrado" });
      }

      return res.status(200).json(response);
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: "Erro ao buscar medicamento por ID",
        error: error.message,
      });
    }
  };

  //Criar Medicamento Usando POST /medicamento

  public criarMedicamento = async (req: Request, res: Response) => {
    console.log("Controller: recebida requisição POST /medicamento");
    try {
      const response = await medicamentosServices.criarMedicamento(req.body);
      console.log("Controller: resposta enviada");

      if (!response.success) {
        return res.status(400).json(response);
      }

      return res.status(201).json(response);
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: "Erro ao criar medicamento.",
        error: error.message,
      });
    }
  };

  //GET por filtro
  public buscarPorFiltros = async (req: Request, res: Response) => {
    try {
      const response = await medicamentosServices.buscarPorFiltros(req.query);
      return res.status(200).json(response);
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: "Erro ao filtrar medicamentos",
        error: error.message,
      });
    }
  };

  //DELETE medicamentos
  public deletarMedicamento = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const response = await medicamentosServices.deletarMedicamento(
        Number(id)
      );

      if (!response.success) {
        return res.status(400).json(response);
      }

      return res.status(200).json(response);
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: "Erro ao deletar medicamento",
        error: error.message,
      });
    }
  };

  //atualizar medicamentos

  public atualizarMedicamento = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const response = await medicamentosServices.atualizarMedicamento(
        Number(id),
        req.body
      );

      if (!response.success) {
        return res.status(400).json(response);
      }

      return res.status(200).json(response);
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: "Erro ao atualizar medicamento",
        error: error.message,
      });
    }
  };
}
