import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const NavigationBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isDropdownOpen_for_add_book, setIsDropdownOpen__for_add_book] =
    useState(false);

  const [isswitch, setIsswitch] = useState(true);

  
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleDropdown_for_add_book = () => {
    setIsDropdownOpen__for_add_book(!isDropdownOpen_for_add_book);
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      navigate(`/search?query=${encodeURIComponent(searchText)}`);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/logout", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        navigate("/login");
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
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
              <NavLink
                to="/home"
                className={({ isActive }) =>
                  isActive ? "text-orange-700" : "text-white"
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/books"
                className={({ isActive }) =>
                  isActive ? "text-orange-700" : "text-white"
                }
              >
                Books
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/friends"
                className={({ isActive }) =>
                  isActive ? "text-orange-700" : "text-white"
                }
              >
                Friends
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/groups"
                className={({ isActive }) =>
                  isActive ? "text-orange-700" : "text-white"
                }
              >
                Groups
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="flex items-center">
          <NavLink
            to="/notifications"
            className={({ isActive }) =>
              isActive ? "text-orange-700 mr-4" : "text-white mr-4"
            }
          >
            Notifications
          </NavLink>
          <div className="relative mr-4">
            <button
              className="text-white"
              onClick={toggleDropdown_for_add_book}
            >
              Add/Delete
            </button>
            {isDropdownOpen_for_add_book && (
              // <div className="absolute  right-0 mt-6 ">

              <div className="absolute top-4 right-0 mt-2 w-96 bg-gray-700 bg-opacity-90 rounded-xl shadow-lg py-1 text-white flex flex-col items-center px-4">
              <div className="w-full flex justify-between items-center">
                <div className="text-lg font-bold ">
                  {isswitch ? "Add Book" : "Delete Book"}
                </div>
            
                <div
                  onClick={() => setIsswitch(!isswitch)}
                  className={`flex w-12 h-6 items-center rounded-full p-1 cursor-pointer ${
                    isswitch ? "bg-green-500" : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`block h-4 w-4 bg-white rounded-full transition-transform duration-300 ${
                      isswitch ? "transform translate-x-6" : ""
                    }`}
                  />
                </div>
              </div>
              
              {isswitch && (
                <div className="w-full mt-4 flex flex-col items-center">
                  <input
                    type="text"
                    placeholder="Book Name"
                    className="bg-gray-600 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 w-3/4"
                  />
                  <div className="flex justify-between w-3/4">
                    <span className="text-sm mr-2">Share with:</span>
                    <select className="bg-gray-600 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="friends">Friends</option>
                      <option value="group">Group</option>
                      <option value="public">Public</option>
                    </select>
                  </div>
                  <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl w-3/4 transition duration-300 ease-in-out mb-5">
                    Add Book
                  </button>
                </div>
              )}
            </div>
            
              // </div>
            )}
          </div>

          {/* <NavLink to="/add-book" className={({ isActive }) => isActive ? "text-orange-700 mr-4" : "text-white mr-4"}>
            Add/delete Book
          </NavLink> */}
          <div className="relative">
            <button className="text-white" onClick={toggleDropdown}>
              Dropdown
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 text-black">
                <NavLink
                  to="/profile"
                  className="block px-4 py-2 hover:bg-gray-200"
                >
                  Profile
                </NavLink>
                <NavLink
                  to="/settings"
                  className="block px-4 py-2 hover:bg-gray-200"
                >
                  Settings
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                >
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
