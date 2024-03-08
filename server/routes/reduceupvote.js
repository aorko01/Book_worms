const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.post("/", authorization, async (req, res) => {
  const userId = req.user; // Assuming this is the owner_id for bookcopy
  console.log("hit add book route");
  const { review_id } = req.body;

  try {
    // Step 1: Retrieve the review from the database
    const review = await pool.query("SELECT * FROM review WHERE review_id = $1", [review_id]);

    // // Step 2: Increment the upvotes count
    const updatedUpvotes = review.rows[0].upvotes - 1;

    // // Step 3: Update the review in the database with the incremented upvotes count
    await pool.query("UPDATE review SET upvotes = $1 WHERE review_id = $2", [updatedUpvotes, review_id]);

    res.json({ message: "Upvote count increased successfully." });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
