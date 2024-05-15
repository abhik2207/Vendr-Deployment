const { Query } = require("../model/Query");

exports.fetchAllQueries = async (req, res) => {
    try {
        let queries = await Query.find({}).exec();
        console.log("~ Fetched all queries!");
        res.status(200).json(queries);
    }
    catch (err) {
        res.status(400).json(err);
    }
};

exports.createQuery = (req, res) => {
    const query = new Query(req.body);

    query.save()
        .then(savedDocument => {
            console.log("~ Created a query!");
            res.status(201).json(savedDocument);
        })
        .catch(err => {
            res.status(400).json(err);
        });
};