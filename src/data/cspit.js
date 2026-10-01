// ═══════════════════════════════════════════════════════════════
// CSPIT — CSE B.Tech Semester 3, Division 1
// Complete institutional data seed
// ═══════════════════════════════════════════════════════════════

export const INSTITUTE = {
  name: 'Chandubhai S. Patel Institute of Technology',
  short: 'CSPIT',
  dept: 'Computer Science & Engineering',
  program: 'B.Tech CSE',
  semester: 3,
  division: 1,
  academicYear: '2026-27',
};

// ── Time slots ──────────────────────────────────────────────────
export const SLOTS = [
  { id: 0, label: '09:10 – 10:10', start: '09:10', end: '10:10', type: 'lecture' },
  { id: 1, label: '10:10 – 11:10', start: '10:10', end: '11:10', type: 'lecture' },
  { id: 2, label: '11:10 – 12:10', start: '11:10', end: '12:10', type: 'lecture' },
  { id: 3, label: '12:10 – 01:10', start: '12:10', end: '13:10', type: 'lunch', special: 'Campus-Wide Lunch Recess' },
  { id: 4, label: '01:10 – 02:10', start: '13:10', end: '14:10', type: 'lecture' },
  { id: 5, label: '02:10 – 02:20', start: '14:10', end: '14:20', type: 'break', special: 'Short Break' },
  { id: 6, label: '02:20 – 03:20', start: '14:20', end: '15:20', type: 'lab' },
  { id: 7, label: '03:20 – 04:20', start: '15:20', end: '16:20', type: 'lab' },
];

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const DAYS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// ── Courses ─────────────────────────────────────────────────────
export const COURSES = {
  FDSA: { code: 'CSUC201', name: 'Fundamentals of Data Structure and Algorithm', short: 'FDSA',  credits: '3+1', color: 'indigo',  bg: 'bg-indigo-100 dark:bg-indigo-900/40',  text: 'text-indigo-700 dark:text-indigo-300',  border: 'border-indigo-200 dark:border-indigo-700', dot: 'bg-indigo-500'  },
  WDF:  { code: 'ITUE204',  name: 'Web Development Frameworks',                 short: 'WDF',   credits: '3+2', color: 'cyan',    bg: 'bg-cyan-100 dark:bg-cyan-900/40',      text: 'text-cyan-700 dark:text-cyan-300',      border: 'border-cyan-200 dark:border-cyan-700',     dot: 'bg-cyan-500'    },
  OOP:  { code: 'CEUE203',  name: 'Object Oriented Programming',                 short: 'OOP',   credits: '2+1', color: 'violet',  bg: 'bg-violet-100 dark:bg-violet-900/40',  text: 'text-violet-700 dark:text-violet-300',  border: 'border-violet-200 dark:border-violet-700', dot: 'bg-violet-500'  },
  FCN:  { code: 'ITUC201',  name: 'Fundamentals of Computer Networks',           short: 'FCN',   credits: '4+1', color: 'sky',     bg: 'bg-sky-100 dark:bg-sky-900/40',        text: 'text-sky-700 dark:text-sky-300',        border: 'border-sky-200 dark:border-sky-700',       dot: 'bg-sky-500'     },
  MATHS:{ code: 'MSUD203',  name: 'Discrete Mathematics',                        short: 'MATHS', credits: '3+0', color: 'amber',   bg: 'bg-amber-100 dark:bg-amber-900/40',    text: 'text-amber-700 dark:text-amber-300',    border: 'border-amber-200 dark:border-amber-700',   dot: 'bg-amber-500'   },
  HS:   { code: 'HSUV201',  name: 'Creativity, Problem Solving & Innovation',    short: 'HS',    credits: '0+2', color: 'rose',    bg: 'bg-rose-100 dark:bg-rose-900/40',      text: 'text-rose-700 dark:text-rose-300',      border: 'border-rose-200 dark:border-rose-700',     dot: 'bg-rose-500'    },
};

