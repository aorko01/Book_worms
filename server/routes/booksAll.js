const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.get("/", authorization, async (req, res) => {
  const userId = req.user;
  console.log("userId: ", userId);

  try {
    const bookQuery=`SELECT *
    FROM public.book
    ORDER BY title;
    `;

    const { rows: books } = await pool.query(bookQuery);
    const responseData = {
      books,
    };
    res.json(responseData);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
