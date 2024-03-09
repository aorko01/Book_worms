require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const port = 3000;

const cors = require("cors");

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend origin
    credentials: true, // To allow sending cookies from the frontend
  })
);
// just send a response to the client

app.use("/auth", require("./routes/jwtAuth"));

app.use("/Home", require("./routes/home"));

app.use("/search", require("./routes/search"));

app.use("/books-all", require("./routes/booksAll"));

app.use("/logout", require("./routes/logout"));

app.use("/reject-request", require("./routes/rejectrequest"));

app.use("/send-request", require("./routes/sendrequest"));

app.use("/post-review", require("./routes/postReview"));

app.use("/add-friend", require("./routes/addasfriend"));

app.use("/addbook", require("./routes/addBook"));

app.use("/borrowrequest", require("./routes/borrowrequest"));

app.use("/book-requests", require("./routes/getNotification"));

app.use("/acceptbookrequest", require("./routes/accpetbookrequest"));

app.use("/return-book", require("./routes/return-book"));

app.use('/create-group', require('./routes/creategroup'));

app.use('/groups', require('./routes/getgroups'));

// app.use("/increase-upvotes", require('./routes/increaseUpvotes'));

// app.use("/post-comment", require('./routes/postComment'));

app.use("/friends", require("./routes/friends"));

app.use("/individual-book", require("./routes/getIndividualBook"));

app.use("/add-upvote", require("./routes/addupvote"));

app.use("/reduce-upvote", require("./routes/reduceupvote"));

app.use("/profile", require("./routes/profile"));

app.use("/getchatlist", require("./routes/getchatlist"));

app.use("/getmessages", require("./routes/getmessages"));

app.use("/other-profile", require("./routes/otherprofile"));

// app.use("groups", require('./routes/groups'));

// app.use("add-book", require('./routes/addBook'));

app.listen(3000, () => {
  console.log(`Server is running on port ${port}`);
});
