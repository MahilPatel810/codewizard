const prisma = require('../lib/prisma');

exports.getTimetable = async (req, res) => {
  try {
    const { day, batch, roomId } = req.query;
    const where = {};

    if (day) where.day = day;
    if (batch) where.batch = batch;
    if (roomId) where.roomId = roomId;

    const timetable = await prisma.timetable.findMany({
      where,
      orderBy: [
        { day: 'asc' },
        { slotTime: 'asc' }
      ]
    });

    res.status(200).json({ success: true, count: timetable.length, data: timetable });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving timetable.', error: error.message });
  }
};

exports.updateMaster = async (req, res) => {
  try {
    const { entries } = req.body;

    if (!entries || !Array.isArray(entries) || entries.length === 0) {
      return res.status(400).json({ success: false, message: 'Entries array is required and must not be empty.' });
    }

    const affectedDaysSet = new Set();

    // ── CLASH DETECTION ENGINE ─────────────────────────────────
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];

      if (!entry.day || !entry.slotTime || !entry.roomId || !entry.facultyCode) {
        return res.status(400).json({
          success: false,
          message: `Incomplete entry at index ${i}. Required fields: day, slotTime, roomId, facultyCode.`
        });
      }

      affectedDaysSet.add(entry.day);

      // Check intra-batch collision against subsequent entries
      for (let j = i + 1; j < entries.length; j++) {
        const other = entries[j];
        if (entry.day === other.day && entry.slotTime === other.slotTime) {
          // 1. Room Clash Detection (Hardware constraint)
          if (entry.roomId.toLowerCase() === other.roomId.toLowerCase()) {
            return res.status(400).json({
              success: false,
              message: `Room Clash: ${entry.roomId} is assigned to both ${entry.courseCode || 'Class A'} and ${other.courseCode || 'Class B'} on ${entry.day} at ${entry.slotTime}.`,
              clashType: 'ROOM_COLLISION',
              collidingSlots: [entry, other]
            });
          }

          // 2. Faculty Clash Detection (Concurrent scheduling constraint)
          if (entry.facultyCode.toUpperCase() === other.facultyCode.toUpperCase()) {
            return res.status(400).json({
              success: false,
              message: `Faculty Clash: Professor ${entry.facultyCode} is assigned to multiple classes simultaneously on ${entry.day} at ${entry.slotTime}.`,
              clashType: 'FACULTY_COLLISION',
              collidingSlots: [entry, other]
            });
          }
        }
      }
    }

    const affectedDays = Array.from(affectedDaysSet);

    // ── ATOMIC PRISMA TRANSACTION ──────────────────────────────
    const result = await prisma.$transaction(async (tx) => {
      // 1. Clear existing schedule for affected days
      await tx.timetable.deleteMany({
        where: { day: { in: affectedDays } }
      });

      // 2. Format and insert new validated entries
      const formattedEntries = entries.map(e => ({
        day: e.day,
        slotTime: e.slotTime,
        courseCode: e.courseCode || 'GENERIC',
        courseName: e.courseName || 'Unassigned',
        facultyName: e.facultyName || 'TBA',
        facultyCode: e.facultyCode.toUpperCase(),
        roomId: e.roomId,
        batch: e.batch || 'Division-1'
      }));

      const created = await tx.timetable.createMany({
        data: formattedEntries
      });

      return created;
    });

    res.status(200).json({
      success: true,
      message: 'Master timetable successfully updated without clashes.',
      affectedDays,
      insertedCount: result.count
    });
  } catch (error) {
    // Handle Prisma unique constraint violation code P2002
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        message: 'Unique constraint violation: Room is already occupied at this day and slot.',
        details: error.meta
      });
    }
    res.status(500).json({ success: false, message: 'Server error updating master schedule.', error: error.message });
  }
};
