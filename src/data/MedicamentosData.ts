import { supabase } from "../database/supabaseClient";
import type { Medicamento } from "../types/types.ts";

export class MedicamentosData {
  async buscarMedicamentos() {
    console.log("Data: executando SELECT na tabela medicamentos");

    const { data, error } = await supabase.from("medicamentos").select("*");

    return { data, error };
  }

  // Criar um novo medicamento
  async criarMedicamento(medicamento: {
    nome: string;
    principio_ativo: string;
    dosagem: string;
    categoria?: string;
  }) {
    console.log("Inserindo novo medicamento na tabela medicamentos...");

    const payload = {
      nome: medicamento.nome,
      principio_ativo: medicamento.principio_ativo ?? null,
      dosagem: medicamento.dosagem,
      categoria: medicamento.categoria,
    };

    const { data, error } = await supabase
      .from("medicamentos")
      .insert([payload])
      .select("*")
      .single();

    if (error) {
      console.error("Erro ao inserir medicamento:", error.message);
      return { data: null, error };
    }

    console.log("Medicamento inserido com sucesso:", data);
    return { data: data as Medicamento, error: null };
  }

  //GET por filtro (nome, categoria e principio ativo)

  async buscarMedicamentosPorFiltro(filtros: {
    nome?: string;
    categoria?: string;
    principio_ativo?: string;
  }) {
    console.log("Data: buscando todos para filtrar em memória...");

    const { data, error } = await supabase.from("medicamentos").select("*");

    if (error) {
      console.error("Erro ao buscar medicamentos:", error.message);
      return { data: null, error };
    }

    // Aplica filtros localmente (permite deixar a pesquisa como se fosse o ilike dos bancos de dados)
    const filtrados = data.filter((m) => {
      let ok = true;

      if (filtros.nome) {
        ok = ok && m.nome.toLowerCase().includes(filtros.nome.toLowerCase());
      }

      if (filtros.principio_ativo) {
        ok =
          ok &&
          m.principio_ativo
            .toLowerCase()
            .includes(filtros.principio_ativo.toLowerCase());
      }

      if (filtros.categoria) {
        ok =
          ok &&
          String(m.categoria)
            .toLowerCase()
            .includes(filtros.categoria.toLowerCase());
      }

      return ok;
    });

    return { data: filtrados, error: null };
  }

  // DELETE medicamentos por id

  async deletarMedicamento(id: number) {
    console.log("Data: deletando medicamento ID:", id);

    const { error } = await supabase.from("medicamentos").delete().eq("id", id);

    return { error };
  }

  // Atualizar medicamento por id

  async atualizarMedicamento(id: number, medicamento: Partial<Medicamento>) {
    console.log("Data: atualizando medicamento ID:", id);

    const { data, error } = await supabase
      .from("medicamentos")
      .update(medicamento)
      .eq("id", id)
      .select("*")
      .single();

    return { data, error };
  }
}
