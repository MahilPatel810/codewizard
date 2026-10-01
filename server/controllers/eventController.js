const prisma = require('../lib/prisma');

exports.recommendVenues = async (req, res) => {
  try {
    const { minCapacity, requireAC, institute } = req.query;
    const capacityInt = parseInt(minCapacity, 10) || 0;

    const where = {
      capacity: { gte: capacityInt }
    };

    if (requireAC === 'true') {
      where.hasAC = true;
    }

    if (institute && institute !== 'ALL') {
      where.institute = institute;
    }

    let rooms = await prisma.room.findMany({
      where,
      orderBy: { capacity: 'asc' }
    });

    // Smart logic: If event requires 400+ attendees, prioritize Auditoriums first
    if (capacityInt >= 400) {
      rooms.sort((a, b) => {
        if (a.type === 'Auditorium' && b.type !== 'Auditorium') return -1;
        if (a.type !== 'Auditorium' && b.type === 'Auditorium') return 1;
        return a.capacity - b.capacity;
      });
    }

    res.status(200).json({
      success: true,
      requestedCapacity: capacityInt,
      recommendedCount: rooms.length,
      data: rooms
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error recommending event venues.', error: error.message });
  }
};
