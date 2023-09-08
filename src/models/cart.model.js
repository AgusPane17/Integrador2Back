import mongoose from "mongoose";

const cartModel = mongoose.model('carts', new mongoose.Schema({
    products: []
}))

export default cartModel 