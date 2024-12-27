import { Outlet } from "react-router-dom";
import Navbar from "./components/NavBar/Navbar";
import Sidebar from "./components/SideBar";

import useAuth from "./hooks/useAuth";

function App() {
  const { userData, isLoading } = useAuth();
  return (
    <div className="bg-[#00050D] w-full min-h-screen pt-16">
      <Navbar userData={userData} />
      {userData && <Sidebar />}
      <div className="sm:px-24">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
