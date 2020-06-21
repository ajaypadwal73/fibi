const express = require("express");
const router = express.Router();
const User = require("../../Models/User");
const gravatar = require('gravatar');
const bcrypt = require("bcryptjs");
var jwt = require('jsonwebtoken');
const key = require("../../config/keys");
const passport = require("passport")



//@route    GET /api/users/test
//@desc     Test Users Route
//@access   PUBLIC
router.get("/test", (req, res) => {
    res.json({
        msg: "User route works"
    })
})

//@route    POST /api/users/register
//@desc     Register User
//@access   PUBLIC
router.post("/register", (req, res) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if(user){
                return res.status(400).json({
                    email: "Email already exists"
                })
            }
            else{

                const avatar = gravatar.url(req.body.email, {
                    s:'200',//Size
                    r:"pg",//Rating
                    d:'mm'//default
                })
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password
                });

                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(newUser.password, salt, function(err, hash) {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                               .then(user => res.json(user))
                               .catch(err => console.log(err))
                    });
                });
            }
        })
});


//@route    POST /api/users/login
//@desc     User login
//@access   PUBLIC
router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email})
        .then(user => {
            //Checking if user exists
            if(!user){
                return res.status(400).json({
                    email: "User not found"
                })
            }

            bcrypt.compare(password, user.password)
                  .then(isMtach => {
                      if(isMtach){

                        //User Match
                        const payload = {id: user.id, name: user.name, avatar: user.avatar}
                        jwt.sign(payload, key.jwtkey , { expiresIn: '1h' }, (err, token) => {
                            if(err) throw err;
                            res.json({
                                success: true,
                                token: 'Bearer ' + token
                            })
                        });
                      }
                      else{
                          return res.status(400).json({
                              password: "Incorrect password"
                          })
                      }
                  });
            
         })
});

//@route    GET /api/users/current
//@desc     Return current user
//@access   PUBLIC
router.get("/current", passport.authenticate('jwt', {session: false}), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    })
})

module.exports = router