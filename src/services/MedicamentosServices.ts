import { ApiResponse, Medicamento } from "../database/types";
import { MedicamentosData } from "../data/MedicamentosData";

const medicamentosData = new MedicamentosData();
export class MedicamentosServices {
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
}
