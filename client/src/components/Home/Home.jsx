import React, { useState, useEffect, useRef } from "react";
import NavigationBar from "../NavigationBar/NavigationBar";
import { useNavigate } from "react-router-dom";
import Chatlist from "../Chatlist/Chatlist";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [friends, setFriends] = useState([]);
  const [groups, setGroups] = useState([]);
  const suggestionsRef = useRef(null);
  const [allBooks, setAllBooks] = useState([]);
  const [bookNameInput, setBookNameInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [audience, setAudience] = useState("public");
  const inputRef = useRef(null);
  const [upvotedReviews, setUpvotedReviews] = useState(new Set());
  const navigate = useNavigate();
  const handleGetBookClick = (bookId) => {
    navigate(`/individual-book/${bookId}`);
  };
  const handleUpvote = async (review_id) => {
    try {
      // Check if the review has already been upvoted
      const alreadyUpvoted = upvotedReviews.has(review_id);

      // Determine the route based on whether the review has already been upvoted
      const route = alreadyUpvoted ? "/reduce-upvote" : "/add-upvote";

      // Make the request to the appropriate route
      const response = await fetch(`http://localhost:3000${route}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ review_id }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // If the review was already upvoted, remove it from the upvotedReviews set
      if (alreadyUpvoted) {
        setUpvotedReviews((prevUpvotedReviews) => {
          const newUpvotedReviews = new Set(prevUpvotedReviews);
          newUpvotedReviews.delete(review_id);
          return newUpvotedReviews;
        });
      } else {
        // Otherwise, add it to the upvotedReviews set
        setUpvotedReviews(
          (prevUpvotedReviews) => new Set(prevUpvotedReviews.add(review_id))
        );
      }

      await fetchData(); // Call fetchData again to refresh the data on the page
      // Optionally, reset any states related to the review form here
      // Additional code for handling the response and resetting state
    } catch (error) {
      console.error("Error posting review:", error);
    }
  };

  // Define fetchData as a standalone function
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
      setAllBooks(data.allBooks);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // useEffect to call fetchData on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const searchLocalBooks = (title) => {
    return allBooks
      .filter((book) => book.title.toLowerCase().includes(title.toLowerCase()))
      .map((book) => ({
        id: book.book_id,
        title: book.title,
        authors: book.author_name,
        coverUrl: book.cover_url || "../public/photo_2024-02-29_23-38-49.jpg",
        genre: book.genre,
        pageCount: book.page_count, // Include page count here
        source: "local",
      }));
  };

  const searchGoogleBooks = async (title) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${title}&maxResults=5`
      );
      const data = await response.json();

      if (!data.items) {
        return [];
      }

      return data.items.map((item) => ({
        id: item.id,
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors?.join(", ") || "Unknown Author",
        coverUrl:
          item.volumeInfo.imageLinks?.thumbnail ||
          "../public/photo_2024-02-29_23-38-49.jpg",
        genre: item.volumeInfo.categories?.join(", ") || "Genre not specified",
        pageCount: item.volumeInfo.pageCount || "Page count not available", // Adjust here for page count
        source: "google",
      }));
    } catch (error) {
      console.error("Error searching Google Books:", error);
      return [];
    }
  };

  const handleInputChange = async (e) => {
    const input = e.target.value;
    setBookNameInput(input);

    if (!input.trim()) {
      setSuggestions([]);
      return;
    }

    const localSuggestions = searchLocalBooks(input);
    if (localSuggestions.length > 0) {
      setSuggestions(localSuggestions);
    } else {
      const googleSuggestions = await searchGoogleBooks(input);
      setSuggestions(googleSuggestions);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setBookNameInput(suggestion.title);
    setSelectedBook(suggestion);
    setSuggestions([]);
  };

  const postReview = async () => {
    // Determine if the book has a page count and is not a local book
    const isGoogleBookWithPageCount =
      selectedBook &&
      selectedBook.source === "google" &&
      selectedBook.pageCount !== "Page count not available";

    const payload =
      selectedBook && selectedBook.source === "local"
        ? {
            book_id: selectedBook.id,
            review: reviewText,
            audience: audience, // Update this line to include the audience
            page_count: selectedBook.page_count,
          }
        : {
            title: bookNameInput,
            author_name: selectedBook?.authors || "Unknown Author",
            cover_url: selectedBook?.coverUrl || null,
            genre: selectedBook?.genre || "Genre not specified",
            page_count: isGoogleBookWithPageCount
              ? selectedBook.pageCount
              : null,
            review: reviewText,
            audience: audience, // Update this line to include the audience
            book_id: null,
          };

    try {
      const response = await fetch("http://localhost:3000/post-review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      await fetchData(); // Call fetchData again to refresh the data on the page
      // Optionally, reset any states related to the review form here
      setReviewText("");
      setBookNameInput("");
      setSelectedBook(null);
      setSuggestions([]);
      // Additional code for handling the response and resetting state
    } catch (error) {
      console.error("Error posting review:", error);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <NavigationBar />

      <div className="flex justify-between my-10 mx-10 pt-[4rem]">
        <div className="w-1/4 pr-4 border-r border-gray-700">
          <h2 className="text-4xl font-semibold mb-7">Available Books</h2>
          {books.map((book) => (
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
                className="bg-green-500 hover:bg--700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
                onClick={() => handleGetBookClick(book.book_id)}
              >
                Get This Book
              </button>
            </div>
          ))}
        </div>

        <div className="w-1/2 px-4">
          <h2 className="text-4xl font-semibold mb-7">Write Review</h2>
          <div className="mb-4 p-6 bg-gray-800 rounded-lg shadow-lg">
            <div className="flex justify-center mb-5 w-full">
              <input
                type="text"
                placeholder="Book Name"
                className="bg-gray-700 text-white rounded-xl px-4 py-2 focus:outline-none focus:bg-gray-600 w-3/4"
                value={bookNameInput}
                onChange={handleInputChange}
                ref={inputRef}
              />
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="ml-2 bg-gray-700 text-white rounded-xl px-4 py-2 w-1/4"
              >
                <option value="public">Public</option>
                <option value="friends">Friends</option>
                <option value="group">Group</option>
              </select>
            </div>

            {suggestions.length > 0 && (
              <ul className="bg-gray-700 text-white rounded-xl">
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion.id}
                    className="p-2 hover:bg-gray-600 cursor-pointer"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.title}
                  </li>
                ))}
              </ul>
            )}
            <textarea
              placeholder="Write your review here..."
              className="w-full bg-gray-700 text-white rounded-xl px-4 py-2 focus:outline-none focus:bg-gray-600 mb-5"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              style={{ minHeight: "130px" }}
            ></textarea>
            <button
              className="w-full bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-xl transition duration-300 ease-in-out transform hover:scale-105"
              onClick={postReview}
            >
              Post Review
            </button>
          </div>
          <h2 className="text-4xl font-semibold mb-7 mt-8">Review Section</h2>

          {reviews.map((review) => (
            <div className="mt-8" key={review.review_id}>
              <div className="flex my-4 p-6 bg-gray-800 rounded-lg shadow-lg">
                <div className="w-1/4 flex flex-col items-center justify-center border-r border-gray-700">
                  <img
                    className=" w-20 h-auto mb-2"
                    src={
                      review.bookInfo.cover_url ||
                      "../public/photo_2024-02-29_23-38-49.jpg"
                    }
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
                    <div className="mr-3 font-bold">{review.upvotes}</div>
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline mr-2"
                      onClick={() => handleUpvote(review.review_id)}
                    >
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
          <Chatlist/>
        </div>
      </div>
    </div>
  );
};

export default Home;
