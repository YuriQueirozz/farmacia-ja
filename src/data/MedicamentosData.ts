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
}
