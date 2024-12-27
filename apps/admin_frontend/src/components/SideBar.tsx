import { useState } from "react";
import {
  AiOutlineMenu,
  AiOutlineHome,
  AiOutlineClockCircle,
} from "react-icons/ai";
import { IoMdCreate } from "react-icons/io";
import { BsChatSquare } from "react-icons/bs";
import { TbLayoutSidebarRightExpandFilled } from "react-icons/tb";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`h-screen bg-[#0A0B11] text-white fixed px-2 left-0 z-50 border-r-[1px] border-[#141920] ${
        isOpen ? "w-64" : "w-16"
      } transition-all duration-300 over`}
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
        {isOpen && <h1 className="text-xl font-semibold">Menu</h1>}
      </div>

      {/* Menu Items */}
      <ul className="mt-6 space-y-4">
        {/* Home */}
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center space-x-4 px-3 py-3 font-semibold hover:bg-gray-700 rounded-md cursor-pointer
              ${isActive ? "bg-gray-700 text-[#F89A28]" : "text-white"}`
            }
          >
            <AiOutlineHome size={24} />
            {isOpen && <span>Home</span>}
          </NavLink>
        </li>

        {/* Create Course */}
        <li>
          <NavLink
            to="/create-course"
            className={({ isActive }) =>
              `flex items-center space-x-4 px-3 py-3 font-semibold hover:bg-gray-700 rounded-md cursor-pointer
              ${isActive ? "bg-gray-700 text-[#F89A28]" : "text-white"}`
            }
          >
            <IoMdCreate size={24} />
            {isOpen && <span>Create Course</span>}
          </NavLink>
        </li>

        {/* Questions (Static) */}
        <li>
          <div className="flex items-center space-x-4 px-4 py-3 hover:bg-gray-700 rounded-md cursor-pointer">
            <BsChatSquare size={24} />
            {isOpen && <span>Questions</span>}
          </div>
        </li>

        {/* Watch History (Static) */}
        <li>
          <div className="flex items-center space-x-4 px-4 py-3 hover:bg-gray-700 rounded-md cursor-pointer">
            <AiOutlineClockCircle size={24} />
            {isOpen && <span>Watch History</span>}
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
