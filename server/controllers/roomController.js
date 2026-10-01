const Room = require('../models/Room');
const Timetable = require('../models/Timetable');
const Booking = require('../models/Booking');

exports.getVacantRooms = async (req, res) => {
  try {
    const { institute, day, timeSlot, date } = req.query;
    const roomFilter = {};
    if (institute) roomFilter.institute = institute;
    const rooms = await Room.find(roomFilter);

    const timetableFilter = {};
    if (day) timetableFilter.day = day;
    if (timeSlot) timetableFilter.slotTime = timeSlot;
    const occupiedInTimetable = await Timetable.find(timetableFilter);
    const occupiedRoomIds = new Set(occupiedInTimetable.map(t => t.roomId));

    const bookingFilter = { status: 'Confirmed' };
    if (date) {
      const d = new Date(date);
      if (!isNaN(d.getTime())) {
        const startOfDay = new Date(d);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(d);
        endOfDay.setHours(23, 59, 59, 999);
        bookingFilter.date = { $gte: startOfDay, $lte: endOfDay };
      }
    }
    if (timeSlot) {
      bookingFilter.timeDuration = timeSlot;
    }

    const bookings = await Booking.find(bookingFilter);
    const bookedRoomIds = new Set(bookings.map(b => b.room.toString()));

    const vacantRooms = rooms.filter(room => {
      return !occupiedRoomIds.has(room.roomId) && !bookedRoomIds.has(room._id.toString());
    });

    res.status(200).json({
      success: true,
      metadata: { total: vacantRooms.length, institute: institute || 'ALL', day, timeSlot, date },
      data: vacantRooms
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.bookRoom = async (req, res) => {
  try {
    const { roomId, date, timeDuration, purpose, clubName, notes } = req.body;
    const roomDoc = await Room.findOne({ roomId });
    if (!roomDoc) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }
    
    const existingBooking = await Booking.findOne({
      room: roomDoc._id,
      date,
      timeDuration,
      status: 'Confirmed'
    });
    
    if (existingBooking) {
      return res.status(409).json({ success: false, message: 'Room already booked for this slot' });
    }
    
    const newBooking = await Booking.create({
      room: roomDoc._id,
      date,
      timeDuration,
      purpose,
      clubName,
      notes,
      bookedBy: req.user.id,
      status: 'Confirmed'
    });
    
    res.status(201).json({ success: true, data: newBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.getBookingHistory = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { purpose: { $regex: search, $options: 'i' } },
        { clubName: { $regex: search, $options: 'i' } }
      ];
    }
    
    const bookings = await Booking.find(filter)
      .populate('room')
      .populate({ path: 'bookedBy', select: 'name userId role' })
      .sort({ date: -1 });
      
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.getWeeklyReport = async (req, res) => {
  try {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0=Sun
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const report = await Booking.aggregate([
      {
        $match: {
          date: { $gte: startOfWeek, $lte: endOfWeek }
        }
      },
      {
        $lookup: {
          from: 'rooms',
          localField: 'room',
          foreignField: '_id',
          as: 'roomInfo'
        }
      },
      { $unwind: '$roomInfo' },
      {
        $group: {
          _id: { roomId: '$roomInfo.roomId', roomName: '$roomInfo.name', purpose: '$purpose' },
          count: { $sum: 1 },
          bookings: { $push: { date: '$date', timeDuration: '$timeDuration', status: '$status' } }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      weekRange: { start: startOfWeek, end: endOfWeek },
      totalEntries: report.reduce((sum, r) => sum + r.count, 0),
      data: report
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
