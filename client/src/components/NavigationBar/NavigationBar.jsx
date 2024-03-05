import React, { useState } from "react";
import { NavLink, useNavigate } from 'react-router-dom';

const NavigationBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState(''); // State to hold search text
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Update the search text state on input change
  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  // Navigate to /search route with search text as query parameter on Enter key press
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      navigate(`/search?query=${encodeURIComponent(searchText)}`);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3000/logout', {
        method: 'GET',
        credentials: 'include', // Important for sending cookies over cross-origin requests
      });
      if (response.ok) {
        // Assuming the backend clears the authentication cookie or token
        navigate('/login');
        // console.log('reached'); // Redirect to login page after successful logout
      } else {
        throw new Error('Logout failed');
        console.log('reached');
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
            value={searchText} // Bind input value to state
            onChange={handleSearchChange} // Update state on change
            onKeyDown={handleKeyDown} // Handle Enter key press
          />
        </div>
        <div className="flex justify-center flex-grow">
          <ul className="flex space-x-8">
            <li>
              <NavLink to="/home" className={({ isActive }) => isActive ? "text-orange-700" : "text-white"}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/books" className={({ isActive }) => isActive ? "text-orange-700" : "text-white"}>
                Books
              </NavLink>
            </li>
            <li>
              <NavLink to="/friends" className={({ isActive }) => isActive ? "text-orange-700" : "text-white"}>
                Friends
              </NavLink>
            </li>
            <li>
              <NavLink to="/groups" className={({ isActive }) => isActive ? "text-orange-700" : "text-white"}>
                Groups
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="flex items-center">
          <NavLink to="/notifications" className={({ isActive }) => isActive ? "text-orange-700 mr-4" : "text-white mr-4"}>
            Notifications
          </NavLink>
          <NavLink to="/add-book" className={({ isActive }) => isActive ? "text-orange-700 mr-4" : "text-white mr-4"}>
            Add/delete Book
          </NavLink>
          <div className="relative">
            <button className="text-white" onClick={toggleDropdown}>
              Dropdown
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 text-black">
                <NavLink to="/profile" className="block px-4 py-2 hover:bg-gray-200">
                  Profile
                </NavLink>
                <NavLink to="/settings" className="block px-4 py-2 hover:bg-gray-200">
                  Settings
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
