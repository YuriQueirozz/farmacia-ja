import { supabase } from "../database/supabaseClient";

export class UsuariosData {
    async buscarUsuarios() {
        console.log("Data: executando SELECT na tabela usuarios");

        const { data, error } = await supabase.from("usuarios").select("*");

        return { data, error };
    }
}
