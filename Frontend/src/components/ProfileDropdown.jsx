import { useState, useRef, useEffect } from "react"
import { UserCircleIcon, ChevronDownIcon } from "@heroicons/react/24/outline"
import { Link } from "react-router-dom"

function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="profile-wrapper" ref={dropdownRef}>
      <button className="profile-button" onClick={() => setIsOpen(!isOpen)}>
        <UserCircleIcon className="profile-icon" />
        <span className="profile-text">Admin</span>
        <ChevronDownIcon className={`chevron-icon ${isOpen ? "rotate" : ""}`} />
      </button>

      {isOpen && (
        <div className="profile-dropdown">
          <div className="dropdown-header">
            <UserCircleIcon className="dropdown-user-icon" />
            <div className="user-details">
              <p className="user-name">Admin User</p>
              <p className="user-email">admin@khanpan.com</p>
            </div>
          </div>
          <div className="dropdown-divider" />
          <Link  to="/">
          <button className="logout-button">Logout</button>
          </Link>
        </div>
      )}
    </div>
  )
}

export default ProfileDropdown