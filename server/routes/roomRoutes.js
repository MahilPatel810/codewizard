const router = require('express').Router();
const { getVacantRooms, bookRoom, getBookingHistory, getWeeklyReport } = require('../controllers/roomController');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

router.get('/vacant', auth, getVacantRooms);
router.post('/book', auth, adminOnly, bookRoom);
router.get('/bookings/history', auth, adminOnly, getBookingHistory);
router.get('/bookings/weekly-report', auth, adminOnly, getWeeklyReport);

module.exports = router;
