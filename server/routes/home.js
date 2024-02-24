const router=require('express').Router();

const pool=require('../db');
const authorization=require('../middleware/authorization');

router.get('/',authorization, async (req,res)=>{
    const userId=req.user;
    const suggest_book_of_friends= await pool.query("select * from bookcopy where owner_id IN (select friend_id from friendlist where user_id=$1) and sharing_status='friends' and availability=true;",[userId]);
    const suggest_book_of_public= await pool.query("select * from bookcopy where sharing_status='public' and availability=true;");
    const suggest_book_of_exchange_from_friends= await pool.query("select * from bookcopy where owner_id IN (select friend_id from friendlist where user_id= $1) and sharing_status='exchange' and availability=true;",[userId]);
    const suggest_book_of_group= await pool.query("select * from bookcopy where owner_id in ( select user_id from member where group_id in (select group_id from member where user_id=$1)) and owner_id !=$1 and availability=true",[userId]);
    const responseData = {
        suggest_book_of_friends: suggest_book_of_friends.rows
        ,suggest_book_of_public: suggest_book_of_public.rows,
        suggest_book_of_exchange_from_friends: suggest_book_of_exchange_from_friends.rows
        ,suggest_book_of_group: suggest_book_of_group.rows

    };

    try {
        res.json(responseData);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
})



module.exports=router;