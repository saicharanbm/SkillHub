import { MdOutlineLogout } from "react-icons/md";
import { IoMdCreate } from "react-icons/io";
import { IoSettings } from "react-icons/io5";
import { AiOutlineHome } from "react-icons/ai";
import { NavLink } from "react-router-dom";
function UserModal({ fullName }: { fullName: string }) {
  return (
    <div className="absolute right-0 my-4 w-64 bg-[rgba(25,30,37,.95)] rounded-md shadow-lg text-white">
      <div className="px-4 py-2 border-b border-gray-600 text-sm">
        <p className="text-lg text-white">
          Hello, <span className="font-bold text-[#F89A28]">{fullName}</span>
        </p>
      </div>
      <div className=" flex flex-col space-y-2 text-sm:text-lg">
        <NavLink
          to={"/"}
          className={({ isActive }) =>
            `px-4 py-2 hover:bg-gray-700 cursor-pointer flex space-x-2 items-center ${
              isActive ? "bg-gray-700 text-[#F89A28]" : ""
            }`
          }
        >
          <AiOutlineHome /> <p>Home</p>
        </NavLink>
        <NavLink
          to={"/create-course"}
          className={({ isActive }) =>
            `px-4 py-2 hover:bg-gray-700 cursor-pointer flex space-x-2 items-center ${
              isActive ? "bg-gray-700 text-[#F89A28]" : ""
            }`
          }
        >
          <IoMdCreate /> <p>Create Course</p>
        </NavLink>
        <NavLink
          to={"/account-setting"}
          className={({ isActive }) =>
            `px-4 py-2 hover:bg-gray-700  cursor-pointer flex space-x-2 items-center ${
              isActive ? "bg-gray-700 text-[#F89A28]" : ""
            }`
          }
        >
          <IoSettings /> <p>Account & Settings</p>
        </NavLink>
      </div>

      <div className="px-4 py-2 border-t border-gray-600">
        <button className="flex space-x-2 items-center hover:text-[#F89A28] cursor-pointer">
          <MdOutlineLogout /> <p>Sign out</p>
        </button>
      </div>
    </div>
  );
}

export default UserModal;
