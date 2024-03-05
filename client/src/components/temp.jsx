import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import NavigationBar from "../NavigationBar/NavigationBar"; // Ensure correct import path

function Search() {
  let [searchParams] = useSearchParams();
  const searchText = searchParams.get("query");
  const [results, setResults] = useState({ users: [], books: [] });
  const [activeCategory, setActiveCategory] = useState("users"); // "users" or "books"

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/search?searchTerm=${encodeURIComponent(
            searchText
          )}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Error fetching search data:", error);
      }
    };

    if (searchText) {
      fetchData();
    }
  }, [searchText]);

  return (
    <div className="bg-gray-900 text-white min-h-screen flex">
      <NavigationBar />
      <div className="flex-grow">
        <div className="pt-20">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <h2 className="text-4xl font-semibold mb-4">Search Results for: {searchText}</h2>
            <div className="flex justify-center gap-4 mb-8">
              <button
                onClick={() => setActiveCategory("users")}
                className={`py-2 px-4 ${activeCategory === "users" ? "bg-blue-600" : "bg-gray-700"} rounded-lg`}
              >
                Users
              </button>
              <button
                onClick={() => setActiveCategory("books")}
                className={`py-2 px-4 ${activeCategory === "books" ? "bg-blue-600" : "bg-gray-700"} rounded-lg`}
              >
                Books
              </button>
            </div>
            {activeCategory === "users" && (
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4">Users</h3>
                <div className="grid grid-cols-3 gap-4">
                  {results.users.map((user) => (
                    <div key={user.user_id} className="flex flex-col items-center bg-gray-700 rounded-lg shadow p-4">
                      {/* User Cards */}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeCategory === "books" && (
              <div className="my-8">
                <h3 className="text-2xl font-semibold mb-4">Books</h3>
                <div className="grid grid-cols-3 gap-4">
                  {results.books.map((book) => (
                    <div key={book.book_id} className="bg-gray-800 p-4 mb-4 rounded-lg shadow-lg flex flex-col items-center">
                      {/* Book Cards */}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Chat List Placeholder */}
      {/* ... */}
    </div>
  );
}

export default Search;
