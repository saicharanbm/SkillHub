import { useState } from "react";
import {
  AiOutlineMenu,
  AiOutlineHome,
  AiOutlineClockCircle,
} from "react-icons/ai";
import { BsBookmark, BsChatSquare } from "react-icons/bs";
import { TbLayoutSidebarRightExpandFilled } from "react-icons/tb";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`h-screen bg-[#141920] text-white fixed top-0 left-0 z-50 ${
        isOpen ? "w-64" : "w-16"
      } transition-all duration-300`}
    >
      {/* Toggle Button */}
      <div className="flex items-center space-x-4 px-4 py-4">
        <button
          onClick={toggleSidebar}
          className="text-white hover:bg-gray-700 p-2 rounded-md"
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
          <div className="flex items-center space-x-4 px-4 py-3 hover:bg-gray-700 rounded-md cursor-pointer">
            <AiOutlineHome size={24} />
            {isOpen && <span>Home</span>}
          </div>
        </li>

        {/* Bookmarks */}
        <li>
          <div className="flex items-center space-x-4 px-4 py-3 hover:bg-gray-700 rounded-md cursor-pointer">
            <BsBookmark size={24} />
            {isOpen && <span>Bookmarks</span>}
          </div>
        </li>

        {/* Questions */}
        <li>
          <div className="flex items-center space-x-4 px-4 py-3 hover:bg-gray-700 rounded-md cursor-pointer">
            <BsChatSquare size={24} />
            {isOpen && <span>Questions</span>}
          </div>
        </li>

        {/* Watch History */}
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
