import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import bcrypt from 'bcrypt';

const app = express();
const PORT = process.env.PORT || 3001;
const stripe = new Stripe('sk_test_placeholder_secret_key');

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
app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: Date.now().toString(), username, password: hashedPassword };
    users.push(newUser);
    res.status(201).json({ message: 'User created', userId: newUser.id });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  try {
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({ message: 'Login successful', userId: user.id });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Protected route example (logged-in users only)
app.get('/api/protected', isLoggedIn, (req, res) => {
  res.json({ message: 'This is a protected route', userId: req.userId });
});

app.post('/api/create-checkout-session', async (req, res) => {
  const { cart, userId } = req.body;
  if (!cart || !Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }
  try {
    const line_items = cart.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: { name: item.title },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: 'http://localhost:3000/cart?success=true',
      cancel_url: 'http://localhost:3000/cart?canceled=true',
      metadata: { userId: userId || '' },
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 