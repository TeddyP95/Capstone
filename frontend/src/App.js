import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';

function Home() {
  return <h2>Home</h2>;
}

function Products() {
  const initialProducts = [
    { id: 1, title: 'Golf Club Set', price: 299.99, image: 'https://via.placeholder.com/150?text=Golf+Club+Set', category: 'Clubs' },
    { id: 2, title: 'Golf Balls (12 Pack)', price: 24.99, image: 'https://via.placeholder.com/150?text=Golf+Balls', category: 'Balls' },
    { id: 3, title: 'Golf Bag', price: 89.99, image: 'https://via.placeholder.com/150?text=Golf+Bag', category: 'Bags' },
    { id: 4, title: 'Golf Gloves', price: 19.99, image: 'https://via.placeholder.com/150?text=Golf+Gloves', category: 'Accessories' },
    { id: 5, title: 'Golf Shoes', price: 79.99, image: 'https://via.placeholder.com/150?text=Golf+Shoes', category: 'Apparel' },
    { id: 6, title: 'Golf Hat', price: 14.99, image: 'https://via.placeholder.com/150?text=Golf+Hat', category: 'Apparel' },
  ];
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState('');
  const [filter, setFilter] = useState('');
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Simulate fetching products with a delay
  useEffect(() => {
    setLoading(true);
    setError('');
    const timer = setTimeout(() => {
      // Simulate error 10% of the time
      if (Math.random() < 0.1) {
        setError('Failed to load products. Please try again.');
        setLoading(false);
      } else {
        setProducts(initialProducts);
        setLoading(false);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Sorting
  const sortedProducts = [...products].sort((a, b) => {
    if (sort === 'name') return a.title.localeCompare(b.title);
    if (sort === 'price') return a.price - b.price;
    return 0;
  });

  // Filtering
  const filteredProducts = filter ? sortedProducts.filter(p => p.category === filter) : sortedProducts;

  // Add to cart
  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    let newCart;
    if (existing) {
      newCart = cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  // Category options
  const categories = Array.from(new Set(initialProducts.map(p => p.category)));

  return (
    <div className="container" aria-live="polite">
      <h2 tabIndex={0}>Products</h2>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <label>
          Sort by:
          <select value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort products">
            <option value="">None</option>
            <option value="name">Name</option>
            <option value="price">Price</option>
          </select>
        </label>
        <label>
          Filter by Category:
          <select value={filter} onChange={e => setFilter(e.target.value)} aria-label="Filter products by category">
            <option value="">All</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </label>
      </div>
      {loading && <div role="status" aria-busy="true" style={{textAlign:'center',margin:'2rem'}}><span>Loading products...</span></div>}
      {error && <div role="alert" style={{color:'red',textAlign:'center',margin:'2rem'}}>{error}</div>}
      {!loading && !error && (
        <div className="product-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card" tabIndex={0} aria-label={`Product: ${product.title}, Price: $${product.price}, Category: ${product.category}`}>
              <img src={product.image} alt={product.title} className="product-image" />
              <div className="product-info">
                <h3 className="product-title">{product.title}</h3>
                <p className="product-price">${product.price}</p>
                <p style={{ fontSize: '0.9em', color: '#888' }}>{product.category}</p>
                <button onClick={() => addToCart(product)} aria-label={`Add ${product.title} to cart`}>Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Users() {
  return <h2>Users</h2>;
}

function Cart() {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);

  const updateQuantity = (id, delta) => {
    const newCart = cart.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    );
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const removeItem = (id) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container">
      <h2>Your Cart</h2>
      {cart.length === 0 ? <p>Your cart is empty.</p> : (
        <table style={{ width: '100%', background: 'white', borderRadius: 8, boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cart.map(item => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>${item.price}</td>
                <td>
                  <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                  {item.quantity}
                  <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                </td>
                <td>${(item.price * item.quantity).toFixed(2)}</td>
                <td><button onClick={() => removeItem(item.id)}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <h3 style={{ textAlign: 'right', marginTop: 20 }}>Total: ${total.toFixed(2)}</h3>
    </div>
  );
}

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage('Error signing up');
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Signup</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      setMessage(data.message);
      if (data.userId) {
        localStorage.setItem('userId', data.userId);
      }
    } catch (error) {
      setMessage('Error logging in');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

function Protected() {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    return <Navigate to="/login" />;
  }
  return <h2>Protected Page</h2>;
}

function OrderHistory() {
  // Mock order history data
  const orders = [
    {
      id: '1001',
      date: '2024-06-01',
      items: [
        { title: 'Golf Club Set', quantity: 1, price: 299.99 },
        { title: 'Golf Balls (12 Pack)', quantity: 2, price: 24.99 },
      ],
      total: 349.97,
    },
    {
      id: '1002',
      date: '2024-05-15',
      items: [
        { title: 'Golf Bag', quantity: 1, price: 89.99 },
      ],
      total: 89.99,
    },
  ];
  return (
    <div className="container">
      <h2 tabIndex={0}>Order History</h2>
      {orders.map(order => (
        <div key={order.id} style={{ background: 'white', margin: '1rem 0', padding: '1rem', borderRadius: 8 }}>
          <h3>Order #{order.id} <span style={{ fontWeight: 'normal', color: '#888', fontSize: '0.9em' }}>({order.date})</span></h3>
          <ul>
            {order.items.map((item, idx) => (
              <li key={idx}>{item.title} x{item.quantity} - ${item.price}</li>
            ))}
          </ul>
          <strong>Total: ${order.total.toFixed(2)}</strong>
        </div>
      ))}
    </div>
  );
}

function Profile() {
  // Mock user profile data
  const [profile, setProfile] = useState({ username: 'golfuser', email: 'golfuser@example.com' });
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState(profile);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSave = () => {
    setProfile(form);
    setEdit(false);
  };

  return (
    <div className="container">
      <h2 tabIndex={0}>Profile</h2>
      {edit ? (
        <div>
          <label>Username: <input name="username" value={form.username} onChange={handleChange} /></label><br />
          <label>Email: <input name="email" value={form.email} onChange={handleChange} /></label><br />
          <button onClick={handleSave}>Save</button>
        </div>
      ) : (
        <div>
          <p><strong>Username:</strong> {profile.username}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <button onClick={() => setEdit(true)}>Edit</button>
        </div>
      )}
    </div>
  );
}

// Helper to check if user is logged in
function isLoggedIn() {
  return !!localStorage.getItem('userId');
}

function App() {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());

  // Listen for login/logout changes
  useEffect(() => {
    const onStorage = () => setLoggedIn(isLoggedIn());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Merge guest cart with user cart on login
  useEffect(() => {
    if (loggedIn) {
      // In a real app, merge guest cart with user cart on the server
      // For now, just keep the localStorage cart
    }
  }, [loggedIn]);

  return (
    <Router>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/products">Products</Link></li>
          <li><Link to="/cart">Cart</Link></li>
          {!loggedIn && <li><Link to="/signup">Signup</Link></li>}
          {!loggedIn && <li><Link to="/login">Login</Link></li>}
          {loggedIn && <li><Link to="/orders">Order History</Link></li>}
          {loggedIn && <li><Link to="/profile">Profile</Link></li>}
          <li><Link to="/protected">Protected</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/signup" element={!loggedIn ? <Signup /> : <Navigate to="/" />} />
        <Route path="/login" element={!loggedIn ? <Login /> : <Navigate to="/" />} />
        <Route path="/orders" element={loggedIn ? <OrderHistory /> : <Navigate to="/login" />} />
        <Route path="/profile" element={loggedIn ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/protected" element={<Protected />} />
      </Routes>
    </Router>
  );
}

export default App;
