# Migrations

Os arquivos SQL desta pasta criam as tabelas exigidas pelo projeto em um banco MySQL.

1. Configure as variáveis `DATABASE_*` no `.env`.
2. Crie o banco configurado em `DATABASE_NAME`.
3. Execute:

```bash
npm run migrate
```

Os arquivos são executados em ordem numérica. O modo local usa `pg-mem` automaticamente e `sequelize.sync()` monta as tabelas em memória.

As migrations são versionadas nesta pasta.

Para produção, o Sequelize CLI pode ser configurado a partir dos modelos existentes em `src/models`.
O desenvolvimento atual usa `sequelize.sync()` em `src/server.js`, permitindo subir o banco SQLite local imediatamente.
