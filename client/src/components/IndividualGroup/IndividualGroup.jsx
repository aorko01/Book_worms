import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NavigationBar from "../NavigationBar/NavigationBar";
import Chatlist from "../Chatlist/Chatlist";
import { useNavigate } from "react-router-dom";

function IndividualGroup() {
  const [groupInfo, setGroupInfo] = useState(null);
  const { groupId } = useParams(); // Access the groupId parameter from the URL
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroupInfo();
  }, [groupId]); // Fetch group info whenever the groupId changes

  const fetchGroupInfo = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/individualgroup/${groupId}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      setGroupInfo(responseData);
      console.log("Group Info: ", responseData);
    } catch (error) {
      console.error(error.message);
      // Handle error appropriately, e.g., show a notification to the user
    }
  };

  // Function to handle navigation when clicking on a book
  const handleGetBookClick = (bookId) => {
    navigate(`/individual-book/${bookId}`);
  };

  // Function to handle navigation when clicking on a user
  const handleUserClick = (userId) => {
    // Navigate to user profile page
    navigate(`/profile/${userId}`);
  };

  // Inside the IndividualGroup component
  // Inside the IndividualGroup component
// Inside the IndividualGroup component
return (
  <div className="bg-gray-900 text-white min-h-screen">
    <NavigationBar />
    <div className="flex my-10 mx-10 pt-[4rem]">
      {/* Left section - Group Info */}
      <div className="w-1/4 pr-4">
        {groupInfo && (
          <div>
            <h2 className="text-4xl font-semibold mb-7">
              {groupInfo.groupName}
            </h2>
            <div className="mb-4"></div>
          </div>
        )}
      </div>
      {/* Middle section - Reviews */}
      <div className="w-1/2 px-4">
        {groupInfo && (
          <div>
            <h2 className="text-4xl font-semibold mb-7">Reviews</h2>
            {groupInfo.reviewsByGroupMembers.map((review) => (
              <div
                className="bg-gray-800 p-4 mb-4 rounded-lg shadow-lg"
                key={review.review_id}
              >
                <div className="mb-2 flex justify-between items-center">
                  <div className="text-xl font-semibold">
                    {review.book_name}  
                  </div>
                </div>
                <div className="mb-2 text-gray-200">{review.review_text}</div>
                <div className="flex items-center text-gray-400">
                  <span className="mr-2">{review.review_time}</span>
                  <span className="mr-2">Upvotes: {review.upvotes}</span>
                  <span>Replies: {review.reply_count}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Right section - Books */}
      <div className="w-1/4 pl-4 border-l border-gray-700">
        {groupInfo && (
          <div>
            <h2 className="text-4xl font-semibold mb-7">Books</h2>
            {groupInfo.uniqueBooksOwnedByGroupMembers.map((book) => (
              <div
                key={book.book_id}
                className="bg-gray-800 p-4 mb-4 rounded-lg shadow-lg flex flex-col items-center"
              >
                <img
                  src={
                    book.cover_url ||
                    "https://i.pinimg.com/564x/69/a8/a8/69a8a8249d3cc620ff82e8c922c9bd61.jpg"
                  }
                  alt={book.title}
                  className="rounded-lg mb-2"
                  style={{ width: "80%" }}
                />
                <div className="mb-2 text-2xl">{book.title}</div>
                <div className="mb-2 text-xl">{book.author_name}</div>
                <div className="text-lg">{book.genre}</div>
                <div className="text-lg">Pages: {book.page_count}</div>{" "}
                {/* Display page_count here */}
                <button
                  className="bg-violet-500 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline mt-2"
                  onClick={() => handleGetBookClick(book.book_id)}
                >
                  About this Book
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);


}

export default IndividualGroup;
