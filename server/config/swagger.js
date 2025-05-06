import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Construction PM API Documentation',
      version: '1.0.0',
      description: 'API documentation for Construction Project Management System',
      contact: {
        name: 'API Support',
        email: 'support@constructionpm.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:{port}/api',
        variables: {
          port: {
            default: '4000',
            description: 'API server port'
          }
        }
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string'
                  },
                  message: {
                    type: 'string'
                  }
                }
              }
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            email: {
              type: 'string',
              format: 'email'
            },
            name: {
              type: 'string'
            },
            accountNo: {
              type: 'string',
              pattern: '^USR\\d{6}$'
            },
            role: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['USER', 'ADMIN', 'PROJECT_MANAGER']
              }
            }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password', 'name'],
          properties: {
            email: {
              type: 'string',
              format: 'email'
            },
            password: {
              type: 'string',
              format: 'password',
              minLength: 8
            },
            name: {
              type: 'string',
              minLength: 2,
              maxLength: 50
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email'
            },
            password: {
              type: 'string',
              format: 'password'
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            accessToken: {
              type: 'string'
            },
            refreshToken: {
              type: 'string'
            },
            user: {
              $ref: '#/components/schemas/User'
            }
          }
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./server/routes/*.js'], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

export function configureSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
