# Capstone Golf Store Application: System Overview

## 1. Introduction

The Capstone Golf Store is a full-stack e-commerce web application designed to simulate a modern online golf shop. It allows users to browse and filter golf products, manage a shopping cart, sign up and log in, place orders, and—if they are administrators—manage products, categories, orders, and users. The application is built with a React frontend, a Node.js/Express backend, and a PostgreSQL database for persistent storage. Stripe integration is included for payment processing.

---

## 2. System Architecture

### 2.1. Frontend (React)
- **Framework:** React (with React Router for navigation)
- **Styling:** CSS modules and custom styles
- **State Management:** React hooks and local state
- **Key Features:**
  - Responsive, accessible UI
  - Product listing with sorting and filtering
  - Shopping cart with persistent state
  - User authentication (signup, login, logout)
  - Order history and profile management
  - Admin dashboard for management features

### 2.2. Backend (Node.js/Express)
- **Framework:** Express.js
- **Database:** PostgreSQL (via the `pg` library)
- **API:** RESTful endpoints for all resources (products, categories, users, orders, etc.)
- **Authentication:** Session-based or token-based (expandable)
- **Stripe Integration:** For secure payment processing

### 2.3. Database (PostgreSQL)
- **Tables:** Users, Products, Categories, Orders, Order Items
- **Relationships:** 
  - Products belong to categories
  - Orders belong to users
  - Order items belong to orders and products

---

## 3. User Experience and Features

### 3.1. Public (Not Logged In) Users
- **Browse Products:** Users can view all products, filter by category, and sort by name or price.
- **Aesthetic & Accessibility:** The site features a visually appealing golf-themed background, large product cards, and accessible navigation.
- **Persistent Cart:** Items added to the cart persist across sessions using localStorage (or can be migrated to backend storage).
- **Guest-to-Logged-In Cart:** When a guest logs in, their cart can be merged with their user cart.

### 3.2. Authentication
- **Signup:** Users can create an account with a username, email, and password.
- **Login/Logout:** Secure login and logout functionality. The navigation bar updates based on authentication state.
- **Protected Routes:** Certain pages (e.g., order history, profile, protected page) are only accessible to logged-in users.

### 3.3. Logged-In Users
- **Order Placement:** Users can checkout their cart, which creates an order in the database.
- **Order History:** Users can view their past orders, including items, quantities, and order status.
- **Profile Management:** Users can view and edit their profile information.

### 3.4. Admin Features
- **Admin Dashboard:** Accessible only to admin users (promotable via the profile page for demo purposes).
- **Product Management:** Admins can add, edit, and delete products, including uploading images and assigning categories.
- **Category Management:** Admins can manage product categories.
- **Order Management:** Admins can view all orders, filter by status, and update order statuses (e.g., Processing, Completed).
- **User Management:** Admins can view all users, promote/demote admin status, and delete users.

### 3.5. Payments
- **Stripe Integration:** Users can pay for their cart using Stripe Checkout, which securely handles payment processing and redirects users back to the app upon completion.

---

## 4. Technical Implementation Details

### 4.1. Frontend
- **Routing:** Uses React Router for client-side navigation. Protected routes redirect unauthenticated users to the login page.
- **State:** Uses React hooks (`useState`, `useEffect`) for local state and side effects.
- **Styling:** Custom CSS for a modern, clean look. The home page features a full-screen golf course background with a large welcome message.
- **Accessibility:** ARIA attributes, keyboard navigation, and color contrast are considered for usability.

### 4.2. Backend
- **API Endpoints:** RESTful endpoints for all CRUD operations on users, products, categories, orders, and order items.
- **Database Access:** Uses the `pg` library to connect to PostgreSQL. All data is persisted in the database.
- **Authentication:** User sessions or JWT tokens (expandable for production).
- **Stripe:** The backend exposes an endpoint to create Stripe Checkout sessions, using a secret key.

### 4.3. Database
- **Schema:** 
  - `users` (id, username, email, password, is_admin)
  - `categories` (id, name)
  - `products` (id, title, price, image, category_id)
  - `orders` (id, user_id, created_at, status)
  - `order_items` (id, order_id, product_id, quantity, price)
- **Initialization:** A script (`init_db.js`) is provided to create all tables automatically.

---

## 5. How the Application Works (User Flow)

### 5.1. Browsing and Shopping
- Users land on a visually rich home page.
- They can browse products, filter and sort, and add items to their cart.
- The cart is always accessible and persists between sessions.

### 5.2. Authentication and Orders
- Users can sign up and log in.
- Once logged in, they can place orders, view their order history, and manage their profile.
- Orders are stored in the database and can be paid for using Stripe.

### 5.3. Admin Management
- Admins access the dashboard via the nav bar (after promotion).
- They can manage products, categories, orders, and users through dedicated admin pages.
- All changes are reflected in the database and visible to users in real time.

---

## 6. Extensibility and Best Practices

- **Security:** Passwords should be hashed (e.g., with bcrypt) before storing in production.
- **Validation:** All user input should be validated on both frontend and backend.
- **Deployment:** The app can be deployed on platforms like Heroku, Vercel, or AWS, with environment variables for sensitive credentials.
- **Testing:** Unit and integration tests can be added for robustness.
- **Accessibility:** The app is designed with accessibility in mind, but further improvements can always be made.

---

## 7. Conclusion

The Capstone Golf Store is a robust, full-stack e-commerce application that demonstrates modern web development practices. It is designed to be both a learning tool and a foundation for a real-world online store, with a clean UI, secure authentication, admin management, and payment integration. The architecture is modular and extensible, making it easy to add new features or adapt to other domains. 