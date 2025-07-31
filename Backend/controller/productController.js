const Product = require("../model/productModel");
const Category = require("../model/categoryModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
// Add Product
const addProduct = async (req, res) => {
  try {
    const { name, description, price, image, categoryId } = req.body;

    if (!name || !price || !categoryId) {
      return res.status(400).json({ 
        message: "Name, price, and category are required" 
      });
    }

    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const product = await Product.create({
      name,
      description,
      price,
      image,
      categoryId,
    });

    res.status(201).json({
      message: "Product added successfully",
      product,
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
      include: [{ model: Category, attributes: ["name"] }],
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

    await product.update({
      name,
      description,
      price,
      image,
      categoryId,
    });

    res.status(200).json({
      message: "Product updated successfully",
      product,
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
// Get Products by Category Name
const getProductsByCategory = async (req, res) => {
  try {
    const { categoryName } = req.params;
    if (!categoryName) {
      return res.status(400).json({ message: "Category name is required" });
    }
    const category = await Category.findOne({ where: { name: categoryName } });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    const products = await Product.findAll({
      where: { categoryId: category.id },
      include: [{ model: Category, attributes: ["name"] }],
    });
    res.status(200).json(products);
  } catch (error) {
    console.error("Get products by category error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
};