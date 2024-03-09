const router = require("express").Router();
const pool = require("../db");
const validInfo = require("../middleware/validinfo");
const authorization = require("../middleware/authorization");

router.post("/", authorization, async (req, res) => {
    console.log("Adding user to group");
  try {
    const { groupId } = req.body; // Group id sent in the request body
    console.log("Group id: ", groupId);
    const userId = req.user; // User id retrieved from authorization middleware

    // Check if the user is already a member of the group
    const existingMember = await pool.query(
      "SELECT * FROM member WHERE user_id = $1 AND group_id = $2",
      [userId, groupId]
    );

    if (existingMember.rows.length > 0) {
      return res.status(400).json({ message: "User is already a member of the group" });
    }

    // Add the user as a member of the group
    await pool.query(
      "INSERT INTO member (user_id, group_id) VALUES ($1, $2)",
      [userId, groupId]
    );

    res.json({ message: "User added as a group member successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
