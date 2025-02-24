import { Order } from "../models/order.js";
import { Product } from "../models/product.js";

const getAll = async (req, res) => {
  try {
    const orders = await Order.findAll({ include: Product });
    res.status(200).send({ data: orders, message: "Successfully fetched orders" });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

const create = async (req, res) => {
  try {
    const { tableNo, products } = req.body;
    if (!tableNo || !products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).send({ message: "Invalid payload" });
    }

    const order = await Order.create({ tableNo, totalPrice: 0 });
    let totalPrice = 0;

    for (const productData of products) {
      const product = await Product.findByPk(productData.id);
      if (!product) {
        await order.destroy();
        return res.status(404).send({ message: `Product with id ${productData.id} not found` });
      }
      await order.addProduct(product, { through: { quantity: productData.quantity } });
      totalPrice += product.price * productData.quantity;
    }

    await order.update({ totalPrice });
    const updatedOrder = await Order.findByPk(order.id, { include: Product });
    res.status(201).send({ data: updatedOrder, message: "Successfully created order" });
  } catch (e) {
    res.status(500).json({ error: "Failed to create order" });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { tableNo, products } = req.body;
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }

    if (tableNo) {
      order.tableNo = tableNo;
    }

    if (products && Array.isArray(products) && products.length > 0) {
      await order.setProducts([]);
      let totalPrice = 0;

      for (const productData of products) {
        const product = await Product.findByPk(productData.id);
        if (!product) {
          return res.status(404).send({ message: `Product with id ${productData.id} not found` });
        }
        await order.addProduct(product, { through: { quantity: productData.quantity } });
        totalPrice += product.price * productData.quantity;
      }

      order.totalPrice = totalPrice;
    }

    await order.save();
    const updatedOrder = await Order.findByPk(id, { include: Product });
    res.status(200).send({ data: updatedOrder, message: "Order updated successfully" });
  } catch (e) {
    res.status(500).json({ error: "Failed to update order" });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id, { include: Product });
    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }
    res.status(200).send({ data: order, message: "Order fetched successfully" });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

const deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }
    await order.destroy();
    res.status(200).send({ message: "Order deleted successfully" });
  } catch (e) {
    res.status(500).json({ error: "Failed to delete order" });
  }
};

export const orderController = {
  getAll,
  create,
  update,
  getById,
  deleteById,
};