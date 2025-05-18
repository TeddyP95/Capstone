import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
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
  const [checkedOut, setCheckedOut] = useState(false);
  const userId = localStorage.getItem('userId');

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

  const handleCheckout = () => {
    if (!userId) return;
    // Get existing orders for this user
    const orders = JSON.parse(localStorage.getItem(`orders_${userId}`)) || [];
    const newOrder = {
      id: Date.now().toString(),
      date: new Date().toISOString().slice(0, 10),
      items: cart,
      total,
    };
    localStorage.setItem(`orders_${userId}`,
      JSON.stringify([newOrder, ...orders])
    );
    setCart([]);
    localStorage.setItem('cart', JSON.stringify([]));
    setCheckedOut(true);
  };

  return (
    <div className="container">
      <h2>Your Cart</h2>
      {checkedOut && <div style={{ color: 'green', marginBottom: 10 }}>Order placed successfully!</div>}
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
      {userId && cart.length > 0 && (
        <button style={{ float: 'right', marginTop: 20 }} onClick={handleCheckout}>Checkout</button>
      )}
      {!userId && cart.length > 0 && (
        <p style={{ color: 'red', textAlign: 'right', marginTop: 20 }}>Please log in to place your order.</p>
      )}
    </div>
  );
}

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Store user in localStorage
      const users = getAllUsers();
      if (users.find(u => u.username === username)) {
        setMessage('Username already exists');
        return;
      }
      const newUser = { id: Date.now().toString(), username, password, email, isAdmin: false };
      setAllUsers([newUser, ...users]);
      setMessage('User created');
    } catch (error) {
      setMessage('Error signing up');
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
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
  const userId = localStorage.getItem('userId');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (userId) {
      setOrders(JSON.parse(localStorage.getItem(`orders_${userId}`)) || []);
    }
  }, [userId]);

  return (
    <div className="container">
      <h2 tabIndex={0}>Order History</h2>
      {orders.length === 0 ? <p>No orders found.</p> : orders.map(order => (
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

function isAdmin() {
  return localStorage.getItem('isAdmin') === 'true';
}

function getStoredProducts() {
  return JSON.parse(localStorage.getItem('admin_products')) || [
    { id: 1, title: 'Golf Club Set', price: 299.99, image: 'https://via.placeholder.com/150?text=Golf+Club+Set', category: 'Clubs' },
    { id: 2, title: 'Golf Balls (12 Pack)', price: 24.99, image: 'https://via.placeholder.com/150?text=Golf+Balls', category: 'Balls' },
    { id: 3, title: 'Golf Bag', price: 89.99, image: 'https://via.placeholder.com/150?text=Golf+Bag', category: 'Bags' },
    { id: 4, title: 'Golf Gloves', price: 19.99, image: 'https://via.placeholder.com/150?text=Golf+Gloves', category: 'Accessories' },
    { id: 5, title: 'Golf Shoes', price: 79.99, image: 'https://via.placeholder.com/150?text=Golf+Shoes', category: 'Apparel' },
    { id: 6, title: 'Golf Hat', price: 14.99, image: 'https://via.placeholder.com/150?text=Golf+Hat', category: 'Apparel' },
  ];
}
function getStoredCategories() {
  return JSON.parse(localStorage.getItem('admin_categories')) || ['Clubs', 'Balls', 'Bags', 'Accessories', 'Apparel'];
}
function setStoredProducts(products) {
  localStorage.setItem('admin_products', JSON.stringify(products));
}
function setStoredCategories(categories) {
  localStorage.setItem('admin_categories', JSON.stringify(categories));
}

function AdminProductManagement() {
  const [products, setProducts] = useState(getStoredProducts());
  const [categories] = useState(getStoredCategories());
  const [form, setForm] = useState({ title: '', price: '', image: '', category: categories[0] });
  const [editId, setEditId] = useState(null);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = e => {
    e.preventDefault();
    if (!form.title || !form.price || !form.image || !form.category) return;
    const newProduct = { ...form, id: Date.now(), price: parseFloat(form.price) };
    const newProducts = [newProduct, ...products];
    setProducts(newProducts);
    setStoredProducts(newProducts);
    setForm({ title: '', price: '', image: '', category: categories[0] });
  };

  const handleEdit = id => {
    const prod = products.find(p => p.id === id);
    setForm(prod);
    setEditId(id);
  };

  const handleUpdate = e => {
    e.preventDefault();
    const updated = products.map(p => p.id === editId ? { ...form, id: editId, price: parseFloat(form.price) } : p);
    setProducts(updated);
    setStoredProducts(updated);
    setForm({ title: '', price: '', image: '', category: categories[0] });
    setEditId(null);
  };

  const handleDelete = id => {
    const filtered = products.filter(p => p.id !== id);
    setProducts(filtered);
    setStoredProducts(filtered);
  };

  return (
    <div className="container">
      <h2>Product Management</h2>
      <form onSubmit={editId ? handleUpdate : handleAdd} style={{ marginBottom: 20 }}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
        <input name="price" placeholder="Price" type="number" value={form.price} onChange={handleChange} />
        <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} />
        <select name="category" value={form.category} onChange={handleChange}>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <button type="submit">{editId ? 'Update' : 'Add'} Product</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({ title: '', price: '', image: '', category: categories[0] }); }}>Cancel</button>}
      </form>
      <div className="product-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.title} className="product-image" />
            <div className="product-info">
              <h3 className="product-title">{product.title}</h3>
              <p className="product-price">${product.price}</p>
              <p style={{ fontSize: '0.9em', color: '#888' }}>{product.category}</p>
              <button onClick={() => handleEdit(product.id)}>Edit</button>
              <button onClick={() => handleDelete(product.id)} style={{ marginLeft: 8, color: 'red' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminCategoryManagement() {
  const [categories, setCategories] = useState(getStoredCategories());
  const [input, setInput] = useState('');
  const [editIdx, setEditIdx] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleAdd = e => {
    e.preventDefault();
    if (!input || categories.includes(input)) return;
    const newCats = [...categories, input];
    setCategories(newCats);
    setStoredCategories(newCats);
    setInput('');
  };

  const handleEdit = idx => {
    setEditIdx(idx);
    setEditValue(categories[idx]);
  };

  const handleUpdate = e => {
    e.preventDefault();
    const updated = categories.map((cat, idx) => idx === editIdx ? editValue : cat);
    setCategories(updated);
    setStoredCategories(updated);
    setEditIdx(null);
    setEditValue('');
  };

  const handleDelete = idx => {
    const filtered = categories.filter((_, i) => i !== idx);
    setCategories(filtered);
    setStoredCategories(filtered);
  };

  return (
    <div className="container">
      <h2>Category Management</h2>
      <form onSubmit={editIdx !== null ? handleUpdate : handleAdd} style={{ marginBottom: 20 }}>
        {editIdx !== null ? (
          <>
            <input value={editValue} onChange={e => setEditValue(e.target.value)} />
            <button type="submit">Update</button>
            <button type="button" onClick={() => { setEditIdx(null); setEditValue(''); }}>Cancel</button>
          </>
        ) : (
          <>
            <input value={input} onChange={e => setInput(e.target.value)} placeholder="New Category" />
            <button type="submit">Add Category</button>
          </>
        )}
      </form>
      <ul>
        {categories.map((cat, idx) => (
          <li key={cat} style={{ marginBottom: 8 }}>
            {cat}
            <button style={{ marginLeft: 8 }} onClick={() => handleEdit(idx)}>Edit</button>
            <button style={{ marginLeft: 8, color: 'red' }} onClick={() => handleDelete(idx)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function getAllOrders() {
  // Find all keys that start with 'orders_'
  const orders = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('orders_')) {
      const userId = key.replace('orders_', '');
      const userOrders = JSON.parse(localStorage.getItem(key)) || [];
      userOrders.forEach(order => orders.push({ ...order, userId }));
    }
  }
  return orders;
}
function setOrderStatus(userId, orderId, status) {
  const orders = JSON.parse(localStorage.getItem(`orders_${userId}`)) || [];
  const updated = orders.map(order => order.id === orderId ? { ...order, status } : order);
  localStorage.setItem(`orders_${userId}`, JSON.stringify(updated));
}

function AdminOrderManagement() {
  const [orders, setOrders] = useState(getAllOrders());
  const [filter, setFilter] = useState('');

  useEffect(() => {
    setOrders(getAllOrders());
  }, []);

  const handleStatusChange = (userId, orderId, status) => {
    setOrderStatus(userId, orderId, status);
    setOrders(getAllOrders());
  };

  const filteredOrders = filter ? orders.filter(order => order.status === filter) : orders;
  const statusOptions = ['Created', 'Processing', 'Cancelled', 'Completed'];

  return (
    <div className="container">
      <h2>Order Management</h2>
      <label>
        Filter by Status:
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="">All</option>
          {statusOptions.map(status => <option key={status} value={status}>{status}</option>)}
        </select>
      </label>
      {filteredOrders.length === 0 ? <p>No orders found.</p> : filteredOrders.map(order => (
        <div key={order.id} style={{ background: 'white', margin: '1rem 0', padding: '1rem', borderRadius: 8 }}>
          <h3>Order #{order.id} <span style={{ fontWeight: 'normal', color: '#888', fontSize: '0.9em' }}>({order.date})</span></h3>
          <p><strong>User ID:</strong> {order.userId}</p>
          <ul>
            {order.items.map((item, idx) => (
              <li key={idx}>{item.title} x{item.quantity} - ${item.price}</li>
            ))}
          </ul>
          <strong>Total: ${order.total.toFixed(2)}</strong>
          <div style={{ marginTop: 10 }}>
            <label>Status: </label>
            <select value={order.status || 'Created'} onChange={e => handleStatusChange(order.userId, order.id, e.target.value)}>
              {statusOptions.map(status => <option key={status} value={status}>{status}</option>)}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}

function getAllUsers() {
  return JSON.parse(localStorage.getItem('users')) || [];
}
function setAllUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}
function AdminUserManagement() {
  const [users, setUsers] = useState(getAllUsers());

  const handlePromote = (id) => {
    const updated = users.map(u => u.id === id ? { ...u, isAdmin: true } : u);
    setUsers(updated);
    setAllUsers(updated);
  };
  const handleDemote = (id) => {
    const updated = users.map(u => u.id === id ? { ...u, isAdmin: false } : u);
    setUsers(updated);
    setAllUsers(updated);
  };
  const handleDelete = (id) => {
    const updated = users.filter(u => u.id !== id);
    setUsers(updated);
    setAllUsers(updated);
  };

  return (
    <div className="container">
      <h2>User Management</h2>
      {users.length === 0 ? <p>No users found.</p> : (
        <table style={{ width: '100%', background: 'white', borderRadius: 8, boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Admin</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.isAdmin ? 'Yes' : 'No'}</td>
                <td>
                  {!user.isAdmin && <button onClick={() => handlePromote(user.id)}>Promote</button>}
                  {user.isAdmin && <button onClick={() => handleDemote(user.id)}>Demote</button>}
                  <button style={{ color: 'red', marginLeft: 8 }} onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function AdminDashboard() {
  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      <div style={{ background: 'white', padding: 20, borderRadius: 8, marginBottom: 20 }}>
        <h3>Welcome, Admin!</h3>
        <ul>
          <li><Link to="/admin/products">Product Management</Link></li>
          <li><Link to="/admin/categories">Category Management</Link></li>
          <li><Link to="/admin/orders">Order Management</Link></li>
          <li><Link to="/admin/users">User Management</Link></li>
        </ul>
      </div>
    </div>
  );
}

function Profile({ setUsername }) {
  // Mock user profile data
  const [profile, setProfile] = useState({ username: 'golfuser', email: 'golfuser@example.com' });
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState(profile);
  const [success, setSuccess] = useState(false);
  const [admin, setAdmin] = useState(isAdmin());
  const location = useLocation();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSave = () => {
    setProfile(form);
    setEdit(false);
    setSuccess(true);
    setUsername(form.username);
    setTimeout(() => setSuccess(false), 2000);
  };

  const promoteToAdmin = () => {
    localStorage.setItem('isAdmin', 'true');
    setAdmin(true);
  };

  // Helper for active nav link
  const isActive = (path) => location.pathname === path;

  return (
    <div className="container">
      <h2 tabIndex={0}>Profile</h2>
      {success && <div style={{ color: 'green', marginBottom: 10 }}>Profile updated!</div>}
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
          {!admin && (
            <button style={{ marginLeft: 10 }} onClick={promoteToAdmin}>Promote to Admin</button>
          )}
          {admin && <span style={{ marginLeft: 10, color: '#007bff', fontWeight: 'bold' }}>Admin</span>}
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
  const [username, setUsername] = useState('golfuser');
  const location = useLocation();
  const [admin, setAdmin] = useState(isAdmin());

  // Listen for login/logout/admin changes
  useEffect(() => {
    const onStorage = () => {
      setLoggedIn(isLoggedIn());
      setAdmin(isAdmin());
    };
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

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('isAdmin');
    setLoggedIn(false);
    setAdmin(false);
  };

  // Helper for active nav link
  const isActive = (path) => location.pathname === path;

  return (
    <Router>
      <nav>
        <ul>
          <li><Link to="/" className={isActive('/') ? 'active-nav' : ''}>Home</Link></li>
          <li><Link to="/products" className={isActive('/products') ? 'active-nav' : ''}>Products</Link></li>
          <li><Link to="/cart" className={isActive('/cart') ? 'active-nav' : ''}>Cart</Link></li>
          {!loggedIn && <li><Link to="/signup" className={isActive('/signup') ? 'active-nav' : ''}>Signup</Link></li>}
          {!loggedIn && <li><Link to="/login" className={isActive('/login') ? 'active-nav' : ''}>Login</Link></li>}
          {loggedIn && <li><Link to="/orders" className={isActive('/orders') ? 'active-nav' : ''}>Order History</Link></li>}
          {loggedIn && <li><Link to="/profile" className={isActive('/profile') ? 'active-nav' : ''}>Profile</Link></li>}
          {admin && <li><Link to="/admin" className={isActive('/admin') ? 'active-nav' : ''}>Admin Dashboard</Link></li>}
          <li><Link to="/protected" className={isActive('/protected') ? 'active-nav' : ''}>Protected</Link></li>
          {loggedIn && (
            <li>
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', fontSize: '1em', padding: '15px' }}>Logout</button>
            </li>
          )}
        </ul>
        {loggedIn && (
          <div style={{ float: 'right', marginRight: 20, fontWeight: 'bold' }}>
            <span role="img" aria-label="user" style={{ marginRight: 8 }}>👤</span>
            Welcome, {username}!
          </div>
        )}
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/signup" element={!loggedIn ? <Signup /> : <Navigate to="/" />} />
        <Route path="/login" element={!loggedIn ? <Login /> : <Navigate to="/" />} />
        <Route path="/orders" element={loggedIn ? <OrderHistory /> : <Navigate to="/login" />} />
        <Route path="/profile" element={loggedIn ? <Profile setUsername={setUsername} /> : <Navigate to="/login" />} />
        <Route path="/admin" element={admin ? <AdminDashboard /> : <Navigate to="/" />} />
        <Route path="/protected" element={<Protected />} />
        <Route path="/admin/products" element={admin ? <AdminProductManagement /> : <Navigate to="/" />} />
        <Route path="/admin/categories" element={admin ? <AdminCategoryManagement /> : <Navigate to="/" />} />
        <Route path="/admin/orders" element={admin ? <AdminOrderManagement /> : <Navigate to="/" />} />
        <Route path="/admin/users" element={admin ? <AdminUserManagement /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
