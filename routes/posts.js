const router = require('express').Router()
const verify = require('./verifyToken')


router.get('/', verify, (req, res) => {
    res.send(req.user)

    // Find User based on token 
    // User.findbyOne({_id: req.user})
   
})


module.exports = router;