import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

// Products route
app.get('/api/products', (req, res) => {
  res.json({ message: 'Products endpoint' });
});

// Users route
app.get('/api/users', (req, res) => {
  res.json({ message: 'Users endpoint' });
});

// Cart route
app.get('/api/cart', (req, res) => {
  res.json({ message: 'Cart endpoint' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 