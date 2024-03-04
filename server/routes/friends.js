const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.get("/", authorization, async (req, res) => {
  const userId = req.user;
  console.log('friend');
  console.log("userId: ", userId);

  try {
    
    const friendRequest=`SELECT ui.user_id, ui.first_name, ui.last_name, ui.email_address
    FROM public.friendrequest AS fr
    JOIN public.user_info AS ui ON fr.from_id = ui.user_id
    WHERE fr.to_id = $1 AND fr.acceptance = false AND fr.rejected = false;`

    const { rows: friendRequests } = await pool.query(friendRequest, [userId]);
    
    const  Suggestions = `SELECT DISTINCT u.user_id, u.first_name, u.last_name, u.email_address
    FROM public.user_info u
    WHERE u.user_id IN (
        SELECT f1.friend_id
        FROM public.friendlist f1
        WHERE f1.user_id IN (
            SELECT f2.friend_id
            FROM public.friendlist f2
            WHERE f2.user_id = $1
        )
        AND f1.friend_id != $1
        AND NOT EXISTS (
            SELECT 1
            FROM public.friendlist f3
            WHERE f3.user_id = $1 AND f3.friend_id = f1.friend_id
        )
        UNION
        SELECT m.user_id
        FROM public.member m
        WHERE m.group_id IN (
            SELECT gm.group_id
            FROM public.member gm
            WHERE gm.user_id = $1
        )
        AND m.user_id != $1
        AND NOT EXISTS (
            SELECT 1
            FROM public.friendlist f
            WHERE (f.user_id = $1 AND f.friend_id = m.user_id)
            OR (f.friend_id = $1 AND f.user_id = m.user_id)
        )
    )
    AND u.user_id != $1;
    `;

    const { rows: suggestions } = await pool.query(Suggestions, [userId]);
    const responseData = {
        friendRequests,
        suggestions,
    };
    res.json(responseData);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
