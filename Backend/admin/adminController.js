/**
 * Admin Controller
 * Handles all admin-related operations including authentication,
 * category management, and product management
 */

const Admin = require("../model/adminModel");
const Product = require("../model/productModel");
const Category = require("../model/categoryModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Admin Login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Admin login successful",
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add Category
const addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const existingCategory = await Category.findOne({ where: { name: name.trim() } });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({
      name: name.trim()
    });

    res.status(201).json({
      message: "Category added successfully",
      category: {
        id: category.id,
        name: category.name
      }
    });
  } catch (error) {
    console.error("Add category error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get All Categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(categories);
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add Product
const addProduct = async (req, res) => {
  try {
    const { name, description, price, image, categoryId } = req.body;

    if (!name || !description || !price || !categoryId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(400).json({ message: "Category not found" });
    }

    const product = await Product.create({
      name,
      description,
      price: parseFloat(price),
      image: image || null,
      categoryId
    });

    res.status(201).json({
      message: "Product added successfully",
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        categoryId: product.categoryId
      }
    });
  } catch (error) {
    console.error("Add product error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get All Products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(products);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update Product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image, categoryId } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(400).json({ message: "Category not found" });
      }
    }

    await product.update({
      name: name || product.name,
      description: description || product.description,
      price: price ? parseFloat(price) : product.price,
      image: image || product.image,
      categoryId: categoryId || product.categoryId
    });

    res.status(200).json({
      message: "Product updated successfully",
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        categoryId: product.categoryId
      }
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.destroy();

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  adminLogin,
  addCategory,
  getAllCategories,
  addProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
};


