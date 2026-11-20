import test from 'node:test';
import assert from 'node:assert/strict';
import { app } from '../src/server.js';
import { sequelize } from '../src/config/database.js';

process.env.JWT_SECRET = 'test-secret';

test('API inicia, cria usuário e responde ao buscar produto inexistente', async (t) => {
  await sequelize.sync({ force: true });
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const port = server.address().port;
  t.after(async () => { await new Promise((resolve) => server.close(resolve)); await sequelize.close(); });

  const response = await fetch(`http://127.0.0.1:${port}/v1/user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firstname: 'Sibelly', surname: 'Silva', email: 'sibelly@example.com', password: '123456', confirmPassword: '123456' }),
  });
  assert.equal(response.status, 201);

  const missing = await fetch(`http://127.0.0.1:${port}/v1/product/999`);
  assert.equal(missing.status, 404);

  const categorySearch = await fetch(`http://127.0.0.1:${port}/v1/category/search`);
  assert.equal(categorySearch.status, 200);

  const productSearch = await fetch(`http://127.0.0.1:${port}/v1/product/search?page=1&limit=12`);
  assert.equal(productSearch.status, 200);
});
