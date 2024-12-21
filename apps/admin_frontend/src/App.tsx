import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/SideBar";

function App() {
  return (
    <div className="bg-[#00050D] w-full min-h-screen pt-16">
      <Sidebar />
      <Navbar />
      <Outlet />
    </div>
  );
}

export default App;
