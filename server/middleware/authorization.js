const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req,res,next)=>{
    try {
        // console.log(req.headers);
        const jwtToken = req.cookies.token;
        // console.log(jwtToken);

        if(!jwtToken){
            console.log("Not Authorized");
            return res.status(403).json("Not Authorized");
        }
        const payload = jwt.verify(jwtToken, process.env.jwtSecret);
        req.user = payload.user;
        next();
    } catch (error) {
        console.error(error.message);
        return res.status(403).json("Not Authorized");
    }
}