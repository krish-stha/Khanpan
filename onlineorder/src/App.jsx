// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Sidebar from "./components/Sidebar";
// import ProfileDropdown from "./components/ProfileDropdown";
// import Dashboard from "./pages/Dashboard";
// import Orders from "./pages/Orders";
// import Sales from "./pages/Sales";
// import Menu from "./pages/Menu";
// import Setup from "./pages/Setup";
// import { MenuProvider } from "./context/MenuContext";
// // import Login from "./components/Login";
// import "./App.css";
// import "./components/ProfileDropdown.css";
// import Landing from "./components/Landing";
// import Login from "./components/Login";

// function App() {
//   return (
//     <MenuProvider>
//       <Router>
//       <div className="App">
//         <Routes>
          
//         <Route path="/" element={<Landing />} />
//         <Route path="/login" element={<Login/>} />
//         </Routes>
//         </div>
//             <Routes>
//               <Route path="/dashboard" element={<Dashboard />} />
//               <Route path="/orders" element={<Orders />} />
//               <Route path="/sales" element={<Sales />} />
//               <Route path="/menu" element={<Menu />} />
//               <Route path="/setup" element={<Setup />} />
//             </Routes> 
//       </Router>
//     </MenuProvider>
//   );
// }

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Sales from "./pages/Sales";
import Menu from "./pages/Menu";
import Setup from "./pages/Setup";
import { MenuProvider } from "./context/MenuContext";
import Login from "./pages/Login"
import "./App.css";
import "./components/ProfileDropdown.css";
import Landing from "./components/Landing";
import MainLayout from "./MainLayout";

function App() {
  return (
    <MenuProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/setup" element={<Setup />} />
          </Route>
        </Routes>
      </Router>
    </MenuProvider>
  );
}

export default App;

// export default App;


{/* <div className="app-container">
<Sidebar />
<main className="main-content">
  <div className="top-bar">
    <h1>Khanpan Restaurant</h1>
    <ProfileDropdown />
  </div> */}
// Landing page

// import React from 'react';
// import Landing from './components/Landing';
// // import Login from './components/Login'

// function App() {
//   return (
//     <div className="App">
//       <Landing />
//     </div>
//   );
// }

// export default App;

//Login

// import React from 'react';
// // import Landing from './components/Landing';
// import Login from './components/Login'

// function App() {
//   return (
//     <div className="App">
//       <Login />
//     </div>
//   );
// }

// export default App;