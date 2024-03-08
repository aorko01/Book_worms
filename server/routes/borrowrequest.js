const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.post("/", authorization, async (req, res) => {
  const { owner_id, book_id, borrow_days } = req.body; // Assuming owner_id, book_id, and borrow_days are sent from the frontend
  const borrower_id = req.user; // Assuming borrower_id is obtained from the authenticated user
  console.log("hit borrow request");

  try {
    // Step 1: Check if the book copy already exists
    const bookCopy = await pool.query(
      "SELECT * FROM public.bookcopy WHERE book_id = $1 AND owner_id = $2",
      [book_id, owner_id]
    );

    if (bookCopy.rows.length === 0) {
      // Book copy doesn't exist
      return res.status(404).json({ message: "Book copy not found." });
    }

    // Step 2: Insert borrow request
    await pool.query(
      "INSERT INTO public.borrowrequest (borrow_days, borrower_id, copy_id) VALUES ($1, $2, $3)",
      [borrow_days, borrower_id, bookCopy.rows[0].copy_id]
    );

    res.json({ message: "Borrow request added successfully." });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
