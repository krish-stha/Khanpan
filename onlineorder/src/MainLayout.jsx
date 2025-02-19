import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar"
import ProfileDropdown from "./components/ProfileDropdown";

const MainLayout = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <div className="top-bar">
          <h1>Khanpan Restaurant</h1>
          <ProfileDropdown />
        </div>
        <Outlet />  
      </main>
    </div>
  );
};

export default MainLayout;