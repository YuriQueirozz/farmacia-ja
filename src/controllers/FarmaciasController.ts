import { Request, Response } from "express";
import { FarmaciasServices } from "../services/FarmaciasServices";

const farmaciasServices = new FarmaciasServices();

export class FarmaciasController {
    // GET /farmacias lista todas as farmácias
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

    // POST /farmacias - cria uma nova farmácia
    public criarFarmacia = async (req: Request, res: Response) => {
        try {
            // pega os dados que vieram no body da requisição
            const { nome, endereco_id, entregas, cnpj, telefone, ativo } = req.body;

            // valida se os campos obrigatórios foram enviados
            if (!nome || typeof endereco_id === "undefined" || typeof entregas === "undefined" || !cnpj) {
                return res.status(400).json({
                    success: false,
                    message: "Campos obrigatórios ausente: nome, endereco_id, entregas, CNPJ",
                });
            }

            // Nao inserir o  id
            const response = await farmaciasServices.criarFarmacia({
                nome,
                endereco_id,
                entregas,
                cnpj,
                telefone,
                ativo,
            });

            if (!response.success) {
                const status = response.error ? 500 : 400;
                return res.status(status).json(response);
            }

            return res.status(201).json(response);
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: "Erro ao criar farmácia",
                error: error.message,
            });
        }
    };

    // GET /farmacias/bairro/:bairro 
    public buscarFarmaciasPorBairro = async (req: Request, res: Response) => {
        try {
            // pega o bairro da URL (parâmetro)
            const { bairro } = req.params;

            if (!bairro) {
                return res.status(400).json({
                    success: false,
                    message: "Você precisa informar o bairro!",
                });
            }

            const response = await farmaciasServices.buscarFarmaciasPorBairro(bairro);

            if (!response.success) {
                return res.status(400).json(response);
            }

            return res.status(200).json(response);
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: "Erro ao buscar farmácias",
                error: error.message,
            });
        }
    };

    // GET /farmacias/:id para buscar uma farmácia pelo id
    public buscarFarmaciaPorId = async (req: Request, res: Response) => {
        try {
            // pega o id da URL
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "Você precisa informar o ID da farmácia!",
                });
            }

            // converte o id pra número e busca no service
            const response = await farmaciasServices.buscarFarmaciaPorId(Number(id));

            if (!response.success) {
                return res.status(404).json(response);
            }

            return res.status(200).json(response);
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: "Erro ao buscar farmácia",
                error: error.message,
            });
        }
    };

    // PUT /farmacias/:id para atualizar uma farmácia
    public atualizarFarmacia = async (req: Request, res: Response) => {
        try {
            // pega o id da URL e os dados do body
            const { id } = req.params;
            const { nome, telefone, entregas, cnpj, endereco_id, ativo } = req.body;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "Você precisa informar o id da farmácia",
                });
            }

            // monta o objeto só com os campos que foram enviados (atualização em partes)
            const updateData: any = {};
            if (nome) updateData.nome = nome;
            // usa !== undefined para aceitar valores vazios tipo "" ou false
            if (telefone !== undefined) updateData.telefone = telefone;
            if (entregas !== undefined) updateData.entregas = entregas;
            if (cnpj) updateData.cnpj = cnpj;
            if (endereco_id !== undefined) updateData.endereco_id = endereco_id;
            if (ativo !== undefined) updateData.ativo = ativo;

            const response = await farmaciasServices.atualizarFarmacia(Number(id), updateData);

            if (!response.success) {
                return res.status(404).json(response);
            }

            return res.status(200).json(response);
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: "Erro ao atualizar farmacia",
                error: error.message,
            });
        }
    };

    // DELETE /farmacias/:id para deletar por Id
    public deletarFarmacia = async (req: Request, res: Response) => {
        try {
            // pega o ID da URL
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "Você precisa informar o ID da farmácia",
                });
            }

            const response = await farmaciasServices.deletarFarmacia(Number(id));

            if (!response.success) {
                return res.status(404).json(response);
            }

            return res.status(200).json(response);
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: "Erro ao deletar farmácia",
                error: error.message,
            });
        }
    };
}