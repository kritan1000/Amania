// User Management Tests for Amania Backend
const request = require('supertest');
const app = require('../server');
const { User } = require('../model/userModel');
const { 
  createTestUser, 
  generateUserToken,
  cleanupTestData 
} = require('./helpers/testHelpers');

describe('👥 User Management Tests', () => {
  let testUser;
  let userToken;

  beforeEach(async () => {
    await cleanupTestData();
    testUser = await createTestUser();
    userToken = await generateUserToken(testUser);
  });

  afterEach(async () => {
    await cleanupTestData();
  });

  describe('GET /api/users/profile', () => {
    it('should get user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('firstName');
      expect(response.body).toHaveProperty('lastName');
      expect(response.body).toHaveProperty('email');
      expect(response.body).toHaveProperty('contact');
      expect(response.body.id).toBe(testUser.id);
      expect(response.body.email).toBe(testUser.email);
    });

    it('should fail getting profile without token', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    it('should fail getting profile with invalid token', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(403);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('PUT /api/users/profile', () => {
    it('should update user profile with valid data', async () => {
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
        contact: 9876543210
      };

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.firstName).toBe(updateData.firstName);
      expect(response.body.user.lastName).toBe(updateData.lastName);

      // Verify changes in database
      const updatedUser = await User.findByPk(testUser.id);
      expect(updatedUser.firstName).toBe(updateData.firstName);
      expect(updatedUser.lastName).toBe(updateData.lastName);
    });

    it('should fail updating profile without token', async () => {
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name'
      };

      const response = await request(app)
        .put('/api/users/profile')
        .send(updateData)
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    it('should fail updating profile with invalid data', async () => {
      const updateData = {
        firstName: '', // Empty required field
        lastName: 'Name'
      };

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('PUT /api/users/password', () => {
    it('should change user password with valid data', async () => {
      const passwordData = {
        currentPassword: 'test123', // Original password from createTestUser
        newPassword: 'newpassword123'
      };

      const response = await request(app)
        .put('/api/users/password')
        .set('Authorization', `Bearer ${userToken}`)
        .send(passwordData)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('successfully');
    });

    it('should fail changing password with wrong current password', async () => {
      const passwordData = {
        currentPassword: 'wrongpassword',
        newPassword: 'newpassword123'
      };

      const response = await request(app)
        .put('/api/users/password')
        .set('Authorization', `Bearer ${userToken}`)
        .send(passwordData)
        .expect(401);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Invalid');
    });

    it('should fail changing password without token', async () => {
      const passwordData = {
        currentPassword: 'test123',
        newPassword: 'newpassword123'
      };

      const response = await request(app)
        .put('/api/users/password')
        .send(passwordData)
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    it('should fail changing password with weak new password', async () => {
      const passwordData = {
        currentPassword: 'test123',
        newPassword: '123' // Too short
      };

      const response = await request(app)
        .put('/api/users/password')
        .set('Authorization', `Bearer ${userToken}`)
        .send(passwordData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('DELETE /api/users/account', () => {
    it('should delete user account with valid token', async () => {
      const response = await request(app)
        .delete('/api/users/account')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('deleted');

      // Verify user was deleted from database
      const deletedUser = await User.findByPk(testUser.id);
      expect(deletedUser).toBeNull();
    });

    it('should fail deleting account without token', async () => {
      const response = await request(app)
        .delete('/api/users/account')
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/users/orders', () => {
    it('should get user orders with valid token', async () => {
      const response = await request(app)
        .get('/api/users/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      // For new users, orders array should be empty
      expect(response.body.length).toBe(0);
    });

    it('should fail getting orders without token', async () => {
      const response = await request(app)
        .get('/api/users/orders')
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/users/orders/:orderId', () => {
    it('should get specific order details', async () => {
      const orderId = 1; // Mock order ID

      const response = await request(app)
        .get(`/api/users/orders/${orderId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('userId');
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('status');
    });

    it('should fail getting non-existent order', async () => {
      const response = await request(app)
        .get('/api/users/orders/99999')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });

    it('should fail getting order without token', async () => {
      const response = await request(app)
        .get('/api/users/orders/1')
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/users/address', () => {
    it('should add user address', async () => {
      const addressData = {
        type: 'shipping',
        street: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
        country: 'Test Country',
        isDefault: true
      };

      const response = await request(app)
        .post('/api/users/address')
        .set('Authorization', `Bearer ${userToken}`)
        .send(addressData)
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('address');
      expect(response.body.address.street).toBe(addressData.street);
    });

    it('should fail adding address without token', async () => {
      const addressData = {
        type: 'shipping',
        street: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345'
      };

      const response = await request(app)
        .post('/api/users/address')
        .send(addressData)
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    it('should fail adding address with invalid data', async () => {
      const addressData = {
        type: 'shipping',
        street: '', // Empty required field
        city: 'Test City'
      };

      const response = await request(app)
        .post('/api/users/address')
        .set('Authorization', `Bearer ${userToken}`)
        .send(addressData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/users/addresses', () => {
    it('should get user addresses', async () => {
      const response = await request(app)
        .get('/api/users/addresses')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      // For new users, addresses array should be empty
      expect(response.body.length).toBe(0);
    });

    it('should fail getting addresses without token', async () => {
      const response = await request(app)
        .get('/api/users/addresses')
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('PUT /api/users/address/:addressId', () => {
    it('should update user address', async () => {
      const addressId = 1; // Mock address ID
      const updateData = {
        street: '456 Updated Street',
        city: 'Updated City',
        state: 'Updated State',
        zipCode: '54321'
      };

      const response = await request(app)
        .put(`/api/users/address/${addressId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('address');
      expect(response.body.address.street).toBe(updateData.street);
    });

    it('should fail updating non-existent address', async () => {
      const updateData = {
        street: '456 Updated Street',
        city: 'Updated City'
      };

      const response = await request(app)
        .put('/api/users/address/99999')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('DELETE /api/users/address/:addressId', () => {
    it('should delete user address', async () => {
      const addressId = 1; // Mock address ID

      const response = await request(app)
        .delete(`/api/users/address/${addressId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('deleted');
    });

    it('should fail deleting non-existent address', async () => {
      const response = await request(app)
        .delete('/api/users/address/99999')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/users/logout', () => {
    it('should logout user successfully', async () => {
      const response = await request(app)
        .post('/api/users/logout')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('successfully');
    });

    it('should fail logout without token', async () => {
      const response = await request(app)
        .post('/api/users/logout')
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });
}); 