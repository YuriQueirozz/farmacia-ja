import { ApiResponse, Usuario } from "../types/types";
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

    async filtrarUsuarios(queryParams: any): Promise<ApiResponse<Usuario[]>> {
        console.log("Service: filtrando usuários...");

        const filtros = {
            nome: queryParams.nome,
            cpf: queryParams.cpf,
            email: queryParams.email,
        };

        const{ data, error } = await usuariosData.filtrarUsuarios(filtros);

        if(error) {
            return {
                success: false,
                message: "Erro ao filtrar usuários",
                error: error.message,
            };
        }

        return {
            success: true,
            message: "Usuários filtrados encontrados",
            data: data as Usuario[],
        };
    }

    async buscarUsuarioPorId(id: string): Promise<ApiResponse<Usuario>> {
        console.log(`Service: buscando usuário com ID ${id}...`);

        if(!id) {
            return {
                success: false,
                message: "ID não fornecido",
                error: "VALIDATION_ERROR",
            };
        }

        const { data, error } = await usuariosData.buscarUsuarioPorId(id);

        if(error) {
            return {
                success: false,
                message: "Erro ao buscar usuário",
                error: error.message,
            };
        }

        if(!data) {
            return {
                success: false,
                message: "Usuário não encontrado",
                error: "NOT_FOUND",
            };
        }

        return {
            success: true,
            message: "Usuário encontrado",
            data: data as Usuario,
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

            // VERIFICANDO ERRO DE CPF DUPLICADO NO SUPABASE
            if(error.code === "23505" || error.message?.includes("cpf")) {
                return {
                    success: false,
                    message: "CPF já cadastrado",
                    error: "DUPLICATE_CPF",
                }
            }

            // EMAIL DUPLICADO NO SUPABASE AUTH
            if(error.code === "DUPLICATE_EMAIL") {
                return {
                    success: false,
                    message: "Email já cadastrado",
                    error: "DUPLICATE_EMAIL",
                }
            }

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
