import { ApiResponse, Farmacia } from "../types/types";
import { FarmaciasData } from "../data/FarmaciasData";

const farmaciasData = new FarmaciasData();

export class FarmaciasServices {
  // lista todas as farmácias
  public async listarFarmacias(): Promise<ApiResponse<Farmacia[]>> {

    try {
      const { data, error } = await farmaciasData.listarFarmacias();

      // se deu erro no banco, retorna a mensagem de erro
      if (error) {
        console.error("Service: erro ao buscar farmácias:", error);
        return {
          success: false,
          message: "Erro ao buscar farmácias no banco de dados.",
          error: error.message,
        };
      }

      // se não encontrou nenhuma farmácia
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
        documentosNecessarios: "Para retirar medicamentos gratuitamente pelo programa Farmácia Popular, são necessários os seguintes documentos: Identidade (CPF e RG) e Receita médica."
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

  // cria uma nova farmácia
  public async criarFarmacia(payload: Partial<Farmacia>): Promise<ApiResponse<Farmacia>> {
    try {
      // chama a camada de dados pra inserir no banco
      const { data, error } = await farmaciasData.criarFarmacia(payload);

      if (error) {
        return {
          success: false,
          message: "Erro ao inserir farmácia no banco de dados.",
          error: error.message ?? error,
        };
      }

      if (!data) {
        return {
          success: false,
          message: "Não foi possível criar a farmácia.",
        };
      }

      return {
        success: true,
        message: "Farmácia criada com sucesso.",
        data,
      };
    } catch (err: any) {
      return {
        success: false,
        message: "Erro interno no serviço ao criar farmácia.",
        error: err.message ?? err,
      };
    }
  }

  // busca farmácias de um bairro específico
  async buscarFarmaciasPorBairro(bairro: string): Promise<ApiResponse<Farmacia[]>> {
    try {
      const { data, error } = await farmaciasData.buscarFarmaciasPorBairro(bairro);

      if (error) {
        return {
          success: false,
          message: "Deu erro ao buscar as farmácias",
          error: error,
        };
      }

      // se não achar nada, vai retornar array vazio
      if (!data || data.length === 0) {
        return {
          success: true,
          message: "Não tem farmácia cadastrada nesse bairro",
          data: [],
        };
      }

      return {
        success: true,
        message: "Farmácias encontradas!",
        data: data,
        documentosNecessarios: "Para retirar medicamentos gratuitamente pelo programa Farmácia Popular, são necessários os seguintes documentos: Identidade (CPF e RG) e Receita médica."
      };
    } catch (error: any) {
      return {
        success: false,
        message: "Erro ao buscar farmácias",
        error: error.message,
      };
    }
  }

  // busca uma farmácia pelo id dela
  async buscarFarmaciaPorId(id: number): Promise<ApiResponse<Farmacia>> {
    try {
      const { data, error } = await farmaciasData.buscarFarmaciaPorId(id);

      if (error) {
        return {
          success: false,
          message: "Erro ao buscar farmácia",
          error: error,
        };
      }

      // se não encontrou
      if (!data) {
        return {
          success: false,
          message: "Farmácia não encontrada",
        };
      }

      return {
        success: true,
        message: "Farmácia encontrada!",
        data: data,
        documentosNecessarios: "Para retirar medicamentos gratuitamente pelo programa Farmácia Popular, são necessários os seguintes documentos: Identidade (CPF e RG) e Receita médica."
      };
    } catch (error: any) {
      return {
        success: false,
        message: "Erro ao buscar farmácia",
        error: error.message,
      };
    }
  }

  // atualiza informações de uma farmácia
  async atualizarFarmacia(id: number, payload: Partial<Farmacia>): Promise<ApiResponse<Farmacia>> {
    try {
      const { data, error } = await farmaciasData.atualizarFarmacia(id, payload);

      if (error) {
        return {
          success: false,
          message: "Erro ao atualizar farmácia",
          error: error,
        };
      }

      // se não encontrou para atualizar
      if (!data) {
        return {
          success: false,
          message: "Farmácia não encontrada",
        };
      }

      return {
        success: true,
        message: "Farmácia atualizada com sucesso!",
        data: data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: "Erro ao atualizar farmácia",
        error: error.message,
      };
    }
  }

  // deleta farmácia por Id
  async deletarFarmacia(id: number): Promise<ApiResponse<Farmacia>> {
    try {
      // verifica se o Id foi adicionado
      if (!id) {
        return {
          success: false,
          message: "O Id é obrigatório para deletar uma farmácia",
        };
      }

      const { data, error } = await farmaciasData.deletarFarmacia(id);

      if (error) {
        return {
          success: false,
          message: "Erro ao deletar farmácia",
          error: error,
        };
      }

      // se não encontrar farmácia para deletar
      if (!data || (Array.isArray(data) && data.length === 0)) {
        return {
          success: false,
          message: "Farmácia não encontrada",
        };
      }

      return {
        success: true,
        message: "Farmácia deletada com sucesso!",
        data: Array.isArray(data) ? data[0] : data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: "Erro ao deletar farmácia",
        error: error.message,
      };
    }
  }
}
