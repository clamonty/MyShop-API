const router = require('express').Router();
const Cart = require('../models/Cart');
const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require('./tokenVerification');

// CREATE cart
// Any registered user can create a new cart
router.post('/', verifyTokenAndAuthorization, async (req, res) => {
    // Create a new cart model
    const newCart = new Cart(req.body);

    try {
        // Save and return that cart as json
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    } catch (error) {
        res.status(500).json(error);
    }
});

// UPDATE cart
// Any registered user can update their cart
router.put('/:id', verifyTokenAndAuthorization, async(req, res) => {
    try {
        const updatedCart = Cart.findByIdAndUpdate(req.params.id,
            {
                $set: req.body
            },
            {new: true}
        );
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json(error);
    }
})

// DELETE (empty) cart
// Any registered user can delete their cart
router.delete('/:id', verifyTokenAndAuthorization, async(req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("Cart was successfuly deleted");
    } catch (error) {
        res.status(500).json(error);
    }
});

// GET cart by user id
router.get('/find/:userId', verifyTokenAndAuthorization, async(req, res) => {
    try {
        // Find cart that matches condition of userId matching parameter 
        const cart = await Cart.findOne({userId: req.params.userId});
        if (!cart)
            res.status(404).json("No cart found with this id");
        
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json(error);
    }
});

// GET all carts
router.get('/', verifyTokenAndAdmin, async(req, res) => {
    try {
        const carts = await Cart.find();
        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router;