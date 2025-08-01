// Test setup file for Amania Backend Tests
const { db } = require('../config/db');

// Global test setup
beforeAll(async () => {
  // Sync database for testing
  await db.sync({ force: true });
  console.log('✅ Test database synced');
});

// Global test teardown
afterAll(async () => {
  // Close database connection
  await db.close();
  console.log('✅ Test database connection closed');
});

// Global test timeout
jest.setTimeout(10000);

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}; 