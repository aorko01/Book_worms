import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const NavigationBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isDropdownOpen_for_add_book, setIsDropdownOpen__for_add_book] =
    useState(false);
  const [isNotification, setIsNotification] = useState(false);
  const [isswitch, setIsswitch] = useState(true);
  const [allBooks, setAllBooks] = useState([]);
  const [bookNameInput, setBookNameInput] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [audience, setAudience] = useState("public");
  const [bookRequests, setBookRequests] = useState([]);
  const [booksToReturn, setBooksToReturn] = useState([]);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedRequest2, setSelectedRequest2] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);

  const handleRequestClick = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
    setIsNotification(false);
  };

  const handleRequestClick2 = (request) => {
    setSelectedRequest2(request);
    setShowModal2(true);
    setIsNotification(false);
  };


  const handleModalClose = () => {
    setSelectedRequest(null);
    setShowModal(false);
  };

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3000/books-all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      setAllBooks(data.books);
      console.log("Data fetched:", data.books);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchBookRequests = async () => {
    try {
      const response = await fetch("http://localhost:3000/book-requests", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      setBookRequests(data.bookRequests);
      setBooksToReturn(data.booksToReturn);

      console.log("Book requests fetched:", data.bookRequests);
      console.log("Books to return fetched:", data.booksToReturn);
    } catch (error) {
      console.error("Error fetching book requests:", error);
    }
  };

  // useEffect to call fetchData on component mount
  useEffect(() => {
    fetchData();
    fetchBookRequests();
  }, []);

  const searchGoogleBooks = async (title) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${title}&maxResults=5`
      );
      const data = await response.json();

      if (!data.items) {
        return [];
      }

      return data.items.map((item) => ({
        id: item.id,
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors?.join(", ") || "Unknown Author",
        coverUrl:
          item.volumeInfo.imageLinks?.thumbnail ||
          "../public/photo_2024-02-29_23-38-49.jpg",
        genre: item.volumeInfo.categories?.join(", ") || "Genre not specified",
        pageCount: item.volumeInfo.pageCount || "Page count not available", // Adjust here for page count
        source: "google",
      }));
    } catch (error) {
      console.error("Error searching Google Books:", error);
      return [];
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setBookNameInput(suggestion.title);
    setSelectedBook(suggestion);
    setSuggestions([]);
  };

  const searchLocalBooks = (title) => {
    return allBooks
      .filter((book) => book.title.toLowerCase().includes(title.toLowerCase()))
      .map((book) => ({
        id: book.book_id,
        title: book.title,
        authors: book.author_name,
        coverUrl: book.cover_url || "../public/photo_2024-02-29_23-38-49.jpg",
        genre: book.genre,
        pageCount: book.page_count, // Include page count here
        source: "local",
      }));
  };

  const handleInputChange = async (e) => {
    const input = e.target.value;
    setBookNameInput(input);

    if (!input.trim()) {
      setSuggestions([]);
      return;
    }

    const localSuggestions = searchLocalBooks(input);
    if (localSuggestions.length > 0) {
      setSuggestions(localSuggestions);
    } else {
      const googleSuggestions = await searchGoogleBooks(input);
      setSuggestions(googleSuggestions);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleDropdown_for_add_book = () => {
    setIsDropdownOpen__for_add_book(!isDropdownOpen_for_add_book);
  };

  const toggleNotificaion = () => {
    setIsNotification(!isNotification);
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      navigate(`/search?query=${encodeURIComponent(searchText)}`);
    }
  };

  const AddBook = async () => {
    // Determine if the book has a page count and is not a local book
    const isGoogleBookWithPageCount =
      selectedBook &&
      selectedBook.source === "google" &&
      selectedBook.pageCount !== "Page count not available";

    const payload =
      selectedBook && selectedBook.source === "local"
        ? {
            book_id: selectedBook.id,
            audience: audience, // Update this line to include the audience
          }
        : {
            title: bookNameInput,
            author_name: selectedBook?.authors || "Unknown Author",
            cover_url: selectedBook?.coverUrl || null,
            genre: selectedBook?.genre || "Genre not specified",
            page_count: isGoogleBookWithPageCount
              ? selectedBook.pageCount
              : null,
            audience: audience, // Update this line to include the audience
            book_id: null,
          };

    try {
      const response = await fetch("http://localhost:3000/addbook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      await fetchData(); // Call fetchData again to refresh the data on the page
      // Optionally, reset any states related to the review form here
      // setReviewText("");
      setBookNameInput("");
      setSelectedBook(null);
      setSuggestions([]);
      // Additional code for handling the response and resetting state
    } catch (error) {
      console.error("Error posting review:", error);
    }
  };

  const handleModalAccept = async (request) => {
    try {
      // Send a request to update the acceptance status of the book request
      const response = await fetch("http://localhost:3000/acceptbookrequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          borrower_id: request.borrower_id,
          copy_id: request.copy_id,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Handle success response if needed
      console.log("Book request accepted successfully");

      // Close the modal and reset selectedRequest state
    } catch (error) {
      console.error("Error accepting book request:", error);
      // Handle error if needed
    }
  };

  const handleReturnBook = async (request) => {
    try {
      const response = await fetch("http://localhost:3000/return-book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sharing_id: request.sharing_id,
        }),
        credentials: "include",
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      // Handle success response if needed
      console.log("Book returned successfully");
  
      // Close the modal and reset selectedRequest2 state
      setShowModal2(false);
      setSelectedRequest2(null);
    } catch (error) {
      console.error("Error returning book:", error);
      // Handle error if needed
    }
  };
  

  const handleLogout = async () => {
    // try {
    //   const response = await fetch("http://localhost:3000/logout", {
    //     method: "GET",
    //     credentials: "include",
    //   });
    //   if (response.ok) {
    //     navigate("/login");
    //   } else {
    //     throw new Error("Logout failed");
    //   }
    // } catch (error) {
    //   console.error("Error during logout:", error);
    // }
    navigate("/");
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
          <div className="relative mr-4">
            <button className="text-white" onClick={toggleNotificaion}>
              Notification
            </button>
            {isNotification && (
              <div className="absolute left-0 mt-2 w-72 bg-gray-700 rounded-xl shadow-lg py-1 text-white flex flex-col items-center px-4">
                <div className="w-full flex justify-between items-center">
                  <div className="text-lg font-bold">Notifications</div>
                </div>
                <ul className="w-full mt-4 flex flex-col items-start">
                  {bookRequests.map((request) => (
                    <li
                      key={request.copy_id}
                      className="p-2 hover:bg-gray-600 cursor-pointer text-lg border-2 border-gray-600 w-full"
                      onClick={() => handleRequestClick(request)}
                    >
                      {`Request for ${request.title} from ${request.last_name} ${request.borrow_days} days`}
                    </li>
                  ))}
                  {booksToReturn.map((request) => (
                    <li
                      key={request.copy_id}
                      className="p-2 hover:bg-gray-600 cursor-pointer text-lg border-2 border-gray-600 w-full"
                      onClick={() => handleRequestClick2(request)}
                    >
                      {`Return ${request.title} `}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

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
                      isswitch ? "bg-green-500" : "bg-red-500"
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
                      value={bookNameInput}
                      onChange={handleInputChange}
                    />
                    {suggestions.length > 0 && (
                      <ul className="bg-gray-700 text-white rounded-xl">
                        {suggestions.map((suggestion) => (
                          <li
                            key={suggestion.id}
                            className="p-2 hover:bg-gray-600 cursor-pointer"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion.title}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="flex justify-between w-3/4">
                      <span className="text-sm mr-2">Share with:</span>
                      <select
                        className="bg-gray-600 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={audience}
                        onChange={(e) => setAudience(e.target.value)}
                      >
                        <option value="friends">Friends</option>
                        <option value="group">Group</option>
                        <option value="public">Public</option>
                      </select>
                    </div>
                    <button
                      className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl w-3/4 transition duration-300 ease-in-out mb-5"
                      onClick={AddBook}
                    >
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
      {showModal && selectedRequest && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-700 rounded-lg p-8">
            <h2 className="text-xl font-bold mb-4">Book Request</h2>
            {selectedRequest.acceptance ? (
              <p>
                You accepted the request for "{selectedRequest.title}" from{" "}
                {selectedRequest.first_name} {selectedRequest.last_name}.
              </p>
            ) : (
              <p>
                {selectedRequest.first_name} {selectedRequest.last_name} is
                asking for "{selectedRequest.title}" book for{" "}
                {selectedRequest.borrow_days} days.
              </p>
            )}
            <div className="mt-4 flex justify-end">
              {!selectedRequest.acceptance && (
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
                  onClick={() => {
                    handleModalAccept(selectedRequest);
                    handleModalClose();
                  }}
                >
                  Accept
                </button>
              )}
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md"
                onClick={() => {
                  handleModalClose();
                }}
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )}
      {showModal2 && selectedRequest2 && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-700 rounded-lg p-8">
            <h2 className="text-xl font-bold mb-4">Book Return</h2>
            <p>
              You have to return "{selectedRequest2.title}" book 
            </p>
            <div className="mt-4 flex justify-end">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md"
                onClick={() => {
                  handleReturnBook(selectedRequest2);
                  handleModalClose();
                }}
              >
                Return
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavigationBar;
