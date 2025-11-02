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
}
