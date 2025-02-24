import { Product } from "../models/product.js";

const getAll = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).send({ data: products, message: "Successfully fetched products" });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

const create = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    if (!name || !price || !category) {
      return res.status(400).send({ message: "Invalid payload" });
    }
    const product = await Product.create({ name, description, price, category });
    res.status(201).send({ data: product, message: "Successfully created product" });
  } catch (e) {
    res.status(500).json({ error: "Failed to create product" });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category } = req.body;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }
    await product.update({ name, description, price, category });
    res.status(200).send({ data: product, message: "Product updated successfully" });
  } catch (e) {
    res.status(500).json({ error: "Failed to update product" });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }
    res.status(200).send({ data: product, message: "Product fetched successfully" });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

const deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }
    await product.destroy();
    res.status(200).send({ message: "Product deleted successfully" });
  } catch (e) {
    res.status(500).json({ error: "Failed to delete product" });
  }
};

export const productController = {
  getAll,
  create,
  update,
  getById,
  deleteById,
};