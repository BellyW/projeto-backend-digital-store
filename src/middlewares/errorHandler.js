export function notFound(req, res) {
  res.status(404).json({ error: 'Rota não encontrada' });
}

export function errorHandler(error, req, res, next) {
  if (error.name === 'ZodError') {
    return res.status(400).json({ error: 'Dados inválidos', details: error.flatten() });
  }
  console.error(error);
  res.status(error.status || 500).json({ error: error.message || 'Erro interno do servidor' });
}
