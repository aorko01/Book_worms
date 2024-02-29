require('dotenv').config();
const cookieParser=require('cookie-parser');
const express=require('express');
const app = express();
const port = 3000;
require('dotenv').config();

const cors = require('cors');

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(cors({
    origin: 'http://localhost:5173', // Your frontend origin
    credentials: true // To allow sending cookies from the frontend
  }));
// just send a response to the client


app.use("/auth", require('./routes/jwtAuth'));

app.use("/Home", require('./routes/home'));

app.listen (3000, () => {
    console.log(`Server is running on port ${port}`);
})