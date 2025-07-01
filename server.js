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

app.put('/products', (req, res) => {
  const products = req.body;
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
  res.json({ success: true });
});

app.post('/comprar', (req, res) => {
  const { idProduto, quantidadeComprada } = req.body;
  const products = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const id = Number(idProduto);
  const produto = products.find(p => p.id === id); 

  console.log("idProduto recebido:", idProduto, " (convertido:", id, ")");
  console.log("Product List:", products.map(p => ({ id: p.id, nome: p.nome })));

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

// Rotas de avaliações
const reviewsPath = path.join(__dirname, 'data', 'reviews.json');

app.get('/reviews/:productId', (req, res) => {
  const allReviews = JSON.parse(fs.readFileSync(reviewsPath, 'utf8'));
  const productId = Number(req.params.productId);
  const reviews = allReviews.filter(r => r.productId === productId);
  res.json(reviews);
});

app.post('/reviews', (req, res) => {
  const { productId, stars, comment } = req.body;
  const allReviews = JSON.parse(fs.readFileSync(reviewsPath, 'utf8'));
  allReviews.push({ productId, stars, comment });
  fs.writeFileSync(reviewsPath, JSON.stringify(allReviews, null, 2));
  res.json({ success: true });
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
