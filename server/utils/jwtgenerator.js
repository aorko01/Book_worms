const jwt=require('jsonwebtoken');
require('dotenv').config({ path: './server/.env' });


function jwtGenerator(user_id){
    const payload={
        user:user_id
    };
    console.log("JWT Secret:", process.env.jwtSecret);
    return jwt.sign(payload, process.env.jwtSecret, {expiresIn:"1hr"});
}

module.exports=jwtGenerator;


