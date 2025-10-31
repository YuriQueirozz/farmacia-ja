export type Usuario = {
    id: number;
    nomeCompleto: string;
    email: string;
    cpf: string;
    enderecoId: number;
    criadoEm?: string;
    atualiazadoEm?: string;
};

export type Endereco = {
  id: number;
  logradouro: string;
  numero?: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
};

export type Farmacia = {
  id: number;
  nome: string;
  telefone: string;
  entregas: boolean;
  cnpj: string;
  horarioFuncionamento: string;
  enderecoId: number;
  criadoEm?: string;
  atualizadoEm?: string;
};

export type Medicamento = {
  id: number;
  nome: string;
  principioAtivo: string;
  dosagem: string;
  criadoEm?: string;
  atualizadoEm?: string;
};

export type ApiResponse<T> = {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
};