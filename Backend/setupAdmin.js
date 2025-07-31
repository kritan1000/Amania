/**
 * Admin Setup Script
 * Creates default admin users in the database
 * Includes both default admin and custom admin credentials
 */

const bcrypt = require('bcrypt');
const { db } = require('./config/db');
const Admin = require('./model/adminModel');

const setupAdmin = async () => {
  try {
    // Sync database
    await db.sync({ alter: true });
    console.log('Database synced successfully');

    // Default admins to add
    const admins = [
      {
        username: 'admin',
        email: 'admin@amania.com',
        password: 'admin123',
        role: 'admin',
      },
      {
        username: 'kritan',
        email: 'kritannepal11@gmail.com',
        password: 'kritan12345',
        role: 'admin',
      },
    ];

    for (const adminData of admins) {
      const existingAdmin = await Admin.findOne({ where: { email: adminData.email } });
      if (existingAdmin) {
        console.log(`Admin user already exists: ${adminData.email}`);
        continue;
      }
      const hashedPassword = await bcrypt.hash(adminData.password, 10);
      await Admin.create({
        username: adminData.username,
        email: adminData.email,
        password: hashedPassword,
        role: adminData.role,
      });
      console.log(`Admin user created: ${adminData.email}`);
    }

  } catch (error) {
    console.error('Error setting up admin:', error);
  } finally {
    await db.close();
  }
};

setupAdmin(); 