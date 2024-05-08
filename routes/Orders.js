const express = require('express');
const { createOrder, fetchOrdersByUser, deleteOrder, updateOrder, fetchALlOrders } = require('../controller/Order');

const router = express.Router();

router
    .post('/', createOrder)
    .get('/own', fetchOrdersByUser)
    .get('/', fetchALlOrders)
    .delete('/:id', deleteOrder)
    .patch('/:id', updateOrder);

exports.routes = router;