const Room = require('../models/Room');

exports.recommendVenues = async (req, res) => {
  try {
    const { minCapacity, requireAC } = req.query;
    const capacity = parseInt(minCapacity, 10) || 0;
    
    const filter = { capacity: { $gte: capacity } };
    if (requireAC === 'true') {
      filter.hasAC = true;
    }
    
    let rooms = await Room.find(filter).sort({ capacity: 1 }).lean();
    
    if (capacity >= 400) {
      rooms.sort((a, b) => {
        if (a.type === 'Auditorium' && b.type !== 'Auditorium') return -1;
        if (a.type !== 'Auditorium' && b.type === 'Auditorium') return 1;
        return 0; 
      });
    }
    
    res.status(200).json({ success: true, data: rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
