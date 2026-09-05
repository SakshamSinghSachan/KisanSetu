const router = require('express').Router();
const User = require('../models/User');
const { auth } = require('../middleware/auth');

router.get('/sellers', async (req, res) => {
  try {
    const sellers = await User.find({ role: { $in: ['farmer', 'fpo'] } }).select('name avatar rating totalRatings address role fpoDetails').limit(20);
    res.json(sellers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
