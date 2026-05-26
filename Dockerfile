# --- ESTÁGIO 1: Construção (Builder) ---
FROM node:20-alpine AS builder

# Define a pasta de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala TODAS as dependências (incluindo as de desenvolvimento, como Typescript)
RUN npm install

# Copia todo o resto do código da API
COPY . .

# Compila o código TypeScript para JavaScript (gera a pasta /dist)
RUN npm run build


# --- ESTÁGIO 2: Produção (Runner) ---
FROM node:20-alpine

WORKDIR /app

# Copia apenas os arquivos de configuração de pacotes
COPY package*.json ./

# Instala APENAS as dependências necessárias para a produção (ignora pacotes de dev)
RUN npm install --omit=dev

# Copia a pasta /dist compilada no estágio anterior
COPY --from=builder /app/dist./dist

# Expõe a porta que a API vai rodar
EXPOSE 3000

# Comando para iniciar o servidor (ajuste "dist/server.js" se o seu arquivo principal tiver outro nome, como "dist/index.js")
CMD ["node", "dist/server.js"]