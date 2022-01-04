const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_KEY);

/* --------------------------- POST stripe payment -------------------------- */
router.post('/payment', (req, res) => {
    // Create payment charge with the source of the charge, the amount, and the currency (default usd)
    stripe.charges.create({
        source: req.body.tokenId,
        amount: req.body.amount,
        currency: "USD"
    }, 
    (stripeError, stripeSuccess) => {
        if(stripeError)
            res.status(500).json(stripeError);
        else {
            res.status(200).json(stripeSuccess);
        }
    });
})

module.exports = router;