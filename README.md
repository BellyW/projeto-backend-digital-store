# Projeto Back-end — Digital Store

API REST do projeto Digital Store, construída com Node.js, Express, Sequelize e documentação Swagger.

## Tecnologias

- Node.js 20+
- Express
- Sequelize ORM
- PostgreSQL em memória via `pg-mem` para desenvolvimento local e testes
- MySQL para produção
- JWT para autenticação
- Zod para validação
- Swagger UI
- Testes com Node Test Runner

## Executar

```bash
cp .env.example .env
npm install
npm run dev
```

API: `http://localhost:3000`

Documentação: `http://localhost:3000/docs`

Testes:

```bash
npm test
```

## Rotas principais

| Método | Rota oficial | Proteção |
|---|---|---|
| POST | `/v1/user/token` | Pública |
| GET | `/v1/user/:id` | Pública |
| POST | `/v1/user` | Pública |
| PUT | `/v1/user/:id` | JWT |
| DELETE | `/v1/user/:id` | JWT |
| GET | `/v1/category/search` | Pública |
| GET | `/v1/category/:id` | Pública |
| POST | `/v1/category` | JWT |
| PUT | `/v1/category/:id` | JWT |
| DELETE | `/v1/category/:id` | JWT |
| GET | `/v1/product/search` | Pública |
| GET | `/v1/product/:id` | Pública |
| POST | `/v1/product` | JWT |
| PUT | `/v1/product/:id` | JWT |
| DELETE | `/v1/product/:id` | JWT |

O alias `/v1/auth/login` também está disponível por compatibilidade.

## Integração com banco

Por padrão, o projeto usa PostgreSQL em memória por meio de `pg-mem`; os dados não são persistidos entre reinicializações. Para usar MySQL real, configure no `.env`:

```env
DATABASE_DIALECT=mysql
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=digital_store
DATABASE_USER=root
DATABASE_PASSWORD=sua_senha
JWT_SECRET=sua_chave_secreta
```

Crie o banco em MySQL e aplique as migrations:

```bash
npm run migrate
```

Os arquivos SQL da pasta `migrations` criam usuários, categorias, produtos, imagens, opções e relações entre produtos e categorias.



