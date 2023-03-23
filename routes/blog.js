const router = require('express').Router();
const verify = require('../middlewares/verifyToken');


// added verify under the routes so that only a person logged in will only be the onne to get the post under

router.get('/blog', verify, (req, res) =>{
    res.json(
        {blogs: {title: 'first blog', 
                 details:'football is a teacher of value , sacrifice , humididty , team work and honesty'
        }
    });
});

module.exports = router;
