const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Load profile model
const Profile = require("../../Models/Profile");
//Load user model
const User = require("../../Models/User");

//@route    GET /api/users/test
//@desc     Test Users Route
//@access   PUBLIC
router.get("/test", (req, res) => {
    res.json({
        msg: "Profile route works"
    })
});

//@route    GET /api/profile
//@desc     get current users profile
//@access   Private
router.get("/", passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.findOne({ user: req.user.id})
           .populate('user', ['name', 'avatar'])
           .then(profile => {
               if(!profile){
                   return res.status(404).json({
                       msg:"There is no profile"
                   })
               }
               res.json(profile);
           })
           .catch(err => {
               console.log(err);
               res.status(404).json({
                   msg: "Error occured"
               })
           })
})


//@route    POST /api/profile
//@desc     Create or edit profile
//@access   Private
router.post("/", passport.authenticate('jwt', {session: false}), (req, res) => {
    const profileFields ={};
    profileFields.user = req.user.id;

    if(req.body.handle) profileFields.handle = req.body.handle;
    if(req.body.company) profileFields.company = req.body.company;
    if(req.body.website) profileFields.website = req.body.website;
    if(req.body.location) profileFields.location = req.body.location;
    if(req.body.bio) profileFields.bio = req.body.bio;
    if(req.body.status) profileFields.status = req.body.status;
    if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;

    //Skills- split into an array
    if(typeof req.body.skills !== 'undefined'){
        profileFields.skills = req.body.skills.split(',');
    }

    //Social
    profileFields.social = {}
    if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if(req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({user: req.user.id})
           .then(profile => {
               if(profile){
                   //Update
                   Profile.findOneAndUpdate({user: req.user.id}, 
                                            {$set: profileFields}, 
                                            {new: true})
                          .then(profile => res.json(profile))                  
               }
               else{
                   //Create

                   //Check if handle exits
                   Profile.findOne({handle: profileFields.handle})
                          .then(profile => {

                            if(profile){
                                res.status(404).json({
                                    msg: "That handle already exists"
                                })
                            }
                              
                    //Save profile      
                    new Profile(profileFields).save()
                                              .then(profile => res.json(profile))
               
           })
        }
    })
});

//@route    GET /api/profile/handle/:handle
//@desc     Get profile by handle
//@access   Public

router.get("/handle/:handle", (req, res) => {
    Profile.findOne({handle: req.params.handle})
           .populate('user', ['name', 'avatar'])
           .then(profile => {
            if(!profile){
                return res.status(404).json({
                    msg:"There is no profile"
                })
            }
            res.json(profile);
            })
            .catch(err => {
                console.log(err);
                res.json({
                    msg: "There's an eror"
                })
            })

})



//@route    GET /api/profile/user/:user_id
//@desc     Get profile by user ID
//@access   Public

router.get("/user/:user_id", (req, res) => {
    Profile.findOne({user: req.params.user_id})
           .populate('user', ['name', 'avatar'])
           .then(profile => {
            if(!profile){
                return res.status(404).json({
                    msg:"There is no profile"
                })
            }
            res.json(profile);
            })
            .catch(err => {
                console.log(err);
                res.json({
                    msg: "There's an eror"
                })
            })

})

//@route    GET /api/profile/all
//@desc     Get get all profiles
//@access   Public
router.get("/all", (req, res) => {
    Profile.find()
           .populate('user', ['name','avatar'])
           .then(profiles => {
               if(!profiles){
                   return res.status(404).json({
                       msg: "There are no profiles"
                   })
               }
               res.json(profiles)
            })
           .catch(err => {
               res.json({
                   msg: "Theres an error"
               })
               console.log(err);
           })
})


//@route    POST /api/profile/experience
//@desc     Add experience to profile
//@access   Private
router.post("/experience", passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.findOne({user: req.user.id})
           .then(profile =>{
               const newExp = {
                   title: req.body.title,
                   company: req.body.company,
                   location: req.body.location,
                   from: req.body.from,
                   to: req.body.to,
                   current: req.body.current,
                   description: req.body.description
               }

               //Add to experience array
               profile.experience.unshift(newExp);
               profile.save()
                      .then(profile => {
                        //Here we will need slot timings and slot id/maxtoksens
                        //Use this logice to show the slot timing

                        //For mapping one value
                        companyArray = profile.experience.map(value => value._id);
                        //for mapping multiple values
                        const output = profile.experience.map(({_id, company, title}) => ({_id, company, title}))
                        console.log(output)

                          res.json(profile);
                      })
                      .catch(err => {
                          console.log(err);
                          res.json({
                              msg: "Error Saving experience"
                          })
                      })
           })
})


//@route    POST /api/profile/education
//@desc     Add education to profile
//@access   Private
router.post("/education", passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.findOne({user: req.user.id})
           .then(profile =>{
               const newEdu = {
                   school: req.body.school,
                   degree: req.body.degree,
                   fieldofstudy: req.body.fieldofstudy,
                   from: req.body.from,
                   to: req.body.to,
                   current: req.body.current,
                   description: req.body.description
               }

               //Add to experience array
               profile.education.unshift(newEdu);
               profile.save()
                      .then(profile => {
                          res.json(profile)
                      })
                      .catch(err => {
                          console.log(err);
                          res.json({
                              msg: "Error Saving education"
                          })
                      })
           })
})


//@route    DELETE /api/profile/experience/:exp_id
//@desc     Delete experience from profile
//@access   Private
router.delete("/experience/:exp_id", passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.findOne({user: req.user.id})
           .then(profile => {
               //Get the index you want to remove
                const removeIndex = profile.experience
                                           .map(item => item.id)
                                           .indexOf(req.params.exp_id);

                //Splice out of Array
                profile.experience.splice(removeIndex, 1);  
                
                profile.save()
                       .then(profile => res.json(profile))
                       .catch(err => {
                           res.json({
                               msg:"Error deleting the experience"
                           })
                           console.log(err)
                       })
           })
})

//Logic to get the specific slot
router.get("/experience/:exp_id", passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.findOne({user: req.user.id})
           .then(profile => {
            const getProfileindex = profile.experience
                                       .map(item => item.id)
                                       .indexOf(req.params.exp_id);

            res.json(profile.experience[getProfileindex].title)                           
           })
})


//@route    DELETE /api/profile/education/:edu_id
//@desc     Delete experience from profile
//@access   Private
router.delete("/education/:edu_id", passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.findOne({user: req.user.id})
           .then(profile => {
               //Get the index you want to remove
                const removeIndex = profile.education
                                           .map(item => item.id)
                                           .indexOf(req.params.exp_id);

                //Splice out of Array
                profile.education.splice(removeIndex, 1);  
                
                profile.save()
                       .then(profile => res.json(profile))
                       .catch(err => {
                           res.json({
                               msg:"Error deleting the education"
                           })
                           console.log(err)
                       })
           })
})


        
           





module.exports = router