const Timetable = require('../models/Timetable');

exports.getTimetable = async (req, res) => {
  try {
    const { day, batch, institute } = req.query;
    const filter = {};
    if (day) filter.day = day;
    if (batch) filter.batch = batch;
    if (institute) filter.institute = institute;

    const timetable = await Timetable.find(filter).sort({ day: 1, slotTime: 1 });
    res.status(200).json({ success: true, data: timetable });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.updateMaster = async (req, res) => {
  try {
    const { entries } = req.body;
    if (!entries || !Array.isArray(entries)) {
      return res.status(400).json({ success: false, message: 'Entries array is required.' });
    }

    const affectedDaysSet = new Set();

    // CLASH DETECTION ENGINE
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      affectedDaysSet.add(entry.day);
      
      // Check in incoming array
      for (let j = i + 1; j < entries.length; j++) {
        const other = entries[j];
        if (entry.day === other.day && entry.slotTime === other.slotTime) {
          if (entry.roomId === other.roomId) {
            return res.status(400).json({ success: false, message: 'Room clash found in input array', clash: { entry, other } });
          }
          if (entry.facultyCode === other.facultyCode) {
            return res.status(400).json({ success: false, message: 'Faculty clash found in input array', clash: { entry, other } });
          }
        }
      }
      
      // Check in existing DB (for entries that will NOT be deleted, if any)
      // Since we are going to delete all affected days, any DB conflict on those days doesn't matter (they will be overwritten).
      // A conflict on another day is impossible because the incoming entry has a specific day.
    }

    const affectedDays = Array.from(affectedDaysSet);

    // If no clashes: delete all existing timetable records for affected days
    if (affectedDays.length > 0) {
      await Timetable.deleteMany({ day: { $in: affectedDays } });
    }
    
    // then insertMany the new entries
    const inserted = await Timetable.insertMany(entries);
    
    res.status(200).json({ success: true, count: inserted.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
