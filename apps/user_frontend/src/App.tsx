import { Outlet } from "react-router-dom";
import Navbar from "./components/NavBar/Navbar";
import Sidebar from "./components/SideBar";

import useAuth from "./hooks/useAuth";
import ShimmerSideBar from "./components/shimmer/ShimmerSideBar";
import useIsDesktop from "./hooks/useIsDesktop";

function App() {
  const { userData, isLoading } = useAuth();
  const isDesktop = useIsDesktop();
  return (
    <div className="bg-[#00050D] w-full min-h-screen pt-16">
      <Navbar userData={userData} />
      {userData && isDesktop && <Sidebar />}

      {isLoading && isDesktop && <ShimmerSideBar />}
      <div className="px-4 sm:pl-24 sm:pr-10">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
