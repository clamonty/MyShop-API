const router = require('express').Router();
const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require('./tokenVerification');
const Product = require('../models/Product');


// POST create new product
router.post('/', verifyTokenAndAdmin, async(req,res) => {
    // Make new product
    const newProduct = new Product(req.body);

    try {
        // Save product to Product collection and send as json
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    } catch (error) {
        res.status(500).json(error);
    }
});

// GET all products
router.get('/', async (req, res) => {
    // Queries for different product fetching
    const newQuery = req.query.new;
    const categoryQuery = req.query.category;
    try {
        let products;
        // If new query, sort products by createdAt date and show most recent 5
        if (newQuery) {
            products = await Product.find().sort({createdAt: -1}).limit(1);
        } 
        // If category query, find all products whose categories value contains the query
        else if (categoryQuery) {
            products = await Product.find({category: {
                $in:[categoryQuery]
            }});
        } 
        // If no new query or category query, return all products
        else {
            products = await Product.find();
        }

        res.status(200).json(products);
        
    } catch (error) {
        res.status(500).json(error);
    }
})

// GET product by ID
router.get('/find/:id', async(req, res) => {
    try {
        // Look for the specific product
        const product = await Product.findById(req.params.id);

        // If not found, return 404 error
        if(!product)
            res.status(404).json("Cannot find product with that ID");
        
        // Else return product as payload
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json(error);
    }
});

// UPDATE product
// Only doable by admin
router.put('/update/:id', verifyTokenAndAdmin, async(req, res) => {
    try {
        // Look for and update the product according to the req body
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id,
            {
                $set: req.body
            },
            {new: true}
        );
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json(error);
    }
});

// DELETE product
// Only doable by admin
router.delete('/:id', verifyTokenAndAdmin, async(req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product was successfuly deleted");
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router;