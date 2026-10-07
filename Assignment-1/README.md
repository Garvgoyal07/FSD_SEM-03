# Product Management REST API
Run: `npm install` then `npm start` (http://localhost:3000)

| Method | Route | Operation |
|---|---|---|
| GET | /products | Display all products |
| GET | /products/:id | Display a particular product |
| POST | /products | Add a new product |
| PUT | /products/:id | Update an existing product |
| DELETE | /products/:id | Delete a product |
| GET | /products/category/:category | Filter products by category |

Body for POST/PUT:
{ "name": "Mouse", "category": "Electronics", "price": 499, "quantity": 25 }
