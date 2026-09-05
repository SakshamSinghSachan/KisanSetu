const router = require('express').Router();
const { getDashboard, getDemandForecast, getMarketPrices, getPlatformStats } = require('../controllers/analyticsController');
const { auth } = require('../middleware/auth');

router.get('/dashboard', auth, getDashboard);
router.get('/demand-forecast', auth, getDemandForecast);
router.get('/market-prices', getMarketPrices);
router.get('/platform-stats', getPlatformStats);

module.exports = router;
