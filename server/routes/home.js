const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.get("/", authorization, async (req, res) => {
  const userId = req.user;

  try {
    const bookQuery = `
            SELECT DISTINCT book.*
            FROM book
            JOIN bookcopy ON book.book_id = bookcopy.book_id
            WHERE (
                bookcopy.owner_id IN (
                    SELECT friend_id FROM friendlist WHERE user_id = $1
                    UNION
                    SELECT user_id FROM friendlist WHERE friend_id = $1
                ) AND bookcopy.owner_id <> $1
            )
            OR (
                bookcopy.copy_id IN (
                    SELECT bc.copy_id
                    FROM bookcopy bc
                    JOIN member m ON bc.owner_id = m.user_id
                    JOIN member m2 ON m.group_id = m2.group_id AND m2.user_id = $1
                    WHERE bc.sharing_status = 'group' AND bc.owner_id <> $1
                )
            )
            OR (
                bookcopy.sharing_status = 'public' AND bookcopy.owner_id <> $1
            );
        `;
    const { rows: books } = await pool.query(bookQuery, [userId]);

    const reviewQuery = `
            SELECT 
                r.review_id, 
                r.book_id, 
                r.review_text, 
                r.upvotes, 
                r.reviewer_id, 
                r.audience, 
                r.review_time,
                COUNT(DISTINCT ci.comment_id) AS reply_count
            FROM 
                public.review r
            LEFT JOIN public.comment_info ci ON ci.review_id = r.review_id AND ci.prev_comment_id IS NOT NULL
            JOIN public.user_info u ON u.user_id = r.reviewer_id
            LEFT JOIN public.friendlist fl ON (fl.user_id = $1 AND fl.friend_id = r.reviewer_id) OR (fl.friend_id = $1 AND fl.user_id = r.reviewer_id)
            LEFT JOIN public.member m1 ON m1.user_id = $1
            LEFT JOIN public.member m2 ON m2.user_id = r.reviewer_id AND m1.group_id = m2.group_id
            WHERE 
                r.audience = 'public' 
                OR fl.user_id IS NOT NULL 
                OR (r.audience = 'group' AND m1.group_id IS NOT NULL AND m1.group_id = m2.group_id)
            GROUP BY r.review_id
            ORDER BY 
                r.review_time DESC, 
                reply_count DESC
                r.upvotes DESC;
        `;
    const { rows: reviews } = await pool.query(reviewQuery, [userId]);
    const friendQuery = `
            SELECT user_info.*
            FROM user_info
            JOIN friendlist ON user_info.user_id = friendlist.friend_id
            WHERE friendlist.user_id = $1;
        `;
    const { rows: friends } = await pool.query(friendQuery, [userId]);

    const groupQuery = `
            SELECT group_info.*
            FROM group_info
            JOIN member ON group_info.group_id = member.group_id
            WHERE member.user_id = $1;
        `;
    const { rows: groups } = await pool.query(groupQuery, [userId]);

    const responseData = {
      books,
      reviews,
      friends,
      groups,
    };
    res.json(responseData);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
