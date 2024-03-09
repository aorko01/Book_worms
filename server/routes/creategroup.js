const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.post("/", authorization, async (req, res) => {
  const userId = req.user; // Assuming this is the owner_id for bookcopy
  console.log("create group");
  
  const { group_name } = req.body; // Assuming group_name is provided in the request body

  try {
    // Insert new group into group_info table
    const newGroup = await pool.query(
      "INSERT INTO group_info (group_name, moderator_id, creation_date) VALUES ($1, $2, current_timestamp) RETURNING *",
      [group_name, userId]
    );

    // Retrieve the group ID of the newly created group
    const groupId = newGroup.rows[0].group_id;

    // Insert the user into the member table with the created group's ID
    await pool.query(
      "INSERT INTO member (user_id, group_id, join_time) VALUES ($1, $2, current_timestamp)",
      [userId, groupId]
    );

    res.json({ message: "Group created successfully.", group: newGroup.rows[0] });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
