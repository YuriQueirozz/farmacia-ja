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
});
