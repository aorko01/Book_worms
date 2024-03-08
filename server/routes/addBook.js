const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.post("/", authorization, async (req, res) => {
  const userId = req.user; // Assuming this is the owner_id for bookcopy
  console.log("hit add book route");
  const { title, author_name, genre, page_count, cover_url,book_id,audience } = req.body;

  console.log("title: ", title);
  console.log("author_name: ", author_name);
  console.log("genre: ", genre);
  console.log("page_count: ", page_count);
  console.log("cover_url: ", cover_url);
  console.log("userId: ", userId);
  console.log("page_count: ", page_count);
  console.log("book_id: ", book_id);
  console.log("audience: ", audience);

  try {
    // Step 1: Check if the book already exists
    if(book_id){
      await pool.query(
        "INSERT INTO bookcopy (book_id, owner_id, availability, sharing_status) VALUES ($1, $2, TRUE, $3)",
        [book_id, userId,audience]
      );
      res.json({ message: "Book copy added successfully." });
      return;
    }

     else {

      const newBook = await pool.query(
        "INSERT INTO book (title, author_name, genre, page_count, cover_url) VALUES ($1, $2, $3, $4, $5) RETURNING book_id",
        [title, author_name, genre, page_count, cover_url]
      );
      bookId = newBook.rows[0].book_id;
      await pool.query(
        "INSERT INTO bookcopy (book_id, owner_id, availability, sharing_status) VALUES ($1, $2, TRUE, $3)",
        [bookId, userId,audience]
      );
    }


    

    res.json({ message: "Book copy added successfully." });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
