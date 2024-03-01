import React, { useState, useEffect } from "react";
import NavigationBar from "../NavigationBar/NavigationBar";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [friends, setFriends] = useState([]);
  const [groups, setGroups] = useState([]);
  const [bookNameInput, setBookNameInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/Home", {
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
        setBooks(data.books);
        setReviews(data.reviews);
        setFriends(data.friends);
        setGroups(data.groups);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const searchBooks = async (title) => {
    if (!title.trim()) {
      setSuggestions([]);
      return;
    }

    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${title}&maxResults=5`
    );
    const data = await response.json();

    if (!data.items) {
      setSuggestions([]);
      return;
    }

    const books = data.items.map((item) => ({
      id: item.id,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors?.join(", ") || "Unknown Author",
      coverUrl:
        item.volumeInfo.imageLinks?.thumbnail ||
        "../public/photo_2024-02-29_23-38-49.jpg",
      genre: item.volumeInfo.categories?.join(", ") || "Genre not specified",
    }));

    setSuggestions(books);
  };

  const handleInputChange = (e) => {
    const input = e.target.value;
    setBookNameInput(input);
    searchBooks(input);
  };

  const handleSuggestionClick = (title) => {
    setBookNameInput(title);
    setSuggestions([]);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <NavigationBar />

      <div className="flex justify-between my-10 mx-10 pt-[4rem]">
        <div className="w-1/4 pr-4 border-r border-gray-700">
          {/* Your existing book rendering logic here */}
        </div>

        <div className="w-1/2 px-4">
          <h2 className="text-3xl font-semibold mb-7">Write Review</h2>
          <div className="mb-4 p-6 bg-gray-800 rounded-lg shadow-lg">
            <input
              type="text"
              placeholder="Book Name"
              className="bg-gray-700 text-white rounded-xl px-4 py-2 focus:outline-none focus:bg-gray-600 mb-5"
              value={bookNameInput}
              onChange={handleInputChange}
            />
            {suggestions.length > 0 && (
              <ul className="bg-gray-700 text-white rounded-xl">
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion.id}
                    className="p-2 hover:bg-gray-600 cursor-pointer"
                    onClick={() => handleSuggestionClick(suggestion.title)}
                  >
                    {suggestion.title}
                  </li>
                ))}
              </ul>
            )}
            <textarea
              placeholder="Write your review here..."
              className="w-full bg-gray-700 text-white rounded-xl px-4 py-2 focus:outline-none focus:bg-gray-600 mb-5"
              style={{ minHeight: "100px" }}
            ></textarea>
            <button className="w-full bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-xl transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
              Post Review
            </button>
          </div>
          {/* Your existing review rendering logic here */}
        </div>

        <div className="w-1/5 pl-4 border-l border-gray-700">
          {/* Any additional UI components like Chat List */}
        </div>
      </div>
    </div>
  );
};

export default Home;
