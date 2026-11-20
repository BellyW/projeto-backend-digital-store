import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import routes from './routes/index.js';
import { sequelize } from './config/database.js';
import '../src/models/index.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';

export const app = express();
app.use(cors());
app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup({
  openapi: '3.0.0',
  info: { title: 'Digital Store API', version: '1.0.0', description: 'API REST para usuários, categorias e produtos.' },
  servers: [{ url: 'http://localhost:3000' }],
  components: {
    securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
  },
  paths: {
    '/v1/user/token': { post: { summary: 'Autenticar usuário', tags: ['Usuários'], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['email', 'password'], properties: { email: { type: 'string' }, password: { type: 'string' } } } } } }, responses: { 200: { description: 'Token JWT gerado' }, 401: { description: 'Credenciais inválidas' } } } },
    '/v1/user': { post: { summary: 'Cadastrar usuário', tags: ['Usuários'], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['firstname', 'surname', 'email', 'password', 'confirmPassword'], properties: { firstname: { type: 'string' }, surname: { type: 'string' }, email: { type: 'string' }, password: { type: 'string' }, confirmPassword: { type: 'string' } } } } } }, responses: { 201: { description: 'Usuário criado' }, 400: { description: 'Dados inválidos' } } } },
    '/v1/user/{id}': {
      get: { summary: 'Buscar usuário', tags: ['Usuários'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Usuário encontrado' }, 404: { description: 'Não encontrado' } } },
      put: { summary: 'Atualizar usuário', tags: ['Usuários'], security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Usuário atualizado' }, 401: { description: 'Token obrigatório' } } },
      delete: { summary: 'Excluir usuário', tags: ['Usuários'], security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 204: { description: 'Usuário excluído' }, 401: { description: 'Token obrigatório' } } },
    },
    '/v1/category/search': { get: { summary: 'Pesquisar categorias', tags: ['Categorias'], responses: { 200: { description: 'Lista de categorias' } } } },
    '/v1/category': { post: { summary: 'Criar categoria', tags: ['Categorias'], security: [{ bearerAuth: [] }], responses: { 201: { description: 'Categoria criada' }, 401: { description: 'Token obrigatório' } } } },
    '/v1/category/{id}': { get: { summary: 'Buscar categoria', tags: ['Categorias'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Categoria encontrada' }, 404: { description: 'Não encontrada' } } }, put: { summary: 'Atualizar categoria', tags: ['Categorias'], security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Categoria atualizada' } } }, delete: { summary: 'Excluir categoria', tags: ['Categorias'], security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 204: { description: 'Categoria excluída' } } } },
    '/v1/product/search': { get: { summary: 'Pesquisar produtos', tags: ['Produtos'], parameters: [{ name: 'limit', in: 'query', schema: { type: 'integer', default: 12 } }, { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } }, { name: 'search', in: 'query', schema: { type: 'string' } }], responses: { 200: { description: 'Lista paginada de produtos' } } } },
    '/v1/product': { post: { summary: 'Criar produto', tags: ['Produtos'], security: [{ bearerAuth: [] }], responses: { 201: { description: 'Produto criado' }, 401: { description: 'Token obrigatório' } } } },
    '/v1/product/{id}': { get: { summary: 'Buscar produto', tags: ['Produtos'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Produto encontrado' }, 404: { description: 'Não encontrado' } } }, put: { summary: 'Atualizar produto', tags: ['Produtos'], security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Produto atualizado' } } }, delete: { summary: 'Excluir produto', tags: ['Produtos'], security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 204: { description: 'Produto excluído' } } } },
  },
}));
app.use(routes);
app.use(notFound);
app.use(errorHandler);

const port = Number(process.env.PORT || 3000);

export async function start() {
  await sequelize.sync();
  return app.listen(port, () => console.log(`API disponível em http://localhost:${port}`));
}

if (process.argv[1]?.endsWith('/src/server.js')) start().catch((error) => { console.error(error); process.exit(1); });
