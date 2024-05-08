const { Brand } = require("../model/Brand");

exports.fetchAllBrands = async (req, res) => {
    try {
        let brands = await Brand.find({}).exec();
        console.log("~ Fetched all brands!");
        res.status(200).json(brands);
    }
    catch (err) {
        res.status(400).json(err);
    }
};

exports.createBrand = (req, res) => {
    const brand = new Brand(req.body);

    brand.save()
        .then(savedDocument => {
            console.log("~ Created a brand!");
            res.status(201).json(savedDocument);
        })
        .catch(err => {
            res.status(400).json(err);
        });
};