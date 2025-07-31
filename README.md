# Amania Clothing Store

A complete e-commerce platform with admin panel for clothing store management.

## Features

### User Features
- Product browsing and search
- User authentication and registration
- Shopping cart functionality
- Responsive design

### Admin Features
- Secure admin login system
- Dashboard with statistics
- Product management (CRUD operations)
- Category management
- Modern responsive admin interface

## Tech Stack

### Frontend
- React 19
- Vite
- CSS3 with modern design patterns
- Lucide React icons

### Backend
- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT authentication
- bcrypt for password hashing

## Setup Instructions

### Backend Setup
1. Navigate to Backend directory
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run database setup: `node setupAdmin.js`
5. Start server: `npm start`

### Admin Panel Setup
1. Navigate to Admin directory
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`

### Default Admin Credentials
- Email: `kritannepal11@gmail.com`
- Password: `kritan12345`

## Project Structure

```
amania/
├── Admin/          # Admin panel frontend
├── Backend/        # API server
└── src/           # Main user frontend
```

## API Endpoints

### Admin Endpoints
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/categories` - Get all categories
- `POST /api/admin/categories` - Add new category
- `GET /api/admin/products` - Get all products
- `POST /api/admin/products` - Add new product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
