import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Portfolio CMS API',
    version: '1.0.0',
    description: 'Production-ready CMS backend for personal portfolio website',
    contact: { name: 'Jaber Riyan', email: 'admin@mail.com' },
  },
  servers: [
    { url: 'http://localhost:5000', description: 'Development' },
    { url: 'https://portfolioapi.jaberriyan.com', description: 'Production' },
  ],
  components: {
    securitySchemes: {
      cookieAuth: { type: 'apiKey', in: 'cookie', name: 'token' },
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          data: { type: 'object' },
        },
      },
      ApiError: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string' },
          error: { nullable: true },
        },
      },
      PaginationMeta: {
        type: 'object',
        properties: {
          total: { type: 'integer' },
          page: { type: 'integer' },
          limit: { type: 'integer' },
          totalPages: { type: 'integer' },
          hasNext: { type: 'boolean' },
          hasPrev: { type: 'boolean' },
        },
      },
    },
  },
  security: [{ cookieAuth: [] }, { bearerAuth: [] }],
  tags: [
    { name: 'Auth', description: 'Authentication endpoints' },
    { name: 'Hero', description: 'Hero section management' },
    { name: 'About', description: 'About section management' },
    { name: 'Skills', description: 'Skills management' },
    { name: 'Experience', description: 'Experience management' },
    { name: 'Projects', description: 'Projects management' },
    { name: 'Education', description: 'Education management' },
    { name: 'Certificates', description: 'Certificates management' },
    { name: 'Reviews', description: 'Reviews management' },
    { name: 'Blogs', description: 'Blogs management' },
    { name: 'Contact', description: 'Contact section management' },
    { name: 'Greeting', description: 'Greeting modal management' },
    { name: 'Theme', description: 'Theme system management' },
    { name: 'Public', description: 'Public read-only endpoints (no auth)' },
    { name: 'Upload', description: 'Static file serving' },
  ],
  paths: {
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Admin login',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'admin@mail.com' },
                  password: { type: 'string', example: 'password123' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Login successful, JWT set in httpOnly cookie' },
          400: { description: 'Validation error' },
          401: { description: 'Invalid credentials' },
        },
      },
    },
    '/api/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Admin logout',
        responses: { 200: { description: 'Logged out, cookie cleared' } },
      },
    },
    '/api/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Get current admin profile',
        responses: {
          200: { description: 'Current user data' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/hero': {
      get: { tags: ['Hero'], summary: 'Get hero data', security: [], responses: { 200: { description: 'Hero data' } } },
      post: {
        tags: ['Hero'], summary: 'Create hero section',
        requestBody: { required: true, content: { 'multipart/form-data': { schema: { type: 'object', properties: { name: { type: 'string' }, role: { type: 'string' }, description: { type: 'string' }, profileImage: { type: 'string', format: 'binary' } } } } } },
        responses: { 201: { description: 'Hero created' } },
      },
    },
    '/api/hero/{id}': {
      patch: { tags: ['Hero'], summary: 'Update hero', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Hero updated' } } },
      delete: { tags: ['Hero'], summary: 'Delete hero', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Hero deleted' } } },
    },
    '/api/about': {
      get: { tags: ['About'], summary: 'Get about data', security: [], responses: { 200: { description: 'About data' } } },
      post: { tags: ['About'], summary: 'Create about section', responses: { 201: { description: 'About created' } } },
    },
    '/api/about/{id}': {
      patch: { tags: ['About'], summary: 'Update about', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'About updated' } } },
      delete: { tags: ['About'], summary: 'Delete about', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'About deleted' } } },
    },
    '/api/skills': {
      get: { tags: ['Skills'], summary: 'Get all skill categories', security: [], responses: { 200: { description: 'Skills list' } } },
      post: { tags: ['Skills'], summary: 'Create skill category', responses: { 201: { description: 'Category created' } } },
    },
    '/api/skills/{id}': {
      patch: { tags: ['Skills'], summary: 'Update skill category', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Updated' } } },
      delete: { tags: ['Skills'], summary: 'Delete skill category', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Deleted' } } },
    },
    '/api/skills/reorder': {
      patch: { tags: ['Skills'], summary: 'Reorder skill categories', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { ids: { type: 'array', items: { type: 'string' } } } } } } }, responses: { 200: { description: 'Reordered' } } },
    },
    '/api/experience': {
      get: { tags: ['Experience'], summary: 'Get all experience', security: [], responses: { 200: { description: 'Experience list' } } },
      post: { tags: ['Experience'], summary: 'Create experience entry', responses: { 201: { description: 'Created' } } },
    },
    '/api/experience/{id}': {
      patch: { tags: ['Experience'], summary: 'Update experience', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Updated' } } },
      delete: { tags: ['Experience'], summary: 'Delete experience', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Deleted' } } },
    },
    '/api/projects': {
      get: { tags: ['Projects'], summary: 'Get projects (paginated, filterable)', security: [], parameters: [{ in: 'query', name: 'page', schema: { type: 'integer' } }, { in: 'query', name: 'limit', schema: { type: 'integer' } }, { in: 'query', name: 'featured', schema: { type: 'boolean' } }, { in: 'query', name: 'search', schema: { type: 'string' } }], responses: { 200: { description: 'Paginated projects' } } },
      post: { tags: ['Projects'], summary: 'Create project', responses: { 201: { description: 'Created' } } },
    },
    '/api/projects/reorder': {
      patch: { tags: ['Projects'], summary: 'Reorder projects', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { ids: { type: 'array', items: { type: 'string' } } } } } } }, responses: { 200: { description: 'Reordered' } } },
    },
    '/api/projects/{id}': {
      patch: { tags: ['Projects'], summary: 'Update project', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Updated' } } },
      delete: { tags: ['Projects'], summary: 'Delete project', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Deleted' } } },
    },
    '/api/education': {
      get: { tags: ['Education'], summary: 'Get all education', security: [], responses: { 200: { description: 'Education list' } } },
      post: { tags: ['Education'], summary: 'Create education entry', responses: { 201: { description: 'Created' } } },
    },
    '/api/education/{id}': {
      patch: { tags: ['Education'], summary: 'Update education', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Updated' } } },
      delete: { tags: ['Education'], summary: 'Delete education', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Deleted' } } },
    },
    '/api/certificates': {
      get: { tags: ['Certificates'], summary: 'Get all certificates', security: [], responses: { 200: { description: 'Certificates list' } } },
      post: { tags: ['Certificates'], summary: 'Create certificate', responses: { 201: { description: 'Created' } } },
    },
    '/api/certificates/{id}': {
      patch: { tags: ['Certificates'], summary: 'Update certificate', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Updated' } } },
      delete: { tags: ['Certificates'], summary: 'Delete certificate', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Deleted' } } },
    },
    '/api/reviews': {
      get: { tags: ['Reviews'], summary: 'Get all reviews', security: [], responses: { 200: { description: 'Reviews list' } } },
      post: { tags: ['Reviews'], summary: 'Create review', responses: { 201: { description: 'Created' } } },
    },
    '/api/reviews/{id}': {
      patch: { tags: ['Reviews'], summary: 'Update review', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Updated' } } },
      delete: { tags: ['Reviews'], summary: 'Delete review', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Deleted' } } },
    },
    '/api/blogs': {
      get: { tags: ['Blogs'], summary: 'Get blogs (paginated)', security: [], parameters: [{ in: 'query', name: 'page', schema: { type: 'integer' } }, { in: 'query', name: 'search', schema: { type: 'string' } }, { in: 'query', name: 'published', schema: { type: 'boolean' } }], responses: { 200: { description: 'Paginated blogs' } } },
      post: { tags: ['Blogs'], summary: 'Create blog post', responses: { 201: { description: 'Created' } } },
    },
    '/api/blogs/publish/{id}': {
      patch: { tags: ['Blogs'], summary: 'Toggle blog published state', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Publish state toggled' } } },
    },
    '/api/blogs/{id}': {
      patch: { tags: ['Blogs'], summary: 'Update blog', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Updated' } } },
      delete: { tags: ['Blogs'], summary: 'Delete blog', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Deleted' } } },
    },
    '/api/contact': {
      get: { tags: ['Contact'], summary: 'Get contact info', security: [], responses: { 200: { description: 'Contact data' } } },
      post: { tags: ['Contact'], summary: 'Create contact info', responses: { 201: { description: 'Created' } } },
    },
    '/api/contact/{id}': {
      patch: { tags: ['Contact'], summary: 'Update contact', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Updated' } } },
      delete: { tags: ['Contact'], summary: 'Delete contact', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Deleted' } } },
    },
    '/api/greeting': {
      get: { tags: ['Greeting'], summary: 'Get greeting config', security: [], responses: { 200: { description: 'Greeting data' } } },
      post: { tags: ['Greeting'], summary: 'Create greeting', responses: { 201: { description: 'Created' } } },
    },
    '/api/greeting/{id}': {
      patch: { tags: ['Greeting'], summary: 'Update greeting', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Updated' } } },
      delete: { tags: ['Greeting'], summary: 'Delete greeting', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Deleted' } } },
    },
    '/api/theme': {
      get: { tags: ['Theme'], summary: 'Get full theme', security: [], responses: { 200: { description: 'Theme data' } } },
      patch: { tags: ['Theme'], summary: 'Update global theme settings', responses: { 200: { description: 'Updated' } } },
    },
    '/api/theme/{section}': {
      patch: { tags: ['Theme'], summary: 'Update a specific section theme', parameters: [{ in: 'path', name: 'section', required: true, schema: { type: 'string', enum: ['hero', 'about', 'skills', 'experience', 'projects', 'education', 'certificates', 'reviews', 'blogs', 'contact'] } }], responses: { 200: { description: 'Section theme updated' } } },
    },
    '/public/hero': { get: { tags: ['Public'], summary: 'Get hero data', security: [], responses: { 200: { description: 'Hero' } } } },
    '/public/about': { get: { tags: ['Public'], summary: 'Get about data', security: [], responses: { 200: { description: 'About' } } } },
    '/public/projects': { get: { tags: ['Public'], summary: 'Get public projects', security: [], responses: { 200: { description: 'Projects' } } } },
    '/public/theme': { get: { tags: ['Public'], summary: 'Get theme data', security: [], responses: { 200: { description: 'Theme' } } } },
    '/public/all': {
      get: {
        tags: ['Public'], summary: 'Get all portfolio data in one request', security: [],
        responses: { 200: { description: 'Full portfolio payload', content: { 'application/json': { schema: { type: 'object', properties: { hero: { type: 'object' }, about: { type: 'object' }, skills: { type: 'array' }, experience: { type: 'array' }, projects: { type: 'array' }, education: { type: 'array' }, certificates: { type: 'array' }, reviews: { type: 'array' }, blogs: { type: 'array' }, contact: { type: 'object' }, greeting: { type: 'object' }, theme: { type: 'object' } } } } } } },
      },
    },
  },
};

export const setupSwagger = (app: Express): void => {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Portfolio CMS API Docs',
    customCss: '.swagger-ui .topbar { display: none }',
  }));
};
