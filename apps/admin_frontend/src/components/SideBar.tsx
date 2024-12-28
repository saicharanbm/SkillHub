import {
  AiOutlineMenu,
  AiOutlineHome,
  AiOutlineClockCircle,
} from "react-icons/ai";
import { IoMdCreate } from "react-icons/io";
import { IoSettings } from "react-icons/io5";

import { TbLayoutSidebarRightExpandFilled } from "react-icons/tb";
import { NavLink } from "react-router-dom";

const Sidebar = ({
  isOpen,
  toggleSidebar,
}: {
  isOpen: boolean;
  toggleSidebar: () => void;
}) => {
  return (
    <div
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
          <span className="text-xl font-semibold transition-opacity duration-300 opacity-100">
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
            <AiOutlineHome size={24} />
            {isOpen && <span>Home</span>}
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/create-course"
            className={({ isActive }) =>
              `flex items-center space-x-4 px-[11px] py-3 font-semibold hover:bg-gray-700 rounded-md cursor-pointer ${
                isActive ? "bg-gray-700 text-[#F89A28]" : "text-white"
              }`
            }
          >
            <IoMdCreate size={24} />
            {isOpen && <span>Create Course</span>}
          </NavLink>
        </li>

        <li>
          <div className="flex items-center space-x-4 px-[11px] py-3 hover:bg-gray-700 rounded-md cursor-pointer">
            <IoSettings size={24} />
            {isOpen && <span>Account & Settings</span>}
          </div>
        </li>

        <li>
          <div className="flex items-center space-x-4 px-[11px] py-3 hover:bg-gray-700 rounded-md cursor-pointer">
            <AiOutlineClockCircle size={24} />
            {isOpen && <span>Watch History</span>}
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
