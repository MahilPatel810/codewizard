const router = require('express').Router();
const { recommendVenues } = require('../controllers/eventController');
const auth = require('../middleware/auth');

router.get('/recommend', auth, recommendVenues);

module.exports = router;
