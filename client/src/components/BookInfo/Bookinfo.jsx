import React, { useEffect, useRef, useState } from 'react';
import NavigationBar from '../NavigationBar/NavigationBar';

function Bookinfo() {
  const [books, setBooks] = useState([]);
  const [sortCriteria, setSortCriteria] = useState('title');
  const [filterLetter, setFilterLetter] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');
  const [pageCountFilter, setPageCountFilter] = useState({ min: 0, max: Infinity });
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
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        const data = await response.json();
        setBooks(data.books);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  const applyFilters = () => {
    return books
      .filter(book => filterLetter ? book.title.toUpperCase().startsWith(filterLetter) : true)
      .filter(book => genreFilter ? book.genre === genreFilter : true)
      .filter(book => authorFilter ? book.author_name === authorFilter : true)
      .filter(book => book.page_count >= pageCountFilter.min && book.page_count <= pageCountFilter.max)
      .sort((a, b) => {
        if (sortCriteria === 'title') return a.title.localeCompare(b.title);
        if (sortCriteria === 'author_name') return a.author_name.localeCompare(b.author_name);
        return 0;
      });
  };

  const sortedAndFilteredBooks = applyFilters();

  // Group books by the first letter of their title
  const groupedBooks = sortedAndFilteredBooks.reduce((acc, book) => {
    const firstLetter = book.title[0].toUpperCase();
    if (!acc[firstLetter]) acc[firstLetter] = [];
    acc[firstLetter].push(book);
    return acc;
  }, {});

  // Assuming you have a list of genres and authors from your books or another source
  const genres = [...new Set(books.map(book => book.genre))].sort();
  const authors = [...new Set(books.map(book => book.author_name))].sort();

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <NavigationBar />
      {/* Filters and Sorting UI */}
      <div className="mt-4 sticky top-[4rem] z-10 bg-gray-800 py-2 shadow-md">
        <div className="flex flex-wrap justify-around items-center">
          <div className="flex space-x-2 overflow-x-auto">
            {alphabet.map((char) => (
              <button
                key={char}
                className={`bg-gray-700 text-white font-bold py-2 px-4 rounded hover:bg-gray-600 focus:outline-none ${filterLetter === char ? 'bg-gray-500' : ''}`}
                onClick={() => setFilterLetter(char)}
              >
                {char}
              </button>
            ))}
            <button
              className="bg-red-700 text-white font-bold py-2 px-4 rounded hover:bg-red-500 focus:outline-none"
              onClick={() => setFilterLetter('')}
            >
              Reset Filter
            </button>
          </div>
          <div className="flex flex-wrap items-center space-x-4 mt-5">
            <select
              className="bg-gray-700 text-white rounded px-4 py-2"
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
            >
              <option value="">Genre</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
            <select
              className="bg-gray-700 text-white rounded px-4 py-2"
              value={authorFilter}
              onChange={(e) => setAuthorFilter(e.target.value)}
            >
              <option value="">Author</option>
              {authors.map(author => (
                <option key={author} value={author}>{author}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Min Page"
              className="bg-gray-700 text-white rounded px-4 py-2"
              onChange={(e) => setPageCountFilter({ ...pageCountFilter, min: Number(e.target.value) || 0 })}
            />
            <input
              type="number"
              placeholder="Max Page"
              className="bg-gray-700 text-white rounded px-4 py-2"
              onChange={(e) => setPageCountFilter({ ...pageCountFilter, max: Number(e.target.value) || Infinity })}
            />
            <select
              className="bg-gray-700 text-white rounded px-4 py-2"
              value={sortCriteria}
              onChange={(e) => setSortCriteria(e.target.value)}
            >
              <option value="title">Title</option>
              <option value="author_name">Author</option>
            </select>
          </div>
        </div>
      </div>
      <div className="pt-8 px-10 mt-20">
        {/* Books display */}
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
