const express =  require('express');
const cors = require('cors');
const Products = require("./Products");
const mongoose = require('mongoose');
const _ = require("lodash");


const app = express();
const port =  8000;

// middleware

app.use(express.json());
app.use(cors());


// mongoose connect

const connection_url = 'mongodb+srv://zahar:admin@cluster0.lrbne9s.mongodb.net/productsDB?retryWrites=true&w=majority';

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



// listen

app.listen(port,()=>{
    console.log('listening at port',port)
})
