const { Product } = require("../model/Product");

exports.createProduct = (req, res) => {
    const product = new Product(req.body);
    product.discountedPrice = Math.round(product.price * (1 - product.discountPercentage / 100));

    product.save()
        .then(savedDocument => {
            console.log("~ Created a product!");
            res.status(201).json(savedDocument);
        })
        .catch(err => {
            res.status(400).json(err);
        });
};

exports.fetchAllProducts = async (req, res) => {
    let condition = {};
    if(!req.query.admin) {
        condition.deleted = { $ne: true };
    }

    let query = Product.find(condition);
    let totalProductsQuery = Product.find(condition);

    console.log(req.query.category);

    if (req.query.category) {
        query = query.find({ category: {$in: req.query.category.split(',')} });
        totalProductsQuery = totalProductsQuery.find({ category: {$in: req.query.category.split(',')} });
    }
    if (req.query.brand) {
        query = query.find({ brand: {$in: req.query.brand.split(',')} });
        totalProductsQuery = totalProductsQuery.find({ brand: {$in: req.query.brand.split(',')} });
    }
    if (req.query._sort && req.query._order) {
        query = query.sort({ [req.query._sort]: req.query._order });
    }
    if (req.query._page && req.query._limit) {
        const pageSize = req.query._limit;
        const page = req.query._page;
        query = query.skip(pageSize * (page - 1)).limit(pageSize);
    }

    const totalDocs = await totalProductsQuery.count().exec();
    console.log('~ TOTAL PRODUCT DOCS: ', totalDocs);

    try {
        const docs = await query.exec();
        res.set('X-Total-Count', totalDocs);
        console.log("~ Fetched all products!");
        res.status(200).json(docs);
    }
    catch (err) {
        res.status(400).json(err);
    }
};

exports.fetchProductById = async (req, res) => {
    const productId = req.params.id;

    try {
        const product = await Product.findById(productId).exec();
        console.log("~ Fetched a product by ID!");
        res.status(200).json(product);
    }
    catch (err) {
        res.status(400).json(err);
    }
}

exports.updateProduct = async (req, res) => {
    const productId = req.params.id;

    try {
        const product = await Product.findByIdAndUpdate(productId, req.body, { new: true }).exec();
        product.discountedPrice = Math.round(product.price * (1 - product.discountPercentage / 100));
        const updatedProduct = await product.save();
        console.log("~ Updated a product!");
        res.status(200).json(updatedProduct);
    }
    catch (err) {
        res.status(400).json(err);
    }
}