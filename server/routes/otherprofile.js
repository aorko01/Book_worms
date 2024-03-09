const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.get("/:userId", authorization, async (req, res) => {
    console.log("fetching other user profile data");
    const { userId } = req.params; // Get the userId from the URL parameter
    const user_id = userId;
   
    try {
        // Fetch user information
        const userQuery = `
            SELECT * 
            FROM public.user_info 
            WHERE user_id = $1
        `;
        const userData = await pool.query(userQuery, [user_id]);
        const user = userData.rows[0];

        // Fetch books owned by the user
        const userBooksQuery = `
            SELECT b.*
            FROM public.book b
            JOIN public.bookcopy bc ON b.book_id = bc.book_id
            WHERE bc.owner_id = $1
        `;
        const userBooksData = await pool.query(userBooksQuery, [user_id]);
        const userBooks = userBooksData.rows;

        // Fetch friends of the user
        const userFriendsQuery = `
            SELECT u.*
            FROM public.user_info u
            JOIN public.friendlist f ON u.user_id = f.friend_id
            WHERE f.user_id = $1
        `;
        const userFriendsData = await pool.query(userFriendsQuery, [user_id]);
        const userFriends = userFriendsData.rows;

        // Fetch groups the user is in
        const userGroupsQuery = `
            SELECT g.*
            FROM public.group_info g
            JOIN public.member m ON g.group_id = m.group_id
            WHERE m.user_id = $1
        `;
        const userGroupsData = await pool.query(userGroupsQuery, [user_id]);
        const userGroups = userGroupsData.rows;

        // Fetch reviews written by the user along with book information and comments
        const reviewQuery = `
            SELECT 
                r.review_id, 
                r.book_id, 
                r.review_text, 
                r.upvotes, 
                r.reviewer_id, 
                r.audience, 
                r.review_time,
                COUNT(DISTINCT ci.comment_id) AS reply_count,
                b.title AS book_title,
                b.author_name AS book_author,
                b.genre AS book_genre
            FROM 
                public.review r
            LEFT JOIN public.comment_info ci ON ci.review_id = r.review_id AND ci.prev_comment_id IS NOT NULL
            LEFT JOIN public.book b ON r.book_id = b.book_id
            WHERE 
                r.reviewer_id = $1
            GROUP BY 
                r.review_id, r.book_id, r.review_text, r.upvotes, r.reviewer_id, r.audience, r.review_time, b.title, b.author_name, b.genre
            ORDER BY 
                r.review_time DESC;
        `;
        const reviewData = await pool.query(reviewQuery, [user_id]);
        const reviews = reviewData.rows;

        res.json({
            user,
            books: userBooks,
            friends: userFriends,
            groups: userGroups,
            reviews: reviews
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});


module.exports = router;
