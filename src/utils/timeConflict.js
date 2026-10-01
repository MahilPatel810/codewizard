/**
 * Frontend Conflict Detection & Time Normalization Engine
 * Handles double-booking prevention, overlap detection, room aliasing, and slot clashes.
 */

export const CSPIT_SLOT_RANGES = {
  0: { label: '09:10 – 10:10', startMin: 9 * 60 + 10,  endMin: 10 * 60 + 10 },
  1: { label: '10:10 – 11:10', startMin: 10 * 60 + 10, endMin: 11 * 60 + 10 },
  2: { label: '11:10 – 12:10', startMin: 11 * 60 + 10, endMin: 12 * 60 + 10 },
  3: { label: '12:10 – 01:10', startMin: 12 * 60 + 10, endMin: 13 * 60 + 10 },
  4: { label: '01:10 – 02:10', startMin: 13 * 60 + 10, endMin: 14 * 60 + 10 },
  5: { label: '02:10 – 02:20', startMin: 14 * 60 + 10, endMin: 14 * 60 + 20 },
  6: { label: '02:20 – 03:20', startMin: 14 * 60 + 20, endMin: 15 * 60 + 20 },
  7: { label: '03:20 – 04:20', startMin: 15 * 60 + 20, endMin: 16 * 60 + 20 },
};

const ROOM_ALIASES = {
  '506': 'r506',
  'r506': 'r506',
  'room506': 'r506',
  'cspitcr': 'r506',
  'lab631': 'l631',
  'l631': 'l631',
  'ailab': 'l631',
  'lab632': 'l632',
  'l632': 'l632',
  'maclab': 'l632',
  'lab633': 'l633',
  'l633': 'l633',
  'lab634': 'l634',
  'l634': 'l634',
  'lab638': 'l638',
  'l638': 'l638',
  'arvr': 'vrlab',
  'vrlab': 'vrlab',
  'aud': 'aud',
  'audmain': 'aud',
  'centralauditorium': 'aud',
  'universitycentralauditorium': 'aud',
};

export function normalizeRoomIdentifier(roomId) {
  if (!roomId) return '';
  const clean = roomId.toString().trim().toLowerCase().replace(/[\s\-_]/g, '');
  return ROOM_ALIASES[clean] || clean;
}

export function isSameRoom(idA, idB) {
  if (!idA || !idB) return false;
  const aStr = idA.toString().trim().toLowerCase();
  const bStr = idB.toString().trim().toLowerCase();
  if (aStr === bStr) return true;
  return normalizeRoomIdentifier(idA) === normalizeRoomIdentifier(idB);
}

/**
 * Parses any time string ("10:00", "10:00 AM", "02:20 PM", "14:20") into minutes from midnight (0 - 1439).
 */
export function timeToMinutes(timeStr) {
  if (!timeStr) return null;
  const str = timeStr.toString().trim();

  const match = str.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i);
  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  const modifier = match[3] ? match[3].toUpperCase() : null;

  if (modifier === 'PM' && hours < 12) {
    hours += 12;
  } else if (modifier === 'AM' && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
}

/**
 * Extracts start and end minutes from duration, start/end time, or slot ID.
 */
