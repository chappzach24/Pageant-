const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth');
const checkoutController = require('../../controllers/checkout');

router.post('/', checkoutController.createCheckout);
router.post('/fail', protect, checkoutController.saveFailedPayment);
router.get('/:id', checkoutController.checkoutInformation);

module.exports = router;