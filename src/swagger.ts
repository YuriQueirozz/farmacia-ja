import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const swaggerDocument = {
    openapi: "3.0.0",
    info: {
        title: "Farmácia-Já API",
        version: "1.0.0",
        description:
            "API RESTful para gerenciar dados de farmácias e medicamentos.",
    },
    servers: [
        {
            url: "https://farmacia-ja-api.onrender.com",
            description: "Servidor de Produção",
        },
        { url: "http://localhost:3003", description: "Servidor Local" },
    ],
    tags: [
        { name: "Usuários", description: "Rotas de Usuários" },
        { name: "Medicamentos", description: "Rotas de Medicamentos" },
        { name: "Farmácias", description: "Rotas de Farmácias" },
    ],
    paths: {
        "/usuarios": {
            get: {
                summary: "Lista todos os usuários ou filtra por query",
                tags: ["Usuários"],
                parameters: [
                    { in: "query", name: "nome", schema: { type: "string" } },
                    { in: "query", name: "cpf", schema: { type: "string" } },
                    { in: "query", name: "email", schema: { type: "string" } },
                ],
                responses: { "200": { description: "Sucesso" } },
            },
            post: {
                summary: "Cria usuário no Supabase e banco de dados",
                tags: ["Usuários"],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                example: {
                                    email: "usuario@email.com",
                                    senha: "123",
                                    nome: "João",
                                    cpf: "12345678900",
                                    tipo: "cliente",
                                    endereco: "Rua A",
                                    data_nascimento: "2000-01-01",
                                },
                            },
                        },
                    },
                },
                responses: { "201": { description: "Criado com sucesso" } },
            },
        },
        "/usuarios/{id}": {
            get: {
                summary: "Busca usuário por ID",
                tags: ["Usuários"],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                responses: { "200": { description: "Sucesso" } },
            },
            put: {
                summary: "Atualiza completamente",
                tags: ["Usuários"],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                responses: { "200": { description: "Sucesso" } },
            },
            patch: {
                summary: "Atualiza parcialmente",
                tags: ["Usuários"],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                responses: { "200": { description: "Sucesso" } },
            },
            delete: {
                summary: "Remove usuário",
                tags: ["Usuários"],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                responses: { "204": { description: "Removido" } },
            },
        },
        "/medicamentos": {
            get: {
                summary: "Lista medicamentos",
                tags: ["Medicamentos"],
                responses: { "200": { description: "Sucesso" } },
            },
            post: {
                summary: "Cria medicamento",
                tags: ["Medicamentos"],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                example: {
                                    nome: "Dipirona",
                                    principio_ativo: "Monoidratada",
                                    dosagem: "500mg",
                                    categoria: "Analgésico",
                                },
                            },
                        },
                    },
                },
                responses: { "201": { description: "Criado" } },
            },
        },
        "/medicamentos/buscar": {
            get: {
                summary: "Filtra medicamentos",
                tags: ["Medicamentos"],
                parameters: [
                    { in: "query", name: "nome", schema: { type: "string" } },
                    {
                        in: "query",
                        name: "categoria",
                        schema: { type: "string" },
                    },
                    {
                        in: "query",
                        name: "principio_ativo",
                        schema: { type: "string" },
                    },
                ],
                responses: { "200": { description: "Sucesso" } },
            },
        },
        "/medicamentos/{id}": {
            get: {
                summary: "Busca por ID",
                tags: ["Medicamentos"],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                responses: { "200": { description: "Sucesso" } },
            },
            put: {
                summary: "Atualiza",
                tags: ["Medicamentos"],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                responses: { "200": { description: "Sucesso" } },
            },
            patch: {
                summary: "Atualiza parcial",
                tags: ["Medicamentos"],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                responses: { "200": { description: "Sucesso" } },
            },
            delete: {
                summary: "Remove",
                tags: ["Medicamentos"],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                responses: { "204": { description: "Removido" } },
            },
        },
        "/farmacias": {
            get: {
                summary: "Lista farmácias",
                tags: ["Farmácias"],
                responses: { "200": { description: "Sucesso" } },
            },
            post: {
                summary: "Cria farmácia",
                tags: ["Farmácias"],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                example: {
                                    nome: "Farmácia Central",
                                    telefone: "32999999999",
                                    entregas: true,
                                    cnpj: "12345678000199",
                                    endereco_id: 1,
                                    ativo: true,
                                },
                            },
                        },
                    },
                },
                responses: { "201": { description: "Criado" } },
            },
        },
        "/farmacias/bairro/{bairro}": {
            get: {
                summary: "Busca por bairro",
                tags: ["Farmácias"],
                parameters: [
                    {
                        in: "path",
                        name: "bairro",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                responses: { "200": { description: "Sucesso" } },
            },
        },
        "/farmacias/{id}": {
            get: {
                summary: "Busca por ID",
                tags: ["Farmácias"],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                responses: { "200": { description: "Sucesso" } },
            },
            put: {
                summary: "Atualiza",
                tags: ["Farmácias"],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                responses: { "200": { description: "Sucesso" } },
            },
            delete: {
                summary: "Remove",
                tags: ["Farmácias"],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                responses: { "204": { description: "Removido" } },
            },
        },
    },
};

export const setupSwagger = (app: Express) => {
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
