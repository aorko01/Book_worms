const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.post("/", authorization, async (req, res) => {
  const userId = req.user;
  console.log("userId: ", userId);

  const { book_id, title, author_name, cover_url, genre, page_count, review ,audience} = req.body;

  try {
    if (book_id) {
      // Book ID is provided, insert the review directly
      const reviewResponse = await pool.query(
        "INSERT INTO review (book_id, review_text, reviewer_id,audience) VALUES ($1, $2, $3, $4) RETURNING *",
        [book_id, review, userId,audience]
      );

      res.json({ success: true, review: reviewResponse.rows[0] });
    } else {
      // Book ID is not provided, insert the book first, then insert the review
      const bookResponse = await pool.query(
        "INSERT INTO book (title, author_name, cover_url, genre, page_count) VALUES ($1, $2, $3, $4, $5) RETURNING book_id",
        [title, author_name, cover_url, genre, page_count]
      );

      const newBookId = bookResponse.rows[0].book_id;

      const reviewResponse = await pool.query(
        "INSERT INTO review (book_id, review_text, reviewer_id,audience) VALUES ($1, $2, $3, $4) RETURNING *",
        [newBookId, review, userId,audience]
      );

      res.json({ success: true, review: reviewResponse.rows[0] });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
