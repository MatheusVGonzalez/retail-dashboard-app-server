const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Servir arquivos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint de produtos
app.get('/products', (req, res) => {
  const data = fs.readFileSync('./data/product.json', 'utf8');
  const products = JSON.parse(data);
  res.json(products);
});

// Iniciar servidor
app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
