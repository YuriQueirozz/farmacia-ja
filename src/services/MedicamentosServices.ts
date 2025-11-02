import { ApiResponse, Medicamento } from "../types/types";
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
}
