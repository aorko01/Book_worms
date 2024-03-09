const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.get("/", authorization, async (req, res) => {
  const ownerId = req.user; // Assuming req.user contains the owner's ID
  console.log("Owner ID: ", ownerId);

  try {
    // Query for book requests
    const bookRequests = await pool.query(
      "SELECT * FROM borrowrequest br INNER JOIN bookcopy bc ON br.copy_id = bc.copy_id INNER JOIN book b ON bc.book_id = b.book_id INNER JOIN user_info u ON br.borrower_id = u.user_id WHERE br.approved = false AND bc.owner_id = $1 ORDER BY br.request_time",
      [ownerId]
    );

    // Query for books to be returned
    const booksToReturn = await pool.query(
      "SELECT * FROM public.sharing s INNER JOIN public.bookcopy bc ON s.copy_id = bc.copy_id INNER JOIN public.book b ON bc.book_id = b.book_id WHERE s.returned = false AND (s.sharing_date + s.borrow_days * INTERVAL '1 day') <= CURRENT_DATE + INTERVAL '3 days' AND s.borrower_id = $1 and s.returned = false ORDER BY s.sharing_date DESC",
      [ownerId]
    );

    const responseData = {
      bookRequests: bookRequests.rows,
      booksToReturn: booksToReturn.rows
    };
    res.json(responseData);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
