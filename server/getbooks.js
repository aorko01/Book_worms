const axios = require('axios');

// Function to search for a book by its title
async function searchBook(title) {
  try {
    const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
      params: {
        q: title,
        maxResults: 1 , // Limiting to 1 result for simplicity, you can adjust as needed
      },
    });

    const bookData = response.data.items[0]; // Get the first book from the response

    if (!bookData) {
      console.log('Book not found');
      return;
    }

    const bookInfo = {
      title: bookData.volumeInfo.title,
      authors: bookData.volumeInfo.authors,
      coverUrl: bookData.volumeInfo.imageLinks?.thumbnail || 'No cover available',
      genre: bookData.volumeInfo.categories || 'Genre not specified',
    };

    console.log('Book Information:');
    console.log('Title:', bookInfo.title);
    console.log('Authors:', bookInfo.authors.join(', '));
    console.log('Cover URL:', bookInfo.coverUrl);   
    console.log('Genre:', bookInfo.genre.join(', '));
  } catch (error) {
    console.error('Error fetching book information:', error.message);
  }
}

// Example usage
searchBook('psychology of money');
