const { Cart } = require("../model/Cart");

exports.fetchCartByUser = async (req, res) => {
    const { id } = req.user;
    try {
        const cartItems = await Cart.find({ user: id }).populate('user').populate('product');
        console.log("~ Fetched an user's cart!");
        res.status(200).json(cartItems);
    }
    catch (err) {
        res.status(400).json(err);
    }
}

exports.addToCart = async (req, res) => {
    const { id } = req.user;
    const cart = new Cart({ ...req.body, user: id });

    try {
        const document = await cart.save();
        const savedDocument = await document.populate('product');
        console.log("~ Added an item to cart!");
        res.status(201).json(savedDocument);
    }
    catch (err) {
        res.status(400).json(err);
    }
}

exports.deleteFromCart = async (req, res) => {
    const cartId = req.params.id;

    try {
        const removedCartItem = await Cart.findByIdAndDelete(cartId).exec();
        console.log("~ Removed an item from cart!");
        res.status(200).json(removedCartItem);
    }
    catch (err) {
        res.status(400).json(err);
    }
}

exports.updateCart = async (req, res) => {
    const cartId = req.params.id;

    try {
        const cart = await Cart.findByIdAndUpdate(cartId, req.body, { new: true }).exec();
        const savedDocument = await cart.populate('product');
        console.log("~ Updated the cart!");
        res.status(200).json(savedDocument);
    }
    catch (err) {
        res.status(400).json(err);
    }
}