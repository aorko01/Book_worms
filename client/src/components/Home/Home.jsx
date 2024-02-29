import React, { useState, useEffect } from "react";
import NavigationBar from "../NavigationBar/NavigationBar";

const Home = () => {
  const [books, setBooks] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/Home", {
          method: 'GET', 
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json(); // Parse the JSON response
        setBooks(data.books); // Update state with the books data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Call the function to fetch data
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <NavigationBar />

      <div className="flex justify-between my-10 mx-10 pt-[4rem]">
        {/* Left Division - Book Suggestions */}
        <div className="w-1/4 pr-4 border-r border-gray-700">
          <h2 className="text-3xl font-semibold mb-7">Book Suggestions</h2>
          {books.map((book) => (
            <div className="bg-gray-800 p-4 mb-4 rounded-lg shadow-lg flex flex-col items-center">
              <img
                className="rounded-lg mb-2"
                src={book.image || "http://books.google.com/books/content?id=Jrx6EAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"}
                alt=""
                style={{ width: "80%" }}
              />
              <div className="mb-2 flex text-2xl justify-center">{book.title}</div>
              <div className="mb-2 flex text-xl justify-center">{book.author_name}</div>
              <div className="mb-2 flex justify-center text-lg">{book.genre}</div>
            </div>
          ))}
        </div>

        {/* Middle Division */}
        <div className="w-1/2 px-4">
          {/* Write Review Section */}
          <div>
            <h2 className="text-3xl font-semibold mb-7">Write Review</h2>
            <div className="mb-4 p-6 bg-gray-800 rounded-lg shadow-lg">
              <input
                type="text"
                placeholder="Book Name"
                className="bg-gray-700 text-white rounded-xl px-4 py-2 focus:outline-none focus:bg-gray-600 mb-5"
              />
              <textarea
                placeholder="Write your review here..."
                className="w-full bg-gray-700 text-white rounded-xl px-4 py-2 focus:outline-none focus:bg-gray-600 mb-5"
                style={{ minHeight: "100px" }}
              ></textarea>
              <button className="w-full bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-xl transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
                Post Review
              </button>
            </div>
          </div>

          {/* Review Section */}
          <div className="mt-8">
            <h2 className="text-3xl font-semibold mb-7">Review Section</h2>
            <div className="flex my-4 p-6 bg-gray-800 rounded-lg shadow-lg">
              <div className="w-1/4">
                <img
                  className="rounded-lg"
                  src="http://books.google.com/books/content?id=Jrx6EAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api" // Placeholder image URL
                  alt="Review Visual"
                  style={{ width: "100%" }}
                />
                <div className="text-center text-lg mt-2">Book Title</div>
              </div>
              <div className="w-3/4 pl-4 flex flex-col">
                <div className="mb-4 text-white text-lg mb-10 mt-3">
                  "This book was a fascinating journey through the complexities of space-time. Highly recommended for anyone interested in science fiction."
                </div>
                <div className="flex items-center mb-6">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                  >
                    Upvote
                  </button>
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    className="flex-grow bg-gray-700 text-white rounded-xl px-4 py-2 focus:outline-none focus:bg-gray-600 mr-2"
                  />
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                  >
                    Comment
                  </button>
                </div>
                <div className="bg-gray-700 rounded-xl p-4">
                  <div className="text-white mb-2">"Great review, totally agree!"</div>
                  {/* Placeholder for additional comments */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Division - Chat List */}
        <div className="w-1/5 pl-4 border-l border-gray-700">
          <h2 className="text-3xl font-semibold mb-6">Chat List</h2>
          {/* Placeholder for chat list content */}
        </div>
      </div>
    </div>
  );
};

export default Home;
