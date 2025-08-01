// Authentication Tests for Amania Backend
const request = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../server');
const { User } = require('../model/userModel');
const { 
  createTestUser, 
  cleanupTestData, 
  TEST_USER_DATA 
} = require('./helpers/testHelpers');

describe('🔐 Authentication Tests', () => {
  let testUser;
  let authToken;

  beforeEach(async () => {
    await cleanupTestData();
    testUser = await createTestUser();
    authToken = await generateUserToken(testUser);
  });

  afterEach(async () => {
    await cleanupTestData();
  });

  describe('POST /api/users/register', () => {
    it('should register a new user successfully', async () => {
      const newUserData = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        password: 'password123',
        contact: 9876543210
      };

      const response = await request(app)
        .post('/api/users/register')
        .send({ data: newUserData })
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('successful');

      // Verify user was created in database
      const createdUser = await User.findOne({ 
        where: { email: newUserData.email } 
      });
      expect(createdUser).toBeTruthy();
      expect(createdUser.firstName).toBe(newUserData.firstName);
    });

    it('should fail registration with existing email', async () => {
      const existingUserData = {
        firstName: 'Duplicate',
        lastName: 'User',
        email: testUser.email, // Use existing email
        password: 'password123',
        contact: 1234567890
      };

      const response = await request(app)
        .post('/api/users/register')
        .send({ data: existingUserData })
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('already exists');
    });

    it('should fail registration with invalid data', async () => {
      const invalidUserData = {
        firstName: '', // Empty required field
        lastName: 'Test',
        email: 'invalid-email',
        password: '123', // Too short
        contact: 'invalid-contact'
      };

      const response = await request(app)
        .post('/api/users/register')
        .send({ data: invalidUserData })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/users/login', () => {
    it('should login user with valid credentials', async () => {
      const loginData = {
        email: testUser.email,
        password: 'test123' // Original password from createTestUser
      };

      const response = await request(app)
        .post('/api/users/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user_id');
      expect(response.body).toHaveProperty('email');
      expect(response.body).toHaveProperty('fullname');
      expect(response.body.email).toBe(testUser.email);
    });

    it('should fail login with invalid email', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/users/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('not found');
    });

    it('should fail login with invalid password', async () => {
      const loginData = {
        email: testUser.email,
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/users/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Invalid');
    });

    it('should fail login with missing fields', async () => {
      const loginData = {
        email: testUser.email
        // Missing password
      };

      const response = await request(app)
        .post('/api/users/login')
        .send(loginData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/users/forgot-password', () => {
    it('should send reset email for existing user', async () => {
      const forgotPasswordData = {
        email: testUser.email
      };

      const response = await request(app)
        .post('/api/users/forgot-password')
        .send(forgotPasswordData)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('reset link');
    });

    it('should handle non-existent email gracefully', async () => {
      const forgotPasswordData = {
        email: 'nonexistent@example.com'
      };

      const response = await request(app)
        .post('/api/users/forgot-password')
        .send(forgotPasswordData)
        .expect(200);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/users/reset-password', () => {
    it('should reset password with valid token', async () => {
      // First, request password reset
      await request(app)
        .post('/api/users/forgot-password')
        .send({ email: testUser.email });

      // Get the reset token (in real app, this would be from email)
      const resetToken = 'test-reset-token'; // Mock token
      const newPassword = 'newpassword123';

      const response = await request(app)
        .post('/api/users/reset-password')
        .send({
          token: resetToken,
          password: newPassword
        })
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('successfully');
    });

    it('should fail with invalid token', async () => {
      const resetData = {
        token: 'invalid-token',
        password: 'newpassword123'
      };

      const response = await request(app)
        .post('/api/users/reset-password')
        .send(resetData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/users/send-otp', () => {
    it('should send OTP for existing user', async () => {
      const otpData = {
        email: testUser.email
      };

      const response = await request(app)
        .post('/api/users/send-otp')
        .send(otpData)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('OTP sent');
    });

    it('should handle non-existent email for OTP', async () => {
      const otpData = {
        email: 'nonexistent@example.com'
      };

      const response = await request(app)
        .post('/api/users/send-otp')
        .send(otpData)
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/users/verify-otp', () => {
    it('should verify valid OTP', async () => {
      const verifyData = {
        email: testUser.email,
        otp: '123456' // Mock OTP
      };

      const response = await request(app)
        .post('/api/users/verify-otp')
        .send(verifyData)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('verified');
    });

    it('should fail with invalid OTP', async () => {
      const verifyData = {
        email: testUser.email,
        otp: '000000' // Invalid OTP
      };

      const response = await request(app)
        .post('/api/users/verify-otp')
        .send(verifyData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });
}); 