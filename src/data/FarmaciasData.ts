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
}