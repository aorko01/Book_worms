const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.post("/", authorization, async (req, res) => {
  const userId = req.user; // Assuming this is the owner_id for bookcopy
  console.log("hit add book route");
  
  const { group_name } = req.body; // Assuming group_name is provided in the request body

  try {
    const newGroup = await pool.query(
      "INSERT INTO group_info (group_name, moderator_id, creation_date) VALUES ($1, $2, current_timestamp) RETURNING *",
      [group_name, userId]
    );

    res.json({ message: "Group created successfully.", group: newGroup.rows[0] });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
