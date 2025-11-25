import request from "supertest";
import { app } from "../app";

describe("Farmácias E2E Tests", () => {
  /*
   * TESTE 1 - criar farmácia sem campos obrigatórios
   * Método - POST /farmacias
   * Objetivo - verificar se a API verifica os camps obrigatorios
   */
  describe("POST /farmacias - Validação de campos obrigatórios", () => {
    it("deve retornar erro ao tentar criar farmácia sem campos obrigatórios", async () => {
      // testando o POST de farmácia com dados faltando
      const response = await request(app)
        .post("/farmacias") // Endpoint da API
        .send({
          nome: "Farmácia Incompleta",
          //cnpj
          //endereco_id
        });
      
      // 1- Deve retornar status de falha 400  porque faltam campos
      expect(response.status).toBe(400);
      
      // 2- O campo success deve ser false para indicar que falhou
      expect(response.body.success).toBe(false);
      
      // 3- Nao deve retornar dados por não ter criado nada
      expect(response.body.data).toBeUndefined();
      
    });
  });


  /**
   * TESTE 2 - buscar farmácias em bairros sem cadastros
   * Método - GET /farmacias/bairro/:bairro
   * Objetivo - verificar como a API lida quando não há resultados
   */
  describe("GET /farmacias/bairro/:bairro - Bairro sem farmácias", () => {
    it("deve retornar array vazio para bairro sem farmácias", async () => {
      // Provavelmente não existe no banco de dados
      const response = await request(app).get(
        "/farmacias/bairro/Bairro Inexistente Teste E2E"
      );
      
      // 1- Deve retornar status 200 (correto) porque mesmo sem resultados
      expect(response.status).toBe(200);

      // 2- O campo success deve ser true pois a busca funcionou (só não achou nada)
      expect(response.body.success).toBe(true);

      // 3- Os dados devem ser um array vazio []
      // toEqual([]) para verificar se é um array vazio
      expect(response.body.data).toEqual([]);
      
      // 4- Verificando se tem a palavra "Não" na resposta
      expect(response.body.message).toContain("Não");

    });
  });
});
