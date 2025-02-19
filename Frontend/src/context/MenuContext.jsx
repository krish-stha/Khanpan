

import { createContext, useState, useContext } from "react"

const MenuContext = createContext()

export const MenuProvider = ({ children }) => {
  const [menuItems, setMenuItems] = useState([])

  const addMenuItem = (item) => {
    setMenuItems((prevItems) => [...prevItems, item])
  }

  const updateMenuItem = (oldName, newItem) => {
    setMenuItems((prevItems) => prevItems.map((item) => (item.name === oldName ? newItem : item)))
  }

  const deleteMenuItem = (name) => {
    setMenuItems((prevItems) => prevItems.filter((item) => item.name !== name))
  }

  return (
    <MenuContext.Provider value={{ menuItems, addMenuItem, updateMenuItem, deleteMenuItem }}>
      {children}
    </MenuContext.Provider>
  )
}

export const useMenu = () => {
  const context = useContext(MenuContext)
  if (context === undefined) {
    throw new Error("useMenu must be used within a MenuProvider")
  }
  return context
}

