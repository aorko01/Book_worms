import React, { useEffect, useState } from "react";
import { useSearchParams,useNavigate } from "react-router-dom";
import NavigationBar from "../NavigationBar/NavigationBar"; // Ensure correct import path

function Search() {
  let [searchParams] = useSearchParams();
  const searchText = searchParams.get("query");
  const [results, setResults] = useState({ users: [], books: [] });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/search?searchTerm=${encodeURIComponent(
            searchText
          )}`,
          {
            method: "GET",
            credentials: "include", // Important for sending cookies over cross-origin requests
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

  const handleViewProfile = (toUserId) => {
    navigate(`/otherprofile/${toUserId}`);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex">
      <NavigationBar />
      <div className="flex-grow">
        <div className="pt-20">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <h2 className="text-4xl font-semibold mb-4">
              Search Results for: {searchText}
            </h2>
            {/* Users Section */}
            {results.users.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4">Users</h3>
                <div className="grid grid-cols-3 gap-4">
                  {results.users.map((user) => (
                    <div
                      key={user.user_id}
                      className="flex flex-col items-center bg-gray-700 rounded-lg shadow p-4"
                    >
                      <div className="aspect-w-1 aspect-h-1 w-full flex items-center justify-center bg-gray-700 rounded-lg overflow-hidden">
                        <img
                          src={
                            user.avatar ||
                            "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=338&ext=jpg"
                          }
                          alt="Profile"
                          className="object-cover rounded-full"
                        />
                      </div>
                      <div className="mt-2 text-center">
                        <p className="font-semibold text-white text-xl">
                          {user.first_name} {user.last_name}
                        </p>
                        <p>{user.email_address}</p>
                      </div>
                      <div className="mt-5 flex gap-2">
                        <button
                          className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-1 px-2 rounded"
                          onClick={() => handleViewProfile(user.user_id)}
                        >
                          View Profile
                        </button>
                        
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Books Section */}
            {results.books.length > 0 && (
              <div className="my-8">
                <h3 className="text-2xl font-semibold mb-4">Books</h3>
                <div className="grid grid-cols-3 gap-4">
                  {results.books.map((book) => (
                    <div
                      key={book.book_id}
                      className="bg-gray-800 p-4 mb-4 rounded-lg shadow-lg flex flex-col items-center"
                    >
                      <img
                        className="rounded-lg mb-2"
                        src={
                          book.cover_url || "https://via.placeholder.com/150"
                        }
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
                      <div className="mb-2 flex justify-center text-lg">
                        Pages: {book.page_count}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Show "No matches found" message if both users and books arrays are empty */}
            {results.users.length === 0 && results.books.length === 0 && (
              <div className="text-2xl font-semibold text-red-500">
                No matches found
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Chat List Placeholder */}
      <div className="w-1/4 pl-4 border-l border-gray-700 mt-32">
        <h2 className="text-4xl font-semibold mb-6">Chat List</h2>
        <div className="flex flex-col gap-4">
          {/* Placeholder Chat Entries */}
          <div className="bg-gray-700 rounded-lg shadow p-4">
            <p className="font-semibold">Chat 1</p>
          </div>
          <div className="bg-gray-700 rounded-lg shadow p-4">
            <p className="font-semibold">Chat 2</p>
          </div>
          <div className="bg-gray-700 rounded-lg shadow p-4">
            <p className="font-semibold">Chat 3</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;
