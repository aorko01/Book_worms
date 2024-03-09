const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.post("/", authorization, async (req, res) => {
    console.log("Return book request received");
  try {
    const { sharing_id } = req.body;

    // Update the returned status in the sharing table
    const updateSharingQuery = `
      UPDATE sharing
      SET returned = true
      WHERE sharing_id = $1;
    `;
    await pool.query(updateSharingQuery, [sharing_id]);

    // Update the availability in the bookcopy table
    const updateBookCopyQuery = `
      UPDATE bookcopy
      SET availability = true
      FROM sharing
      WHERE sharing.copy_id = bookcopy.copy_id
      AND sharing.sharing_id = $1;
    `;
    await pool.query(updateBookCopyQuery, [sharing_id]);

    res.json({ message: "Book returned successfully." });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});




module.exports = router;
