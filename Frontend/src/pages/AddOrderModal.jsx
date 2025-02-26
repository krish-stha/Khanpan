"use client";

import { useState } from "react";
import axios from "axios";
import { XMarkIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/solid";

function AddOrderModal({ onClose, onOrderAdded, occupiedTables, menuItems }) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [customer, setCustomer] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...new Set(menuItems.map((item) => item.category))];

  const filteredMenuItems =
    selectedCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  const handleAddItem = (item) => {
    const existingItem = selectedItems.find((i) => i.name === item.name);
    if (existingItem) {
      setSelectedItems(
        selectedItems.map((i) =>
          i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setSelectedItems([...selectedItems, { ...item, quantity: 1 }]);
    }
  };

  const handleRemoveItem = (item) => {
    setSelectedItems(selectedItems.filter((i) => i.name !== item.name));
  };

  const handleQuantityChange = (item, change) => {
    setSelectedItems(
      selectedItems.map((i) =>
        i.name === item.name
          ? { ...i, quantity: Math.max(1, i.quantity + change) }
          : i
      )
    );
  };

  const calculateTotal = () => {
    return selectedItems.reduce(
      (sum, item) =>
        sum + Number.parseInt(item.price.replace("Rs. ", "")) * item.quantity,
      0
    );
  };

  const axiosInstance = axios.create({
    baseURL: "http://localhost:4000/api",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customer || selectedItems.length === 0) return;
    const orderData = {
      tableNo: customer,
      products: selectedItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
      })),
      status: "Preparing",
    };

    try {
      await axiosInstance.post("/orders", orderData);
      onOrderAdded();
      onClose();
    } catch (error) {
      console.error("Error adding order:", error);
      alert("Failed to add order");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Add New Order</h2>
          <button className="close-modal" onClick={onClose}>
            <XMarkIcon className="icon w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="customer">Table Number</label>
            <select
              id="customer"
              className="form-input"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              required
            >
              <option value="">Select a table</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((tableNum) => (
                <option
                  key={tableNum}
                  value={`Table ${tableNum}`}
                  disabled={occupiedTables.includes(`Table ${tableNum}`)}
                >
                  Table {tableNum}{" "}
                  {occupiedTables.includes(`Table ${tableNum}`) ? "(Occupied)" : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <div className="categories">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`category-btn ${selectedCategory === category ? "active" : ""}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>Menu Items</label>
            <div className="menu-items-grid">
              {filteredMenuItems.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  className="menu-item-btn"
                  onClick={() => handleAddItem(item)}
                >
                  <div className="menu-item-content">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <div className="price">{item.price}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          {selectedItems.length > 0 && (
            <div className="form-group">
              <label>Selected Items</label>
              <ul className="selected-items-list">
                {selectedItems.map((item) => (
                  <li key={item.name}>
                    <div className="selected-item-info">
                      <span className="item-name">{item.name}</span>
                      <span className="item-price">{item.price}</span>
                    </div>
                    <div className="quantity-control">
                      <button type="button" onClick={() => handleQuantityChange(item, -1)}>
                        <MinusIcon className="icon w-4 h-4" />
                      </button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => handleQuantityChange(item, 1)}>
                        <PlusIcon className="icon w-4 h-4" />
                      </button>
                      <button type="button" className="remove-item-btn" onClick={() => handleRemoveItem(item)}>
                        <XMarkIcon className="icon w-4 h-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="modal-footer">
            <div className="order-total">Total: Rs. {calculateTotal()}</div>
            <div className="modal-actions">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="submit-btn" disabled={!customer || selectedItems.length === 0}>
                Add Order
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddOrderModal;
