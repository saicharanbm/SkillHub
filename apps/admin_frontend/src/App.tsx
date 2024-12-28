import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/NavBar/Navbar";
import Sidebar from "./components/SideBar";

import useAuth from "./hooks/useAuth";
import ShimmerSideBar from "./components/shimmer/ShimmerSideBar";

function App() {
  const { userData, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };
  return (
    <div className="bg-[#00050D] w-full min-h-screen pt-16">
      <Navbar userData={userData} />
      {isLoading && <ShimmerSideBar />}
      <div className="flex">
        {userData && <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />}
        <div
          className={`flex-1 transition-all duration-300 ${
            isOpen ? "ml-64" : "ml-16"
          }`}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default App;
