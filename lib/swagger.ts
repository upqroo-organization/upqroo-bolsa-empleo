// lib/swagger.ts
import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Bolsa de Trabajo',
      version: '1.0.0',
      description: 'Documentación generada con Swagger',
    },
    servers: [{ url: 'http://localhost:3000' }],
  },
  apis: ['./app/api/**/*.ts'], // Escanea todos tus endpoints con comentarios Swagger
});
