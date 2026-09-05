const router = require('express').Router();
const { optimizeRoute, trackDelivery, getNearbyDeliveries } = require('../controllers/logisticsController');
const { auth } = require('../middleware/auth');

router.post('/optimize-route', auth, optimizeRoute);
router.get('/track/:orderId', auth, trackDelivery);
router.get('/nearby', auth, getNearbyDeliveries);

module.exports = router;
