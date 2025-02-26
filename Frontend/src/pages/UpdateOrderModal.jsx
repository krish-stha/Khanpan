"use client";

import { useState } from "react";
import axios from "axios";
import { XMarkIcon } from "@heroicons/react/24/solid";

function UpdateOrderModal({ order, onClose, onOrderUpdated }) {
  const [orderStatus, setOrderStatus] = useState(order.status);

  const axiosInstance = axios.create({
    baseURL: "http://localhost:4000/api",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = { status: orderStatus };
      await axiosInstance.patch(`/orders/${order.id}`, updatedData);
      onOrderUpdated();
      onClose();
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status, check it.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Update Order Status</h2>
          <button className="close-modal" onClick={onClose}>
            <XMarkIcon className="icon w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="status">Order Status</label>
            <select
              id="status"
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
            >
              <option value="Preparing">Preparing</option>
              <option value="Ready">Ready</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
          <div className="modal-footer">
            <div className="modal-actions">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="submit-btn">
                Update Status
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateOrderModal;
