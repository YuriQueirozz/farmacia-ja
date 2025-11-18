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

    public filtrarUsuarios = async (req: Request, res: Response) => {
        console.log("Controller: recebida requisição GET /usuarios", req.query);

        try {
            const response = await usuariosServices.filtrarUsuarios(req.query);
            return res.status(200).json(response);
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: "Erro ao filtrar usuários.",
                error: error.message,
            });
        }
    };

    public buscarUsuarioPorId = async (req: Request, res: Response) => {
        console.log("Controller: recebida requisição GET /usuarios/:id");

        try {
            const { id } = req.params;
            const response = await usuariosServices.buscarUsuarioPorId(id);
            return res.status(response.success ? 200 : 404).json(response);
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: "Erro ao buscar usuário por ID.",
                error: error.message,
            });
        }
    };

    public criarUsuario = async (req: Request, res: Response) => {
        console.log("Controller: recebida requisição POST /usuarios");
        try {
            const response = await usuariosServices.criarUsuario(req.body);
            console.log("Controller: resposta enviada");

            if (!response.success) {
                return res.status(400).json(response);
            }

            return res.status(201).json(response);
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: "Erro ao criar usuário.",
                error: error.message,
            });
        }
    };

    public atualizarUsuario = async (req: Request, res: Response) => {
        console.log("Controller: recebida requisição PUT /usuarios/:id");
        try {
            const { id } = req.params;
            const response = await usuariosServices.atualizarUsuario(
                id,
                req.body
            );
            if (!response.success) {
                const status = response.error === "NOT_FOUND" ? 404 : 400;
                return res.status(status).json(response);
            }
            return res.status(200).json(response);
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: "Erro ao atualizar usuário.",
                error: error.message,
            });
        }
    };

    public atualizarParcialUsuario = async (req: Request, res: Response) => {
        console.log("Controller: recebida requisição PATCH /usuarios/:id");
        try {
            const { id } = req.params;
            const response = await usuariosServices.atualizarParcialUsuario(
                id,
                req.body
            );
            if (!response.success) {
                const status = response.error === "NOT_FOUND" ? 404 : 400;
                return res.status(status).json(response);
            }
            return res.status(200).json(response);
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: "Erro ao atualizar parcialmente usuário.",
                error: error.message,
            });
        }
    };
}