export function parseTimeRange(timeDuration, startTime, endTime, slotId = null) {
  if (slotId !== null && CSPIT_SLOT_RANGES[slotId]) {
    return {
      startMin: CSPIT_SLOT_RANGES[slotId].startMin,
      endMin: CSPIT_SLOT_RANGES[slotId].endMin,
      startTime: CSPIT_SLOT_RANGES[slotId].label.split('–')[0].trim(),
      endTime: CSPIT_SLOT_RANGES[slotId].label.split('–')[1].trim(),
      label: CSPIT_SLOT_RANGES[slotId].label,
    };
  }

  let sMin = null;
  let eMin = null;
  let sStr = (startTime || '').trim();
  let eStr = (endTime || '').trim();

  if (sStr && eStr) {
    sMin = timeToMinutes(sStr);
    eMin = timeToMinutes(eStr);
  }

  if ((sMin === null || eMin === null) && timeDuration) {
    const parts = timeDuration.split(/\s*[-–—]\s*|\s+to\s+/i);
    if (parts.length >= 2) {
      sStr = sStr || parts[0].trim();
      eStr = eStr || parts[1].trim();
      sMin = sMin !== null ? sMin : timeToMinutes(parts[0]);
      eMin = eMin !== null ? eMin : timeToMinutes(parts[1]);
    } else {
      sMin = timeToMinutes(timeDuration);
      if (sMin !== null) {
        eMin = sMin + 60;
        sStr = timeDuration;
        eStr = `${Math.floor(eMin / 60)}:${(eMin % 60).toString().padStart(2, '0')}`;
      }
    }
  }

  if (sMin === null) sMin = 9 * 60;
  if (eMin === null) eMin = sMin + 60;

  return {
    startMin: sMin,
    endMin: eMin,
    startTime: sStr,
    endTime: eStr,
    label: `${sStr} - ${eStr}`,
  };
}

/**
 * Double-booking overlap condition:
 * existing.startTime < requested.endTime AND existing.endTime > requested.startTime
 */
export function isTimeOverlapping(rangeA, rangeB) {
  return rangeA.startMin < rangeB.endMin && rangeA.endMin > rangeB.startMin;
}

export function toDateString(dateVal) {
  if (!dateVal) return '';
  if (typeof dateVal === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateVal.trim())) {
    return dateVal.trim();
  }
  const d = dateVal instanceof Date ? dateVal : new Date(dateVal);
  if (isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
}

export function getDayName(dateVal) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  if (typeof dateVal === 'string' && days.includes(dateVal)) {
    return dateVal;
  }
  const d = dateVal instanceof Date ? dateVal : new Date(dateVal);
  return isNaN(d.getTime()) ? '' : days[d.getDay()];
}

export function isSameDateOrDay(dateA, dateB) {
  if (!dateA || !dateB) return false;

  const strA = toDateString(dateA);
  const strB = toDateString(dateB);

  // Exact calendar date match
  if (strA && strB && strA === strB) return true;

  // Day-of-week match (e.g. if one is recurring day or compared with target day)
  const dayA = getDayName(dateA);
  const dayB = getDayName(dateB);
  if (dayA && dayB && dayA === dayB) return true;

  return false;
}

/**
 * Validates a candidate booking against all existing active bookings.
 * Returns { hasConflict: boolean, error: string, message: string, conflictingBooking: object }
 */
export function checkBookingConflict(candidate, existingBookings) {
  if (!candidate || !existingBookings || !Array.isArray(existingBookings)) {
    return { hasConflict: false };
  }

  const candRoom = candidate.space || candidate.roomId || candidate.room;
  const candRange = parseTimeRange(candidate.timeDuration, candidate.startTime, candidate.endTime, candidate.slotId);

  for (const ex of existingBookings) {
    if (ex.status && ex.status.toLowerCase() === 'cancelled') continue;

    const exRoom = ex.space || ex.roomId || ex.room;
    if (!isSameRoom(candRoom, exRoom)) continue;

    if (!isSameDateOrDay(candidate.date, ex.date)) continue;

    const exRange = parseTimeRange(ex.timeDuration, ex.startTime, ex.endTime, ex.slotId);

    // Overlap rule: existing.startTime < requested.endTime AND existing.endTime > requested.startTime
    if (isTimeOverlapping(exRange, candRange)) {
      return {
        hasConflict: true,
        error: 'Slot Already Booked',
        message: 'This time slot has already been booked by another faculty. Please select another available slot.',
        conflictingBooking: ex,
        conflictDetails: {
          room: ex.spaceName || exRoom,
          date: toDateString(ex.date),
          time: ex.timeDuration || `${ex.startTime || ''} - ${ex.endTime || ''}`,
          bookedBy: ex.bookedBy || 'Another faculty member',
          purpose: ex.purpose || 'Institutional Activity',
        },
      };
    }
  }

  return { hasConflict: false };
}
