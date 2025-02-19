"use client"

import { useState } from "react"
import { EllipsisVerticalIcon, PlusIcon, XMarkIcon, MinusIcon } from "@heroicons/react/24/solid"
import { useMenu } from "../context/MenuContext"

function Orders() {
  const { menuItems } = useMenu()
  const [orders, setOrders] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState("add")
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [occupiedTables, setOccupiedTables] = useState([])

  const [selectedItems, setSelectedItems] = useState([])
  const [customer, setCustomer] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const categories = ["All", ...new Set(menuItems.map((item) => item.category))]

  const openAddModal = () => {
    setModalMode("add")
    setSelectedItems([])
    setCustomer("")
    setIsModalOpen(true)
  }

  const openUpdateModal = (order) => {
    setModalMode("update")
    setSelectedOrder(order)
    setSelectedItems(parseOrderItems(order.items))
    setCustomer(order.customer)
    setIsModalOpen(true)
  }

  const parseOrderItems = (itemsString) => {
    return itemsString.split(", ").map((item) => {
      const [name, quantityStr] = item.split(" (")
      const quantity = Number.parseInt(quantityStr.replace(")", ""))
      const menuItem = menuItems.find((mi) => mi.name === name)
      return { ...menuItem, quantity }
    })
  }

  const handleAddOrUpdateOrder = () => {
    if (modalMode === "add") {
      const newOrder = {
        id: `#${Math.floor(Math.random() * 1000)}`,
        customer,
        items: selectedItems.map((item) => `${item.name} (${item.quantity})`).join(", "),
        status: "Preparing",
        total: `Rs. ${calculateTotal()}`,
      }
      setOrders([...orders, newOrder])
      setOccupiedTables([...occupiedTables, customer])
    } else if (selectedOrder) {
      const updatedOrder = {
        ...selectedOrder,
        items: selectedItems.map((item) => `${item.name} (${item.quantity})`).join(", "),
        total: `Rs. ${calculateTotal()}`,
      }
      setOrders(orders.map((order) => (order.id === updatedOrder.id ? updatedOrder : order)))
    }
    setIsModalOpen(false)
  }

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(
      orders.map((order) => {
        if (order.id === orderId) {
          if (newStatus === "Delivered") {
            setOccupiedTables(occupiedTables.filter((table) => table !== order.customer))
          }
          return { ...order, status: newStatus }
        }
        return order
      }),
    )
  }

  const filteredMenuItems =
    selectedCategory === "All" ? menuItems : menuItems.filter((item) => item.category === selectedCategory)

  const handleAddItem = (item) => {
    const existingItem = selectedItems.find((i) => i.name === item.name)
    if (existingItem) {
      setSelectedItems(selectedItems.map((i) => (i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i)))
    } else {
      setSelectedItems([...selectedItems, { ...item, quantity: 1 }])
    }
  }

  const handleRemoveItem = (item) => {
    setSelectedItems(selectedItems.filter((i) => i.name !== item.name))
  }

  const handleQuantityChange = (item, change) => {
    setSelectedItems(
      selectedItems.map((i) => (i.name === item.name ? { ...i, quantity: Math.max(1, i.quantity + change) } : i)),
    )
  }

  const calculateTotal = () => {
    return selectedItems.reduce((sum, item) => sum + Number.parseInt(item.price.replace("Rs. ", "")) * item.quantity, 0)
  }

  return (
    <div className="main-content">
      <div className="header">
        <h1>Khanpan Restaurant</h1>
        <button className="add-order-btn" onClick={openAddModal}>
          <PlusIcon className="icon" /> Add Order
        </button>
      </div>
      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Status</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.items}</td>
                <td>
                  <span className={`status ${order.status.toLowerCase()}`}>{order.status}</span>
                </td>
                <td>{order.total}</td>
                <td>
                  <div className="dropdown">
                    <button className="icon-button">
                      <EllipsisVerticalIcon className="icon" />
                    </button>
                    <div className="dropdown-content">
                      <button onClick={() => handleStatusChange(order.id, "Preparing")}>Preparing</button>
                      <button onClick={() => handleStatusChange(order.id, "Ready")}>Ready</button>
                      <button onClick={() => handleStatusChange(order.id, "Delivered")}>Delivered</button>
                      <button onClick={() => openUpdateModal(order)}>Update Order</button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{modalMode === "add" ? "Add New Order" : `Update Order for ${customer}`}</h2>
              <button className="close-modal" onClick={() => setIsModalOpen(false)}>
                <XMarkIcon className="icon" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleAddOrUpdateOrder()
              }}
            >
              {modalMode === "add" && (
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
                        Table {tableNum}
                        {occupiedTables.includes(`Table ${tableNum}`) ? " (Occupied)" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              )}
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
                    <button key={item.name} type="button" className="menu-item-btn" onClick={() => handleAddItem(item)}>
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
                            <MinusIcon className="icon" />
                          </button>
                          <span>{item.quantity}</span>
                          <button type="button" onClick={() => handleQuantityChange(item, 1)}>
                            <PlusIcon className="icon" />
                          </button>
                          <button type="button" className="remove-item-btn" onClick={() => handleRemoveItem(item)}>
                            <XMarkIcon className="icon" />
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
                  <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn" disabled={!customer || selectedItems.length === 0}>
                    {modalMode === "add" ? "Add Order" : "Update Order"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders

