// ------------------------ MOCK SUPABASE ------------------------
const singleMock = jest.fn();

const supabaseMock = {
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: singleMock, // <-- single mock separado
  })),
};

jest.mock("../database/supabaseClient", () => ({
  supabase: supabaseMock,
}));

// ---------------- MOCK MedicamentosData ----------------
const medicamentosDataInstanceMock = {
  buscarMedicamentos: jest.fn(),
  criarMedicamento: jest.fn(),
  buscarMedicamentosPorFiltro: jest.fn(),
  deletarMedicamento: jest.fn(),
  atualizarMedicamento: jest.fn(),
  atualizarParcial: jest.fn(),
};

jest.mock("../data/MedicamentosData", () => {
  return {
    MedicamentosData: jest.fn(() => medicamentosDataInstanceMock),
  };
});

// ---------------------------------------------------------------
import { MedicamentosServices } from "../services/MedicamentosServices";
import type { PostgrestError } from "@supabase/supabase-js";

const makeError = (msg: string): PostgrestError => ({
  message: msg,
  details: "",
  hint: "",
  code: "",
  name: "PostgrestError",
});

// ---------------------------------------------------------------
describe("MedicamentosServices - Testes Unitários", () => {
  let service: MedicamentosServices;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new MedicamentosServices();
  });

  // ---------------------------------------------------------------
  test("deve listar medicamentos com sucesso", async () => {
    medicamentosDataInstanceMock.buscarMedicamentos.mockResolvedValue({
      data: [
        {
          id: 1,
          nome: "Dipirona",
          principio_ativo: "Metamizol",
          dosagem: "500mg",
          categoria: "Analgésico",
        },
      ],
      error: null,
    });

    const response = await service.listarMedicamentos();

    expect(response.success).toBe(true);
    expect(response.data?.length).toBe(1);
  });

  // ---------------------------------------------------------------
  test("deve criar medicamento com sucesso", async () => {
    medicamentosDataInstanceMock.criarMedicamento.mockResolvedValue({
      data: {
        id: 1,
        nome: "Teste",
        principio_ativo: "X",
        dosagem: "10mg",
        categoria: "Outro",
      },
      error: null,
    });

    const response = await service.criarMedicamento({
      nome: "Teste",
      principio_ativo: "X",
      dosagem: "10mg",
      categoria: "Outro",
    });

    expect(response.success).toBe(true);
    expect(response.data?.id).toBe(1);
  });

  // ---------------------------------------------------------------
  test("falhar ao criar medicamento sem campos obrigatórios", async () => {
    const response = await service.criarMedicamento({});
    expect(response.success).toBe(false);
  });

  // ---------------------------------------------------------------
  test("deve falhar ao deletar medicamento inexistente", async () => {
    // mock da verificação "existe?"
    singleMock.mockResolvedValue({
      data: null,
      error: makeError("Not found"),
    });

    // mock do método deletar — necessário apenas para evitar erro de destructuring
    medicamentosDataInstanceMock.deletarMedicamento.mockResolvedValue({
      error: null,
    });

    const response = await service.deletarMedicamento(999);

    expect(response.success).toBe(false);
    expect(response.message).toBe("Medicamento não encontrado");
  });

  // ---------------------------------------------------------------
  test("deve atualizar medicamento com sucesso", async () => {
    // mock existe?
    singleMock.mockResolvedValue({
      data: { id: 1 },
      error: null,
    });

    // mock update
    medicamentosDataInstanceMock.atualizarMedicamento.mockResolvedValue({
      data: { id: 1, nome: "Novo" },
      error: null,
    });

    const response = await service.atualizarMedicamento(1, { nome: "Novo" });

    expect(response.success).toBe(true);
    expect(response.data?.nome).toBe("Novo");
  });
});
