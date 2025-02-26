"use client";

import { useState, useEffect } from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import AddOrderModal from "./AddOrderModal";
import UpdateOrderModal from "./UpdateOrderModal";

function Orders() {
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [orderToUpdate, setOrderToUpdate] = useState(null);
  const [occupiedTables, setOccupiedTables] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchMenuItems();
    fetchOrders();
  }, []);

  const axiosInstance = axios.create({
    baseURL: "http://localhost:4000/api",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  });

  const fetchMenuItems = async () => {
    try {
      const response = await axiosInstance.get("/products");
      setMenuItems(response.data.data);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get("/orders");
      setOrders(response.data.data);
      updateOccupiedTables(response.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const updateOccupiedTables = (orders) => {
    const tables = orders
      .filter((order) => order.status !== "Delivered")
      .map((order) => order.tableNo);
    setOccupiedTables(tables);
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const openUpdateModal = (order) => {
    setOrderToUpdate(order);
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setOrderToUpdate(null);
    setIsUpdateModalOpen(false);
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await axiosInstance.delete(`/orders/${orderId}`);
        fetchOrders();
      } catch (error) {
        console.error("Error deleting order:", error);
        alert("Failed to delete order");
      }
    }
  };

  console.log(orders)

  return (
    <div className="main-content">
      <div className="header">
        <h1>Khanpan Restaurant</h1>
        <button className="add-order-btn" onClick={openAddModal}>
          <PlusIcon className="icon w-5 h-5 mr-2" /> Add Order
        </button>
      </div>
      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Table No</th>
              <th>Items</th>
              <th>Status</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.tableNo}</td>
                <td>
                  {order.itemName}
                </td>
                <td>
                  <span className={`status-badge ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>
                <td>Rs. {order.totalPrice}</td>
                <td className="actions-cell">
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <button className="update-btn" onClick={() => openUpdateModal(order)}>
                      Update
                    </button>
                    <button className="hard" onClick={() => handleDeleteOrder(order.id)}>
                      <TrashIcon className="delete-btnn" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isAddModalOpen && (
        <AddOrderModal
          onClose={closeAddModal}
          onOrderAdded={fetchOrders}
          occupiedTables={occupiedTables}
          menuItems={menuItems}
        />
      )}
      {isUpdateModalOpen && orderToUpdate && (
        <UpdateOrderModal
          order={orderToUpdate}
          onClose={closeUpdateModal}
          onOrderUpdated={fetchOrders}
        />
      )}
    </div>
  );
}

export default Orders;
