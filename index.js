/* --------------------------------- IMPORTS -------------------------------- */
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const productRoute = require('./routes/product');
const orderRoute = require('./routes/order');
const stripeRoute = require('./routes/stripe');
const cors = require('cors');

dotenv.config();



/* ------------------------------ DB CONNECTION ----------------------------- */
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('connected to the DB'))
.catch(err => console.log(err));

// Enable json response & cors
app.use(cors());
app.use(express.json());

/* --------------------------------- ROUTES --------------------------------- */
app.use('/api/auth/', authRoute);
app.use('/api/users/', userRoute);
app.use('/api/products/', productRoute);
app.use('/api/orders/', orderRoute);
app.use('/api/checkout/', stripeRoute);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`listening on port ${port}...`)
});