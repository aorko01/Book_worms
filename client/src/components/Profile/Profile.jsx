import React, { useState, useEffect } from "react";
import NavigationBar from "../NavigationBar/NavigationBar";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  // State and useEffect for fetching user profile data
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  const handleGetBookClick = (bookId) => {
    navigate(`/individual-book/${bookId}`);
  };

  useEffect(() => {
    console.log("fetching user profile data");
    // Fetch user profile data from the server
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:3000/profile", {
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
        setUserData(data);
        console.log("User data:", data);
      } catch (error) {
        console.error("Error fetching user profile data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <NavigationBar />

      <div className="flex justify-between my-10 mx-10 pt-[4rem]">
        {/* user information */}
        <div className="w-1/4 pr-4 border-r border-gray-700">
          <img
            src={
              "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=338&ext=jpg"
            }
            alt="Profile"
            className="object-cover rounded-full "
          />
          <div>
            <h2 className="text-3xl font-semibold">
              {userData.user &&
                `${userData.user.first_name} ${userData.user.last_name}`}
            </h2>
          </div>
          <div className="text-2xl font-semibold">
            {userData.user && `${userData.user.email_address}`}
          </div>
        </div>

        <div className="w-1/2 px-4">
          <h2 className="text-4xl font-semibold mb-7 mt-8">Reviews</h2>
          {userData.reviews &&
            userData.reviews.map((review) => (
              <div
                className="bg-gray-800 p-4 mb-4 rounded-lg shadow-lg"
                key={review.review_id}
              >
                <div className="mb-2 flex justify-between items-center">
                  <div className="text-xl font-semibold">
                    {review.book_title} by {review.book_author}
                  </div>
                  <div className="text-xl font-semibold">{review.rating}/5</div>
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

        <div className="w-1/5 pl-4 border-l border-gray-700">
          <h2 className="text-4xl font-semibold mb-6">Books </h2>
          {userData.books &&
            userData.books.map((book) => (
              <div
                className="bg-gray-800 p-4 mb-4 rounded-lg shadow-lg flex flex-col items-center"
                key={book.book_id}
              >
                <img
                  className="rounded-lg mb-2"
                  src={
                    book.cover_url || "../public/photo_2024-02-29_23-38-49.jpg"
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
                <button
                  className="bg-violet-500 hover:bg--700 text-white font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline mt-2"
                  onClick={() => handleGetBookClick(book.book_id)}
                >
                  About This Book
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
