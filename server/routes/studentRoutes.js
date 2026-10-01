const router = require('express').Router();
const { searchStudents } = require('../controllers/studentController');
const auth = require('../middleware/auth');

router.get('/search', auth, searchStudents);

module.exports = router;
