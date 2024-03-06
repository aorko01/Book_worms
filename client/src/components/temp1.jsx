import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const NavigationBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [bookSuggestions, setBookSuggestions] = useState([]);
  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      navigate(`/search?query=${encodeURIComponent(searchText)}`);
    }
  };

  const handleBookSearchChange = async (event) => {
    const query = event.target.value;

    if (!query.trim()) {
      setBookSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=5`
      );
      const data = await response.json();
      setBookSuggestions(data.items || []);
    } catch (error) {
      console.error("Error fetching book suggestions:", error);
      setBookSuggestions([]);
    }
  };

  const handleAddBook = async (book) => {
    const payload = {
      title: book.volumeInfo.title,
      author_name: book.volumeInfo.authors?.join(", ") || "Unknown Author",
      cover_url: book.volumeInfo.imageLinks?.thumbnail,
      genre: book.volumeInfo.categories?.join(", ") || "Unknown Genre",
      page_count: book.volumeInfo.pageCount,
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
        throw new Error("Failed to add book");
      }

      const responseData = await response.json();
      alert("Book added successfully: " + responseData.message);
      // Resetting book search and suggestions after successful addition
      setBookSuggestions([]);
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  return (
    <nav className="bg-gray-800 text-white rounded-3xl p-4" style={{ position: "fixed", width: "100%", top: 0, zIndex: 1000 }}>
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
        <div className="flex items-center">
          {/* Other navigation links */}
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add/Delete Book
          </button>
          {isDropdownOpen && (
            <div className="absolute mt-12 right-0 w-96 bg-white text-black rounded-lg shadow-lg p-4">
              <input
                type="text"
                placeholder="Type book name..."
                className="w-full p-2 mb-4 text-black"
                onChange={handleBookSearchChange}
              />
              {bookSuggestions.map((book) => (
                <div
                  key={book.id}
                  className="flex justify-between items-center p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleAddBook(book)}
                >
                  {book.volumeInfo.title}
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">
                    Add
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
