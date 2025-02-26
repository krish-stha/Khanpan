// controllers/orderController.js
import { Order, OrderProduct } from "../models/order.js";
import { Product } from "../models/product.js";
import { sequelize } from "../database/index.js";

const getAll = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{
        model: Product,
        through: {
          attributes: ['quantity']
        }
      }],
      order: [['createdAt', 'DESC']] // This will keep newest orders at the top
    });
    res.status(200).send({ data: orders, message: "Successfully fetched orders" });
  } catch (e) {
    console.error("Error fetching orders:", e);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

const create = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { tableNo, products } = req.body;
    if (!tableNo || !products || !Array.isArray(products)) {
      return res.status(400).send({ message: "Invalid payload" });
    }

    // Fetch products to get current prices
    const productIds = products.map(p => p.id);
    const productDetails = await Product.findAll({
      where: { id: productIds }
    });

    // Prepare order item names and calculate total price
    let orderItems = [];
    let totalPrice = 0;
    const orderProducts = products.map(orderProduct => {
      const product = productDetails.find(p => p.id === orderProduct.id);
      if (!product) throw new Error(`Product ${orderProduct.id} not found`);
      
      const lineTotal = parseFloat(product.price) * orderProduct.quantity;
      totalPrice += lineTotal;
      orderItems.push(product.name);
      
      return {
        ProductId: orderProduct.id,
        quantity: orderProduct.quantity,
        priceAtTime: product.price
      };
    });

    // Join the product names to store in the Order's itemName field
    const itemName = orderItems.join(", ");

    // Create order (include itemName)
    const order = await Order.create({
      tableNo,
      totalPrice,
      status: "Preparing",
      itemName
    }, { transaction: t });

    // Create order-product associations
    await OrderProduct.bulkCreate(
      orderProducts.map(op => ({
        ...op,
        OrderId: order.id
      })),
      { transaction: t }
    );

    await t.commit();

    // Fetch the complete order with products
    const completeOrder = await Order.findByPk(order.id, {
      include: [{
        model: Product,
        through: {
          attributes: ['quantity']
        }
      }]
    });

    res.status(201).send({ 
      data: completeOrder, 
      message: "Successfully created order" 
    });
  } catch (e) {
    await t.rollback();
    console.error("Error creating order:", e);
    res.status(500).json({ error: "Failed to create order" });
  }
};

const update = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { status, tableNo, products } = req.body;

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }

    // If only status is being updated
    if (status && !products) {
      await order.update({ status }, { transaction: t });
      await t.commit();

      // Fetch the updated order with products
      const updatedOrder = await Order.findByPk(id, {
        include: [{
          model: Product,
          through: {
            attributes: ['quantity']
          }
        }]
      });

      return res.status(200).send({ 
        data: updatedOrder, 
        message: "Order status updated successfully" 
      });
    }

    // For full order update
    if (products && Array.isArray(products)) {
      // Calculate new total price
      const productDetails = await Product.findAll({
        where: { id: products.map(p => p.id) }
      });

      let totalPrice = 0;
      const orderProducts = products.map(orderProduct => {
        const product = productDetails.find(p => p.id === orderProduct.id);
        if (!product) throw new Error(`Product ${orderProduct.id} not found`);
        
        totalPrice += parseFloat(product.price) * orderProduct.quantity;

        return {
          OrderId: order.id,
          ProductId: orderProduct.id,
          quantity: orderProduct.quantity,
          priceAtTime: product.price
        };
      });

      // Update order
      await order.update({
        tableNo: tableNo || order.tableNo,
        totalPrice,
        status: status || order.status
      }, { transaction: t });

      // Update order products
      await OrderProduct.destroy({
        where: { OrderId: order.id },
        transaction: t
      });

      await OrderProduct.bulkCreate(orderProducts, { 
        transaction: t 
      });
    }

    await t.commit();

    // Fetch the updated order with products
    const updatedOrder = await Order.findByPk(id, {
      include: [{
        model: Product,
        through: {
          attributes: ['quantity']
        }
      }]
    });

    res.status(200).send({ 
      data: updatedOrder, 
      message: "Order updated successfully" 
    });

  } catch (e) {
    await t.rollback();
    console.error("Error updating order:", e);
    res.status(500).json({ error: "Failed to update order" });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id, {
      include: [{
        model: Product,
        through: {
          attributes: ['quantity']
        }
      }]
    });
    
    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }
    
    res.status(200).send({ 
      data: order, 
      message: "Order fetched successfully" 
    });
  } catch (e) {
    console.error("Error fetching order:", e);
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

const deleteById = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id);
    
    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }

    // Delete order-product associations and order
    await OrderProduct.destroy({
      where: { OrderId: id },
      transaction: t
    });

    await order.destroy({ transaction: t });

    await t.commit();
    res.status(200).send({ 
      message: "Order deleted successfully",
      data: { id } // Return the id for frontend reference
    });
  } catch (e) {
    await t.rollback();
    console.error("Error deleting order:", e);
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