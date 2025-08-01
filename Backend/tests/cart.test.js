// Cart Tests for Amania Backend
const request = require('supertest');
const app = require('../server');
const { User } = require('../model/userModel');
const { Product } = require('../model/productModel');
const { Category } = require('../model/categoryModel');
const { 
  createTestUser, 
  createTestProduct,
  createTestCategory,
  generateUserToken,
  cleanupTestData 
} = require('./helpers/testHelpers');

describe('🛒 Cart Tests', () => {
  let testUser;
  let userToken;
  let testCategory;
  let testProduct;

  beforeEach(async () => {
    await cleanupTestData();
    testUser = await createTestUser();
    userToken = await generateUserToken(testUser);
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

  describe('GET /api/cart', () => {
    it('should get cart route working', async () => {
      const response = await request(app)
        .get('/api/cart')
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Cart route working!');
    });
  });

  describe('POST /api/cart/add', () => {
    it('should add item to cart with valid user token', async () => {
      const cartItem = {
        productId: testProduct.id,
        quantity: 2
      };

      const response = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send(cartItem)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('added');
    });

    it('should fail adding item without user token', async () => {
      const cartItem = {
        productId: testProduct.id,
        quantity: 2
      };

      const response = await request(app)
        .post('/api/cart/add')
        .send(cartItem)
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    it('should fail adding non-existent product', async () => {
      const cartItem = {
        productId: 99999,
        quantity: 2
      };

      const response = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send(cartItem)
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });

    it('should fail adding item with invalid quantity', async () => {
      const cartItem = {
        productId: testProduct.id,
        quantity: 0
      };

      const response = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send(cartItem)
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should fail adding item with quantity exceeding stock', async () => {
      const cartItem = {
        productId: testProduct.id,
        quantity: 100 // More than available stock (50)
      };

      const response = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send(cartItem)
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/cart/items', () => {
    it('should get user cart items with valid token', async () => {
      // First add an item to cart
      const cartItem = {
        productId: testProduct.id,
        quantity: 2
      };

      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send(cartItem);

      const response = await request(app)
        .get('/api/cart/items')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('productId');
      expect(response.body[0]).toHaveProperty('quantity');
      expect(response.body[0]).toHaveProperty('product');
    });

    it('should return empty cart for new user', async () => {
      const response = await request(app)
        .get('/api/cart/items')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });

    it('should fail getting cart without user token', async () => {
      const response = await request(app)
        .get('/api/cart/items')
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('PUT /api/cart/update', () => {
    it('should update cart item quantity', async () => {
      // First add an item to cart
      const cartItem = {
        productId: testProduct.id,
        quantity: 2
      };

      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send(cartItem);

      const updateData = {
        productId: testProduct.id,
        quantity: 3
      };

      const response = await request(app)
        .put('/api/cart/update')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('updated');
    });

    it('should fail updating non-existent cart item', async () => {
      const updateData = {
        productId: 99999,
        quantity: 3
      };

      const response = await request(app)
        .put('/api/cart/update')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });

    it('should fail updating without user token', async () => {
      const updateData = {
        productId: testProduct.id,
        quantity: 3
      };

      const response = await request(app)
        .put('/api/cart/update')
        .send(updateData)
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('DELETE /api/cart/remove', () => {
    it('should remove item from cart', async () => {
      // First add an item to cart
      const cartItem = {
        productId: testProduct.id,
        quantity: 2
      };

      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send(cartItem);

      const removeData = {
        productId: testProduct.id
      };

      const response = await request(app)
        .delete('/api/cart/remove')
        .set('Authorization', `Bearer ${userToken}`)
        .send(removeData)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('removed');
    });

    it('should fail removing non-existent cart item', async () => {
      const removeData = {
        productId: 99999
      };

      const response = await request(app)
        .delete('/api/cart/remove')
        .set('Authorization', `Bearer ${userToken}`)
        .send(removeData)
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });

    it('should fail removing without user token', async () => {
      const removeData = {
        productId: testProduct.id
      };

      const response = await request(app)
        .delete('/api/cart/remove')
        .send(removeData)
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('DELETE /api/cart/clear', () => {
    it('should clear user cart', async () => {
      // First add items to cart
      const cartItem = {
        productId: testProduct.id,
        quantity: 2
      };

      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send(cartItem);

      const response = await request(app)
        .delete('/api/cart/clear')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('cleared');

      // Verify cart is empty
      const cartResponse = await request(app)
        .get('/api/cart/items')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(cartResponse.body.length).toBe(0);
    });

    it('should fail clearing cart without user token', async () => {
      const response = await request(app)
        .delete('/api/cart/clear')
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/cart/total', () => {
    it('should get cart total with items', async () => {
      // First add items to cart
      const cartItem = {
        productId: testProduct.id,
        quantity: 2
      };

      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send(cartItem);

      const response = await request(app)
        .get('/api/cart/total')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('itemCount');
      expect(typeof response.body.total).toBe('number');
      expect(typeof response.body.itemCount).toBe('number');
      expect(response.body.total).toBeGreaterThan(0);
      expect(response.body.itemCount).toBeGreaterThan(0);
    });

    it('should get zero total for empty cart', async () => {
      const response = await request(app)
        .get('/api/cart/total')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.total).toBe(0);
      expect(response.body.itemCount).toBe(0);
    });

    it('should fail getting total without user token', async () => {
      const response = await request(app)
        .get('/api/cart/total')
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/cart/checkout', () => {
    it('should process checkout with valid cart', async () => {
      // First add items to cart
      const cartItem = {
        productId: testProduct.id,
        quantity: 2
      };

      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send(cartItem);

      const checkoutData = {
        shippingAddress: {
          street: '123 Test St',
          city: 'Test City',
          state: 'Test State',
          zipCode: '12345'
        },
        paymentMethod: 'credit_card'
      };

      const response = await request(app)
        .post('/api/cart/checkout')
        .set('Authorization', `Bearer ${userToken}`)
        .send(checkoutData)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('orderId');
      expect(response.body.message).toContain('successful');
    });

    it('should fail checkout with empty cart', async () => {
      const checkoutData = {
        shippingAddress: {
          street: '123 Test St',
          city: 'Test City',
          state: 'Test State',
          zipCode: '12345'
        },
        paymentMethod: 'credit_card'
      };

      const response = await request(app)
        .post('/api/cart/checkout')
        .set('Authorization', `Bearer ${userToken}`)
        .send(checkoutData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('empty');
    });

    it('should fail checkout without user token', async () => {
      const checkoutData = {
        shippingAddress: {
          street: '123 Test St',
          city: 'Test City',
          state: 'Test State',
          zipCode: '12345'
        },
        paymentMethod: 'credit_card'
      };

      const response = await request(app)
        .post('/api/cart/checkout')
        .send(checkoutData)
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });
}); 