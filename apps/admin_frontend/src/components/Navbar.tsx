import { NavLink, useNavigate } from "react-router-dom";
// import { IoMdSearch } from "react-icons/io";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="h-16 bg-[rgba(25,30,37,.8)] fixed top-0 w-full text-white flex items-center justify-between px-[7%] backdrop-blur-16 z-40">
      <div className="flex space-x-12">
        <div className="icon">
          <h1
            className="text-3xl font-bold text-[#3F7AE9] cursor-pointer"
            onClick={() => {
              navigate("/");
            }}
          >
            LearnLab
          </h1>
        </div>
        {/* <div className="nav-links flex items-center space-x-4">
          {["/", "/create"].map((path, index) => (
            <NavLink
              key={index}
              to={path}
              className={({ isActive }) =>
                `text-lg p-1 rounded cursor-pointer ${
                  isActive
                    ? "bg-white text-gray-800 opacity-50 font-semibold"
                    : "hover:bg-white hover:text-gray-800"
                }`
              }
            >
              {path === "/"
                ? "Home"
                : path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
            </NavLink>
          ))}
          <div className="w-[2px] h-6 bg-white"></div>
        </div> */}
      </div>

      {/* <div className="search-box flex items-center space-x-4">
        <div className="relative flex items-center bg-gray-700 rounded-full px-3 py-2">
          <IoMdSearch className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="ml-2 bg-transparent outline-none text-sm text-white placeholder-gray-400 w-[300px]"
          />
        </div>
      </div> */}

      <div className="flex items-center space-x-4">
        {["/login", "/signup"].map((authPath, index) => (
          <NavLink
            key={index}
            to={authPath}
            className={({ isActive }) =>
              `text-lg p-1 rounded cursor-pointer ${
                isActive
                  ? "bg-white text-gray-800 opacity-50 font-semibold"
                  : "hover:bg-white hover:text-gray-800"
              }`
            }
          >
            {authPath === "/login" ? "Login" : "Signup"}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
