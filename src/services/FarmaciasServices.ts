import { ApiResponse, Farmacia } from "../types/types";
import { FarmaciasData } from "../data/FarmaciasData";

const farmaciasData = new FarmaciasData();

export class FarmaciasServices {
  public async listarFarmacias(): Promise<ApiResponse<Farmacia[]>> {
    console.log("Service: buscando farmácias...");

    try {
      const { data, error } = await farmaciasData.listarFarmacias();

      if (error) {
        console.error("Service: erro ao buscar farmácias:", error);
        return {
          success: false,
          message: "Erro ao buscar farmácias no banco de dados.",
          error: error.message,
        };
      }

      if (!data || data.length === 0) {
        return {
          success: true,
          message: "Nenhuma farmácia encontrada.",
          data: [],
        };
      }

      return {
        success: true,
        message: "Farmácias encontradas com sucesso.",
        data: data,
      };
    } catch (error: any) {
      console.error("Service: erro inesperado:", error);
      return {
        success: false,
        message: "Erro interno no serviço de farmácias.",
        error: error.message,
      };
    }
  }
}
