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
      documentosNecessarios: "Para retirar medicamentos gratuitamente pelo programa Farmácia Popular, são necessários os seguintes documentos: Identidade (CPF e RG) e Receita médica."
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
    
    return {
      success: true,
      message: "Medicamento encontrado",
      data,
      documentosNecessarios: "Para retirar medicamentos gratuitamente pelo programa Farmácia Popular, são necessários os seguintes documentos: Identidade (CPF e RG) e Receita médica."
    };
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

  // Buscar medicamento por filtro

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
      documentosNecessarios: "Para retirar medicamentos gratuitamente pelo programa Farmácia Popular, são necessários os seguintes documentos: Identidade (CPF e RG) e Receita médica."
    };
  }

  //DELETE medicamentos por id

  async deletarMedicamento(id: number) {
    if (!id) {
      return {
        success: false,
        message: "ID é obrigatório",
        error: "INVALID_ID",
      };
    }

    // aqui verifica se o medicamento existe ou não
    const existente = await supabase
      .from("medicamentos")
      .select("*")
      .eq("id", id)
      .single();

    if (existente.error) {
      return {
        success: false,
        message: "Medicamento não encontrado",
        error: existente.error.message,
      };
    }

    const { error } = await medicamentosData.deletarMedicamento(id);

    if (error) {
      return {
        success: false,
        message: "Erro ao deletar medicamento",
        error: error.message,
      };
    }

    return {
      success: true,
      message: "Medicamento deletado com sucesso",
    };
  }

  //Atualizar medicamentos
  async atualizarMedicamento(
    id: number,
    body: any
  ): Promise<ApiResponse<Medicamento>> {
    if (!id) {
      return {
        success: false,
        message: "ID é obrigatório",
        error: "INVALID_ID",
      };
    }

    // Verifica se existe
    const existente = await supabase
      .from("medicamentos")
      .select("*")
      .eq("id", id)
      .single();

    if (existente.error) {
      return {
        success: false,
        message: "Medicamento não encontrado",
        error: existente.error.message,
      };
    }

    // Apenas campos permitidos
    const { nome, principio_ativo, dosagem, categoria } = body;

    const payload: any = {};

    if (nome) payload.nome = nome.trim();
    if (principio_ativo) payload.principio_ativo = principio_ativo.trim();
    if (dosagem) payload.dosagem = dosagem.trim();
    if (categoria) payload.categoria = categoria.trim();

    const { data, error } = await medicamentosData.atualizarMedicamento(
      id,
      payload
    );

    if (error) {
      return {
        success: false,
        message: "Erro ao atualizar medicamento",
        error: error.message,
      };
    }

    return {
      success: true,
      message: "Medicamento atualizado com sucesso",
      data: data as Medicamento,
    };
  }

  // PATCH medicamentos

  async atualizarParcial(
    id: number,
    body: any
  ): Promise<ApiResponse<Medicamento>> {
    if (!id) {
      return {
        success: false,
        message: "ID é obrigatório",
        error: "INVALID_ID",
      };
    }

    // Verifica se o medicamento existe
    const existente = await supabase
      .from("medicamentos")
      .select("*")
      .eq("id", id)
      .single();

    if (existente.error) {
      return {
        success: false,
        message: "Medicamento não encontrado",
        error: existente.error.message,
      };
    }

    // Somente campos válidos
    const camposPermitidos = [
      "nome",
      "principio_ativo",
      "dosagem",
      "categoria",
    ];
    const payload: any = {};

    for (const campo of camposPermitidos) {
      if (body[campo] !== undefined) {
        payload[campo] = String(body[campo]).trim();
      }
    }

    if (Object.keys(payload).length === 0) {
      return {
        success: false,
        message: "Nenhum campo válido foi enviado para atualização",
        error: "EMPTY_UPDATE",
      };
    }

    const { data, error } = await medicamentosData.atualizarParcial(
      id,
      payload
    );

    if (error) {
      return {
        success: false,
        message: "Erro ao atualizar medicamento",
        error: error.message,
      };
    }

    return {
      success: true,
      message: "Medicamento atualizado com sucesso",
      data: data as Medicamento,
    };
  }
}
