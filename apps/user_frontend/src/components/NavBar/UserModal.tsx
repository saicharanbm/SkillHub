import { MdOutlineLogout } from "react-icons/md";
import { IoMdHome } from "react-icons/io";
import { IoSettings } from "react-icons/io5";
import { FaShoppingBag } from "react-icons/fa";
import { FaClock } from "react-icons/fa6";

import { NavLink } from "react-router-dom";
import { useLogoutMutation } from "../../services/mutations";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function UserModal({ fullName }: { fullName: string }) {
  const navigate = useNavigate();
  const { mutateAsync: logout } = useLogoutMutation();
  const handleLogout = () => {
    toast.promise(logout(), {
      pending: "Logging out...",
      success: {
        render() {
          navigate("/login");
          return "Logout successful!";
        },
      },
      error: {
        render({ data }: { data: string }) {
          console.log(data);
          return (data as string) || "Logout failed!";
        },
      },
    });
  };

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
            `px-4 py-2 hover:text-[#F89A28] cursor-pointer flex space-x-2 items-center ${
              isActive && "bg-gray-700 text-[#F89A28] font-semibold"
            }`
          }
        >
          <IoMdHome className="text-xl" /> <p>Home</p>
        </NavLink>
        <NavLink
          to={"/Purchases"}
          className={({ isActive }) =>
            `px-4 py-2 hover:text-[#F89A28] cursor-pointer flex space-x-2 items-center ${
              isActive && "bg-gray-700 text-[#F89A28] font-semibold"
            }`
          }
        >
          <FaShoppingBag /> <p>Purchases</p>
        </NavLink>
        <NavLink
          to={"/account-setting"}
          className={({ isActive }) =>
            `px-4 py-2 hover:text-[#F89A28] cursor-pointer flex space-x-2 items-center ${
              isActive && "bg-gray-700 text-[#F89A28] font-semibold"
            }`
          }
        >
          <IoSettings /> <p>Account & Settings</p>
        </NavLink>
        <NavLink
          to={"/watch-history"}
          className={({ isActive }) =>
            `px-4 py-2 hover:text-[#F89A28] cursor-pointer flex space-x-2 items-center ${
              isActive && "bg-gray-700 text-[#F89A28] font-semibold"
            }`
          }
        >
          <FaClock /> <p>Watch History</p>
        </NavLink>
      </div>

      <div className="px-4 py-2 border-t border-gray-600">
        <button
          onClick={handleLogout}
          className="flex space-x-2 items-center hover:text-[#F89A28] cursor-pointer"
        >
          <MdOutlineLogout /> <p>Sign out</p>
        </button>
      </div>
    </div>
  );
}

export default UserModal;
