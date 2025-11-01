import { supabase } from "../database/supabaseClient";
import type { Usuario } from "../database/types";

export class UsuariosData {
    async buscarUsuarios() {
        console.log("Data: executando SELECT na tabela usuarios");

        const { data, error } = await supabase.from("usuarios").select("*");

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
            console.error("Erro ao criar usuário no Auth:", authError?.message);
            return { data: null, error: authError };
        }

        // PEGA O UUID GERADO PELO SUPABASE AUTH (ID DO USUÁRIO NO NOSSO SISTEMA)
        const userId = authUser.user.id;
        console.log("Usuário criado no Auth com ID:", userId);

        // DADOS DE PERFIL DO USUÁRIO NA TABELA DO SUPABASE 
        // MONTA O OBJETO PARA INSERIR NA TABELA 
        const payload = {
            id: userId, // VAI USAR O ID (uuid) GERADO PELO AUTH (auth.users)
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

        return { data: data as Usuario, error };
    }
}
