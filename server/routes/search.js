const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.get("/", authorization, async (req, res) => {
    const { searchTerm } = req.query;
    console.log("hit search route");

    try {
        // Search users by name (first or last name partially matched)
        const users = await pool.query(
            "SELECT user_id, first_name, last_name, email_address FROM public.user_info WHERE first_name ILIKE $1 OR last_name ILIKE $1", 
            [`%${searchTerm}%`]
        );

        // Combine book search by title, author name, and genre into a single query to return unique books
        const books = await pool.query(
            `SELECT DISTINCT * FROM public.book 
             WHERE title ILIKE $1 
             OR author_name ILIKE $1 
             OR genre ILIKE $1`, 
            [`%${searchTerm}%`]
        );

        res.json({
            users: users.rows,
            books: books.rows
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});

module.exports = router;
