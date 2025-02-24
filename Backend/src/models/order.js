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
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
});

// Define the relationship between Order and Product
Order.belongsToMany(Product, { through: "OrderProduct" });
Product.belongsToMany(Order, { through: "OrderProduct" });