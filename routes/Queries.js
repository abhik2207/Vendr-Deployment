const express = require('express');
const { fetchAllQueries, createQuery } = require('../controller/Query');

const router = express.Router();

router
    .get('/', fetchAllQueries)
    .post('/', createQuery);

exports.routes = router;