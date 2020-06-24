const express = require("express");
const router = express.Router();
const User = require("../../Models/User");
const urlMetadata = require('url-metadata');


//@route    POST /api/users/register
//@desc     Register User
//@access   PUBLIC
router.post("/register", (req, res) => {
    const newUser = new User({
        name: req.body.name,
        url: req.body.url,
        type: req.body.type
        
    });
    newUser.save()
           .then(user => res.json(user))
           .catch(err => console.log(err))
});


//Route to get All the Data
router.get("/getImages", (req, res) => {
    User.find()
        .then(users => {
            res.json(users)
        })
        .catch(err => console.log(err));
})


//Route for pagination i.e setting offset and limit
router.get("/paginate", (req, res) => {
    User.paginate({}, {offset:3, limit:2}, (err, result) => {
        if(err){
            console.log(err);
        }
        else{
            res.json(result);
        }
    } )
})



//TASK2 extracting metadata from url


router.get("/storeMetaData/:id", (req, res) => {

     const extractData = []
    User.findById(req.params.id)
        .then(user => {

            urlMetadata(user.url).then(
                function (metadata) { // success handler
                    console.log(metadata)
                    extractData.push(metadata);
                 },
                function (error) { // failure handler
                console.log(error)
              })

        })
        .catch(err => console.log(err))


      User.findByIdAndUpdate(req.params.id, {extractData: extractData}, (err, updatedUser) => {
          if(err){
              console.log(err)
          }
          else{
              res.json(updatedUser)
          }
      })  



        


 

});


module.exports =router;
