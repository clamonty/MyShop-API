const router = require('express').Router();
// Models
const User = require('../models/User');

// Imports
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');


// User Registration
router.post('/register', async (req, res) => {

    // Create new user from info in the body
    const newUser = new User({
        username: req.body.username,

        // encrypt password with AES cipher
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_KEY).toString(),
        email: req.body.email,
        isAdmin: req.body.isAdmin ? req.body.isAdmin : 'false'
    });

    // Try and save new user to database
    try {
        const savedUser = await newUser.save();
        res.status(200).json(savedUser);
    } catch (error) {
        res.status(500).json(error);
    }
});

// Login User
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({username: req.body.username});
        // If no user found send error 401
        if(!user)
            res.status(401).json("No such user found");

        // Decrypt AES encrypted pw from user model
        const decryptedPW = CryptoJS.AES.decrypt(user.password, process.env.PASS_KEY).toString(CryptoJS.enc.Utf8);

        // If passwords don't match, send error 401
        if (decryptedPW !== req.body.password)
            res.status(401).json("wrong login credentials");

        // Generate JWT access token, valid for 3 days
        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin,
        }
        , process.env.JWT_KEY
        , {expiresIn:"3d"})
        // Destructure user to remove password field
        const {password, ...others} = user._doc;
        res.status(200).json({...others, accessToken});


    }
    catch(error) {
        console.log(error);
    }
})

module.exports = router;