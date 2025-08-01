// Category Tests for Amania Backend
const request = require('supertest');
const app = require('../server');
const { Category } = require('../model/categoryModel');
const { Product } = require('../model/productModel');
const { 
  createTestCategory, 
  createTestProduct,
  cleanupTestData 
} = require('./helpers/testHelpers');

describe('📂 Category Tests', () => {
  let testCategory;
  let testProduct;

  beforeEach(async () => {
    await cleanupTestData();
    testCategory = await createTestCategory({ name: 'Shirts' });
    testProduct = await createTestProduct({ 
      name: 'Cotton T-Shirt',
      categoryId: testCategory.id 
    });
  });

  afterEach(async () => {
    await cleanupTestData();
  });

  describe('GET /api/categories', () => {
    it('should get all categories', async () => {
      const response = await request(app)
        .get('/api/categories')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('description');
    });

    it('should return empty array when no categories exist', async () => {
      await Category.destroy({ where: {} });

      const response = await request(app)
        .get('/api/categories')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });
  });

  describe('GET /api/categories/:id', () => {
    it('should get category by ID', async () => {
      const response = await request(app)
        .get(`/api/categories/${testCategory.id}`)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('description');
      expect(response.body.id).toBe(testCategory.id);
      expect(response.body.name).toBe(testCategory.name);
    });

    it('should return 404 for non-existent category', async () => {
      const response = await request(app)
        .get('/api/categories/99999')
        .expect(404);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('not found');
    });

    it('should return 400 for invalid category ID', async () => {
      const response = await request(app)
        .get('/api/categories/invalid-id')
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/categories/:id/products', () => {
    it('should get products by category ID', async () => {
      // Create additional products in the same category
      await createTestProduct({ 
        name: 'Polo Shirt',
        categoryId: testCategory.id 
      });

      const response = await request(app)
        .get(`/api/categories/${testCategory.id}/products`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      response.body.forEach(product => {
        expect(product.categoryId).toBe(testCategory.id);
      });
    });

    it('should return empty array for category with no products', async () => {
      // Create a new category with no products
      const emptyCategory = await createTestCategory({ name: 'Empty Category' });

      const response = await request(app)
        .get(`/api/categories/${emptyCategory.id}/products`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });

    it('should return 404 for non-existent category', async () => {
      const response = await request(app)
        .get('/api/categories/99999/products')
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/categories/popular', () => {
    it('should get popular categories', async () => {
      const response = await request(app)
        .get('/api/categories/popular')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('productCount');
    });

    it('should return empty array when no categories exist', async () => {
      await Category.destroy({ where: {} });

      const response = await request(app)
        .get('/api/categories/popular')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });
  });

  describe('GET /api/categories/search', () => {
    it('should search categories by name', async () => {
      const response = await request(app)
        .get('/api/categories/search?q=shirt')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      response.body.forEach(category => {
        expect(category.name.toLowerCase()).toContain('shirt');
      });
    });

    it('should search categories by description', async () => {
      const response = await request(app)
        .get('/api/categories/search?q=comfortable')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach(category => {
        expect(category.description.toLowerCase()).toContain('comfortable');
      });
    });

    it('should return empty array for no matches', async () => {
      const response = await request(app)
        .get('/api/categories/search?q=nonexistent')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });

    it('should handle empty search query', async () => {
      const response = await request(app)
        .get('/api/categories/search?q=')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/categories/with-products', () => {
    it('should get categories with their products', async () => {
      const response = await request(app)
        .get('/api/categories/with-products')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      response.body.forEach(category => {
        expect(category).toHaveProperty('id');
        expect(category).toHaveProperty('name');
        expect(category).toHaveProperty('products');
        expect(Array.isArray(category.products)).toBe(true);
      });
    });

    it('should include products for each category', async () => {
      // Create another category with products
      const pantsCategory = await createTestCategory({ name: 'Pants' });
      await createTestProduct({ 
        name: 'Jeans',
        categoryId: pantsCategory.id 
      });

      const response = await request(app)
        .get('/api/categories/with-products')
        .expect(200);

      expect(response.body.length).toBe(2);
      
      const shirtsCategory = response.body.find(cat => cat.name === 'Shirts');
      const pantsCategoryResponse = response.body.find(cat => cat.name === 'Pants');
      
      expect(shirtsCategory.products.length).toBeGreaterThan(0);
      expect(pantsCategoryResponse.products.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/categories/featured', () => {
    it('should get featured categories', async () => {
      // Create a featured category
      await createTestCategory({ 
        name: 'Featured Category',
        featured: true 
      });

      const response = await request(app)
        .get('/api/categories/featured')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      response.body.forEach(category => {
        expect(category.featured).toBe(true);
      });
    });

    it('should return empty array when no featured categories', async () => {
      const response = await request(app)
        .get('/api/categories/featured')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });
  });

  describe('GET /api/categories/stats', () => {
    it('should get category statistics', async () => {
      const response = await request(app)
        .get('/api/categories/stats')
        .expect(200);

      expect(response.body).toHaveProperty('totalCategories');
      expect(response.body).toHaveProperty('totalProducts');
      expect(response.body).toHaveProperty('averageProductsPerCategory');
      expect(typeof response.body.totalCategories).toBe('number');
      expect(typeof response.body.totalProducts).toBe('number');
      expect(typeof response.body.averageProductsPerCategory).toBe('number');
    });

    it('should return zero stats when no data exists', async () => {
      await cleanupTestData();

      const response = await request(app)
        .get('/api/categories/stats')
        .expect(200);

      expect(response.body.totalCategories).toBe(0);
      expect(response.body.totalProducts).toBe(0);
      expect(response.body.averageProductsPerCategory).toBe(0);
    });
  });
}); 