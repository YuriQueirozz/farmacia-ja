import { ApiResponse, Usuario } from "../database/types";
import { UsuariosData } from "../data/UsuariosData";

const usuariosData = new UsuariosData();

// normalizando valores para string ou nulo
function normalizeToStringOrNull(value: any): string | null {
    if(value == null) return null;
    if(typeof value === "string") {
        const st = value.trim();
        return st.length ? st : null;
    }

    // números e outros tipos
    const st = String(value).trim();
    return st.length ? st : null;
}

function normalizeDateToISOStringOrNull(value: any): string | null {
    if(value == null) return null;

    // se já tem um Date, usa ele, senão tenta criar um
    const date = value instanceof Date ? value : new Date(String(value));
    if(isNaN(date.getTime())) return null;
    return date.toISOString();
}

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

    async criarUsuario(body: any): Promise<ApiResponse<Usuario>> {
        console.log("Service: criando novo usuário...");

        const { email, senha, nome, cpf, tipo, endereco, data_nascimento } = body;

        // Validar campos obrigatórios
        if(!email || ! senha || !nome || !cpf || !tipo) {
            return {
                success: false,
                message: "Email, senha, nome, CPF e tipo são obrigatórios",
                error: "VALIDATION_ERROR",
            };
        }

        // Normalizar e validar a data de nascimento 
        // formato ISO ou nulo
        const dataNascimentoNormalizado = normalizeDateToISOStringOrNull(data_nascimento);
        if (data_nascimento != null && dataNascimentoNormalizado === null) {
            return {
                success: false,
                message: "Data de nascimento inválida",
                error: "VALIDATION_ERROR",
            };
        }

        const payload = {
            email: email.toLowerCase().trim(),
            senha: senha.trim(),
            nome: nome.trim(),
            cpf: cpf.trim(),
            tipo: tipo.trim(),
            endereco: normalizeToStringOrNull(endereco),
            data_nascimento: dataNascimentoNormalizado,
        };

        const { data, error } = await usuariosData.criarUsuario(payload);

        if(error) {
            return {
                success: false,
                message: "Erro ao criar usuário no banco",
                error: error.message,
            };
        }

        return {
            success: true,
            message: "Usuário criado com sucesso",
            data: data as Usuario,
        };
    }
}
