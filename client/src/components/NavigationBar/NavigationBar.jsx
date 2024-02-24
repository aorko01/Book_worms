import React from "react";
// import { Link, NavLink } from "react-router-dom";

const NavigationBar = () => {
  return (
    <nav className="bg-gray-800 text-white rounded-3xl p-4 ">
      <div className="flex justify-between items-center">
        {/* Search input field */}
        <div>
          <input
            type="text"
            placeholder="Search..."
            className="bg-gray-700 text-white rounded-xl px-4 py-2 focus:outline-none focus:bg-gray-600"
          />
        </div>
       
      </div>
    </nav>
  );
};

export default NavigationBar;
