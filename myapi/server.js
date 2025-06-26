const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors()); 

app.get('/products', (req, res) => {
  const data = fs.readFileSync('./data/products.json', 'utf8');
  const products = JSON.parse(data);
  res.json(products);
});

app.listen(3000, () => {
  console.log('Server http://localhost:3000');
});
