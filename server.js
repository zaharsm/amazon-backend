require('dotenv').config();
const express =  require('express');
const cors = require('cors');
const Products = require("./Products");
const mongoose = require('mongoose');
const _ = require("lodash");
const Orders = require('./Orders');
const stripe = require('stripe')('sk_test_51NlBohSCM2T39KjUqUNHmbMj9wwvQ7do7OLwgmpaXRg8EoSRNsfOVR0bR2PpeAy2koULIvYVgHpoQBhpDGymEKdo00ktgfYm1m')


const app = express();
const port =  8000;
const password = process.env.PASSWORD;
console.log(password)

// middleware

app.use(express.json());
app.use(cors());


// mongoose connect

const connection_url = "mongodb+srv://zahar:"+password+"@cluster0.lrbne9s.mongodb.net/productsDB?retryWrites=true&w=majority";

mongoose.connect(connection_url, { useUnifiedTopology: true})



// api
app.get('/',(req,res)=>{
    res.status(200).send('Backend Server is Up')
})


// Creating data
app.post("/products/add", (req, res) => {
  const productDetail = req.body;

  console.log("Product Detail >>>>", productDetail);

  Products.create(productDetail)
    .then(data => {
      res.status(201).send(data);
    })
    .catch(err => {
      res.status(500).send(err.message);
      console.error(err);
    });
});

// Fetching Data
app.get("/products/add", (req, res) => {
  Products.find()
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send(err);
      console.error(err);
    });
});


// Orders API

app.post('/orders/add',(req,res)=>{
  const products = req.body.basket;
  const email = req.body.email;
  const address = req.body.address;
  const price  = req.body.price;

  const orderDetails = {
      products: products,
      email: email,
      address: address,
      price: price
  }

  console.log("Order Details >>>>", orderDetails);

  Orders.create(orderDetails)
  .then(data => {
    res.status(201).send(data);
  })
  .catch(err => {
    res.status(500).send(err.message);
    console.error(err);
  });


})


// Creating API for Stripe Payment

app.post("/payment/create", async (req, res) => {
  const total = req.body.amount;

  // Validate the 'total' value
  if (typeof total !== 'number' || total < 1) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  console.log("Payment Request received for this rupees", total);

  try {
    const payment = await stripe.paymentIntents.create({
      amount: total * 100, // Convert to cents
      currency: "inr",
    });

    res.status(201).send({
      clientSecret: payment.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: 'Payment intent creation failed' });
  }
});


app.post("/orders/get", (req, res) => {
  const email = req.body.email;

  Orders.find()
    .then(err => {
      console.log(err);
    })
    .catch(err => {
      const userOrders = result.filter((order) => order.email === email);

      res.send(userOrders);
    });
  ;
});

// listen
app.listen(port,()=>{
console.log('listening at port',port)
})

