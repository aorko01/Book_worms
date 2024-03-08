import React, { useState, useEffect } from "react";
import NavigationBar from "../NavigationBar/NavigationBar";
import { useParams } from "react-router-dom";

const IndividualBook = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [owners, setOwners] = useState([]);
  const [borrowModal, setBorrowModal] = useState(false);
  const [borrowDuration, setBorrowDuration] = useState(7); // Default borrow duration
  const [selectedOwnerId, setSelectedOwnerId] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/individual-book/${bookId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setBook(data.book);
        setReviews(data.reviews);
        setOwners(data.owners);
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  if (!book) {
    return <div>Loading...</div>;
  }

  const handleBorrow = (owner_id) => {
    setSelectedOwnerId(owner_id);
    setBorrowModal(true);
  };

  const requestBorrow = async () => {
    try {
      // console.log("Borrow requested for book ID:", book.book_id);
      // console.log("Owner ID:", selectedOwnerId);
      // console.log("Borrow for:", borrowDuration, "days");
  
      const response = await fetch(`http://localhost:3000/borrowrequest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ensures cookies are sent with the request
        body: JSON.stringify({
          owner_id: selectedOwnerId,
          book_id: book.book_id,
          borrow_days: borrowDuration,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const data = await response.json();
      console.log("Borrow request response:", data);
      setBorrowModal(false);
    } catch (error) {
      console.error("Error requesting borrow:", error);
    }
    setBorrowModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <NavigationBar />
      <div className="flex justify-between my-10 mx-10 pt-[5rem]">
        {/* Book Information */}
        <div className="w-1/4 pr-4 border-r border-gray-700">
          <h2 className="text-4xl font-semibold mb-7">Book Information</h2>
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <img
              className="rounded-lg mb-2"
              src={book.cover_url}
              alt={book.title}
              style={{ width: "100%" }}
            />
            <p className="text-2xl mb-2">{book.title}</p>
            <p className="text-xl mb-2">{book.author_name}</p>
            <p className="mb-2">Genre: {book.genre}</p>
            <p className="mb-2">Pages: {book.page_count}</p>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="w-1/2 px-4">
          <h2 className="text-4xl font-semibold mb-7">Reviews</h2>
          {reviews.map((review, index) => (
            <div key={index} className="mt-8">
              <div className="flex my-4 p-6 bg-gray-800 rounded-lg shadow-lg">
                <div className="w-1/4 flex flex-col items-center justify-center border-r border-gray-700">
                  <img
                    className=" w-20 h-auto mb-2"
                    src={
                      book.cover_url ||
                      "../public/photo_2024-02-29_23-38-49.jpg"
                    }
                    alt={book.title}
                  />
                  <div className="text-center text-lg">{book.title}</div>
                </div>
                <div className="w-3/4 pl-4 flex flex-col">
                  <div className="flex items-center mb-2">
                    <div className="text-lg font-semibold mb-2">
                      {`${review.reviewer_info.first_name} ${review.reviewer_info.last_name}`}
                    </div>
                  </div>
                  <div className="mb-4 text-white text-lg mb-14 mt-3">
                    {review.review_text}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Owners Section */}
        <div className="w-1/5 pl-4 border-l border-gray-700">
          <h2 className="text-4xl font-semibold mb-6">Book Owners</h2>
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg overflow-auto">
            {owners.length > 0 ? (
              owners.map((owner, index) => (
                <div key={index} className="py-2">
                  <img
                    className="rounded-full w-10 h-10 mr-2"
                    src="https://cdn4.vectorstock.com/i/1000x1000/06/18/male-avatar-profile-picture-vector-10210618.jpg"
                    alt="Reviewer Avatar"
                  />
                  <div className="text-xl mb-1 font-bold">{`${owner.first_name} ${owner.last_name}`}</div>
                  <div className="text-sm">{owner.email_address}</div>
                  <button
                    className="bg-green-500 hover:bg--700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
                    onClick={() => handleBorrow(owner.user_id)}
                  >
                    Borrow
                  </button>
                  {borrowModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="bg-gray-800 p-8 rounded-lg shadow-lg flex">
                        <div>
                          <div className="text-2xl font-semibold mb-4">
                            Borrow Book from{" "}
                            {`${owner.first_name} ${owner.last_name}`}
                          </div>
                          <div className="mb-4">
                            <p className="text-xl font-semibold">
                              {book.title}
                            </p>
                            <p className="text-lg">
                              Author: {book.author_name}
                            </p>
                          </div>
                          <div className="flex items-center mb-4">
                            <label htmlFor="borrowDuration" className="mr-2">
                              Borrow for:
                            </label>
                            <input
                              type="number"
                              id="borrowDuration"
                              className="p-2 border rounded bg-gray-600"
                              min="1"
                              max="365"
                              value={borrowDuration}
                              onChange={(e) =>
                                setBorrowDuration(parseInt(e.target.value))
                              }
                            />
                            <span className="ml-2">days</span>
                          </div>
                          <div className="flex justify-between">
                            <button
                              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                              onClick={() => setBorrowModal(false)}
                            >
                              Cancel
                            </button>
                            <button
                              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                              onClick={requestBorrow}
                            >
                              Borrow
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center text-lg">No owners found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualBook;
