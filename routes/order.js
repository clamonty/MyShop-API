const router = require('express').Router();
const {verifyTokenAndAuthorization, verifyTokenAndAdmin} = require('./tokenVerification');
const Order = require('../models/Order');

// CREATE order
router.post('/', verifyToken, async(req, res) => {
    const newOrder = new Order(req.body);

    try {
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    } catch (error) {
        res.status(500).json(error);
    }
})

// UPDATE order
router.put('/:id', verifyTokenAndAdmin, async(req, res) => {
    try {
        const updatedOrder = Order.findByIdAndUpdate(req.params.id,
            {
                $set: req.body
            },
            {new: true}
        );
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json(error);
    }
});

// DELETE order
router.delete('/:id', verifyTokenAndAdmin, async(req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id); 
        res.status(200).json("Order was successfuly deleted");
    } catch (error) {
        res.status(500).json(error);
    }
});


// GET user order
router.get("/find/:userId", verifyTokenAndAuthorization, async(req, res) => {
    try {
        const orders = await Orders.find({userId: req.params.userId});
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json(error);
    }
});

// GET all orders
router.get("/", verifyTokenAndAdmin, async(req, res) => {
    try {
        const orders = await Orders.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json(error);
    }
});


module.exports = router;