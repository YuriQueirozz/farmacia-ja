export type Usuario = {
    id: number;
    nome: string;
    cpf: string;
    endereco: number;
    dataNascimento: string;
    tipo: string;
    criadoEm?: string;
    atualizadoEm?: string;
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
  localizacao?: any; // vai ser usado mais para frente com o supabase
};

export type Farmacia = {
  id: number;
  nome: string;
  telefone: string;
  entregas: boolean;
  cnpj: string;
  horarioFuncionamento: string;
  enderecoId: number;
  ativo?: boolean;
  criadoEm?: string;
  atualizadoEm?: string;
};

export type Medicamento = {
  id: number;
  nome: string;
  principioAtivo: string;
  dosagem: string;
  categoria?: string;
  criadoEm?: string;
  atualizadoEm?: string;
};

export type ApiResponse<T> = {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
};