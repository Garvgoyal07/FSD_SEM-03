const API = '/api/books';
const $ = (id) => document.getElementById(id);
let books = [];

function toast(msg) {
  const t = $('toast'); t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}
const esc = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// GET
async function loadBooks() {
  const res = await fetch(API);
  books = await res.json();
  render();
}

function render() {
  const q = $('search').value.toLowerCase();
  const shown = books.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
  $('count').textContent = books.length;
  $('books').innerHTML = shown.length ? shown.map(b => `
    <article class="book">
      <div>
        <h3>${esc(b.title)}</h3>
        <p class="meta">${esc(b.author)}${b.year ? ' · ' + b.year : ''}${b.isbn ? ' · ISBN ' + esc(b.isbn) : ''}</p>
        <span class="badge ${b.status}">${b.status}</span>
      </div>
      <div class="btns">
        <button class="btn" onclick="editBook(${b.id})">Edit</button>
        <button class="btn danger" onclick="deleteBook(${b.id})">Delete</button>
      </div>
    </article>`).join('')
    : '<p class="empty">No books found. Add one using the form.</p>';
}

function resetForm() {
  $('bookForm').reset(); $('bookId').value = '';
  $('formTitle').textContent = 'Add a book';
  $('submitBtn').textContent = 'Add book';
  $('cancelBtn').hidden = true; $('error').textContent = '';
}

function editBook(id) {
  const b = books.find(x => x.id === id);
  $('bookId').value = b.id; $('title').value = b.title; $('author').value = b.author;
  $('year').value = b.year || ''; $('isbn').value = b.isbn; $('status').value = b.status;
  $('formTitle').textContent = 'Edit book';
  $('submitBtn').textContent = 'Save changes';
  $('cancelBtn').hidden = false;
  $('title').focus();
}

// POST (new) or PUT (existing)
$('bookForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = $('bookId').value;
  const body = { title: $('title').value, author: $('author').value, year: $('year').value, isbn: $('isbn').value, status: $('status').value };
  const res = await fetch(id ? `${API}/${id}` : API, {
    method: id ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!res.ok) { $('error').textContent = data.error; return; }
  toast(id ? 'Changes saved' : 'Book added');
  resetForm(); loadBooks();
});

// DELETE
async function deleteBook(id) {
  if (!confirm('Delete this book?')) return;
  const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
  if (res.ok) { toast('Book deleted'); if ($('bookId').value == id) resetForm(); loadBooks(); }
}

$('cancelBtn').addEventListener('click', resetForm);
$('search').addEventListener('input', render);
loadBooks();
