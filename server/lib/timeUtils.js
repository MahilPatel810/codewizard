/**
 * Utility functions for time parsing, normalization, and overlap conflict detection.
 */

// Canonical room aliases across CSPIT and CHARUSAT campus
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

function normalizeRoomIdentifier(roomId) {
  if (!roomId) return '';
  const clean = roomId.toString().trim().toLowerCase().replace(/[\s\-_]/g, '');
  return ROOM_ALIASES[clean] || clean;
}

function isSameRoom(idA, idB) {
  if (!idA || !idB) return false;
  if (idA.toString().trim().toLowerCase() === idB.toString().trim().toLowerCase()) return true;
  return normalizeRoomIdentifier(idA) === normalizeRoomIdentifier(idB);
}

/**
 * Parses any time string ("10:00", "10:00 AM", "02:20 PM", "14:20") into minutes from midnight (0 - 1439).
 */
function timeToMinutes(timeStr) {
  if (!timeStr) return null;
  const str = timeStr.toString().trim();

  // Match 12-hour or 24-hour time format: HH:MM or HH:MM AM/PM
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
 * Extracts start and end minutes from timeDuration string or separate startTime/endTime parameters.
 */
function parseAndNormalizeTime(timeDuration, startTime, endTime) {
  let sMin = null;
  let eMin = null;
  let sStr = (startTime || '').trim();
  let eStr = (endTime || '').trim();

  if (sStr && eStr) {
    sMin = timeToMinutes(sStr);
    eMin = timeToMinutes(eStr);
  }

  if ((sMin === null || eMin === null) && timeDuration) {
    // Expected patterns: "10:00 - 11:00", "02:20 PM - 04:20 PM", "10:10 – 11:10"
    const parts = timeDuration.split(/\s*[-–—]\s*|\s+to\s+/i);
    if (parts.length >= 2) {
      sStr = sStr || parts[0].trim();
      eStr = eStr || parts[1].trim();
      sMin = sMin !== null ? sMin : timeToMinutes(parts[0]);
      eMin = eMin !== null ? eMin : timeToMinutes(parts[1]);
    } else {
      // Single time provided
      sMin = timeToMinutes(timeDuration);
      if (sMin !== null) {
        eMin = sMin + 60; // default 1 hour slot
        sStr = timeDuration;
        eStr = `${Math.floor(eMin / 60)}:${(eMin % 60).toString().padStart(2, '0')}`;
      }
    }
  }

  // Fallbacks if unable to parse
  if (sMin === null) sMin = 9 * 60; // 09:00 default
  if (eMin === null) eMin = sMin + 60; // +1 hour default

  const formattedDuration = `${sStr || formatMinutesToDisplay(sMin)} - ${eStr || formatMinutesToDisplay(eMin)}`;

  return {
    startMin: sMin,
    endMin: eMin,
    sTime: sStr || formatMinutesToDisplay(sMin),
    eTime: eStr || formatMinutesToDisplay(eMin),
    formattedDuration
  };
}

function formatMinutesToDisplay(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const period = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 === 0 ? 12 : h % 12;
  return `${displayH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${period}`;
}

/**
 * Overlap check:
 * existing.startTime < requested.endTime AND existing.endTime > requested.startTime
 */
function isTimeOverlapping(startA, endA, startB, endB) {
  return startA < endB && endA > startB;
}

function getDayNameFromDate(dateObj) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const d = dateObj instanceof Date ? dateObj : new Date(dateObj);
  return isNaN(d.getTime()) ? '' : days[d.getDay()];
}

function toDateString(dateVal) {
  if (!dateVal) return '';
  const d = dateVal instanceof Date ? dateVal : new Date(dateVal);
  if (isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
}

module.exports = {
  timeToMinutes,
  parseAndNormalizeTime,
  isTimeOverlapping,
  getDayNameFromDate,
  toDateString,
  normalizeRoomIdentifier,
  isSameRoom,
  formatMinutesToDisplay
};
