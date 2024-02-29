import React, { useState, useEffect } from "react";
import NavigationBar from "../NavigationBar/NavigationBar";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [friends, setFriends] = useState([]);
  const [groups, setGroups] = useState([]);

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

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <NavigationBar />

      <div className="flex justify-between my-10 mx-10 pt-[4rem]">
        <div className="w-1/4 pr-4 border-r border-gray-700">
          <h2 className="text-3xl font-semibold mb-7">Available Books</h2>
          {books.map((book) => (
            <div
              className="bg-gray-800 p-4 mb-4 rounded-lg shadow-lg flex flex-col items-center"
              key={book.book_id}
            >
              <img
                className="rounded-lg mb-2"
                src={
                  book.cover_url ||
                   "../public/photo_2024-02-29_23-38-49.jpg"
                }
                // className="w-3/4 h-auto mb-2 rounded-lg"
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

        <div className="w-1/2 px-4">
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
          <h2 className="text-3xl font-semibold mb-7 mt-8">Review Section</h2>

          {reviews.map((review) => (
            <div className="mt-8" key={review.review_id}>
              <div className="flex my-4 p-6 bg-gray-800 rounded-lg shadow-lg">
                <div className="w-1/4 flex flex-col items-center justify-center border-r border-gray-700">
                  {" "}
                  {/* Update this container */}
                  <img
                    className=" w-20 h-auto mb-2"
                    src={review.bookInfo.cover_url || "../public/photo_2024-02-29_23-38-49.jpg"} 
                    alt="Book Cover"
                  />
                  <div className="text-center text-lg">
                    {review.bookInfo.title}
                  </div>
                </div>
                <div className="w-3/4 pl-4 flex flex-col">
                  <div className="flex items-center mb-2">
                    <img
                      className="rounded-full w-10 h-10 mr-2"
                      src="https://cdn4.vectorstock.com/i/1000x1000/06/18/male-avatar-profile-picture-vector-10210618.jpg"
                      alt="Reviewer Avatar"
                    />
                    <div className="text-lg text-white">
                      {review.userInfo.first_name} {review.userInfo.last_name}
                    </div>
                  </div>
                  <div className="mb-4 text-white text-lg mb-14 mt-3 ">
                    {review.review_text}
                  </div>
                  <div className="flex items-center mb-6">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2">
                      Upvote
                    </button>
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      className="flex-grow bg-gray-700 text-white rounded-xl px-4 py-2 focus:outline-none focus:bg-gray-600 mr-2"
                    />
                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline">
                      Comment
                    </button>
                  </div>
                  <div className="bg-gray-700 rounded-xl p-4">
                    {review.comments.map((comment, index) => (
                      <div key={index} className="text-white mb-2">
                        {comment.comment_text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="w-1/5 pl-4 border-l border-gray-700">
          <h2 className="text-3xl font-semibold mb-6">Chat List</h2>
        </div>
      </div>
    </div>
  );
};

export default Home;
