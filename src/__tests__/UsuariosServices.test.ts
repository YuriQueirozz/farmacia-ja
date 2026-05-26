import { UsuariosServices, IUsuariosRepository } from "../services/UsuariosServices";
import type { Usuario } from "../types/types";

describe("UsuariosServices - testes unitários", () => {
    const makeFakeUser = (id = "uuid-1"): Usuario => ({
        id,
        nome: "Daniel",
        cpf: "11122233344",
        endereco: null,
        data_nascimento: null,
        tipo: "cliente",
        email: "teste@local.test",
    });

    let mockRepository: jest.Mocked<IUsuariosRepository>;
    let service: UsuariosServices;

    beforeEach(() => {
        mockRepository = {
            buscarUsuarios: jest.fn(),
            filtrarUsuarios: jest.fn(),
            buscarUsuarioPorId: jest.fn(),
            criarUsuario: jest.fn(),
            deletarUsuario: jest.fn(),
            atualizarUsuario: jest.fn(),
            atualizarParcialUsuario: jest.fn(),
        };

        service = new UsuariosServices(mockRepository);
    });

    it("listarUsuarios - sucesso", async () => {
        mockRepository.buscarUsuarios.mockResolvedValue({ data: [makeFakeUser()], error: null });
        
        const res = await service.listarUsuarios();

        expect(res.success).toBe(true);
        expect(Array.isArray(res.data)).toBe(true);
        expect(mockRepository.buscarUsuarios).toHaveBeenCalled();
    });

    it("listarUsuarios - erro da camada de dados", async () => {
        mockRepository.buscarUsuarios.mockResolvedValue({
            data: null,
            error: { message: "DB error" },
        });

        const res = await service.listarUsuarios();

        expect(res.success).toBe(false);
        expect(res.message).toMatch(/Erro ao buscar usuários/);
    });

    it("filtrarUsuarios - retorna lista filtrada", async () => {
        const fakeUser = makeFakeUser();
        mockRepository.filtrarUsuarios.mockResolvedValue({ data: [fakeUser], error: null });

        const res = await service.filtrarUsuarios({ nome: "Daniel" });

        expect(res.success).toBe(true);
        expect(res.data).toHaveLength(1);
        expect(mockRepository.filtrarUsuarios).toHaveBeenCalledWith({
            nome: "Daniel",
            cpf: undefined,
            email: undefined,
        });
    });

    it("buscarUsuarioPorId - sucesso", async () => {
        const fakeUser = makeFakeUser("u1");
        mockRepository.buscarUsuarioPorId.mockResolvedValue({ data: fakeUser, error: null });

        const res = await service.buscarUsuarioPorId("u1");

        expect(res.success).toBe(true);
        expect((res.data as Usuario).id).toBe("u1");
        expect(mockRepository.buscarUsuarioPorId).toHaveBeenCalledWith("u1");
    });

    it("buscarUsuarioPorId - NOT_FOUND", async () => {
        mockRepository.buscarUsuarioPorId.mockResolvedValue({ data: null, error: null });

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

        mockRepository.criarUsuario.mockResolvedValue({ data: created, error: null });

        const res = await service.criarUsuario(payload);

        expect(res.success).toBe(true);
        expect((res.data as any).email).toBe(payload.email);
        
        expect(mockRepository.criarUsuario).toHaveBeenCalledWith(
            expect.objectContaining({
                email: payload.email.toLowerCase(),
                senha: payload.senha,
            })
        );
    });

    it("criarUsuario - validação (faltando campos obrigatórios)", async () => {
        const res = await service.criarUsuario({ email: "a@a.com" }); 

        expect(res.success).toBe(false);
        expect(res.error).toBe("VALIDATION_ERROR");
        expect(mockRepository.criarUsuario).not.toHaveBeenCalled();
    });

    it("criarUsuario - erro por CPF duplicado (Tratamento Defensivo)", async () => {
        const payload = {
            email: "x@x.com",
            senha: "123456",
            nome: "Novo",
            cpf: "99988877766",
            tipo: "cliente",
        };

        mockRepository.criarUsuario.mockResolvedValue({ 
            data: null, 
            error: { code: "23505", message: "duplicate key value violates unique constraint" } 
        });

        const res = await service.criarUsuario(payload);

        expect(res.success).toBe(false);
        expect(res.error).toBe("DUPLICATE_CPF");
        expect(res.message).toBe("CPF já cadastrado");
    });

    it("atualizarParcialUsuario - sucesso", async () => {
        const id = "u3";
        const fakeUser = makeFakeUser(id);

        mockRepository.buscarUsuarioPorId.mockResolvedValue({ data: fakeUser, error: null });
        mockRepository.buscarUsuarios.mockResolvedValue({ data: [fakeUser], error: null });
        mockRepository.atualizarParcialUsuario.mockResolvedValue({
            data: {...fakeUser, nome: "Novo" },
            error: null,
        });

        const res = await service.atualizarParcialUsuario(id, { nome: "Novo" });

        expect(res.success).toBe(true);
        expect((res.data as any).nome).toBe("Novo");
        expect(mockRepository.atualizarParcialUsuario).toHaveBeenCalled();
    });

    it("atualizarParcialUsuario - NOT_FOUND", async () => {
        mockRepository.buscarUsuarioPorId.mockResolvedValue({ data: null, error: null });

        const res = await service.atualizarParcialUsuario("nao-existe", {
            nome: "X",
        });

        expect(res.success).toBe(false);
        expect(res.error).toBe("NOT_FOUND");
    });

    it("removerUsuario - sucesso", async () => {
        const id = "u4";
        const fakeUser = makeFakeUser(id);
        mockRepository.buscarUsuarioPorId.mockResolvedValue({ data: fakeUser, error: null });
        mockRepository.deletarUsuario.mockResolvedValue({ data: fakeUser, error: null });

        const res = await service.removerUsuario(id);

        expect(res.success).toBe(true);
        expect(res.message).toMatch(/removido/);
        expect(mockRepository.deletarUsuario).toHaveBeenCalledWith(id);
    });

    it("criarUsuario - duplicidade CPF (da branch main)", async () => {
        const payload = {
            email: "a@a.com",
            senha: "123",
            nome: "X",
            cpf: "11122233344",
            tipo: "cliente",
        };

        mockRepository.criarUsuario.mockResolvedValue({
            data: null,
            error: {
                code: "23505",
                message: 'duplicate key value violates unique constraint "usuarios_cpf_key"',
            },
        });

        const res = await service.criarUsuario(payload);

        expect(res.success).toBe(false);
        expect(res.error).toBe("DUPLICATE_CPF");
        expect(mockRepository.criarUsuario).toHaveBeenCalled();
    });

    it("criarUsuario - duplicidade email no auth -> DUPLICATE_EMAIL", async () => {
        const payload = {
            email: "a@a.com",
            senha: "123",
            nome: "X",
            cpf: "11122233344",
            tipo: "cliente",
        };

        mockRepository.criarUsuario.mockResolvedValue({
            data: null,
            error: {
                code: "DUPLICATE_EMAIL",
                message: "Email already registered",
            },
        });

        const res = await service.criarUsuario(payload);

        expect(res.success).toBe(false);
        expect(res.error).toBe("DUPLICATE_EMAIL");
        expect(mockRepository.criarUsuario).toHaveBeenCalled();
    });
});