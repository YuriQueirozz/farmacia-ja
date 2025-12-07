import { UsuariosServices } from "../services/UsuariosServices";
import type { Usuario } from "../types/types";

describe("UsuariosServices - testes unitários (mock manual via DI)", () => {
    const makeFakeUser = (id = "uuid-1"): Usuario => ({
        id,
        nome: "Daniel",
        cpf: "11122233344",
        endereco: null,
        data_nascimento: null,
        tipo: "cliente",
        email: "teste@local.test",
    });

    it("listarUsuarios - sucesso", async () => {
        const fakeData = {
            buscarUsuarios: jest
                .fn()
                .mockResolvedValue({ data: [makeFakeUser()], error: null }),
        };

        const service = new UsuariosServices(fakeData as any);
        const res = await service.listarUsuarios();

        expect(res.success).toBe(true);
        expect(Array.isArray(res.data)).toBe(true);
        expect(fakeData.buscarUsuarios).toHaveBeenCalled();
    });

    it("listarUsuarios - erro da camada de dados", async () => {
        const fakeData = {
            buscarUsuarios: jest.fn().mockResolvedValue({
                data: null,
                error: { message: "DB error" },
            }),
        };

        const service = new UsuariosServices(fakeData as any);
        const res = await service.listarUsuarios();

        expect(res.success).toBe(false);
        expect(res.message).toMatch(/Erro ao buscar usuários/);
    });

    it("filtrarUsuarios - retorna lista filtrada", async () => {
        const fakeUser = makeFakeUser();
        const fakeData = {
            filtrarUsuarios: jest
                .fn()
                .mockResolvedValue({ data: [fakeUser], error: null }),
        };

        const service = new UsuariosServices(fakeData as any);
        const res = await service.filtrarUsuarios({ nome: "Daniel" });

        expect(res.success).toBe(true);
        expect(res.data).toHaveLength(1);
        expect(fakeData.filtrarUsuarios).toHaveBeenCalledWith({
            nome: "Daniel",
            cpf: undefined,
            email: undefined,
        });
    });

    it("buscarUsuarioPorId - sucesso", async () => {
        const fakeUser = makeFakeUser("u1");
        const fakeData = {
            buscarUsuarioPorId: jest
                .fn()
                .mockResolvedValue({ data: fakeUser, error: null }),
        };

        const service = new UsuariosServices(fakeData as any);
        const res = await service.buscarUsuarioPorId("u1");

        expect(res.success).toBe(true);
        expect((res.data as Usuario).id).toBe("u1");
        expect(fakeData.buscarUsuarioPorId).toHaveBeenCalledWith("u1");
    });

    it("buscarUsuarioPorId - NOT_FOUND", async () => {
        const fakeData = {
            buscarUsuarioPorId: jest
                .fn()
                .mockResolvedValue({ data: null, error: null }),
        };

        const service = new UsuariosServices(fakeData as any);
        const res = await service.buscarUsuarioPorId("nao-existe");

        expect(res.success).toBe(false);
        expect(res.error).toBe("NOT_FOUND");
    });

    it("criarUsuario - sucesso", async () => {
        const payload = {
            email: "x@x.com",
            senha: "123456",
            nome: "Novo",
            cpf: "99988877766",
            tipo: "cliente",
        };
        const created = {
            id: "u1",
            ...payload,
            endereco: null,
            data_nascimento: null,
        };

        const fakeData = {
            criarUsuario: jest
                .fn()
                .mockResolvedValue({ data: created, error: null }),
        };

        const service = new UsuariosServices(fakeData as any);
        const res = await service.criarUsuario(payload);

        expect(res.success).toBe(true);
        expect((res.data as any).email).toBe(payload.email);
        expect(fakeData.criarUsuario).toHaveBeenCalledWith(
            expect.objectContaining({
                email: payload.email.toLowerCase(),
                senha: payload.senha,
            })
        );
    });

    it("criarUsuario - validação (faltando campos obrigatórios)", async () => {
        const fakeData = {
            criarUsuario: jest.fn(), // não será chamado
        };

        const service = new UsuariosServices(fakeData as any);
        const res = await service.criarUsuario({ email: "a@a.com" }); // falta senha/nome/cpf/tipo

        expect(res.success).toBe(false);
        expect(res.error).toBe("VALIDATION_ERROR");
        expect(fakeData.criarUsuario).not.toHaveBeenCalled();
    });

    it("atualizarParcialUsuario - sucesso", async () => {
        const id = "u3";
        const fakeUser = makeFakeUser(id);
        const fakeData = {
            buscarUsuarioPorId: jest
                .fn()
                .mockResolvedValue({ data: fakeUser, error: null }),
            buscarUsuarios: jest
                .fn()
                .mockResolvedValue({ data: [fakeUser], error: null }),
            atualizarParcialUsuario: jest.fn().mockResolvedValue({
                data: { ...fakeUser, nome: "Novo" },
                error: null,
            }),
        };

        const service = new UsuariosServices(fakeData as any);
        const res = await service.atualizarParcialUsuario(id, { nome: "Novo" });

        expect(res.success).toBe(true);
        expect((res.data as any).nome).toBe("Novo");
        expect(fakeData.atualizarParcialUsuario).toHaveBeenCalled();
    });

    it("atualizarParcialUsuario - NOT_FOUND", async () => {
        const fakeData = {
            buscarUsuarioPorId: jest
                .fn()
                .mockResolvedValue({ data: null, error: null }),
        };

        const service = new UsuariosServices(fakeData as any);
        const res = await service.atualizarParcialUsuario("nao-existe", {
            nome: "X",
        });

        expect(res.success).toBe(false);
        expect(res.error).toBe("NOT_FOUND");
    });

    it("removerUsuario - sucesso", async () => {
        const id = "u4";
        const fakeUser = makeFakeUser(id);
        const fakeData = {
            buscarUsuarioPorId: jest
                .fn()
                .mockResolvedValue({ data: fakeUser, error: null }),
            deletarUsuario: jest
                .fn()
                .mockResolvedValue({ data: fakeUser, error: null }),
        };

        const service = new UsuariosServices(fakeData as any);
        const res = await service.removerUsuario(id);

        expect(res.success).toBe(true);
        expect(res.message).toMatch(/removido/);
        expect(fakeData.deletarUsuario).toHaveBeenCalledWith(id);
    });

    it("criarUsuario - duplicidade CPF -> DUPLICATE_CPF", async () => {
        const payload = {
            email: "a@a.com",
            senha: "123",
            nome: "X",
            cpf: "11122233344",
            tipo: "cliente",
        };

        const fakeData = {
            criarUsuario: jest.fn().mockResolvedValue({
                data: null,
                error: {
                    code: "23505",
                    message:
                        'duplicate key value violates unique constraint "usuarios_cpf_key"',
                },
            }),
        };

        const service = new UsuariosServices(fakeData as any);
        const res = await service.criarUsuario(payload);

        expect(res.success).toBe(false);
        expect(res.error).toBe("DUPLICATE_CPF");
        expect(fakeData.criarUsuario).toHaveBeenCalled();
    });

    it("criarUsuario - duplicidade email no auth -> DUPLICATE_EMAIL", async () => {
        const payload = {
            email: "a@a.com",
            senha: "123",
            nome: "X",
            cpf: "11122233344",
            tipo: "cliente",
        };

        const fakeData = {
            criarUsuario: jest.fn().mockResolvedValue({
                data: null,
                error: {
                    code: "DUPLICATE_EMAIL",
                    message: "Email already registered",
                },
            }),
        };

        const service = new UsuariosServices(fakeData as any);
        const res = await service.criarUsuario(payload);

        expect(res.success).toBe(false);
        expect(res.error).toBe("DUPLICATE_EMAIL");
        expect(fakeData.criarUsuario).toHaveBeenCalled();
    });

    
});
