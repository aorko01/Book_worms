const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.post("/", authorization, async (req, res) => {
  const userId = req.user; // Assuming this is the owner_id for bookcopy
  const { title, author_name, genre, page_count, cover_url } = req.body;

  try {
    // Step 1: Check if the book already exists
    const existingBook = await pool.query(
      "SELECT book_id FROM book WHERE title = $1",
      [title]
    );

    let bookId;

    if (existingBook.rowCount > 0) {
      bookId = existingBook.rows[0].book_id;
    } else {

      const newBook = await pool.query(
        "INSERT INTO book (title, author_name, genre, page_count, cover_url) VALUES ($1, $2, $3, $4, $5) RETURNING book_id",
        [title, author_name, genre, page_count, cover_url]
      );
      bookId = newBook.rows[0].book_id;
    }


    await pool.query(
      "INSERT INTO bookcopy (book_id, owner_id, availability, sharing_status) VALUES ($1, $2, TRUE, 'available')",
      [bookId, userId]
    );

    res.json({ message: "Book copy added successfully." });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
