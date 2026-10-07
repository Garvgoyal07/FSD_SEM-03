const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

let products = [
  { id: 1, name: "Laptop", price: 50000 },
  { id: 2, name: "Mouse", price: 800 }
];

app.get("/products", (req, res) => {
  res.json(products);
});

app.post("/products", (req, res) => {
  products.push(req.body);
  res.json({ message: "Product added successfully" });
});

app.put("/products/:id", (req, res) => {
  let product = products.find(p => p.id == req.params.id);
  Object.assign(product, req.body);
  res.json({ message: "Product updated successfully" });
});

app.delete("/products/:id", (req, res) => {
  products = products.filter(p => p.id != req.params.id);
  res.json({ message: "Product deleted successfully" });
});

app.listen(3005, () => {
  console.log("Server running on port 3005");
});