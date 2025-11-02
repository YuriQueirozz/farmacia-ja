export type Usuario = {
  id: string;
  nome: string;
  cpf: string;
  endereco: string | null;
  data_nascimento: string | null;
  tipo: string;
  criadoEm?: string | null;
  atualizadoEm?: string | null;
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
<<<<<<< HEAD
  // horarioFuncionamento: string;
  endereco_id: number;
=======
  horarioFuncionamento: string;
  enderecoId: number;
>>>>>>> 42d8a717c20b05aef9d4e4c400ea1120ebd324c7
  ativo?: boolean;
  criadoEm?: string;
  atualizadoEm?: string;
};

export type Medicamento = {
  id: number;
  nome: string;
  principio_ativo: string;
  dosagem: string;
  categoria?: string;
  criadoEm?: string;
  atualizadoEm?: string;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
<<<<<<< HEAD
};
=======
};
>>>>>>> 42d8a717c20b05aef9d4e4c400ea1120ebd324c7
