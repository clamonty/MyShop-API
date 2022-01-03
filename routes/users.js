const router = require('express').Router();
const {verifyTokenAndAuthorization, verifyTokenAndAdmin} = require('./tokenVerification');
const User = require('../models/User');

// UPDATE user
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    // If password accidentally sent, encrypt it 
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString();
    }

  try {
    // Find the user from the database by ID param, update with information in req.body
    const updatedUser = await User.findByIdAndUpdate(req.params.id,
        {
            $set: req.body,
        },
        {new: true}
    );
    // Return the updated user information
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE user
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User was succesfully deleted")
    } catch (error) {
        res.status(500).json(error);
    }
});

// GET user with specific id
// Only able to be done if sender has admin jwt token
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        // Get user based on id
        const user = await User.findById(req.params.id);
        // Destructure user to remove password
        const {password, ...others} = user._doc;
        res.status(200).json(others);
    } catch (error) {
        res.status(404).json("User not found");
    }
});

// GET all users
// Only able to be done by admin
router.get("/find/", verifyTokenAndAdmin, async(req, res) => {
    const query = req.query.new;
    try {
        // If /find/?new=true, return first 5 users
        // Else return all users
        const users = query 
        ? await User.find().sort({_id: -1}).limit(5) 
        : await User.find();

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json(error);
    }
});

// GET user statistics
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    // Get the last year as a variable
    const lastYear = new Date(date.setFullYear(date.getFullYear - 1));
    
    try {

        const data = await User.aggregate([
            // Match users that were created any time after last year
            {$match: {createdAt: {$gte: lastYear}}},
            {
                $project:{
                    month: {$month: "$createdAt"},
                },
            },
            {
                // Group and return users based on month they were created
                $group:{
                    _id: "$month",
                    total:{$sum: 1}
                }
            }
        ]);

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json(error);
    }
})




module.exports = router;