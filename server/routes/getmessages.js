const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.get("/", authorization, async (req, res) => {
  console.log("getmessages");
  const userId = req.user;
    const { to_id } = req.query;
    console.log(to_id);
  try {
    // Query to select messages between the current user and the specified user,
    // ordered by message_time in descending order to get the most recent messages first
    const query = `
      SELECT *
      FROM public.message
      WHERE (from_id = $1 AND to_id = $2) OR (from_id = $2 AND to_id = $1)
      ORDER BY message_time DESC;
    `;

    // Execute the query
    const { messages } = await pool.query(query, [userId, to_id]);

    // Send the response with the retrieved data
    res.json(messages);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
