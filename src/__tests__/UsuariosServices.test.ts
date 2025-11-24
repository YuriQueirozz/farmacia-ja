
import { UsuariosServices } from "../services/UsuariosServices";

describe("UsuariosServices (mock manual via DI)", () => {
  it("atualiza parcialmente um usuário", async () => {
    const fakeData = {
      buscarUsuarioPorId: jest.fn().mockResolvedValue({
        data: { id: "1", nome: "Daniel", cpf: "123", tipo: "cliente" },
        error: null,
      }),
      buscarUsuarios: jest.fn().mockResolvedValue({
        data: [{ id: "1", nome: "Daniel", cpf: "123", tipo: "cliente" }],
        error: null,
      }),
      atualizarParcialUsuario: jest.fn().mockResolvedValue({
        data: { id: "1", nome: "Daniel Atualizado", cpf: "123", tipo: "cliente" },
        error: null,
      }),
    };

    const service = new UsuariosServices(fakeData as any);

    const result = await service.atualizarParcialUsuario("1", { nome: "Daniel Atualizado" });

    expect(result.success).toBe(true);
    expect((result.data as any).nome).toBe("Daniel Atualizado");
    expect(fakeData.atualizarParcialUsuario).toHaveBeenCalled();
  });

  
});
