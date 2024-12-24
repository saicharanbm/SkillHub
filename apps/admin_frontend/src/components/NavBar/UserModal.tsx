import React from "react";

function UserModal() {
  return (
    <div className="absolute right-0 mt-2 w-64 bg-[rgba(25,30,37,.95)] rounded-md shadow-lg text-white">
      <div className="px-4 py-2 border-b border-gray-600 text-sm">
        <p>Your Account</p>
      </div>
      <ul className="py-2">
        <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Help</li>
        <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">
          Watch Anywhere
        </li>
        <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">
          Account & Settings
        </li>
        <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Sign out</li>
      </ul>
      <div className="px-4 py-2 border-t border-gray-600 text-sm">
        <p>Profiles</p>
      </div>
      <ul className="py-2">
        <li className="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer">
          <img
            src="https://via.placeholder.com/24"
            alt="new year"
            className="w-6 h-6 rounded-full mr-2"
          />
          <span>New Year</span>
        </li>
        <li className="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer">
          <img
            src="https://via.placeholder.com/24"
            alt="mane nayi"
            className="w-6 h-6 rounded-full mr-2"
          />
          <span>Mane Nayi</span>
        </li>
        <li className="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer">
          <img
            src="https://via.placeholder.com/24"
            alt="kids"
            className="w-6 h-6 rounded-full mr-2"
          />
          <span>Kids</span>
        </li>
        <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">
          + Add new
        </li>
      </ul>
      <div className="px-4 py-2 border-t border-gray-600">
        <p className="text-sm cursor-pointer hover:underline">
          Manage profiles
        </p>
        <p className="text-sm cursor-pointer hover:underline">Learn more</p>
      </div>
    </div>
  );
}

export default UserModal;
