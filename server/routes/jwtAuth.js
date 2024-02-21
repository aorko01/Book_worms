const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtgenerator");
const validInfo = require("../middleware/validinfo");
const authorization = require("../middleware/authorization");

router.post("/register",validInfo, async (req, res) => {
  try {
    const { first_name, last_name, email_address, password } = req.body;

    //check if user exists
    const user = await pool.query(
      "SELECT * FROM user_info WHERE email_address = $1",
      [email_address]
    );
    if (user.rows.length !== 0) {
      return res.status(401).send("User already exists");
    }

    //bcrypt the user password
    else {
      const saltRound = 10;
      const salt = await bcrypt.genSalt(saltRound);
      const bcryptPassword = await bcrypt.hash(password, salt);
      const newUser = await pool.query(
        "INSERT INTO user_info (first_name, last_name, email_address, password) VALUES ($1, $2, $3, $4) RETURNING *",
        [first_name, last_name, email_address, bcryptPassword]
      );
      const token = jwtGenerator(newUser.rows[0].user_id);
      res.json({ token });
    }
    //enter the user into the database
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
});

router.post("/login", async (req, res) => {

    try {
        const { email_address, password } = req.body;
        const user = await pool.query("SELECT * FROM user_info WHERE email_address = $1", [email_address]);
        if (user.rows.length === 0) {
            return res.status(401).send("Password or Email is incorrect");
        }
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(401).send("Password or Email is incorrect");
        }
        const token = jwtGenerator(user.rows[0].user_id);
        res.json({ token });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server error");
    }

});

router.get("/is-verify", authorization, async (req, res) => {
    console.log("hit");
    try {
        res.json(true);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server error");
    }
});

module.exports = router;
