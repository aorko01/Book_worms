const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.get("/", authorization, async (req, res) => {
  const ownerId = req.user; // Assuming req.user contains the owner's ID
  console.log("Owner ID: ", ownerId);

  try {
    const bookRequests = await pool.query(
      "SELECT * FROM borrowrequest br INNER JOIN bookcopy bc ON br.copy_id = bc.copy_id INNER JOIN book b ON bc.book_id = b.book_id INNER JOIN user_info u ON br.borrower_id = u.user_id WHERE br.approved = false AND bc.owner_id = $1 ORDER BY br.request_time",
      [ownerId]
    );

    const responseData = {
      bookRequests: bookRequests.rows,
    };
    res.json(responseData);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
