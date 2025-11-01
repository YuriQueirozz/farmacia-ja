import { Request, Response } from "express";
import { MedicamentosServices } from "../services/MedicamentosServices";

const medicamentosServices = new MedicamentosServices();

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
}
