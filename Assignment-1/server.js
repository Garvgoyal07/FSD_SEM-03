const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // parse JSON request bodies

// In-memory data store
let products = [
  { id: 1, name: 'Laptop', category: 'Electronics', price: 55000, quantity: 10 },
  { id: 2, name: 'Headphones', category: 'Electronics', price: 1500, quantity: 40 },
  { id: 3, name: 'Notebook', category: 'Stationery', price: 60, quantity: 200 }
];
let nextId = 4;

// Validates body; returns an error message or null
function validate(body) {
  const { name, category, price, quantity } = body || {};
  if (!name || typeof name !== 'string' || !name.trim()) return 'Product name is required';
  if (!category || typeof category !== 'string' || !category.trim()) return 'Product category is required';
  if (price === undefined || typeof price !== 'number' || price < 0) return 'Price must be a non-negative number';
  if (quantity === undefined || !Number.isInteger(quantity) || quantity < 0) return 'Quantity must be a non-negative integer';
  return null;
}

// GET /products - display all products
app.get('/products', (req, res) => {
  res.json(products);
});

// GET /products/category/:category - filter products by category
app.get('/products/category/:category', (req, res) => {
  const category = req.params.category.toLowerCase();
  const result = products.filter(p => p.category.toLowerCase() === category);
  if (result.length === 0) {
    return res.status(404).json({ error: `No products found in category '${req.params.category}'` });
  }
  res.json(result);
});

// GET /products/:id - display a particular product
app.get('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);
  if (!product) return res.status(404).json({ error: `Product with ID ${req.params.id} not found` });
  res.json(product);
});

// POST /products - add a new product
app.post('/products', (req, res) => {
  const error = validate(req.body);
  if (error) return res.status(400).json({ error });
  const { name, category, price, quantity } = req.body;
  const product = { id: nextId++, name: name.trim(), category: category.trim(), price, quantity };
  products.push(product);
  res.status(201).json({ message: 'Product added successfully', product });
});

// PUT /products/:id - update an existing product
app.put('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);
  if (!product) return res.status(404).json({ error: `Product with ID ${req.params.id} not found` });
  const error = validate(req.body);
  if (error) return res.status(400).json({ error });
  const { name, category, price, quantity } = req.body;
  Object.assign(product, { name: name.trim(), category: category.trim(), price, quantity });
  res.json({ message: 'Product updated successfully', product });
});

// DELETE /products/:id - delete a product
app.delete('/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: `Product with ID ${req.params.id} not found` });
  const [deleted] = products.splice(index, 1);
  res.json({ message: 'Product deleted successfully', product: deleted });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
