const router = require('express').Router();
const { createProduct, getProducts, getProduct, updateProduct, deleteProduct, getFarmerProducts } = require('../controllers/productController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', getProducts);
router.get('/my-products', auth, getFarmerProducts);
router.get('/:id', getProduct);
router.post('/', auth, authorize('farmer', 'fpo'), createProduct);
router.put('/:id', auth, authorize('farmer', 'fpo'), updateProduct);
router.delete('/:id', auth, authorize('farmer', 'fpo'), deleteProduct);

module.exports = router;
