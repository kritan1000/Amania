// Test helpers for Amania Backend Tests
const bcrypt = require('bcrypt');
const { User } = require('../../model/userModel');
const { Admin } = require('../../model/adminModel');
const { Category } = require('../../model/categoryModel');
const { Product } = require('../../model/productModel');
const { generateToken } = require('../../security/jwt-utils');

// Create test user
const createTestUser = async (userData = {}) => {
  const defaultUser = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    password: 'test123',
    contact: 1234567890,
    ...userData
  };

  const hashedPassword = await bcrypt.hash(defaultUser.password, 10);
  
  const user = await User.create({
    ...defaultUser,
    password: hashedPassword
  });

  return user;
};

// Create test admin
const createTestAdmin = async (adminData = {}) => {
  const defaultAdmin = {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@amania.com',
    password: 'admin123',
    role: 'admin',
    ...adminData
  };

  const hashedPassword = await bcrypt.hash(defaultAdmin.password, 10);
  
  const admin = await Admin.create({
    ...defaultAdmin,
    password: hashedPassword
  });

  return admin;
};

// Create test category
const createTestCategory = async (categoryData = {}) => {
  const defaultCategory = {
    name: 'Test Category',
    description: 'Test category description',
    ...categoryData
  };

  const category = await Category.create(defaultCategory);
  return category;
};

// Create test product
const createTestProduct = async (productData = {}) => {
  const defaultProduct = {
    name: 'Test Product',
    description: 'Test product description',
    price: 99.99,
    stock: 10,
    image: 'test-image.jpg',
    ...productData
  };

  const product = await Product.create(defaultProduct);
  return product;
};

// Generate auth token for user
const generateUserToken = async (user) => {
  return generateToken({ 
    id: user.id, 
    email: user.email, 
    role: 'user' 
  });
};

// Generate auth token for admin
const generateAdminToken = async (admin) => {
  return generateToken({ 
    id: admin.id, 
    email: admin.email, 
    role: admin.role 
  });
};

// Clean up test data
const cleanupTestData = async () => {
  await Product.destroy({ where: {} });
  await Category.destroy({ where: {} });
  await User.destroy({ where: {} });
  await Admin.destroy({ where: {} });
};

// Test data constants
const TEST_USER_DATA = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  password: 'password123',
  contact: 9876543210
};

const TEST_ADMIN_DATA = {
  firstName: 'Admin',
  lastName: 'Manager',
  email: 'admin.manager@amania.com',
  password: 'admin123',
  role: 'admin'
};

const TEST_CATEGORY_DATA = {
  name: 'Shirts',
  description: 'Comfortable and stylish shirts'
};

const TEST_PRODUCT_DATA = {
  name: 'Cotton T-Shirt',
  description: 'Comfortable cotton t-shirt',
  price: 29.99,
  stock: 50,
  image: 'cotton-tshirt.jpg'
};

module.exports = {
  createTestUser,
  createTestAdmin,
  createTestCategory,
  createTestProduct,
  generateUserToken,
  generateAdminToken,
  cleanupTestData,
  TEST_USER_DATA,
  TEST_ADMIN_DATA,
  TEST_CATEGORY_DATA,
  TEST_PRODUCT_DATA
}; 