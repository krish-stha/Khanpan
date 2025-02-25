import { NavLink } from 'react-router-dom';
import tea from "./images/tea.png"
import { 
  HomeIcon, 
  ShoppingCartIcon, 
  ChartBarIcon, 
  Squares2X2Icon, 
  Cog6ToothIcon 
} from '@heroicons/react/24/outline';

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="logo">
        <img src={tea} alt="Khanpan" />
        <h2>Khanpan</h2>
      </div>
      
      <nav>
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
          <HomeIcon className="icon" />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink to="/orders" className={({ isActive }) => isActive ? 'active' : ''}>
          <ShoppingCartIcon className="icon" />
          <span>Orders</span>
        </NavLink>
        
   
        
        <NavLink to="/menu" className={({ isActive }) => isActive ? 'active' : ''}>
          <Squares2X2Icon className="icon" />
          <span>Menu</span>
        </NavLink>
        
        <NavLink to="/setup" className={({ isActive }) => isActive ? 'active' : ''}>
          <Cog6ToothIcon className="icon" />
          <span>Setup</span>
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;