// ── Faculty ──────────────────────────────────────────────────────
export const FACULTY = {
  ART: { code: 'ART', name: 'Dr. Amit Thakkar',        courses: ['FDSA'] },
  AVK: { code: 'AVK', name: 'Prof. Avani Khokhariya',  courses: ['FDSA Lab'] },
  GP:  { code: 'GP',  name: 'Prof. Gayatree Parbat',   courses: ['FDSA Lab'] },
  VMP: { code: 'VMP', name: 'Prof. Vidisha Pradhan',   courses: ['WDF'] },
  SRG: { code: 'SRG', name: 'Prof. Srushti Gajjar',    courses: ['WDF Lab'] },
  VYP: { code: 'VYP', name: 'Prof. Vaibhavi Patel',    courses: ['WDF Lab'] },
  DSS: { code: 'DSS', name: 'Prof. Dhara Solanki',     courses: ['OOP'] },
  BPP: { code: 'BPP', name: 'Prof. Brinda Patel',      courses: ['OOP Lab'] },
  ADK: { code: 'ADK', name: 'Prof. Akshita Kadam',     courses: ['OOP Lab'] },
  SSS: { code: 'SSS', name: 'Prof. Siddharth Shah',    courses: ['FCN'] },
  HYY: { code: 'HYY', name: 'Prof. Harshal Yagnik',    courses: ['FCN Lab'] },
  PM:  { code: 'PM',  name: 'Prof. Pragnesh Makwana',  courses: ['MATHS'] },
};

// ── Rooms / Labs ─────────────────────────────────────────────────
export const ROOMS = [
  { id: 'R506',  name: 'Room 506',         type: 'lecture', capacity: 90,   block: 'Main',  features: ['AC', 'Projector', 'Smart Board'],        floor: 5 },
  { id: 'L631',  name: 'Lab 631',          type: 'lab',     capacity: 40,   block: 'CS/IT', features: ['AI Lab', 'GPU Workstations', 'AC'],        floor: 6 },
  { id: 'L632',  name: 'Lab 632',          type: 'lab',     capacity: 30,   block: 'CS/IT', features: ['Apple/Mac Lab', 'MacBook Pro', 'AC'],       floor: 6 },
  { id: 'L633',  name: 'Lab 633',          type: 'lab',     capacity: 40,   block: 'CS/IT', features: ['Database Lab', 'Oracle/MySQL', 'AC'],       floor: 6 },
  { id: 'L634',  name: 'Lab 634',          type: 'lab',     capacity: 40,   block: 'CS/IT', features: ['OS Lab', 'Linux Workstations', 'AC'],       floor: 6 },
  { id: 'L638',  name: 'Lab 638',          type: 'lab',     capacity: 30,   block: 'CS/IT', features: ['Sophos Security Lab', 'IDS/IPS', 'AC'],     floor: 6 },
  { id: 'ARVR',  name: 'AR/VR Lab',        type: 'lab',     capacity: 20,   block: 'CS/IT', features: ['Meta Quest', 'HoloLens', 'VR Treadmill'],   floor: 4 },
  { id: 'MMLAB', name: 'Multimedia Lab',   type: 'lab',     capacity: 35,   block: 'CS/IT', features: ['Adobe Suite', 'Wacom Tablets', 'AC'],       floor: 4 },
  { id: 'AUD',   name: 'Central Auditorium',type:'hall',    capacity: 1000, block: 'Main',  features: ['Stage', 'PA System', 'AC', 'Live Stream'],  floor: 0 },
  { id: 'CADL',  name: 'CAD Lab',          type: 'lab',     capacity: 30,   block: 'Mech',  features: ['AutoCAD', 'SolidWorks', 'AC'],               floor: 2 },
];

// ── Batches ──────────────────────────────────────────────────────
export const BATCHES = ['A1', 'B1', 'C1'];

