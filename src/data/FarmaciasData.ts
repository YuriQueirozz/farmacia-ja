import { supabase } from "../database/supabaseClient";
import { Farmacia } from "../types/types";

export class FarmaciasData {
  public async listarFarmacias(): Promise<{ data: Farmacia[] | null; error: any }> {
    console.log("Data: executando busca na tabela farmacias");
    
    try {
      const { data, error } = await supabase
        .from("farmacias")
        .select("*")
        .order("id");

      if (error) {
        console.error("Data: erro ao buscar farmácias:", error.message);
        return { data: null, error };
      }

      return { data, error: null };
      
    } catch (err) {
      console.error("Data: erro inesperado:", err);
      return { data: null, error: err };
    }
  }

  public async criarFarmacia(payload: Partial<Farmacia>): Promise<{ data?: Farmacia | null; error?: any }> {
    try {
      // Não enviar o id
      const insertPayload = {
        nome: payload.nome,
        telefone: payload.telefone ?? null,
        entregas: payload.entregas ?? false,
        cnpj: payload.cnpj,
        endereco_id: payload.endereco_id,
        ativo: typeof payload.ativo === "boolean" ? payload.ativo : true,
      };

      const { data, error } = await supabase
        .from("farmacias")
        .insert(insertPayload)
        .select("*")
        .single();

      if (error) {
        console.error("Data: erro ao inserir farmácia:", error);
        return { data: null, error };
      }

      return { data: data as Farmacia, error: null };
    } catch (err) {
      console.error("Data: erro inesperado ao inserir farmácia:", err);
      return { data: null, error: err };
    }
  }

  
  async buscarFarmaciasPorBairro(bairro: string) {
    try {
      // faz ligação com a tabela enderecos para pegar o bairro
      const { data, error } = await supabase
        .from("farmacias")
        .select(`
          *,
          enderecos!inner (
            bairro
          )
        `)
        // Para não ser CaseSensitive
        .ilike("enderecos.bairro", bairro)
        // ordenar por id
        .order("id");

      if (error) {
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  }

  // buscar farmacia por id
  async buscarFarmaciaPorId(id: number) {
    try {
      const { data, error } = await supabase
        .from("farmacias")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  }

  // atualizar farmacia
  async atualizarFarmacia(id: number, payload: Partial<Farmacia>) {
    try {
      // monta só com os campos que vieram
      const updatePayload: any = {};
      
      if (payload.nome) updatePayload.nome = payload.nome;
      if (payload.telefone !== undefined) updatePayload.telefone = payload.telefone;
      if (payload.entregas !== undefined) updatePayload.entregas = payload.entregas;
      if (payload.cnpj) updatePayload.cnpj = payload.cnpj;
      if (payload.endereco_id !== undefined) updatePayload.endereco_id = payload.endereco_id;
      if (payload.ativo !== undefined) updatePayload.ativo = payload.ativo;

      const { data, error } = await supabase
        .from("farmacias")
        .update(updatePayload)
        .eq("id", id)
        .select("*")
        .single();

      if (error) {
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  }
}