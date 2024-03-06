const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.get("/:book_id", authorization, async (req, res) => {
    const { book_id } = req.params;

    try {
        // Fetch book information
        const bookInfo = await pool.query("SELECT * FROM public.book WHERE book_id = $1", [book_id]);

        // Fetch owners of the book
        const bookOwners = await pool.query(`
            SELECT u.user_id, u.first_name, u.last_name, u.email_address
            FROM public.user_info u
            INNER JOIN public.bookcopy bc ON u.user_id = bc.owner_id
            WHERE bc.book_id = $1
        `, [book_id]);

        // Fetch reviews, their corresponding comments, and reviewer information
        const reviews = await pool.query(`
            SELECT r.*,  
                   json_agg(c.*) AS comments,
                   json_build_object(
                       'user_id', u.user_id,
                       'first_name', u.first_name,
                       'last_name', u.last_name,
                       'email_address', u.email_address
                   ) AS reviewer_info
            FROM public.review r
            LEFT JOIN public.comment_info c ON r.review_id = c.review_id
            INNER JOIN public.user_info u ON r.reviewer_id = u.user_id
            WHERE r.book_id = $1
            GROUP BY r.review_id, u.user_id
        `, [book_id]);

        res.json({
            book: bookInfo.rows[0], // Assuming there's only one book per book_id
            owners: bookOwners.rows,
            reviews: reviews.rows
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});



module.exports = router;
