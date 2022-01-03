const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const productRoute = require('./routes/product');
// Access .env variables
dotenv.config();



// Connect to DB
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('connected to the DB'))
.catch(err => console.log(err));

// Enable json response
app.use(express.json());

// Setup and use routers


app.use('/api/auth/', authRoute);
app.use('/api/users/', userRoute);
app.use('/api/products/', productRoute);
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`listening on port ${port}...`)
});