import React, { useState, useEffect } from "react";
import NavigationBar from "../NavigationBar/NavigationBar";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [friends, setFriends] = useState([]);
  const [groups, setGroups] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
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
        setAllBooks(data.allBooks); // Assuming this endpoint also provides allBooks data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const searchLocalBooks = (title) => {
    return allBooks.filter((book) =>
      book.title.toLowerCase().includes(title.toLowerCase())
    ).map((book) => ({
      id: book.book_id,
      title: book.title,
      authors: book.author_name,
      coverUrl: book.cover_url || "../public/photo_2024-02-29_23-38-49.jpg",
      genre: book.genre,
    }));
  };

  const searchGoogleBooks = async (title) => {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${title}&maxResults=5`);
    const data = await response.json();
    if (!data.items) {
      return [];
    }
    return data.items.map((item) => ({
      id: item.id,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors?.join(", ") || "Unknown Author",
      coverUrl: item.volumeInfo.imageLinks?.thumbnail || "../public/photo_2024-02-29_23-38-49.jpg",
      genre: item.volumeInfo.categories?.join(", ") || "Genre not specified",
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

  const handleSuggestionClick = (title) => {
    setBookNameInput(title);
    setSuggestions([]);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <NavigationBar />
      <div className="flex justify-between my-10 mx-10 pt-[4rem]">
        {/* Book Display Section */}
        <div className="w-1/4 pr-4 border-r border-gray-700">
          <h2 className="text-3xl font-semibold mb-7">Available Books</h2>
          {books.map((book) => (
            <div
              className="bg-gray-800 p-4 mb-4 rounded-lg shadow-lg flex flex-col items-center"
              key={book.book_id}
            >
              <img
                className="rounded-lg mb-2"
                src={book.cover_url || "../public/photo_2024-02-29_23-38-49.jpg"}
                alt={book.title}
                style={{ width: "80%" }}
              />
              <div className="mb-2 flex text-2xl justify-center">
                {book.title}
              </div>
              <div className="mb-2 flex text-xl justify-center">
                {book.author_name}
              </div>
              <div className="mb-2 flex justify-center text-lg">
                {book.genre}
              </div>
            </div>
          ))}
        </div>

        {/* Review Writing Section */}
        <div className="w-1/2 px-4">
          <h2 className="text-3xl font-semibold mb-7">Write Review</h2>
          <div className="mb-4 p-6 bg-gray-800 rounded-lg shadow-lg">
            <input
              type="text"
              placeholder="Book Name"
              className="bg-gray-700 text-white rounded-xl px-4 py-2 focus:outline-none focus:bg-gray-600 mb-5 w-full"
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
            {/* Additional inputs for review submission not shown for brevity */}
          </div>
          {/* Review display logic not shown for brevity */}
        </div>

        {/* Additional UI components like chat list */}
        <div className="w-1/5 pl-4 border-l border-gray-700">
          <h2 className="text-3xl font-semibold mb-6">Chat List</h2>
          {/* Chat list UI not shown for brevity */}
        </div>
      </div>
    </div>
  );
};

export default Home;
