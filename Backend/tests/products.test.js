// Product Tests for Amania Backend
const request = require('supertest');
const app = require('../server');
const { Category } = require('../model/categoryModel');
const { Product } = require('../model/productModel');
const { 
  createTestCategory, 
  createTestProduct,
  cleanupTestData 
} = require('./helpers/testHelpers');

describe('🛍️ Product Tests', () => {
  let testCategory;
  let testProduct;

  beforeEach(async () => {
    await cleanupTestData();
    testCategory = await createTestCategory({ name: 'Shirts' });
    testProduct = await createTestProduct({ 
      name: 'Cotton T-Shirt',
      price: 29.99,
      stock: 50,
      categoryId: testCategory.id 
    });
  });

  afterEach(async () => {
    await cleanupTestData();
  });

  describe('GET /api/products', () => {
    it('should get all products', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('price');
      expect(response.body[0]).toHaveProperty('categoryId');
    });

    it('should return empty array when no products exist', async () => {
      await Product.destroy({ where: {} });

      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });
  });

  describe('GET /api/products/:id', () => {
    it('should get product by ID', async () => {
      const response = await request(app)
        .get(`/api/products/${testProduct.id}`)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('price');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('stock');
      expect(response.body).toHaveProperty('image');
      expect(response.body).toHaveProperty('categoryId');
      expect(response.body.id).toBe(testProduct.id);
      expect(response.body.name).toBe(testProduct.name);
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .get('/api/products/99999')
        .expect(404);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('not found');
    });

    it('should return 400 for invalid product ID', async () => {
      const response = await request(app)
        .get('/api/products/invalid-id')
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/products/category/:categoryId', () => {
    it('should get products by category', async () => {
      // Create additional products in the same category
      await createTestProduct({ 
        name: 'Polo Shirt',
        price: 39.99,
        categoryId: testCategory.id 
      });

      const response = await request(app)
        .get(`/api/products/category/${testCategory.id}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      response.body.forEach(product => {
        expect(product.categoryId).toBe(testCategory.id);
      });
    });

    it('should return empty array for non-existent category', async () => {
      const response = await request(app)
        .get('/api/products/category/99999')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });
  });

  describe('GET /api/products/search', () => {
    it('should search products by name', async () => {
      const response = await request(app)
        .get('/api/products/search?q=cotton')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      response.body.forEach(product => {
        expect(product.name.toLowerCase()).toContain('cotton');
      });
    });

    it('should search products by description', async () => {
      const response = await request(app)
        .get('/api/products/search?q=comfortable')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach(product => {
        expect(product.description.toLowerCase()).toContain('comfortable');
      });
    });

    it('should return empty array for no matches', async () => {
      const response = await request(app)
        .get('/api/products/search?q=nonexistent')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });

    it('should handle empty search query', async () => {
      const response = await request(app)
        .get('/api/products/search?q=')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/products/featured', () => {
    it('should get featured products', async () => {
      // Create a featured product
      await createTestProduct({ 
        name: 'Featured Shirt',
        price: 49.99,
        featured: true,
        categoryId: testCategory.id 
      });

      const response = await request(app)
        .get('/api/products/featured')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      response.body.forEach(product => {
        expect(product.featured).toBe(true);
      });
    });

    it('should return empty array when no featured products', async () => {
      const response = await request(app)
        .get('/api/products/featured')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });
  });

  describe('GET /api/products/new', () => {
    it('should get newest products', async () => {
      const response = await request(app)
        .get('/api/products/new')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      // Check if products are sorted by creation date (newest first)
      const dates = response.body.map(product => new Date(product.createdAt));
      for (let i = 0; i < dates.length - 1; i++) {
        expect(dates[i] >= dates[i + 1]).toBe(true);
      }
    });
  });

  describe('GET /api/products/popular', () => {
    it('should get popular products', async () => {
      const response = await request(app)
        .get('/api/products/popular')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/products/price-range', () => {
    it('should get products within price range', async () => {
      const response = await request(app)
        .get('/api/products/price-range?min=20&max=40')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach(product => {
        expect(product.price).toBeGreaterThanOrEqual(20);
        expect(product.price).toBeLessThanOrEqual(40);
      });
    });

    it('should handle invalid price range', async () => {
      const response = await request(app)
        .get('/api/products/price-range?min=invalid&max=40')
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/products/in-stock', () => {
    it('should get only in-stock products', async () => {
      // Create an out-of-stock product
      await createTestProduct({ 
        name: 'Out of Stock Shirt',
        price: 19.99,
        stock: 0,
        categoryId: testCategory.id 
      });

      const response = await request(app)
        .get('/api/products/in-stock')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach(product => {
        expect(product.stock).toBeGreaterThan(0);
      });
    });
  });
}); 