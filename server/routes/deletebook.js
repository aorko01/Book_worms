const express = require("express");
const router = express.Router();
const pool = require("../db");

// DELETE route to remove a book from the bookcopy table
router.delete("/:book_id/:owner_id", async (req, res) => {
  const { book_id, owner_id } = req.params;

  try {
    // Check if the bookcopy exists
    const checkBookCopyQuery = "SELECT * FROM public.bookcopy WHERE book_id = $1 AND owner_id = $2";
    const checkBookCopyValues = [book_id, owner_id];
    const bookCopyExists = await pool.query(checkBookCopyQuery, checkBookCopyValues);

    if (bookCopyExists.rows.length === 0) {
      return res.status(404).json({ message: "Book copy not found." });
    }

    // Delete the bookcopy
    const deleteBookCopyQuery = "DELETE FROM public.bookcopy WHERE book_id = $1 AND owner_id = $2";
    await pool.query(deleteBookCopyQuery, checkBookCopyValues);

    res.status(200).json({ message: "Book copy deleted successfully." });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
