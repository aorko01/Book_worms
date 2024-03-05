const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.post("/", authorization, async (req, res) => {
  try {
    console.log("send request");
    const userId = req.user;
    console.log("userId: ", userId);
    
    // The recipient's ID is received from the request body
    const { to_id } = req.body;
    console.log(to_id); // Assuming you pass the recipient's ID as to_id in the body of your request

    // Insert the friend request into the friendrequest table
    const sendRequestQuery = `
      INSERT INTO public.friendrequest (from_id, to_id, request_time, evaluated)
      VALUES ($1, $2, CURRENT_TIMESTAMP, false)
      RETURNING *;`;

    const friendRequestResponse = await pool.query(sendRequestQuery, [userId, to_id]);

  

    const removeSuggestionQuery = `
      INSERT INTO public.removed_suggestions (user_id, other_user_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, other_user_id) DO NOTHING;`;

    await pool.query(removeSuggestionQuery, [userId, to_id]);

    // If the friend request was inserted successfully, send a response back
    if (friendRequestResponse.rows.length > 0) {
      res.json({ message: "Friend request sent successfully" });
    } else {
      res.status(400).json({ error: "Failed to send friend request" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
