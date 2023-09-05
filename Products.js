const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    title:String,
    imageUrl:String,
    price:Number,
    rating:Number
})

module.exports = mongoose.model("products", ProductSchema);