import { supabase } from "../database/supabaseClient";
import { Farmacia } from "../types/types";

export class FarmaciasData {
  // pega todas as farmácias do banco
  public async listarFarmacias(): Promise<{ data: Farmacia[] | null; error: any }> {
    console.log("Data: executando busca na tabela farmacias");
    
    try {
      // busca tudo da tabela farmacias e ordena pelo id
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

  // cria uma nova farmácia no banco
  public async criarFarmacia(payload: Partial<Farmacia>): Promise<{ data?: Farmacia | null; error?: any }> {
    try {
      // monta o objeto com os dados pra inserir (não precis enviar o id)
      const insertPayload = {
        nome: payload.nome,
        telefone: payload.telefone ?? null,
        entregas: payload.entregas ?? false,
        cnpj: payload.cnpj,
        endereco_id: payload.endereco_id,
        ativo: typeof payload.ativo === "boolean" ? payload.ativo : true,
      };

      // insere no banco e já retorna os dados inseridos
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

  
  // busca farmácias que estão em um bairro específico
  async buscarFarmaciasPorBairro(bairro: string) {
    try {
      // faz join com a tabela enderecos pra filtrar pelo bairro
      const { data, error } = await supabase
        .from("farmacias")
        .select(`
          *,
          enderecos!inner (
            bairro
          )
        `)
        // ilike ignora maiúscula/minúscula (ex: "centro" acha "Centro")
        .ilike("enderecos.bairro", bairro)
        // ordena pelo id crescente
        .order("id");

      if (error) {
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  }

  // busca uma farmácia específica pelo id
  async buscarFarmaciaPorId(id: number) {
    try {
      // .eq = "igual a" / .single() = retorna só um resultado
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

  // atualiza só os campos que foram enviados
  async atualizarFarmacia(id: number, payload: Partial<Farmacia>) {
    try {
      // cria objeto vazio e vai adicionando só o que veio no payload
      const updatePayload: any = {};
      
      // verifica cada campo: se foi enviado, adiciona no update
      if (payload.nome) updatePayload.nome = payload.nome;
      if (payload.telefone !== undefined) updatePayload.telefone = payload.telefone;
      if (payload.entregas !== undefined) updatePayload.entregas = payload.entregas;
      if (payload.cnpj) updatePayload.cnpj = payload.cnpj;
      if (payload.endereco_id !== undefined) updatePayload.endereco_id = payload.endereco_id;
      if (payload.ativo !== undefined) updatePayload.ativo = payload.ativo;

      // atualiza no banco onde o id for igual ao que foi passado
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

  // deletar uma farmácia por ID
  async deletarFarmacia(id: number) {
    try {
      const { data, error } = await supabase
        .from("farmacias")
        .delete()
        .eq("id", id)
        .select("*");

      if (error) {
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  }
}