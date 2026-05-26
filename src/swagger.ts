import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Farmácia-Já API',
      version: '1.0.0',
      description: 'API RESTful para gerenciar dados de farmácias e medicamentos.',
    },
    servers: [
      {
        url: 'https://farmacia-ja-api.onrender.com',
        description: 'Servidor de Produção (Render)',
      },
      {
        url: 'http://localhost:3000',
        description: 'Servidor Local',
      },
    ],
  },

  apis: ['./src/routes/*.ts'], 
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};