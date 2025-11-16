import { ApiResponse, Medicamento } from "../types/types";
import { MedicamentosData } from "../data/MedicamentosData";
import { supabase } from "../database/supabaseClient";

const medicamentosData = new MedicamentosData();
export class MedicamentosServices {
  //Lista todos os medicamentos

  async listarMedicamentos(): Promise<ApiResponse<Medicamento[]>> {
    console.log("Service: buscando medicamentos...");

    const { data, error } = await medicamentosData.buscarMedicamentos();

    if (error) {
      return {
        success: false,
        message: "Erro ao buscar usuários no banco",
        error: error.message,
      };
    }

    return {
      success: true,
      message: "Medicamentos encontrados",
      data: data as Medicamento[],
    };
  }

  //Busca medicamento por ID

  public async buscarMedicamentoPorId(id: number) {
    const { data, error } = await supabase
      .from("medicamentos")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  //Criar medicamento

  async criarMedicamento(body: any): Promise<ApiResponse<Medicamento>> {
    console.log("Service: criando novo medicamento...");

    const { nome, principio_ativo, dosagem, categoria } = body;

    // Validar campos obrigatórios
    if (!nome || !principio_ativo || !dosagem || !categoria) {
      return {
        success: false,
        message:
          "Nome, principio ativo, dosagem e categoria são obrigatórios são obrigatórios",
        error: "VALIDATION_ERROR",
      };
    }

    const payload = {
      nome: nome.trim(),
      principio_ativo: principio_ativo.trim(),
      dosagem: dosagem.trim(),
      categoria: categoria.trim(),
    };

    const { data, error } = await medicamentosData.criarMedicamento(payload);

    if (error) {
      return {
        success: false,
        message: "Erro ao criar medicamento no banco",
        error: error.message,
      };
    }

    return {
      success: true,
      message: "Medicamento criado com sucesso",
      data: data as Medicamento,
    };
  }

  async buscarPorFiltros(query: any) {
    const { nome, categoria, principio_ativo } = query;

    const { data, error } = await medicamentosData.buscarMedicamentosPorFiltro({
      nome,
      categoria,
      principio_ativo,
    });

    if (error) {
      return {
        success: false,
        message: "Erro ao buscar medicamentos com filtros",
        error: error.message,
      };
    }

    return {
      success: true,
      message: "Medicamentos filtrados encontrados",
      data,
    };
  }
}
