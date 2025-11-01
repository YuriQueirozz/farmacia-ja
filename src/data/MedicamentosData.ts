import { supabase } from "../database/supabaseClient";

export class MedicamentosData {
  async buscarMedicamentos() {
    console.log("Data: executando SELECT na tabela medicamentos");

    const { data, error } = await supabase.from("medicamentos").select("*");

    return { data, error };
  }
}
