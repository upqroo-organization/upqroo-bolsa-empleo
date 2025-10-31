import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'UPQROO Bolsa de Trabajo API',
      version: '1.0.0',
      description: 'API documentation for UPQROO University Job Board Platform',
      contact: {
        name: 'UPQROO Development Team',
        email: 'dev@upqroo.edu.mx',
      },
    },
    servers: [
      {
        url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        sessionAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'next-auth.session-token',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            image: { type: 'string', nullable: true },
            role: { type: 'string', enum: ['student', 'external', 'coordinator', 'admin'] },
            cvUrl: { type: 'string', nullable: true },
            career: { type: 'string', nullable: true },
            semester: { type: 'integer', nullable: true },
            phone: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Company: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            rfc: { type: 'string', nullable: true },
            phone: { type: 'string', nullable: true },
            industry: { type: 'string', nullable: true },
            size: { type: 'string', enum: ['1-10', '11-50', '51-200', '201-500', '500+'] },
            companyType: { type: 'string' },
            websiteUrl: { type: 'string', nullable: true },
            address: { type: 'string', nullable: true },
            description: { type: 'string', nullable: true },
            logoUrl: { type: 'string', nullable: true },
            fiscalDocumentUrl: { type: 'string', nullable: true },
            contactName: { type: 'string', nullable: true },
            contactPosition: { type: 'string', nullable: true },
            contactEmail: { type: 'string', format: 'email', nullable: true },
            isApprove: { type: 'boolean' },
            approvalStatus: { type: 'string', enum: ['pending', 'approved', 'rejected'] },
            stateId: { type: 'integer', nullable: true },
            roleId: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Vacante: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            summary: { type: 'string' },
            description: { type: 'string' },
            responsibilities: { type: 'string' },
            requirements: { type: 'string', nullable: true },
            benefits: { type: 'string', nullable: true },
            location: { type: 'string', nullable: true },
            salaryMin: { type: 'integer', nullable: true },
            salaryMax: { type: 'integer', nullable: true },
            career: { type: 'string', nullable: true },
            department: { type: 'string', nullable: true },
            type: { type: 'string', enum: ['full-time', 'part-time', 'internship', 'contract'] },
            modality: { type: 'string', enum: ['remote', 'on-site', 'hybrid'] },
            numberOfPositions: { type: 'integer' },
            deadline: { type: 'string', format: 'date-time', nullable: true },
            status: { type: 'string', enum: ['active', 'expired', 'closed'] },
            applicationProcess: { type: 'string', nullable: true },
            isMock: { type: 'boolean' },
            companyId: { type: 'string' },
            stateId: { type: 'integer', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Application: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'string' },
            vacanteId: { type: 'string' },
            status: { type: 'string', enum: ['pending', 'reviewed', 'accepted', 'rejected'] },
            appliedAt: { type: 'string', format: 'date-time' },
            reviewedAt: { type: 'string', format: 'date-time', nullable: true },
            notes: { type: 'string', nullable: true },
          },
        },
        Survey: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string', nullable: true },
            questions: { type: 'array', items: { type: 'object' } },
            isActive: { type: 'boolean' },
            createdBy: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        State: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            code: { type: 'string' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            details: { type: 'string', nullable: true },
          },
        },
        Success: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string', nullable: true },
            data: { type: 'object', nullable: true },
          },
        },
      },
    },
    tags: [
      { name: 'Authentication', description: 'Authentication and authorization endpoints' },
      { name: 'Users', description: 'User management endpoints' },
      { name: 'Companies', description: 'Company management endpoints' },
      { name: 'Jobs', description: 'Job vacancy management endpoints' },
      { name: 'Applications', description: 'Job application endpoints' },
      { name: 'Coordinators', description: 'Coordinator management endpoints' },
      { name: 'Uploads', description: 'File upload and management endpoints' },
      { name: 'Surveys', description: 'Survey management endpoints' },
      { name: 'Utilities', description: 'Utility endpoints' },
    ],
  },
  apis: ['./app/api/**/*.ts', './docs/api-specs.ts'], // Path to the API files
};

export const swaggerSpec = swaggerJSDoc(options);