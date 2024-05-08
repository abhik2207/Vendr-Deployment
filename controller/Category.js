const { Category } = require("../model/Category");

exports.fetchAllCategories = async (req, res) => {
    try {
        let categories = await Category.find({}).exec();
        console.log("~ Fetched all categories!");
        res.status(200).json(categories);
    }
    catch (err) {
        res.status(400).json(err);
    }
};

exports.createCategory = (req, res) => {
    const category = new Category(req.body);

    category.save()
        .then(savedDocument => {
            console.log("~ Created a category!");
            res.status(201).json(savedDocument);
        })
        .catch(err => {
            res.status(400).json(err);
        });
};