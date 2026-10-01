const prisma = require('../lib/prisma');

exports.getVacantRooms = async (req, res) => {
  try {
    const { institute, day, timeSlot, date } = req.query;

    const roomWhere = {};
    if (institute && institute !== 'ALL') {
      roomWhere.institute = institute;
    }

    const allRooms = await prisma.room.findMany({
      where: roomWhere,
      orderBy: { capacity: 'asc' }
    });

    // 1. Check static schedule in Timetable
    const timetableWhere = {};
    if (day) timetableWhere.day = day;
    if (timeSlot) timetableWhere.slotTime = timeSlot;

    const scheduledClasses = await prisma.timetable.findMany({
      where: timetableWhere,
      select: { roomId: true, courseCode: true, facultyName: true, batch: true }
    });
    const occupiedRoomIds = new Set(scheduledClasses.map(t => t.roomId.toLowerCase()));

    // 2. Check dynamic bookings
    const bookingWhere = { status: 'Confirmed' };
    if (date) {
      const d = new Date(date);
      if (!isNaN(d.getTime())) {
        const startOfDay = new Date(d);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(d);
        endOfDay.setHours(23, 59, 59, 999);
        bookingWhere.date = { gte: startOfDay, lte: endOfDay };
      }
    }
    if (timeSlot) {
      bookingWhere.timeDuration = timeSlot;
    }

    const activeBookings = await prisma.booking.findMany({
      where: bookingWhere,
      select: { roomId: true, purpose: true, clubName: true }
    });
    const bookedRoomIds = new Set(activeBookings.map(b => b.roomId));

    // 3. Filter vacant rooms
    const vacantRooms = allRooms.filter(room => {
      const isOccupiedInTimetable = occupiedRoomIds.has(room.roomId.toLowerCase());
      const isBooked = bookedRoomIds.has(room.id);
      return !isOccupiedInTimetable && !isBooked;
    });

    res.status(200).json({
      success: true,
      metadata: {
        totalRooms: allRooms.length,
        vacantCount: vacantRooms.length,
        institute: institute || 'ALL',
        day: day || 'ANY',
        timeSlot: timeSlot || 'ANY',
        date: date || 'ANY'
      },
      data: vacantRooms
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error computing room vacancies.', error: error.message });
  }
};

exports.bookRoom = async (req, res) => {
  try {
    const { roomId, date, timeDuration, purpose, clubName, notes } = req.body;

    if (!roomId || !date || !timeDuration || !purpose) {
      return res.status(400).json({
        success: false,
        message: 'Room ID, date, time duration, and purpose are required.'
      });
    }

    // Support both room primary key (UUID) and business key (roomId e.g. '506')
    const roomDoc = await prisma.room.findFirst({
      where: {
        OR: [
          { id: roomId },
          { roomId: roomId }
        ]
      }
    });

    if (!roomDoc) {
      return res.status(404).json({ success: false, message: `Room with identifier '${roomId}' not found.` });
    }

    const bookingDate = new Date(date);
    if (isNaN(bookingDate.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid date format provided.' });
    }

    const startOfDay = new Date(bookingDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(bookingDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Prevent double booking for the exact date and duration
    const existing = await prisma.booking.findFirst({
      where: {
        roomId: roomDoc.id,
        date: { gte: startOfDay, lte: endOfDay },
        timeDuration: timeDuration,
        status: 'Confirmed'
      }
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Conflict: ${roomDoc.name} (${roomDoc.roomId}) is already booked for ${timeDuration} on ${bookingDate.toISOString().split('T')[0]}.`
      });
    }

    const newBooking = await prisma.booking.create({
      data: {
        roomId: roomDoc.id,
        bookedById: req.user.id,
        date: bookingDate,
        timeDuration: timeDuration,
        purpose: purpose,
        clubName: clubName || '',
        notes: notes || '',
        status: 'Confirmed'
      },
      include: {
        room: true,
        bookedBy: {
          select: { id: true, userId: true, name: true, role: true }
        }
      }
    });

    res.status(201).json({ success: true, message: 'Room successfully booked.', data: newBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error processing room booking.', error: error.message });
  }
};

exports.getBookingHistory = async (req, res) => {
  try {
    const { status, search } = req.query;
    const where = {};

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { purpose: { contains: search, mode: 'insensitive' } },
        { clubName: { contains: search, mode: 'insensitive' } },
        { room: { name: { contains: search, mode: 'insensitive' } } },
        { room: { roomId: { contains: search, mode: 'insensitive' } } }
      ];
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        room: true,
        bookedBy: {
          select: { id: true, userId: true, name: true, role: true }
        }
      },
      orderBy: { date: 'desc' }
    });

    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching booking history.', error: error.message });
  }
};

exports.getWeeklyReport = async (req, res) => {
  try {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const weeklyBookings = await prisma.booking.findMany({
      where: {
        date: { gte: startOfWeek, lte: endOfWeek }
      },
      include: {
        room: true,
        bookedBy: {
          select: { userId: true, name: true }
        }
      },
      orderBy: { date: 'asc' }
    });

    // Group by room and purpose
    const reportMap = {};
    for (const b of weeklyBookings) {
      const key = `${b.room.roomId}_${b.purpose}`;
      if (!reportMap[key]) {
        reportMap[key] = {
          roomId: b.room.roomId,
          roomName: b.room.name,
          institute: b.room.institute,
          purpose: b.purpose,
          count: 0,
          entries: []
        };
      }
      reportMap[key].count++;
      reportMap[key].entries.push({
        date: b.date,
        timeDuration: b.timeDuration,
        clubName: b.clubName,
        status: b.status,
        bookedBy: b.bookedBy.name
      });
    }

    const report = Object.values(reportMap).sort((a, b) => b.count - a.count);

    res.status(200).json({
      success: true,
      weekRange: { start: startOfWeek, end: endOfWeek },
      totalBookings: weeklyBookings.length,
      data: report
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error generating weekly report.', error: error.message });
  }
};
