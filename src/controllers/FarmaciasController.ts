import { Request, Response } from "express";
import { FarmaciasServices } from "../services/FarmaciasServices";

const farmaciasServices = new FarmaciasServices();

export class FarmaciasController {
    public listarFarmacias = async (req: Request, res: Response) => {
        console.log("Controller: recebida requisição GET /farmacias");
        try {
            const response = await farmaciasServices.listarFarmacias();
            console.log("Controller: resposta enviada");
            return res.status(200).json(response);
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: "Erro ao listar farmácias.",
                error: error.message,
            });
        }
    };
}