const router = require("express").Router();
const pool = require("../db");
const validInfo = require("../middleware/validinfo");
const authorization = require("../middleware/authorization");

router.post("/", authorization, async (req, res) => {
  try {
    const userId = req.user; // User id retrieved from authorization middleware
    const { from_id } = req.body; // From id attached with the request body
    console.log("from_id: ", from_id);
    console.log("user_id: ", userId);

    // Update the row with the specified from_id and user_id
    const updateFriendRequestQuery = `
      UPDATE public.friendrequest
      SET evaluated = true
      WHERE from_id = $1
        AND to_id = $2
        AND evaluated = false;`;

    // Execute the query
    await pool.query(updateFriendRequestQuery, [from_id, userId]);

    await pool.query(
      `INSERT INTO public.removed_suggestions (user_id, other_user_id) VALUES ($1, $2)`,
      [from_id, userId]
    );

    res.json({ message: "Friend request updated successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
