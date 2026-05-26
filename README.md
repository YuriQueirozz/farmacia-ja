# Farmácia-Já API

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge\&logo=typescript\&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge\&logo=node.js\&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge\&logo=express\&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge\&logo=supabase\&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge\&logo=docker\&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge\&logo=jest\&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)

API RESTful desenvolvida em **Node.js**, **TypeScript**, **Express** e **Supabase** para gerenciar usuários, farmácias e medicamentos relacionados ao contexto do programa Farmácia Popular.

O projeto foi estruturado com separação em camadas, padronização de respostas, integração com banco de dados, integração com Supabase Auth para criação de usuários, testes automatizados e suporte a execução em ambiente containerizado com Docker.

---

## Acesso ao serviço

* **URL da API:** https://farmacia-ja-api.onrender.com
* **Documentação Postman:** [Abrir Collection no Postman](https://documenter.getpostman.com/view/49690742/2sB3dQv9LL)
* **Esta API possui uma documentação interativa completa, permitindo que você visualize todos os endpoints e realize testes diretamente pelo navegador (Swagger):** [https://farmacia-ja-api.onrender.com/docs](https://farmacia-ja-api.onrender.com/docs)

---

---

## Sumário

* [Sobre o projeto](#sobre-o-projeto)
* [Principais funcionalidades](#principais-funcionalidades)
* [Arquitetura](#arquitetura)
* [Tecnologias utilizadas](#tecnologias-utilizadas)
* [Rotas da API](#rotas-da-api)
* [Padrão de resposta](#padrão-de-resposta)
* [Como rodar localmente](#como-rodar-localmente)
* [Variáveis de ambiente](#variáveis-de-ambiente)
* [Scripts disponíveis](#scripts-disponíveis)
* [Testes](#testes)
* [CI com GitHub Actions](#ci-com-github-actions)

---

## Sobre o projeto

A **Farmácia-Já API** é uma aplicação backend criada para centralizar dados de farmácias, medicamentos e usuários.

Além do CRUD tradicional, a API possui integração com o **Supabase Auth** para criação de usuários autenticáveis e salva os dados complementares do perfil na tabela `usuarios`.

Um dos pontos importantes da implementação é o cuidado com consistência: caso o usuário seja criado no Supabase Auth, mas ocorra erro ao salvar o perfil no banco de dados, a API executa um rollback removendo o usuário criado no Auth.

---

## Principais funcionalidades

* Cadastro, listagem, busca, atualização e remoção de usuários.
* Criação de usuários no Supabase Auth.
* Salvamento do perfil do usuário na tabela `usuarios`.
* Rollback automático caso o perfil do usuário não seja salvo corretamente.
* Cadastro, listagem, busca, filtro, atualização e remoção de medicamentos.
* Cadastro, listagem, busca por ID, busca por bairro, atualização e remoção de farmácias.
* Respostas padronizadas com `ApiResponse<T>`.
* Testes unitários com Jest.
* Build automatizado com TypeScript.
* Containerização com Docker.
* Pipeline de CI com GitHub Actions.

---

## Arquitetura

O projeto utiliza uma arquitetura em camadas para separar responsabilidades e facilitar manutenção, testes e evolução da API.

```txt
Request
  ↓
Routes
  ↓
Controllers
  ↓
Services
  ↓
Data
  ↓
Supabase/PostgreSQL
```

### Responsabilidade das camadas

| Camada        | Responsabilidade                                                                       |
| ------------- | -------------------------------------------------------------------------------------- |
| `routes`      | Define os endpoints da API e direciona as requisições para os controllers.             |
| `controllers` | Recebe `Request` e `Response`, chama os services e define os status HTTP.              |
| `services`    | Centraliza regras de negócio, validações, normalização de dados e tratamento de erros. |
| `data`        | Encapsula as operações com o Supabase e o banco de dados.                              |
| `database`    | Configura a conexão com o Supabase.                                                    |
| `types`       | Define os tipos compartilhados da aplicação.                                           |
| `__tests__`   | Contém testes automatizados.                                                           |

---

## Tecnologias utilizadas

* **Node.js**
* **TypeScript**
* **Express**
* **Supabase**
* **Supabase Auth**
* **PostgreSQL**
* **Jest**
* **ts-jest**
* **Supertest**
* **Playwright**
* **Docker**
* **GitHub Actions**
* **CORS**
* **dotenv**

---

## Rotas da API

Por padrão, em ambiente local, a API roda em:

```txt
http://localhost:3003
```

### Usuários

| Método   | Rota                              | Descrição                                                |
| -------- | --------------------------------- | -------------------------------------------------------- |
| `GET`    | `/usuarios`                       | Lista todos os usuários.                                 |
| `GET`    | `/usuarios?nome=Daniel`           | Filtra usuários por nome.                                |
| `GET`    | `/usuarios?cpf=123`               | Filtra usuários por CPF.                                 |
| `GET`    | `/usuarios?email=teste@email.com` | Filtra usuários por email.                               |
| `GET`    | `/usuarios/:id`                   | Busca usuário por ID.                                    |
| `POST`   | `/usuarios`                       | Cria usuário no Supabase Auth e salva o perfil no banco. |
| `PUT`    | `/usuarios/:id`                   | Atualiza completamente um usuário.                       |
| `PATCH`  | `/usuarios/:id`                   | Atualiza parcialmente um usuário.                        |
| `DELETE` | `/usuarios/:id`                   | Remove um usuário da tabela `usuarios`.                  |

#### Exemplo de criação de usuário

```json
{
  "email": "usuario@email.com",
  "senha": "123456",
  "nome": "João Silva",
  "cpf": "12345678900",
  "tipo": "cliente",
  "endereco": "Rua Exemplo, 123",
  "data_nascimento": "2000-01-01"
}
```

---

### Medicamentos

| Método   | Rota                                       | Descrição                                |
| -------- | ------------------------------------------ | ---------------------------------------- |
| `GET`    | `/medicamentos`                            | Lista todos os medicamentos.             |
| `GET`    | `/medicamentos/buscar?nome=...`            | Filtra medicamentos por nome.            |
| `GET`    | `/medicamentos/buscar?categoria=...`       | Filtra medicamentos por categoria.       |
| `GET`    | `/medicamentos/buscar?principio_ativo=...` | Filtra medicamentos por princípio ativo. |
| `GET`    | `/medicamentos/:id`                        | Busca medicamento por ID.                |
| `POST`   | `/medicamentos`                            | Cria um novo medicamento.                |
| `PUT`    | `/medicamentos/:id`                        | Atualiza um medicamento.                 |
| `PATCH`  | `/medicamentos/:id`                        | Atualiza parcialmente um medicamento.    |
| `DELETE` | `/medicamentos/:id`                        | Remove um medicamento.                   |

#### Exemplo de criação de medicamento

```json
{
  "nome": "Dipirona",
  "principio_ativo": "Dipirona monoidratada",
  "dosagem": "500mg",
  "categoria": "Analgésico"
}
```

---

### Farmácias

| Método   | Rota                        | Descrição                       |
| -------- | --------------------------- | ------------------------------- |
| `GET`    | `/farmacias`                | Lista todas as farmácias.       |
| `GET`    | `/farmacias/bairro/:bairro` | Busca farmácias por bairro.     |
| `GET`    | `/farmacias/:id`            | Busca farmácia por ID.          |
| `POST`   | `/farmacias`                | Cria uma nova farmácia.         |
| `PUT`    | `/farmacias/:id`            | Atualiza dados de uma farmácia. |
| `DELETE` | `/farmacias/:id`            | Remove uma farmácia.            |

#### Exemplo de criação de farmácia

```json
{
  "nome": "Farmácia Central",
  "telefone": "32999999999",
  "entregas": true,
  "cnpj": "12345678000199",
  "endereco_id": 1,
  "ativo": true
}
```

---

## Padrão de resposta

As respostas seguem o padrão:

```json
{
  "success": true,
  "message": "Operação realizada com sucesso",
  "data": {}
}
```

Em caso de erro:

```json
{
  "success": false,
  "message": "Mensagem explicando o erro",
  "error": "ERROR_CODE"
}
```

Algumas respostas relacionadas a medicamentos e farmácias também retornam o campo `documentosNecessarios`, com orientações sobre documentos necessários para retirada gratuita pelo programa Farmácia Popular.

---

## Como rodar localmente

### 1. Clone o repositório

```bash
git clone https://github.com/dangosil/farmacia-ja.git
cd farmacia-ja
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto e preencha as variáveis necessárias.

### 4. Inicie o servidor em desenvolvimento

```bash
npm run dev
```

A API estará disponível em:

```txt
http://localhost:3003
```

---

## Variáveis de ambiente

Crie um arquivo `.env` com:

```env
SUPABASE_URL=sua_url_do_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
```

> A `SUPABASE_SERVICE_ROLE_KEY` deve ser usada apenas no backend. Nunca exponha essa chave no frontend e nunca envie o arquivo `.env` para o GitHub.

Para ambiente de testes, o projeto carrega `.env.test` quando `NODE_ENV=test`.

---

## Scripts disponíveis

| Script                   | Descrição                                                    |
| ------------------------ | ------------------------------------------------------------ |
| `npm run dev`            | Inicia o servidor em modo desenvolvimento com `ts-node-dev`. |
| `npm run build`          | Compila o TypeScript para JavaScript na pasta `dist`.        |
| `npm start`              | Executa a versão compilada da API.                           |
| `npm test`               | Executa os testes com Jest.                                  |
| `npm run teste:watch`    | Executa o Jest em modo watch.                                |
| `npm run test:coverage`  | Gera relatório de cobertura de testes.                       |
| `npm run e2e:playwright` | Executa testes end-to-end com Playwright.                    |

---

## Testes

O projeto possui testes unitários para a camada de serviços de usuários, utilizando Jest e mocks da camada de dados.

Os testes cobrem cenários como:

* Listagem de usuários com sucesso.
* Tratamento de erro da camada de dados.
* Filtro de usuários.
* Busca de usuário por ID.
* Usuário não encontrado.
* Criação de usuário com sucesso.
* Validação de campos obrigatórios.
* Tratamento de CPF duplicado.
* Tratamento de email duplicado.
* Atualização parcial.
* Remoção de usuário.

Para executar:

```bash
npm test
```

Para gerar cobertura:

```bash
npm run test:coverage
```

---

## CI com GitHub Actions

O projeto possui um workflow de integração contínua que roda em pushes e pull requests para a branch `main`.

O pipeline executa:

* Checkout do código.
* Configuração do Node.js.
* Instalação de dependências.
* Build do TypeScript.
* Execução dos testes com Jest.

---

## Autor

Desenvolvido por **Daniel Gomes Silva**, **Heron Emanuel** e **Yuri Queiroz**.

GitHub: [@dangosil](https://github.com/dangosil), [@HeronEmanuel](https://github.com/HeronEmanuel), [@YuriQueirozz](https://github.com/YuriQueirozz)
