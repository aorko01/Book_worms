const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.get("/:groupId", authorization, async (req, res) => {
    console.log("Fetching individual group");
    const { groupId } = req.params;

    try {
        // Fetch group name
        const group = await pool.query("SELECT * FROM public.group_info WHERE group_id = $1", [groupId]);
        const groupName = group.rows[0].group_name;

        // Fetch group members
        const groupMembers = await pool.query("SELECT * FROM public.member WHERE group_id = $1", [groupId]);

        // Fetch unique books owned by group members
        const books = await pool.query(
            "SELECT DISTINCT b.* FROM public.bookcopy bc JOIN public.book b ON bc.book_id = b.book_id WHERE bc.owner_id = ANY($1)",
            [groupMembers.rows.map(member => member.user_id)]
        );

        // Fetch reviews written by group members along with book names
        const reviews = await pool.query(
            "SELECT r.*, b.title as book_name FROM public.review r JOIN public.book b ON r.book_id = b.book_id WHERE b.book_id = ANY(SELECT DISTINCT bc.book_id FROM public.bookcopy bc WHERE bc.owner_id = ANY($1))",
            [groupMembers.rows.map(member => member.user_id)]
        );

        res.json({
            groupName: groupName,
            groupMembers: groupMembers.rows,
            uniqueBooksOwnedByGroupMembers: books.rows,
            reviewsByGroupMembers: reviews.rows
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});

module.exports = router;
