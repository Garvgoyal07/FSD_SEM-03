const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'books.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ---- tiny JSON-file "database" ----
function load() {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); }
  catch { return [
    { id: 1, title: 'To Kill a Mockingbird', author: 'Harper Lee', year: 1960, isbn: '9780061120084', status: 'Available' },
    { id: 2, title: 'The Pragmatic Programmer', author: 'Andrew Hunt', year: 1999, isbn: '9780201616224', status: 'Issued' }
  ]; }
}
function save() { fs.writeFileSync(DATA_FILE, JSON.stringify(books, null, 2)); }
let books = load();
let nextId = books.reduce((m, b) => Math.max(m, b.id), 0) + 1;

function validate(b) {
  if (!b.title || !b.title.trim()) return 'Title is required.';
  if (!b.author || !b.author.trim()) return 'Author is required.';
  if (b.year && (isNaN(b.year) || b.year < 0 || b.year > new Date().getFullYear()))
    return 'Enter a valid publication year.';
  return null;
}
const clean = (b) => ({
  title: b.title.trim(), author: b.author.trim(),
  year: b.year ? Number(b.year) : null, isbn: (b.isbn || '').trim(),
  status: b.status === 'Issued' ? 'Issued' : 'Available'
});

// GET - display all books
app.get('/api/books', (req, res) => res.json(books));

// POST - add a new book
app.post('/api/books', (req, res) => {
  const err = validate(req.body);
  if (err) return res.status(400).json({ error: err });
  const book = { id: nextId++, ...clean(req.body) };
  books.push(book); save();
  res.status(201).json(book);
});

// PUT - update book details
app.put('/api/books/:id', (req, res) => {
  const book = books.find(b => b.id === Number(req.params.id));
  if (!book) return res.status(404).json({ error: 'Book not found.' });
  const err = validate(req.body);
  if (err) return res.status(400).json({ error: err });
  Object.assign(book, clean(req.body)); save();
  res.json(book);
});

// DELETE - delete a book
app.delete('/api/books/:id', (req, res) => {
  const i = books.findIndex(b => b.id === Number(req.params.id));
  if (i === -1) return res.status(404).json({ error: 'Book not found.' });
  const [removed] = books.splice(i, 1); save();
  res.json(removed);
});

app.listen(PORT, () => console.log(`Library running at http://localhost:${PORT}`));
