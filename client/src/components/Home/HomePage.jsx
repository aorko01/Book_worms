import React from 'react';
import NavigationBar from '../NavigationBar/NavigationBar';

const HomePage = () => {
  return (
    <div>
    {/* Include the NavigationBar component */}
    <NavigationBar />

    <div className="container mx-auto px-4 flex mt-8">
      {/* Left Division - Book Suggestions */}
      <div className="w-1/4 pr-4">
        <h2 className="text-xl font-semibold mb-4">Book Suggestions</h2>
        {/* Placeholder for book suggestions */}
        {/* You can map through your book suggestions data here */}
        <div className="bg-white p-4 mb-4 rounded shadow">
          <div className="mb-2">Book Title</div>
          <div className="mb-2">Author Name</div>
          <div>Genre</div>
        </div>
        {/* Repeat the above block for each book suggestion */}
      </div>

      {/* Middle Division - Write Review Section */}
      <div className="w-1/2 px-4">
        <h2 className="text-xl font-semibold mb-4">Write Review</h2>
        {/* Form for writing a review */}
        <form className="mb-4">
          <input
            type="text"
            placeholder="Book Name"
            className="w-full border rounded py-2 px-3 mb-2"
          />
          <textarea
            placeholder="Write your review here..."
            className="w-full border rounded py-2 px-3 mb-2 h-32"
          ></textarea>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Post Review
          </button>
        </form>

        {/* Placeholder for displaying other reviews */}
        {/* You can map through your reviews data here */}
        <div className="bg-white p-4 mb-4 rounded shadow">
          <div className="mb-2">Review Text</div>
          <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 mr-2">
            Upvote
          </button>
          {/* Add comment section and button here */}
        </div>
        {/* Repeat the above block for each review */}
      </div>

      {/* Right Division - Chat List */}
      <div className="w-1/4 pl-4">
        <h2 className="text-xl font-semibold mb-4">Chat List</h2>
        {/* Placeholder for chat list */}
        {/* You can map through your chat list data here */}
        <div className="bg-white p-4 mb-4 rounded shadow">
          {/* Chat list content */}
        </div>
        {/* Repeat the above block for each chat */}
      </div>
    </div>
  </div>
  );
};

export default HomePage;
