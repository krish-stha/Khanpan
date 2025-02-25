// models/order.js
import { DataTypes } from "sequelize";
import { sequelize } from "../database/index.js";
import { Product } from "./product.js";

export const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  tableNo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("Preparing", "Ready", "Delivered"),
    defaultValue: "Preparing",
    allowNull: false,
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  }
});

// Junction table for many-to-many relationship between Order and Product
export const OrderProduct = sequelize.define("OrderProduct", {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  priceAtTime: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  }
});

// Define relationships
Order.belongsToMany(Product, { through: OrderProduct });
Product.belongsToMany(Order, { through: OrderProduct });