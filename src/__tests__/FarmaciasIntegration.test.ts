import { FarmaciasServices } from "../services/FarmaciasServices";
import { FarmaciasData } from "../data/FarmaciasData";

// mockando a camada de dados
jest.mock("../data/FarmaciasData");

describe("Farmácias - Testes de Integração", () => {
  // variavel para o service
  let farmaciasServices: FarmaciasServices;

  // roda antes de cada teste
  beforeEach(() => {
    // limpa os mocks
    jest.clearAllMocks();
    
    // nova instancia
    farmaciasServices = new FarmaciasServices();
  });

  /*
   * TESTE 1: listar farmácias com sucesso
   * Objetivo: verificar se o serviço processa os dados do banco corretamente
   */
  describe("Listar Farmácias", () => {
    it("deve listar farmácias com sucesso e incluir mensagem de documentos", async () => {
      // dados falsos simulando o retorno do banco
      const farmaciasMock = [
        {
          id: 1,
          nome: "Farmácia Teste 1",
          cnpj: "12345678000199",
          telefone: "(11) 98765-4321",
          entregas: true,
          endereco_id: 1,
          ativo: true,
        },
        {
          id: 2,
          nome: "Farmácia Teste 2",
          cnpj: "98765432000188",
          telefone: "(11) 91234-5678",
          entregas: false,
          endereco_id: 2,
          ativo: true,
        },
      ];

      // mock retornando dados falsos
      (FarmaciasData.prototype.listarFarmacias as jest.Mock) = jest.fn().mockResolvedValue({
        data: farmaciasMock,
        error: null,
      });

      // chama o método
      const resultado = await farmaciasServices.listarFarmacias();

      // 1: verifica sucesso
      expect(resultado.success).toBe(true);

      // 2: verifica mensagem
      expect(resultado.message).toBe("Farmácias encontradas com sucesso.");

      // 3: verifica dados corretos
      expect(resultado.data).toEqual(farmaciasMock);
      expect(resultado.data?.length).toBe(2);

      // 4: verifica mensagem de documentos necessários
      expect(resultado.documentosNecessarios).toBeDefined();
      expect(resultado.documentosNecessarios).toContain("Farmácia Popular");
      expect(resultado.documentosNecessarios).toContain("Identidade (CPF e RG)");
      expect(resultado.documentosNecessarios).toContain("Receita médica");
    });
  });

  /*
   * TESTE 2: buscar farmácia por ID inexistente
   * Objetivo: verificar se trata quando não encontra a farmácia
   */
  describe("Buscar Farmácia por ID", () => {
    it("deve retornar erro quando farmácia não for encontrada", async () => {
      // ID que nao existe
      const idInexistente = 999;

      // mock retornando null (nao encontrou)
      (FarmaciasData.prototype.buscarFarmaciaPorId as jest.Mock) = jest.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      // busca farmácia inexistente
      const resultado = await farmaciasServices.buscarFarmaciaPorId(idInexistente);

      // 1: verifica falha
      expect(resultado.success).toBe(false);

      // 2: verifica mensagem de nao encontrado
      expect(resultado.message).toBe("Farmácia não encontrada");

      // 3: verifica que nao retornou dados
      expect(resultado.data).toBeUndefined();

      // 4: verifica que nao tem mensagem de documentos
      expect(resultado.documentosNecessarios).toBeUndefined();
    });
  });
});