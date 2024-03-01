const router = require("express").Router();

router.get('/logout', (req, res) => {
    res.cookie('jwt', '', { expires: new Date(0) }); // Set the JWT cookie to expire immediately
    res.send({ status: 'success', message: 'Logged out successfully' });
  });
  

module.exports = router;