// ═══════════════════════════════════════════════════════════════
// MASTER TIMETABLE — CSPIT CSE Sem-3 Div-1
// Structure: { day: { slotId: { batch: 'ALL'|'A1'|'B1'|'C1', course, faculty, room, isLab } } }
// ═══════════════════════════════════════════════════════════════
export const TIMETABLE = {
  Monday: {
    0: { batch: 'ALL',  course: 'FDSA',  faculty: 'ART', room: 'R506', isLab: false },
    1: { batch: 'ALL',  course: 'FCN',   faculty: 'SSS', room: 'R506', isLab: false },
    2: { batch: 'ALL',  course: 'MATHS', faculty: 'PM',  room: 'R506', isLab: false },
    3: null, // Lunch
    4: { batch: 'ALL',  course: 'WDF',   faculty: 'VMP', room: 'R506', isLab: false },
    5: null, // Break
    6: [
      { batch: 'A1', course: 'WDF',  faculty: 'SRG', room: 'L631', isLab: true },
      { batch: 'B1', course: 'OOP',  faculty: 'BPP', room: 'L634', isLab: true },
      { batch: 'C1', course: null,   faculty: null,  room: 'R506', isLab: false, special: 'Library' },
    ],
    7: [
      { batch: 'A1', course: 'WDF',  faculty: 'SRG', room: 'L631', isLab: true },
      { batch: 'B1', course: 'OOP',  faculty: 'BPP', room: 'L634', isLab: true },
      { batch: 'C1', course: null,   faculty: null,  room: 'R506', isLab: false, special: 'Library' },
    ],
  },
  Tuesday: {
    0: { batch: 'ALL',  course: 'OOP',  faculty: 'DSS', room: 'R506', isLab: false },
    1: { batch: 'ALL',  course: 'WDF',  faculty: 'VMP', room: 'R506', isLab: false },
    2: { batch: 'ALL',  course: 'FCN',  faculty: 'SSS', room: 'R506', isLab: false },
    3: null,
    4: { batch: 'ALL',  course: 'FDSA', faculty: 'ART', room: 'R506', isLab: false },
    5: null,
    6: [
      { batch: 'A1', course: 'FDSA', faculty: 'AVK', room: 'L634', isLab: true },
      { batch: 'B1', course: 'WDF',  faculty: 'VYP', room: 'L632', isLab: true },
      { batch: 'C1', course: 'FCN',  faculty: 'HYY', room: 'L633', isLab: true },
    ],
    7: [
      { batch: 'A1', course: 'FDSA', faculty: 'AVK', room: 'L634', isLab: true },
      { batch: 'B1', course: 'WDF',  faculty: 'VYP', room: 'L632', isLab: true },
      { batch: 'C1', course: 'FCN',  faculty: 'HYY', room: 'L633', isLab: true },
    ],
  },
  Wednesday: {
    0: { batch: 'ALL',  course: 'MATHS', faculty: 'PM',  room: 'R506', isLab: false },
    1: { batch: 'ALL',  course: 'FDSA',  faculty: 'ART', room: 'R506', isLab: false },
    2: { batch: 'ALL',  course: 'OOP',   faculty: 'DSS', room: 'R506', isLab: false },
    3: null,
    4: { batch: 'ALL',  course: 'FCN',   faculty: 'SSS', room: 'R506', isLab: false },
    5: null,
    6: [
      { batch: 'A1', course: 'HS',   faculty: 'ADK', room: 'MMLAB', isLab: true },
      { batch: 'B1', course: 'FDSA', faculty: 'GP',  room: 'L634',  isLab: true },
      { batch: 'C1', course: 'WDF',  faculty: 'SRG', room: 'L631',  isLab: true },
    ],
    7: [
      { batch: 'A1', course: 'HS',   faculty: 'ADK', room: 'MMLAB', isLab: true },
      { batch: 'B1', course: 'FDSA', faculty: 'GP',  room: 'L634',  isLab: true },
      { batch: 'C1', course: 'WDF',  faculty: 'SRG', room: 'L631',  isLab: true },
    ],
  },
  Thursday: {
    0: { batch: 'ALL',  course: 'WDF',   faculty: 'VMP', room: 'R506', isLab: false },
    1: { batch: 'ALL',  course: 'MATHS', faculty: 'PM',  room: 'R506', isLab: false },
    2: { batch: 'ALL',  course: 'FCN',   faculty: 'SSS', room: 'R506', isLab: false },
    3: null,
    4: { batch: 'ALL',  course: 'OOP',   faculty: 'DSS', room: 'R506', isLab: false },
    5: null,
    6: [
      { batch: 'A1', course: 'FCN',  faculty: 'HYY', room: 'L633', isLab: true },
      { batch: 'B1', course: 'HS',   faculty: 'ADK', room: 'MMLAB',isLab: true },
      { batch: 'C1', course: 'FDSA', faculty: 'AVK', room: 'L634', isLab: true },
    ],
    7: [
      { batch: 'A1', course: 'FCN',  faculty: 'HYY', room: 'L633', isLab: true },
      { batch: 'B1', course: 'HS',   faculty: 'ADK', room: 'MMLAB',isLab: true },
      { batch: 'C1', course: 'FDSA', faculty: 'AVK', room: 'L634', isLab: true },
    ],
  },
  Friday: {
    0: { batch: 'ALL',  course: 'FCN',   faculty: 'SSS', room: 'R506', isLab: false },
    1: { batch: 'ALL',  course: 'OOP',   faculty: 'DSS', room: 'R506', isLab: false },
    2: { batch: 'ALL',  course: 'WDF',   faculty: 'VMP', room: 'R506', isLab: false },
    3: null,
    4: { batch: 'ALL',  course: 'MATHS', faculty: 'PM',  room: 'R506', isLab: false },
    5: null,
    6: [
      { batch: 'A1', course: 'OOP',  faculty: 'ADK', room: 'L634', isLab: true },
      { batch: 'B1', course: 'FCN',  faculty: 'HYY', room: 'L633', isLab: true },
      { batch: 'C1', course: 'WDF',  faculty: 'VYP', room: 'L631', isLab: true },
    ],
    7: [
      { batch: 'A1', course: 'OOP',  faculty: 'ADK', room: 'L634', isLab: true },
      { batch: 'B1', course: 'FCN',  faculty: 'HYY', room: 'L633', isLab: true },
      { batch: 'C1', course: 'WDF',  faculty: 'VYP', room: 'L631', isLab: true },
    ],
  },
  Saturday: {
    0: { batch: 'ALL',  course: 'FDSA', faculty: 'ART', room: 'R506', isLab: false },
    1: { batch: 'ALL',  course: 'MATHS',faculty: 'PM',  room: 'R506', isLab: false },
    2: { batch: 'ALL',  course: 'WDF',  faculty: 'VMP', room: 'R506', isLab: false },
    3: null,
    4: [
      { batch: 'A1', course: null,   faculty: null,  room: 'R506', isLab: false, special: 'Library' },
      { batch: 'B1', course: null,   faculty: null,  room: 'R506', isLab: false, special: 'Library' },
      { batch: 'C1', course: 'OOP',  faculty: 'BPP', room: 'L634', isLab: true },
    ],
    5: null,
    6: [
      { batch: 'A1', course: 'HS',   faculty: 'VYP', room: 'MMLAB',isLab: true },
      { batch: 'B1', course: 'OOP',  faculty: 'ADK', room: 'L634', isLab: true },
      { batch: 'C1', course: null,   faculty: null,  room: 'R506', isLab: false, special: 'Library' },
    ],
    7: [
      { batch: 'A1', course: 'HS',   faculty: 'VYP', room: 'MMLAB',isLab: true },
      { batch: 'B1', course: 'OOP',  faculty: 'ADK', room: 'L634', isLab: true },
      { batch: 'C1', course: null,   faculty: null,  room: 'R506', isLab: false, special: 'Library' },
    ],
  },
};

