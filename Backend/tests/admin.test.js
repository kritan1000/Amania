// Admin Tests for Amania Backend
const request = require('supertest');
const app = require('../server');
const { Admin } = require('../model/adminModel');
const { Category } = require('../model/categoryModel');
const { Product } = require('../model/productModel');
const { 
  createTestAdmin, 
  createTestCategory, 
  createTestProduct,
  generateAdminToken,
  cleanupTestData 
} = require('./helpers/testHelpers');

describe('👨‍💼 Admin Tests', () => {
  let testAdmin;
  let adminToken;
  let testCategory;
  let testProduct;

  beforeEach(async () => {
    await cleanupTestData();
    testAdmin = await createTestAdmin();
    adminToken = await generateAdminToken(testAdmin);
    testCategory = await createTestCategory();
    testProduct = await createTestProduct({ categoryId: testCategory.id });
  });

  afterEach(async () => {
    await cleanupTestData();
  });

  describe('POST /api/admin/login', () => {
    it('should login admin with valid credentials', async () => {
      const loginData = {
        email: testAdmin.email,
        password: 'admin123' // Original password from createTestAdmin
      };

      const response = await request(app)
        .post('/api/admin/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('admin');
      expect(response.body.admin).toHaveProperty('id');
      expect(response.body.admin).toHaveProperty('email');
      expect(response.body.admin).toHaveProperty('role');
      expect(response.body.admin.email).toBe(testAdmin.email);
    });

    it('should fail login with invalid email', async () => {
      const loginData = {
        email: 'nonexistent@admin.com',
        password: 'admin123'
      };

      const response = await request(app)
        .post('/api/admin/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('not found');
    });

    it('should fail login with invalid password', async () => {
      const loginData = {
        email: testAdmin.email,
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/admin/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Invalid');
    });
  });

  describe('GET /api/admin/categories', () => {
    it('should get all categories with admin token', async () => {
      const response = await request(app)
        .get('/api/admin/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
    });

    it('should fail without admin token', async () => {
      const response = await request(app)
        .get('/api/admin/categories')
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/admin/categories', () => {
    it('should create new category with admin token', async () => {
      const newCategoryData = {
        name: 'New Category',
        description: 'A new test category'
      };

      const response = await request(app)
        .post('/api/admin/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newCategoryData)
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('category');
      expect(response.body.category).toHaveProperty('id');
      expect(response.body.category.name).toBe(newCategoryData.name);

      // Verify category was created in database
      const createdCategory = await Category.findOne({ 
        where: { name: newCategoryData.name } 
      });
      expect(createdCategory).toBeTruthy();
    });

    it('should fail creating category without admin token', async () => {
      const newCategoryData = {
        name: 'New Category',
        description: 'A new test category'
      };

      const response = await request(app)
        .post('/api/admin/categories')
        .send(newCategoryData)
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    it('should fail creating category with duplicate name', async () => {
      const duplicateCategoryData = {
        name: testCategory.name, // Use existing category name
        description: 'Duplicate category'
      };

      const response = await request(app)
        .post('/api/admin/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(duplicateCategoryData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('already exists');
    });
  });

  describe('PUT /api/admin/categories/:id', () => {
    it('should update category with admin token', async () => {
      const updateData = {
        name: 'Updated Category',
        description: 'Updated description'
      };

      const response = await request(app)
        .put(`/api/admin/categories/${testCategory.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('category');
      expect(response.body.category.name).toBe(updateData.name);

      // Verify category was updated in database
      const updatedCategory = await Category.findByPk(testCategory.id);
      expect(updatedCategory.name).toBe(updateData.name);
    });

    it('should fail updating non-existent category', async () => {
      const updateData = {
        name: 'Updated Category',
        description: 'Updated description'
      };

      const response = await request(app)
        .put('/api/admin/categories/99999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('DELETE /api/admin/categories/:id', () => {
    it('should delete category with admin token', async () => {
      const response = await request(app)
        .delete(`/api/admin/categories/${testCategory.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('deleted');

      // Verify category was deleted from database
      const deletedCategory = await Category.findByPk(testCategory.id);
      expect(deletedCategory).toBeNull();
    });

    it('should fail deleting non-existent category', async () => {
      const response = await request(app)
        .delete('/api/admin/categories/99999')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/admin/products', () => {
    it('should get all products with admin token', async () => {
      const response = await request(app)
        .get('/api/admin/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('price');
    });

    it('should fail without admin token', async () => {
      const response = await request(app)
        .get('/api/admin/products')
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/admin/products', () => {
    it('should create new product with admin token', async () => {
      const newProductData = {
        name: 'New Product',
        description: 'A new test product',
        price: 49.99,
        stock: 25,
        image: 'new-product.jpg',
        categoryId: testCategory.id
      };

      const response = await request(app)
        .post('/api/admin/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newProductData)
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('product');
      expect(response.body.product).toHaveProperty('id');
      expect(response.body.product.name).toBe(newProductData.name);

      // Verify product was created in database
      const createdProduct = await Product.findOne({ 
        where: { name: newProductData.name } 
      });
      expect(createdProduct).toBeTruthy();
    });

    it('should fail creating product without admin token', async () => {
      const newProductData = {
        name: 'New Product',
        description: 'A new test product',
        price: 49.99,
        stock: 25,
        image: 'new-product.jpg',
        categoryId: testCategory.id
      };

      const response = await request(app)
        .post('/api/admin/products')
        .send(newProductData)
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    it('should fail creating product with invalid category', async () => {
      const newProductData = {
        name: 'New Product',
        description: 'A new test product',
        price: 49.99,
        stock: 25,
        image: 'new-product.jpg',
        categoryId: 99999 // Invalid category ID
      };

      const response = await request(app)
        .post('/api/admin/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newProductData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('PUT /api/admin/products/:id', () => {
    it('should update product with admin token', async () => {
      const updateData = {
        name: 'Updated Product',
        description: 'Updated description',
        price: 59.99,
        stock: 30
      };

      const response = await request(app)
        .put(`/api/admin/products/${testProduct.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('product');
      expect(response.body.product.name).toBe(updateData.name);

      // Verify product was updated in database
      const updatedProduct = await Product.findByPk(testProduct.id);
      expect(updatedProduct.name).toBe(updateData.name);
    });

    it('should fail updating non-existent product', async () => {
      const updateData = {
        name: 'Updated Product',
        description: 'Updated description',
        price: 59.99,
        stock: 30
      };

      const response = await request(app)
        .put('/api/admin/products/99999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('DELETE /api/admin/products/:id', () => {
    it('should delete product with admin token', async () => {
      const response = await request(app)
        .delete(`/api/admin/products/${testProduct.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('deleted');

      // Verify product was deleted from database
      const deletedProduct = await Product.findByPk(testProduct.id);
      expect(deletedProduct).toBeNull();
    });

    it('should fail deleting non-existent product', async () => {
      const response = await request(app)
        .delete('/api/admin/products/99999')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });
  });
}); 