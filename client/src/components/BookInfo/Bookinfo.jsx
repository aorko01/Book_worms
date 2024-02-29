import React, { useEffect, useRef, useState } from 'react';
import NavigationBar from '../NavigationBar/NavigationBar';

function Bookinfo() {
  const [books, setBooks] = useState([]);
  const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  const bookRefs = useRef({});

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:3000/books-all', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Includes cookies in the request
        });
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        const data = await response.json();
        setBooks(data.books); // Adjust according to the shape of your response
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  const scrollTo = (char) => {
    bookRefs.current[char]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Group books by the first letter of their title
  const groupedBooks = books.reduce((acc, book) => {
    const firstLetter = book.title[0].toUpperCase();
    if (!acc[firstLetter]) acc[firstLetter] = [];
    acc[firstLetter].push(book);
    return acc;
  }, {});

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <NavigationBar />
      <div className="mt-4 sticky top-[4rem] z-10 bg-gray-800 py-2 shadow-md">
        <div className="flex justify-center space-x-2 overflow-x-auto">
          {alphabet.map((char) => (
            <button
              key={char}
              className="bg-gray-700 text-white font-bold py-2 px-4 rounded hover:bg-gray-600 focus:outline-none"
              onClick={() => scrollTo(char)}
            >
              {char}
            </button>
          ))}
        </div>
      </div>
      <div className="pt-8 px-10 mt-20">
        <div>
          {Object.entries(groupedBooks).map(([letter, books]) => (
            <div ref={el => bookRefs.current[letter] = el} key={letter} id={letter}>
              <h3 className="text-2xl font-semibold mb-4">{letter}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {books.map((book) => (
                  <div
                    className="bg-gray-800 p-4 mb-4 rounded-lg shadow-lg flex flex-col items-center"
                    key={book.book_id}
                  >
                    <img
                      src={book.cover_url || "../public/default_book_cover.jpg"}
                      alt={book.title}
                      className="rounded-lg mb-2"
                      style={{ width: "80%" }}
                    />
                    <div className="mb-2 text-2xl">{book.title}</div>
                    <div className="mb-2 text-xl">{book.author_name}</div>
                    <div className="text-lg">{book.genre}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Bookinfo;
