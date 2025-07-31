# Amania Clothing Store - Admin Panel

This is the admin panel for the Amania Clothing Store website, built with React and Vite.

## Features

- **Secure Admin Login**: JWT-based authentication
- **Dashboard**: Overview of products and categories
- **Categories Management**: Add and view product categories
- **Products Management**: Add, edit, and delete products with category assignment
- **Responsive Design**: Works on desktop and mobile devices

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Development Server

```bash
npm run dev
```

The admin panel will be available at `http://localhost:5173`

### 3. Backend Setup

Make sure the backend server is running on `http://localhost:5000` and the admin user is set up.

To set up the default admin user, run:

```bash
cd ../Backend
node setupAdmin.js
```

### 4. Default Admin Credentials

- **Email**: admin@amania.com
- **Password**: admin123
- **Username**: admin

## Usage

### Login
1. Navigate to the admin panel
2. Enter the admin credentials
3. You'll be redirected to the dashboard upon successful login

### Dashboard
- View total number of products and categories
- Quick access to add new categories and products

### Categories Management
- Add new product categories
- View all existing categories
- Categories are required for adding products

### Products Management
- Add new products with name, price, description, image URL, and category
- Edit existing products
- Delete products (with confirmation)
- View all products in a grid layout

## File Structure

```
src/
├── components/
│   ├── AdminLogin.jsx          # Login page
│   ├── AdminDashboard.jsx      # Dashboard overview
│   ├── CategoriesManagement.jsx # Categories CRUD
│   ├── ProductsManagement.jsx  # Products CRUD
│   ├── AdminLayout.jsx         # Shared layout with navigation
│   └── *.css                   # Component styles
├── App.jsx                     # Main app with routing
└── main.jsx                    # App entry point
```

## API Endpoints

The admin panel communicates with the backend API:

- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/categories` - Get all categories
- `POST /api/admin/categories` - Add new category
- `GET /api/admin/products` - Get all products
- `POST /api/admin/products` - Add new product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product

## Security

- JWT token-based authentication
- Protected routes requiring valid admin token
- Automatic logout on token expiration
- Secure password hashing on the backend

## Technologies Used

- **Frontend**: React 19, Vite, React Router DOM
- **Styling**: CSS3 with modern design patterns
- **HTTP Client**: Axios
- **Authentication**: JWT tokens
- **Backend**: Node.js, Express, Sequelize, PostgreSQL
