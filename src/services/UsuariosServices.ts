import { ApiResponse, Usuario } from "../database/types";
import { UsuariosData } from "../data/UsuariosData";

const usuariosData = new UsuariosData();
export class UsuariosServices {
    async listarUsuarios(): Promise<ApiResponse<Usuario[]>> {
        console.log("Service: buscando usuários...");

        const { data, error } = await usuariosData.buscarUsuarios();

        if (error) {
            return {
                success: false,
                message: "Erro ao buscar usuários no banco",
                error: error.message,
            };
        }

        return {
            success: true,
            message: "Usuários encontrados",
            data: data as Usuario[],
        };
    }
}
