async function fetchBooksByAuthor(authorName) {
  const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key
  const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=+inauthor:${encodeURIComponent(authorName)}&key=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    const books = data.items.map(item => ({
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors || ['Unknown'],
      publishedDate: item.volumeInfo.publishedDate,
      thumbnail: item.volumeInfo.imageLinks?.thumbnail || 'No image available',
      infoLink: item.volumeInfo.infoLink
    }));

    console.log(books);
    return books;
  } catch (error) {
    console.error("Failed to fetch books: ", error);
  }
}

// Example usage
fetchBooksByAuthor('J.K. Rowling');
