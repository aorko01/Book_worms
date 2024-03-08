const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.post("/", authorization, async (req, res) => {
    console.log("hit accept book request route");
  const { borrower_id, copy_id } = req.body;

  try {
    // Update the acceptance status in the borrowrequest table
    const updateQuery = `
      UPDATE borrowrequest 
      SET approved = true
      WHERE borrower_id = $1
      AND copy_id = $2;
    `;
    await pool.query(updateQuery, [borrower_id, copy_id]);

    res.json({ message: "Borrow request accepted successfully." });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
