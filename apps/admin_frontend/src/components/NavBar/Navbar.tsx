import { NavLink, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import UserModal from "./UserModal";
// import { IoMdSearch } from "react-icons/io";

type NavbarProps = {
  userData?: { avatarUrl: string; fullName: string };
};
const Navbar = ({ userData }: NavbarProps) => {
  const defaultAvatar = useRef(
    "https://m.media-amazon.com/images/G/02/CerberusPrimeVideo-FN38FSBD/adult-2.png"
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current); // Clear any existing timer
    }
    setIsDropdownOpen(true); // Open dropdown
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false); // Close dropdown after delay
    }, 300); // Adjust the delay time as needed
  };

  return (
    <nav className="h-16 bg-[#00050D] fixed top-0 w-full text-white flex items-center justify-between px-[6%] border-b-2 border-[#262d38] z-40">
      <div className="flex space-x-12">
        <div className="icon">
          <h1
            className="text-3xl font-bold tracking-wider text-[#fff] cursor-pointer"
            onClick={() => navigate("/")}
          >
            <span className="font-bebas">Skill</span>
            <span className=" text-[#F89A28] font-helvetica">hub</span>
          </h1>
        </div>
      </div>
      {userData ? (
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className={`rounded-full p-1 cursor-pointer ${isDropdownOpen && "bg-white"} transform duration-200 ease-in-out`}
          >
            <img
              src={userData?.avatarUrl || defaultAvatar.current}
              alt="profile picture"
              className="w-10 h-10 rounded-full"
            />
          </div>
          {isDropdownOpen && <UserModal fullName={userData.fullName} />}
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          {["/login", "/signup"].map((authPath, index) => (
            <NavLink
              key={index}
              to={authPath}
              className={({ isActive }) =>
                `text-lg p-1 rounded cursor-pointer hover:bg-[#F89A28] hover:opacity-100 hover:font-semibold hover:text-gray-800 ${
                  isActive &&
                  "bg-[#F89A28] text-gray-800 opacity-50 font-semibold"
                }`
              }
            >
              {authPath === "/login" ? "Login" : "Signup"}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
