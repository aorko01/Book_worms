import React, { useState } from "react";
import { NavLink, useNavigate } from 'react-router-dom';

const NavigationBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      navigate(`/search?query=${encodeURIComponent(searchText)}`);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3000/logout', {
        method: 'GET',
        credentials: 'include',
      });
      if (response.ok) {
        navigate('/login');
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <nav
      className="bg-gray-800 text-white rounded-3xl p-4"
      style={{ position: "fixed", width: "100%", top: 0, zIndex: 1000 }}
    >
      <div className="flex justify-between items-center">
        <div>
          <input
            type="text"
            placeholder="Search..."
            className="bg-gray-700 text-white rounded-xl px-4 py-2 focus:outline-none focus:bg-gray-600"
            value={searchText}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="flex justify-center flex-grow">
          <ul className="flex space-x-8">
            <li>
              <NavLink to="/home" className={({ isActive }) => isActive ? "text-orange-700" : "text-white"}>
                Home
              </NavLink>
            </li>
            {/* Other links remain unchanged */}
          </ul>
        </div>
        <div className="flex items-center">
          <NavLink to="/notifications" className={({ isActive }) => isActive ? "text-orange-700 mr-4" : "text-white mr-4"}>
            Notifications
          </NavLink>
          <div className="relative">
            <button className="text-white" onClick={toggleDropdown}>
              Dropdown
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 text-black">
                {/* Other navigation links */}
                <div className="px-4 py-2">
                  <input
                    type="text"
                    placeholder="Search in dropdown..."
                    className="bg-gray-200 text-black rounded-md px-4 py-2 w-full"
                    // No onChange handler for now as specified
                  />
                </div>
                <NavLink to="/add-book" className="block px-4 py-2 hover:bg-gray-200">
                  Add Book
                </NavLink>
                <NavLink to="/delete-book" className="block px-4 py-2 hover:bg-gray-200">
                  Delete Book
                </NavLink>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-200">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
