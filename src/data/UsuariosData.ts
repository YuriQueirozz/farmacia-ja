import { supabase } from "../database/supabaseClient";
import type { Usuario } from "../types/types";

export class UsuariosData {
    async buscarUsuarios() {
        console.log("Data: executando SELECT na tabela usuarios");

        const { data, error } = await supabase.from("usuarios").select("*");

        return { data, error };
    }

    async filtrarUsuarios(filtros: Record<string, any>) {
        console.log("Data: filtrando usuários por: ", filtros);

        let query = supabase.from("usuarios").select("*");

        // Aplicar filtros dinamicamente
        if (filtros.nome) {
            query = query.ilike("nome", `%${filtros.nome}%`);
        }

        if (filtros.cpf) {
            query = query.ilike("cpf", `%${filtros.cpf}%`);
        }

        if (filtros.email) {
            query = query.ilike("email!", `%${filtros.email}%`);
        }

        const { data, error } = await query;

        console.log("Resultado filtragem:", { count: data?.length || 0, error });

        return { data, error };
    }
    
    async buscarUsuarioPorId(id: string) {
        console.log("Data: buscando usuário por ID na tabela usuários");

        const { data, error } = await supabase
            .from("usuarios")
            .select("*")
            .eq("id", id)
            .single();

        return { data, error };
    }


    // CRIAR USUÁRIO NO SUPABASE AUTH E SALVAR O PERFIL NA TABELA USUARIOS COM O MESMO ID
    async criarUsuario(usuario: {
        email: string,
        senha: string,
        nome: string;
        cpf: string;
        tipo: string;
        endereco: string | null;
        data_nascimento: string | null;
    }) {
        console.log("Criando usuário no Supabase Auth...");

        // APRENDENDO A CRIAR USUÁRIO NO AUTH DO SUPABASE
        const { data: authUser, error: authError } = 
            await supabase.auth.admin.createUser({
                email: usuario.email,
                password: usuario.senha,
                email_confirm: true,
            });

        // SE FALHAR NA CRIAÇÃO DO USUÁRIO NO AUTH, INTERROMPE O PROCESSO
        if(authError || !authUser?.user?.id){

            // VERIFICAR ERRO DE EMAIL DUPLICADO NO SUPABASE AUTH
            if(authError && authError.message?.toLowerCase().includes("email address has already been registered")) {
                console.error("Email já cadastrado no Auth: ", authError.message);
                return {
                    data: null,
                    error: { code: "DUPLICATE_EMAIL", message: "Email já castrado" }
                };
            }

            console.error("Erro ao criar usuário no Auth:", authError?.message);
            return { data: null, error: authError };
        }

        // PEGA O UUID GERADO PELO SUPABASE AUTH (ID DO USUÁRIO NO NOSSO SISTEMA)
        const usuarioId = authUser.user.id;
        console.log("Usuário criado no Auth com ID:", usuarioId);

        // DADOS DE PERFIL DO USUÁRIO NA TABELA DO SUPABASE 
        // MONTA O OBJETO PARA INSERIR NA TABELA 
        const payload = {
            id: usuarioId, // VAI USAR O ID (uuid) GERADO PELO AUTH (auth.users)
            email: usuario.email,
            nome: usuario.nome,
            cpf: usuario.cpf,
            tipo: usuario.tipo,
            endereco: usuario.endereco ?? null,
            data_nascimento: usuario.data_nascimento ?? null,
        };

        console.log("Inserindo dados do perfil na tabela usuarios...");

        const { data, error } = await supabase
            .from("usuarios")
            .insert([payload])
            .select("*")
            .single();

        // SE DER ERRO, DELETA O USUÁRIO CRIADO NO AUTH
        // RESOLVENDO BUG DE USUÁRIO CRIADO NO AUTH MAS NÃO NA TABELA
        if (error) {
            console.error("Erro ao salvar perfil. Iniciando rollback...", error.message);

            await supabase.auth.admin.deleteUser(usuarioId);
            console.log("Rollback concluído.");

            return { data: null, error }; // RETORNA O ERRO PARA O SERVICES 
        }

        return { data: data as Usuario, error: null };
    }
}
