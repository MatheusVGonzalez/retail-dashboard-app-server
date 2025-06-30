const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Conectar rotas de autenticação
const authRoutes = require('./routes/auth'); // <--- ajuste o caminho se necessário
app.use('/auth', authRoutes);

// Rota de produtos
const filePath = path.join(__dirname, 'data', 'products.json');

app.get('/products', (req, res) => {
  const data = fs.readFileSync(filePath, 'utf8');
  const products = JSON.parse(data);
  res.json(products);
});

app.post('/comprar', (req, res) => {
  const { productId, quantidadeComprada } = req.body;

  const products = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const produto = products.find(p => p.id === productId);
  if (!produto) {
    return res.json({ success: false, error: 'Produto não encontrado.' });
  }

  if (produto.quantidade < quantidadeComprada) {
    return res.json({ success: false, error: 'Estoque insuficiente.' });
  }

  produto.quantidade -= quantidadeComprada;

  fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
  res.json({ success: true });
});

// Iniciar servidor
app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
