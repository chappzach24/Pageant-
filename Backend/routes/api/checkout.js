const express = require('express');
const router = express.Router();
const checkoutController = require('../../controllers/checkout');

router.post('/', checkoutController.createCheckout);
router.get('/:id', checkoutController.checkoutInformation);

module.exports = router;