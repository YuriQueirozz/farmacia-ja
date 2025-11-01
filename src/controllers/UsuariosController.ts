import { Request, Response } from "express";
import { UsuariosServices } from "../services/UsuariosServices";

const usuariosServices = new UsuariosServices();

export class UsuariosController {
    public listarUsuarios = async (req: Request, res: Response) => {
        console.log("Controller: recebida requisição GET /usuarios");
        try {
            const response = await usuariosServices.listarUsuarios();
            console.log("Controller: resposta enviada");
            return res.status(200).json(response);
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: "Erro ao listar usuários.",
                error: error.message,
            });
        }
    };
}
