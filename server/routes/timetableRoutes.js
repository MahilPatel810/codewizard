const router = require('express').Router();
const { getTimetable, updateMaster } = require('../controllers/timetableController');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

router.get('/', getTimetable);
router.put('/update-master', auth, adminOnly, updateMaster);

module.exports = router;
