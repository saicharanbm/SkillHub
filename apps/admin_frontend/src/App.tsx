import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/SideBar";
import { useAuthQuery } from "./services/queries";
import { useEffect } from "react";

function App() {
  const { isLoading, error } = useAuthQuery();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoading && error) {
      navigate("/signup");
    }
  }, [error, isLoading, navigate]);
  return (
    <div className="bg-[#00050D] w-full min-h-screen pt-16">
      <Navbar />
      {isLoading && (
        <div className="text-white text-2xl text-center mt-10">Loading...</div>
      )}
      {!isLoading && !error && <Sidebar />}
      <Outlet />
    </div>
  );
}

export default App;
