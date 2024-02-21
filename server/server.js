require('dotenv').config();
const db=require('./db');
const express=require('express');
const app = express();
const port = 3000;
require('dotenv').config();

// const cors = require('cors');

app.use(express.json());

// app.use(cors());
// just send a response to the client


app.use("/auth", require('./routes/jwtAuth'));

app.listen (3000, () => {
    console.log(`Server is running on port ${port}`);
})