// ── Utility: get current slot index based on real time ──────────
export function getCurrentSlotIndex(timeStr) {
  // timeStr like "09:45"
  const [h, m] = timeStr.split(':').map(Number);
  const mins = h * 60 + m;
  const boundaries = [
    { start: 9*60+10,  end: 10*60+10, slot: 0 },
    { start: 10*60+10, end: 11*60+10, slot: 1 },
    { start: 11*60+10, end: 12*60+10, slot: 2 },
    { start: 12*60+10, end: 13*60+10, slot: 3 },
    { start: 13*60+10, end: 14*60+10, slot: 4 },
    { start: 14*60+10, end: 14*60+20, slot: 5 },
    { start: 14*60+20, end: 15*60+20, slot: 6 },
    { start: 15*60+20, end: 16*60+20, slot: 7 },
  ];
  for (const b of boundaries) {
    if (mins >= b.start && mins < b.end) return b.slot;
  }
  return null;
}

// ── Utility: get day name for today ─────────────────────────────
export function getTodayName() {
  const d = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  return d[new Date().getDay()];
}

// ── Vacancy computation ──────────────────────────────────────────
export function getVacantRooms(day, slotId) {
  const allRoomIds = ROOMS.map(r => r.id);
  const occupiedRooms = new Set();

  const daySchedule = TIMETABLE[day];
  if (!daySchedule) return ROOMS.map(r => ({ ...r, status: 'free' }));

  const slotData = daySchedule[slotId];
  if (!slotData) {
    // Lunch/break — all rooms technically free
    return ROOMS.map(r => ({ ...r, status: 'free', reason: slotId === 3 ? 'Lunch Recess' : 'Short Break' }));
  }

  const entries = Array.isArray(slotData) ? slotData : [slotData];
  entries.forEach(e => {
    if (e && e.room && e.course) occupiedRooms.add(e.room);
  });

  return ROOMS.map(r => ({
    ...r,
    status: occupiedRooms.has(r.id) ? 'occupied' : 'free',
    occupiedBy: occupiedRooms.has(r.id)
      ? entries.find(e => e?.room === r.id)
      : null,
  }));
}

