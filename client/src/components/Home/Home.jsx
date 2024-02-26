import React from "react";
import NavigationBar from "../NavigationBar/NavigationBar";


const Home = () => {



  return (
    <div>
      {/* Include the NavigationBar component */}
      <NavigationBar />

      <div class="flex justify-between my-10">
        {/* Left Division - Book Suggestions */}
        <div className="w-1/4 pr-4  ">
          <h2 className="text-xl font-semibold mb-4">Book Suggestions</h2>
          {/* Placeholder for book suggestions */}
          {/* You can map through your book suggestions data here */}
          <div className="bg-gray-700 p-4 mb-4 rounded shadow flex flex-col items-center rounded-xl"> 
            <img className="rounded-lg mb-2"
              src="http://books.google.com/books/content?id=Jrx6EAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
              alt=""
              style={{ width: "80%" }} 
            />
            <div className="mb-2 flex justify-center ">Book Title</div>
            <div className="mb-2 flex justify-center ">Author Name</div>
            <div className="mb-2 flex justify-center">Genre</div>
          </div>
          {/* Repeat the above block for each book suggestion */}
        </div>

        {/* Middle Division - Write Review Section */}
        <div className="w-1/2 px-4">
          <h2 className="text-xl font-semibold mb-4">Write Review</h2>
          {/* Form for writing a review */}
          <div className="mb-4 border-2 border-sky-800 p-4 bg-gray-800">
            {" "}
            {/* Wrapper div added */}
            <input
              type="text"
              placeholder="Book Name"
              className="w-full border rounded py-2 px-3 mb-2 bg-sky-900" // Added bg-gray-200
            />
            <textarea
              placeholder="Write your review here..."
              className="w-full border rounded py-2 px-3 mb-2 h-32 bg-gray-200" // Added bg-gray-200
            ></textarea>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Post Review
            </button>
          </div>
          {/* End of wrapper div */}

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
        <div className="w-1/5 pl-4">
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

export default Home;
