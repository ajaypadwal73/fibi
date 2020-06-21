const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const Post = require("../../Models/Post");
const Profile = require("../../Models/Profile");


//@route    GET /api/post/test
//@desc     Test Post Route
//@access   PUBLIC
router.get("/test", (req, res) => {
    res.json({
        msg: "Post route works"
    })
})

//@route    POST /api/posts
//@desc     Test Users Route
//@access   PRIVATE
router.post("/", passport.authenticate('jwt', {session: false}), (req, res) => {
    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    });

    newPost.save()
           .then(post => res.json(post))
           .catch(err => console.log(err));
})

//@route    GET /api/post/
//@desc     Get all posts
//@access   PUBLIC
router.get("/", (req, res) => {
    Post.find()
        .sort({date: -1})
        .then(posts => res.json(posts))
        .catch(err => console.log(err))
})

//@route    GET /api/post/:id
//@desc     Get  post by id
//@access   PUBLIC
router.get("/:id", (req, res) => {
    Post.findById(req.params.id)
        .then(post => res.json(post))
        .catch(err => console.log(err))
})

//@route    DELETE /api/post/:id
//@desc     Delete  post by id
//@access   PRIVATE
router.delete("/:id", passport.authenticate('jwt', {session:false}) ,(req, res) => {
    Profile.findOne({user: req.user.id})
           .then(profile => {
               Post.findById(req.params.id)
                   .then(post => {
                       // Check for post owner
                       if(post.user.toString() !== req.user.id){
                           return res.status(401).json({
                               err: " User not authorized"
                           })
                       }

                       //Delete
                        post.remove()
                            .then((post) => res.json({
                                Success: true
                            }))
                            .catch(err => res.json({
                                msg: "Error deleting the Post"
                            }))
                   })

           })
})

module.exports = router