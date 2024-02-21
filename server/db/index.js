const { Pool } = require('pg');


const pool=new Pool({
    user:"postgres",
    host:"localhost",
    database:"Book_Worms",
    password:"Lifeisgood@1",
    port:5432
})

module.exports= {
    query : (text, params ) => pool.query(text, params)
}


