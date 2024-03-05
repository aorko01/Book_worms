import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const NavigationBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [bookName, setBookName] = useState("");
  const [bookSuggestions, setBookSuggestions] = useState([]);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleBookNameChange = async (event) => {
    const bookNameInput = event.target.value;
    setBookName(bookNameInput);

    if (!bookNameInput.trim()) {
      setBookSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          bookNameInput
        )}&maxResults=5`
      );
      const data = await response.json();
      setBookSuggestions(data.items || []);
    } catch (error) {
      console.error("Error fetching book data:", error);
    }
  };

  const handleAddBook = async (book) => {
    // Modify this part to match the structure of your API and database
    const payload = {
      title: book.volumeInfo.title,
      author_name: book.volumeInfo.authors?.join(", "),
      cover_url: book.volumeInfo.imageLinks?.thumbnail,
      genre: book.volumeInfo.categories?.join(", "),
      page_count: book.volumeInfo.pageCount,
    };

    try {
      const response = await fetch('http://localhost:3000/addbook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to add book');
      }

      const responseData = await response.json();
      alert('Book added successfully');
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  return (
    // Existing navigation code...
    // Dropdown for Add/Delete Book
    {isDropdownOpen && (
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 text-black">
        <input
          type="text"
          placeholder="Add Book Name"
          className="block w-full text-black px-4 py-2"
          value={bookName}
          onChange={handleBookNameChange}
        />
        {bookSuggestions.map((book) => (
          <div
            key={book.id}
            className="flex justify-between items-center px-4 py-2 hover:bg-gray-200 cursor-pointer"
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
  );
};

export default NavigationBar;
