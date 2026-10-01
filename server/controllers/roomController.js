const prisma = require('../lib/prisma');
const {
  parseAndNormalizeTime,
  isTimeOverlapping,
  getDayNameFromDate,
  isSameRoom
} = require('../lib/timeUtils');

exports.getVacantRooms = async (req, res) => {
  try {
    const { institute, day, timeSlot, startTime, endTime, date } = req.query;

    const roomWhere = {};
    if (institute && institute !== 'ALL') {
      roomWhere.institute = institute;
    }

    const allRooms = await prisma.room.findMany({
      where: roomWhere,
      orderBy: { capacity: 'asc' }
    });

    const targetDay = day || (date ? getDayNameFromDate(date) : null);
    const hasTimeFilter = Boolean(timeSlot || (startTime && endTime));
    const queryTime = hasTimeFilter
      ? parseAndNormalizeTime(timeSlot, startTime, endTime)
      : null;

    // 1. Check static schedule in Timetable
    const timetableWhere = {};
    if (targetDay && targetDay !== 'ANY') timetableWhere.day = targetDay;

    const scheduledClasses = await prisma.timetable.findMany({
      where: timetableWhere,
      select: { roomId: true, courseCode: true, facultyName: true, batch: true, slotTime: true }
    });

    const occupiedRoomIds = new Set();
    for (const sc of scheduledClasses) {
      if (!hasTimeFilter) {
        occupiedRoomIds.add(sc.roomId.toLowerCase());
      } else {
        const scTime = parseAndNormalizeTime(sc.slotTime);
        if (isTimeOverlapping(scTime.startMin, scTime.endMin, queryTime.startMin, queryTime.endMin)) {
          occupiedRoomIds.add(sc.roomId.toLowerCase());
        }
      }
    }

    // 2. Check dynamic bookings
    const bookingWhere = { status: 'Confirmed' };
    if (date && date !== 'ANY') {
      const d = new Date(date);
      if (!isNaN(d.getTime())) {
        const startOfDay = new Date(d);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(d);
        endOfDay.setHours(23, 59, 59, 999);
        bookingWhere.date = { gte: startOfDay, lte: endOfDay };
      }
    }

    const activeBookings = await prisma.booking.findMany({
      where: bookingWhere,
      select: { roomId: true, purpose: true, clubName: true, timeDuration: true, startTime: true, endTime: true }
    });

    const bookedRoomIds = new Set();
    for (const b of activeBookings) {
      if (!hasTimeFilter) {
        bookedRoomIds.add(b.roomId);
      } else {
        const bTime = parseAndNormalizeTime(b.timeDuration, b.startTime, b.endTime);
        if (isTimeOverlapping(bTime.startMin, bTime.endMin, queryTime.startMin, queryTime.endMin)) {
          bookedRoomIds.add(b.roomId);
        }
      }
    }

    // 3. Filter vacant rooms
    const vacantRooms = allRooms.filter(room => {
      const isOccupiedInTimetable = occupiedRoomIds.has(room.roomId.toLowerCase()) || occupiedRoomIds.has(room.id.toLowerCase());
      const isBooked = bookedRoomIds.has(room.id) || bookedRoomIds.has(room.roomId);
      return !isOccupiedInTimetable && !isBooked;
    });

    res.status(200).json({
      success: true,
      metadata: {
        totalRooms: allRooms.length,
        vacantCount: vacantRooms.length,
        institute: institute || 'ALL',
        day: targetDay || 'ANY',
        timeSlot: timeSlot || (queryTime ? queryTime.formattedDuration : 'ANY'),
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
    const { roomId, date, timeDuration, startTime, endTime, purpose, clubName, notes } = req.body;

    if (!roomId || !date || (!timeDuration && (!startTime || !endTime)) || !purpose) {
      return res.status(400).json({
        success: false,
        message: 'Room ID, date, time duration (or start/end time), and purpose are required.'
      });
    }

    // Support both room primary key (UUID) and business key (roomId e.g. '506', 'AUD', 'Lab 631')
    const roomDoc = await prisma.room.findFirst({
      where: {
        OR: [
          { id: roomId },
          { roomId: roomId },
          { name: { equals: roomId, mode: 'insensitive' } }
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

    const reqTime = parseAndNormalizeTime(timeDuration, startTime, endTime);

    if (reqTime.startMin >= reqTime.endMin) {
      return res.status(400).json({
        success: false,
        message: 'Invalid time duration: Start time must precede end time.'
      });
    }

    const startOfDay = new Date(bookingDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(bookingDate);
    endOfDay.setHours(23, 59, 59, 999);

    // ── DATABASE-LEVEL CONFLICT CHECK & ATOMIC TRANSACTION ─────────────
    // Executed in an interactive transaction to prevent race conditions
    const newBooking = await prisma.$transaction(async (tx) => {
      // 1. Conflict check against existing confirmed bookings for this room on this date
      const existingBookings = await tx.booking.findMany({
        where: {
          roomId: roomDoc.id,
          date: { gte: startOfDay, lte: endOfDay },
          status: 'Confirmed'
        },
        include: {
          bookedBy: {
            select: { id: true, userId: true, name: true, role: true }
          }
        }
      });

      for (const ex of existingBookings) {
        const exTime = parseAndNormalizeTime(ex.timeDuration, ex.startTime, ex.endTime);

        // Core double-booking condition:
        // existing.startTime < requested.endTime AND existing.endTime > requested.startTime
        if (isTimeOverlapping(exTime.startMin, exTime.endMin, reqTime.startMin, reqTime.endMin)) {
          const err = new Error('Slot Already Booked');
          err.statusCode = 409;
          err.conflictDetails = {
            type: 'DYNAMIC_BOOKING_CONFLICT',
            room: roomDoc.name,
            roomId: roomDoc.roomId,
            date: bookingDate.toISOString().split('T')[0],
            timeSlot: ex.timeDuration || `${ex.startTime} - ${ex.endTime}`,
            bookedBy: ex.bookedBy?.name || 'Another faculty member',
            purpose: ex.purpose
          };
          throw err;
        }
      }

      // 2. Conflict check against master academic timetable for this day of week
      const dayOfWeek = getDayNameFromDate(bookingDate);
      const scheduledClasses = await tx.timetable.findMany({
        where: {
          day: dayOfWeek,
          roomId: { in: [roomDoc.roomId, roomDoc.id] }
        }
      });

      for (const sc of scheduledClasses) {
        const scTime = parseAndNormalizeTime(sc.slotTime);
        if (isTimeOverlapping(scTime.startMin, scTime.endMin, reqTime.startMin, reqTime.endMin)) {
          const err = new Error('Slot Already Booked');
          err.statusCode = 409;
          err.conflictDetails = {
            type: 'TIMETABLE_CLASS_CONFLICT',
            room: roomDoc.name,
            roomId: roomDoc.roomId,
            date: bookingDate.toISOString().split('T')[0],
            timeSlot: sc.slotTime,
            bookedBy: `${sc.facultyName} (${sc.facultyCode})`,
            purpose: `${sc.courseCode}: ${sc.courseName} (${sc.batch})`
          };
          throw err;
        }
      }

      // 3. No conflict detected: create booking atomically
      return await tx.booking.create({
        data: {
          roomId: roomDoc.id,
          bookedById: req.user.id,
          date: bookingDate,
          timeDuration: reqTime.formattedDuration,
          startTime: reqTime.sTime,
          endTime: reqTime.eTime,
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
    });

    res.status(201).json({
      success: true,
      message: 'Room successfully booked.',
      data: newBooking
    });
  } catch (error) {
    if (error.statusCode === 409 || error.message === 'Slot Already Booked') {
      return res.status(409).json({
        success: false,
        error: 'Slot Already Booked',
        message: 'This time slot has already been booked by another faculty. Please select another available slot.',
        conflict: error.conflictDetails
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error processing room booking.',
      error: error.message
    });
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
