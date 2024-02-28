import React from "react";
import NavigationBar from "../NavigationBar/NavigationBar";

const Home = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <NavigationBar />

      <div className="flex justify-between my-10 mx-10 pt-[4rem]" style={{ paddingTop: '4rem' }}> {/* Adjust this padding value based on the actual height of your navigation bar */}
        {/* Left Division - Book Suggestions */}
        <div className="w-1/4 pr-4 border-r border-gray-700">
          <h2 className="text-3xl font-semibold mb-7">Book Suggestions</h2>
          <div className="bg-gray-800 p-4 mb-4 rounded-lg shadow-lg flex flex-col items-center">
            <img
              className="rounded-lg mb-2"
              src="http://books.google.com/books/content?id=Jrx6EAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
              alt=""
              style={{ width: "80%" }}
            />
            <div className="mb-2 flex text-2xl justify-center">Book Title</div>
            <div className="mb-2 flex text-xl justify-center">Author Name</div>
            <div className="mb-2 flex justify-center text-lg">Genre</div>
          </div>
        </div>

        {/* Middle Division - Write Review Section */}
        <div className="w-1/2 px-4 ">
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
              style={{ minHeight: '100px' }} // Adjusted the minHeight to make the height smaller
            ></textarea>
            <button
              className="w-full bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-xl transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
            >
              Post Review
            </button>
          </div>
        </div>

        {/* Right Division - Chat List */}
        <div className="w-1/5 pl-4 border-l border-gray-700">
          <h2 className="text-3xl font-semibold mb-6">Chat List</h2>
          <div className="bg-gray-800 p-4 mb-4 rounded-lg shadow-lg">
            {/* Chat list content */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
