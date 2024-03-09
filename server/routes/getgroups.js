const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.get("/", authorization, async (req, res) => {
  const userId = req.user; // Assuming this is the owner_id for bookcopy
  console.log("Fetching groups user is not in");
  
  try {
    // Query to retrieve groups that the user is not in
    const notInGroups = await pool.query(
      "SELECT * FROM group_info WHERE group_id NOT IN (SELECT group_id FROM member WHERE user_id = $1)",
      [userId]
    );

    res.json(notInGroups.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
