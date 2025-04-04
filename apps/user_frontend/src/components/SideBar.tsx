import { useState, useRef, useEffect } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { IoMdHome } from "react-icons/io";
import { IoSettings } from "react-icons/io5";
import { FaShoppingBag } from "react-icons/fa";
import { FaClock } from "react-icons/fa6";
import { TbLayoutSidebarRightExpandFilled } from "react-icons/tb";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTextVisible, setIsTextVisible] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => {
    if (!isOpen) {
      setIsOpen(true);
      setTimeout(() => {
        setIsTextVisible(true);
      }, 250);
    } else {
      setIsTextVisible(false);
      setTimeout(() => {
        setIsOpen(false);
      }, 100);
    }
  };

  // Close sidebar if clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsTextVisible(false);
        setTimeout(() => {
          setIsOpen(false);
        }, 100);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={sidebarRef}
      className={`h-screen bg-[#0A0B11] text-white fixed px-2 left-0 z-50 border-r-[1px] text-nowrap border-[#141920] ${
        isOpen ? "w-64" : "w-16"
      } transition-width duration-300 overflow-hidden`}
    >
      {/* Toggle Button */}
      <div className="flex items-center space-x-4 py-3 px-1">
        <button
          onClick={toggleSidebar}
          className="text-[#F89A28] hover:bg-gray-700 p-2 rounded-md"
        >
          {isOpen ? (
            <TbLayoutSidebarRightExpandFilled size={24} />
          ) : (
            <AiOutlineMenu size={24} />
          )}
        </button>
        {isOpen && (
          <span
            className={`text-xl font-semibold transition-opacity duration-300 ${
              isTextVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            Menu
          </span>
        )}
      </div>

      <ul className="mt-6 space-y-4">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center space-x-4 px-[11px] py-3 font-semibold hover:bg-gray-700 rounded-md cursor-pointer ${
                isActive ? "bg-gray-700 text-[#F89A28]" : "text-white"
              }`
            }
          >
            <IoMdHome size={24} />
            <span
              className={`transition-opacity duration-300 ${
                isTextVisible ? "block opacity-100" : "hidden opacity-0"
              }`}
            >
              Home
            </span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/purchases"
            className={({ isActive }) =>
              `flex items-center space-x-4 px-[11px] py-3 font-semibold hover:bg-gray-700 rounded-md cursor-pointer ${
                isActive ? "bg-gray-700 text-[#F89A28]" : "text-white"
              }`
            }
          >
            <FaShoppingBag size={24} />
            <span
              className={`transition-opacity duration-300 ${
                isTextVisible ? "block opacity-100" : "hidden opacity-0"
              }`}
            >
              Purchases
            </span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/account-setting"
            className={({ isActive }) =>
              `flex items-center space-x-4 px-[11px] py-3 font-semibold hover:bg-gray-700 rounded-md cursor-pointer ${
                isActive ? "bg-gray-700 text-[#F89A28]" : "text-white"
              }`
            }
          >
            <IoSettings size={24} />
            <span
              className={`transition-opacity duration-300 ${
                isTextVisible ? "block opacity-100" : "hidden opacity-0"
              }`}
            >
              Account & Settings
            </span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/watch-history"
            className={({ isActive }) =>
              `flex items-center space-x-4 px-[11px] py-3 font-semibold hover:bg-gray-700 rounded-md cursor-pointer ${
                isActive ? "bg-gray-700 text-[#F89A28]" : "text-white"
              }`
            }
          >
            <FaClock size={24} />
            <span
              className={`transition-opacity duration-300 ${
                isTextVisible ? "block opacity-100" : "hidden opacity-0"
              }`}
            >
              Watch History
            </span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
