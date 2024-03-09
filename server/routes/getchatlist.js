const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.get("/", authorization, async (req, res) => {
  const userId = req.user;
  console.log("userId: ", userId);

  try {
    // Query to select users who are friends with the current user
    const query = `
      SELECT u.user_id, u.first_name, u.last_name
      FROM public.user_info u
      JOIN public.friendlist f ON u.user_id = f.friend_id
      LEFT JOIN (
          SELECT from_id AS user_id, COUNT(*) AS num_messages
          FROM public.message
          WHERE to_id = $1
          GROUP BY from_id
          UNION
          SELECT to_id AS user_id, COUNT(*) AS num_messages
          FROM public.message
          WHERE from_id = $1
          GROUP BY to_id
      ) m ON u.user_id = m.user_id
      WHERE f.user_id = $1
      ORDER BY COALESCE(m.num_messages, 0) DESC;
    `;

    // Execute the query
    const { rows } = await pool.query(query, [userId]);

    // Send the response with the retrieved data
    res.json(rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
