const User = require('../models/User');

exports.searchStudents = async (req, res) => {
  try {
    const { q, batch } = req.query;
    const filter = { role: 'student' };
    
    if (q) {
      filter.$or = [
        { userId: { $regex: q, $options: 'i' } },
        { name: { $regex: q, $options: 'i' } }
      ];
    }
    
    if (batch) {
      filter.batch = batch;
    }
    
    const students = await User.find(filter)
      .select('userId name batch department')
      .limit(50);
      
    res.status(200).json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