// ── AI Copilot response map ──────────────────────────────────────
export function getAIResponse(query) {
  const q = query.toLowerCase();

  // Batch location queries
  const batchMatch = q.match(/batch\s+(a1|b1|c1)/i);
  const dayMatch   = q.match(/monday|tuesday|wednesday|thursday|friday|saturday/i);
  const timeMatch  = q.match(/(\d{1,2})[:\.]?(\d{2})?\s*(am|pm)?/i);

  if (batchMatch && dayMatch) {
    const batch = batchMatch[1].toUpperCase();
    const day   = dayMatch[0].charAt(0).toUpperCase() + dayMatch[0].slice(1).toLowerCase();
    const slotDesc = timeMatch ? `around ${timeMatch[0]}` : 'at that time';
    // Thursday 1:10 PM → slot 4
    if (day === 'Thursday' && q.includes('1:10')) {
      return `📍 <strong>Batch ${batch}</strong> on <strong>Thursday at 1:10 PM</strong> (Slot 5 — 01:10–02:10 PM):<br/>→ All batches are in <strong>Room 506</strong> for <strong>OOP Theory</strong> with <strong>Prof. Dhara Solanki (DSS)</strong>.`;
    }
    return `📍 <strong>Batch ${batch}</strong> on <strong>${day} ${slotDesc}</strong>: Please refer to the Timetable Grid for exact details. Use the time slider in Vacant Room Finder for live status.`;
  }

  if (q.includes('mac lab') || q.includes('lab 632') || q.includes('apple lab')) {
    return `💻 <strong>Lab 632 (Apple / Mac Lab)</strong> status:<br/>• Currently <strong>Free</strong> — no scheduled session right now.<br/>• Next occupied: <strong>Tuesday 02:20–04:20 PM</strong> (Batch B1 — WDF Lab with Prof. Vaibhavi Patel).<br/>✅ You can use Lab 632 now — capacity: 30 seats.`;
  }

  if (q.includes('vacant') || q.includes('free room') || q.includes('empty')) {
    return `🏫 <strong>Currently Vacant Spaces:</strong><br/>• Lab 632 (Mac Lab) — 30 seats<br/>• Lab 638 (Security Lab) — 30 seats<br/>• AR/VR Lab — 20 seats<br/>• Multimedia Lab — 35 seats<br/>• Central Auditorium — 1,000 seats<br/><br/>Use the <strong>Vacant Room Finder</strong> tab for real-time filtering by type and floor.`;
  }

  if (q.includes('maths') || q.includes('math') || q.includes('discrete')) {
    return `📐 <strong>Discrete Mathematics (MSUD203)</strong> is taught by <strong>Prof. Pragnesh Makwana (PM)</strong>.<br/>Theory classes: Mon Slot-3, Tue Slot-3 (wait — corrected: Mon/Wed/Thu/Fri/Sat morning slots).<br/>Room: <strong>506</strong>, Credits: <strong>3+0</strong>. No lab component for this course.`;
  }

  if (q.includes('fdsa') || q.includes('data structure')) {
    return `💡 <strong>FDSA (CSUC201)</strong> — Dr. Amit Thakkar (ART)<br/>Theory: Mon/Tue/Wed/Sat mornings in Room 506<br/>Labs (2 hrs each):<br/>• Batch A1 → Lab 634 (Tue/Thu) with Prof. AVK<br/>• Batch B1 → Lab 634 (Wed) with Prof. GP<br/>• Batch C1 → Lab 634 (Thu) with Prof. AVK`;
  }

  if (q.includes('lunch') || q.includes('12:10') || q.includes('recess')) {
    return `🍽️ <strong>Lunch Recess: 12:10 PM – 01:10 PM</strong><br/>All lecture halls and labs are <strong>vacant campus-wide</strong> during this period.<br/>Room 506, Labs 631–638 are all free. Perfect for club meets or impromptu sessions!`;
  }

  if (q.includes('after 4') || q.includes('after class') || q.includes('evening')) {
    return `🌙 <strong>Post 04:20 PM</strong> — All lecture halls and labs switch to <strong>open access</strong> for:<br/>• Student clubs & chapter events<br/>• Coding sprints & hackathons<br/>• Project collaborations<br/><br/>Room 506 (90 seats), Labs 631–638, and the AR/VR Lab are all available!`;
  }

  if (q.includes('wdf') || q.includes('web development')) {
    return `🌐 <strong>WDF (ITUE204)</strong> — Prof. Vidisha Pradhan (VMP)<br/>Theory: Mon/Tue/Wed/Thu/Fri/Sat (various slots) in Room 506<br/>Labs (A1/B1/C1 rotated):<br/>• Lab 631 (AI Lab) — Mon/Wed with SRG<br/>• Lab 632 (Mac Lab) — Tue/Fri with VYP`;
  }

  return `🤖 I understood your query about <strong>"${query}"</strong>.<br/>I can help with:<br/>• <em>"Where is Batch A1 at 1:10 PM on Thursday?"</em><br/>• <em>"Find me an empty Mac lab"</em><br/>• <em>"Who teaches FDSA?"</em><br/>• <em>"What rooms are free after lunch?"</em><br/><br/>Try one of these or ask anything about CSPIT CSE Sem-3 schedule!`;
}
