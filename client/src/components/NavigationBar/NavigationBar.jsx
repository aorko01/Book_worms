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
      console.log('Search for:', searchText);
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
        {/* Navlinks */}
        <div className="flex justify-center flex-grow">
          <ul className="flex space-x-8">
            <li>
              <NavLink
                to="/books"
                className="text-white"
                activeClassName="text-orange-700"
              >
                Books
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/friends"
                className="text-white"
                activeClassName="text-orange-700"
              >
                Friends
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/groups"
                className="text-white"
                activeClassName="text-orange-700"
              >
                Groups
              </NavLink>
            </li>
          </ul>
        </div>
        {/* Notifications and Add Book */}
        <div className="flex items-center">
          <NavLink
            to="/notifications"
            className="text-white mr-4"
            activeClassName="text-orange-700"
          >
            Notifications
          </NavLink>
          <NavLink
            to="/add-book"
            className="text-white mr-4"
            activeClassName="text-orange-700"
          >
            Add Book
          </NavLink>
          {/* Dropdown Box */}
          <div className="relative" onBlur={() => setIsDropdownOpen(false)}>
            <button className="text-white" onClick={toggleDropdown}>
              Dropdown
              {/* You can use an SVG icon for dropdown arrow here */}
            </button>
            {/* Dropdown Content */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1">
                <NavLink
                  to="/profile"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                >
                  Profile
                </NavLink>
                <NavLink
                  to="/settings"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                >
                  Settings
                </NavLink>
                <NavLink
                  to="/logout"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                >
                  Logout
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
