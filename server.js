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

// Mock user database
const users = [];

// Middleware to check if user is logged in
const isLoggedIn = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  req.userId = userId;
  next();
};

// Signup endpoint
app.post('/api/signup', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  const newUser = { id: Date.now().toString(), username, password };
  users.push(newUser);
  res.status(201).json({ message: 'User created', userId: newUser.id });
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  res.json({ message: 'Login successful', userId: user.id });
});

// Protected route example (logged-in users only)
app.get('/api/protected', isLoggedIn, (req, res) => {
  res.json({ message: 'This is a protected route', userId: req.userId });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 