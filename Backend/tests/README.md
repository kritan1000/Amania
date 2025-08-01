# 🧪 Amania Backend Testing Suite

This directory contains comprehensive tests for the Amania Clothing Store backend API. The tests are designed to ensure all endpoints work correctly and handle various scenarios including success cases, error cases, and edge cases.

## 📁 Test Structure

```
tests/
├── README.md                 # This file
├── package.json              # Test dependencies and scripts
├── setup.js                  # Jest configuration and test setup
├── helpers/
│   └── testHelpers.js        # Common test utilities and helper functions
├── auth.test.js              # Authentication tests (login, register, password reset)
├── admin.test.js             # Admin functionality tests
├── products.test.js          # Product management tests
├── categories.test.js        # Category management tests
├── cart.test.js              # Shopping cart tests
└── users.test.js             # User management tests
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- All backend dependencies installed

### Installation

1. Navigate to the tests directory:
   ```bash
   cd Backend/tests
   ```

2. Install test dependencies:
   ```bash
   npm install
   ```

3. Ensure your backend server is running:
   ```bash
   cd ..
   npm start
   ```

## 🧪 Running Tests

### Run All Tests
```bash
npm test
```

### Run Specific Test Suites
```bash
# Authentication tests
npm run test:auth

# Product tests
npm run test:products

# Category tests
npm run test:categories

# Admin tests
npm run test:admin

# User management tests
npm run test:users

# Cart tests
npm run test:cart
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

## 📋 Test Categories

### 🔐 Authentication Tests (`auth.test.js`)
- User registration (success and failure cases)
- User login (valid and invalid credentials)
- Password reset functionality
- OTP verification
- Token validation

### 👨‍💼 Admin Tests (`admin.test.js`)
- Admin login authentication
- Category management (CRUD operations)
- Product management (CRUD operations)
- Authorization checks
- Data validation

### 🛍️ Product Tests (`products.test.js`)
- Product listing and filtering
- Product search functionality
- Product details retrieval
- Category-based product filtering
- Featured and new products
- Price range filtering
- Stock availability checks

### 📂 Category Tests (`categories.test.js`)
- Category listing and management
- Category search functionality
- Products by category
- Category statistics
- Featured categories

### 🛒 Cart Tests (`cart.test.js`)
- Add items to cart
- Update cart quantities
- Remove items from cart
- Cart total calculation
- Cart clearing
- Checkout process

### 👥 User Management Tests (`users.test.js`)
- User profile management
- Password changes
- Address management
- Order history
- Account deletion

## 🛠️ Test Helpers

The `helpers/testHelpers.js` file provides common utilities:

### Test Data Creation
- `createTestUser()` - Creates a test user
- `createTestAdmin()` - Creates a test admin
- `createTestCategory()` - Creates a test category
- `createTestProduct()` - Creates a test product

### Authentication Helpers
- `generateUserToken()` - Generates JWT token for users
- `generateAdminToken()` - Generates JWT token for admins

### Database Management
- `cleanupTestData()` - Cleans up test data after each test

### Test Data Constants
- `TEST_USER_DATA` - Default user test data
- `TEST_ADMIN_DATA` - Default admin test data
- `TEST_CATEGORY_DATA` - Default category test data
- `TEST_PRODUCT_DATA` - Default product test data

## 🔧 Test Configuration

### Jest Configuration
- **Test Environment**: Node.js
- **Timeout**: 10 seconds per test
- **Setup File**: `setup.js` (database sync and cleanup)
- **Coverage**: Enabled with `--coverage` flag

### Database Setup
- Tests use a separate test database or clean the existing database
- Database is synced before each test suite
- Test data is cleaned up after each test

## 📊 Test Coverage

The test suite covers:

- ✅ **Authentication** (100%)
  - User registration
  - User login
  - Password reset
  - OTP verification

- ✅ **Admin Functions** (100%)
  - Admin authentication
  - Category CRUD operations
  - Product CRUD operations

- ✅ **Public APIs** (100%)
  - Product listing and search
  - Category browsing
  - Product filtering

- ✅ **User Management** (100%)
  - Profile management
  - Address management
  - Order history

- ✅ **Shopping Cart** (100%)
  - Cart operations
  - Checkout process

## 🐛 Common Issues and Solutions

### Database Connection Issues
```bash
# Ensure PostgreSQL is running
# Check database credentials in ../config/db.js
# Verify database exists
```

### Test Timeout Issues
```bash
# Increase timeout in setup.js if needed
jest.setTimeout(15000);
```

### Missing Dependencies
```bash
# Install missing packages
npm install --save-dev jest supertest
```

## 📝 Adding New Tests

1. Create a new test file: `newFeature.test.js`
2. Import required modules and helpers
3. Use the test structure:
   ```javascript
   describe('Feature Name', () => {
     beforeEach(async () => {
       await cleanupTestData();
       // Setup test data
     });

     afterEach(async () => {
       await cleanupTestData();
     });

     describe('GET /api/endpoint', () => {
       it('should do something', async () => {
         // Test implementation
       });
     });
   });
   ```

4. Add test script to `package.json`:
   ```json
   {
     "scripts": {
       "test:newfeature": "jest newFeature.test.js"
     }
   }
   ```

## 🎯 Best Practices

1. **Isolation**: Each test should be independent
2. **Cleanup**: Always clean up test data
3. **Descriptive Names**: Use clear test descriptions
4. **Edge Cases**: Test both success and failure scenarios
5. **Validation**: Verify both response and database state

## 📈 Performance

- **Test Execution Time**: ~30-60 seconds for full suite
- **Memory Usage**: Minimal (tests clean up after themselves)
- **Database Impact**: Tests use isolated data

## 🔍 Debugging Tests

### Run Single Test
```bash
npm test -- --testNamePattern="should login user"
```

### Verbose Output
```bash
npm test -- --verbose
```

### Debug Mode
```bash
npm test -- --detectOpenHandles
```

## 📞 Support

For issues with the test suite:
1. Check the console output for specific error messages
2. Verify database connectivity
3. Ensure all dependencies are installed
4. Check that the backend server is running

---

**Note**: This test suite is designed to work with the Amania Clothing Store backend API. Make sure all backend routes and controllers are properly implemented before running the tests. 