require('dotenv').config();
const db=require('./db');

const express=require('express');

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/api/v1/employees', async (req, res) => {
    try {
        const results = await db.query('select * from employees');
        res.status(200).json({
            status: 'success',
            results: results.rows.length,
            data: {
                employees: results.rows
            }
        });
    } catch (err) {
        console.log(err);
    }
})

app.listen (3000, () => {
    console.log(`Server is running on port ${port}`);
})