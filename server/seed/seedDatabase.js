/**
 * ═══════════════════════════════════════════════════════════════
 * CHARUSAT Smart Scheduler — Database Seeder
 * Seeds: Users, Rooms, Master Timetable
 * Run:   npm run seed
 * ═══════════════════════════════════════════════════════════════
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

// ── Models ──────────────────────────────────────────────────────
const User      = require('../models/User');
const Room      = require('../models/Room');
const Timetable = require('../models/Timetable');
const Booking   = require('../models/Booking');

// ═══════════════════════════════════════════════════════════════
// 1. USER ACCOUNTS
// ═══════════════════════════════════════════════════════════════
const USERS = [
  // ── Admin ──
  { userId: 'ADMIN_CSE', name: 'CSE Department Admin', password: 'AdminPassword123', role: 'admin', department: 'CSE', batch: '' },

  // ── Authentic CSPIT 3CS Students ──
  { userId: '25CS001',   name: 'ADODARIYA ANSHKUMAR PRAKASHBHAI',    password: 'Student@123', role: 'student', department: 'CSE', batch: 'A1' },
  { userId: '25CS004',   name: 'CHHATBAR DHWANI MANISHBHAI',         password: 'Student@123', role: 'student', department: 'CSE', batch: 'A1' },
  { userId: '25CS005',   name: 'CHODVADIYA AYUSHKUMAR RAKESHBHAI',   password: 'Student@123', role: 'student', department: 'CSE', batch: 'A1' },
  { userId: '25CS036',   name: 'KOTADIYA MAHIL DIVYESHBHAI',         password: 'Student@123', role: 'student', department: 'CSE', batch: 'A1' },
  { userId: '25CS038',   name: 'PRATYUSH KUMAR',                     password: 'Student@123', role: 'student', department: 'CSE', batch: 'B1' },
  { userId: '25CS039',   name: 'MANTRAKUMAR VIPULBHAI LADANI',       password: 'Student@123', role: 'student', department: 'CSE', batch: 'B1' },
  { userId: '25CS043',   name: 'MANGUKIYA NITI BHAVESHBHAI',         password: 'Student@123', role: 'student', department: 'CSE', batch: 'B1' },
  { userId: '25CS064',   name: 'JAY CHANDRAKANT PATEL',              password: 'Student@123', role: 'student', department: 'CSE', batch: 'B1' },
  { userId: '25CS100',   name: 'SHAH NAND PANKAJKUMAR',              password: 'Student@123', role: 'student', department: 'CSE', batch: 'C1' },
  { userId: '25CS102',   name: 'SONI DAKSH RAKESHBHAI',              password: 'Student@123', role: 'student', department: 'CSE', batch: 'C1' },
  { userId: 'D26CS114',  name: 'TANNA KRISHNA KALPESHBHAI',          password: 'Student@123', role: 'student', department: 'CSE', batch: 'C1' },
  { userId: 'D26CS122',  name: 'MAKADIYA YUG JIGNESHBHAI',           password: 'Student@123', role: 'student', department: 'CSE', batch: 'C1' },
];

// ═══════════════════════════════════════════════════════════════
// 2. FACILITIES & LABS
// ═══════════════════════════════════════════════════════════════
const ROOMS = [
  // ── CSPIT Core Facilities ──
  { roomId: '506',        name: 'Room 506',                          institute: 'CSPIT',   type: 'Classroom',     capacity: 90,   hasAC: true,  floor: 5 },
  { roomId: 'Lab 631',    name: 'Artificial Intelligence Lab',       institute: 'CSPIT',   type: 'Lab',           capacity: 35,   hasAC: true,  floor: 6 },
  { roomId: 'Lab 632',    name: 'Apple / Mac Lab',                   institute: 'CSPIT',   type: 'Lab',           capacity: 35,   hasAC: true,  floor: 6 },
  { roomId: 'Lab 633',    name: 'Database Lab',                      institute: 'CSPIT',   type: 'Lab',           capacity: 35,   hasAC: true,  floor: 6 },
  { roomId: 'Lab 634',    name: 'Operating System Lab',              institute: 'CSPIT',   type: 'Lab',           capacity: 35,   hasAC: true,  floor: 6 },
  { roomId: 'Lab 638',    name: 'Sophos Information Security Lab',   institute: 'CSPIT',   type: 'Lab',           capacity: 35,   hasAC: true,  floor: 6 },
  { roomId: 'ARVR',       name: 'AR / VR Lab',                       institute: 'CSPIT',   type: 'Lab',           capacity: 20,   hasAC: true,  floor: 4 },
  { roomId: 'MMLAB',      name: 'Multimedia Lab',                    institute: 'CSPIT',   type: 'Lab',           capacity: 35,   hasAC: true,  floor: 4 },
  { roomId: 'AUD',        name: 'University Central Auditorium',     institute: 'CSPIT',   type: 'Auditorium',    capacity: 1000, hasAC: true,  floor: 0 },

  // ── DEPSTAR ──
  { roomId: 'DEP-101',    name: 'DEPSTAR Classroom 101',             institute: 'DEPSTAR', type: 'Classroom',     capacity: 100,  hasAC: true,  floor: 1 },
  { roomId: 'DEP-102',    name: 'DEPSTAR Classroom 102',             institute: 'DEPSTAR', type: 'Classroom',     capacity: 100,  hasAC: true,  floor: 1 },
  { roomId: 'DEP-LAB1',   name: 'DEPSTAR Computing Lab 1',           institute: 'DEPSTAR', type: 'Lab',           capacity: 40,   hasAC: true,  floor: 2 },

  // ── CMPICA ──
  { roomId: 'CMP-201',    name: 'CMPICA Lecture Hall 201',           institute: 'CMPICA',  type: 'Classroom',     capacity: 100,  hasAC: true,  floor: 2 },
  { roomId: 'CMP-LAB1',   name: 'CMPICA Software Lab 1',             institute: 'CMPICA',  type: 'Lab',           capacity: 40,   hasAC: true,  floor: 3 },

  // ── MTIN ──
  { roomId: 'MTN-101',    name: 'MTIN Lecture Room 101',             institute: 'MTIN',    type: 'Classroom',     capacity: 100,  hasAC: false, floor: 1 },
  { roomId: 'MTN-AUD',    name: 'MTIN Auditorium',                   institute: 'MTIN',    type: 'Auditorium',    capacity: 400,  hasAC: true,  floor: 0 },

  // ── PDPIAS ──
  { roomId: 'PDP-101',    name: 'PDPIAS Classroom 101',              institute: 'PDPIAS',  type: 'Classroom',     capacity: 80,   hasAC: true,  floor: 1 },

  // ── RPCP ──
  { roomId: 'RPC-SH1',    name: 'RPCP Seminar Hall',                 institute: 'RPCP',    type: 'Seminar Hall',  capacity: 120,  hasAC: true,  floor: 2 },

  // ── I2IM ──
  { roomId: 'I2M-101',    name: 'I2IM Conference Room',              institute: 'I2IM',    type: 'Seminar Hall',  capacity: 60,   hasAC: true,  floor: 1 },
];

// ═══════════════════════════════════════════════════════════════
// 3. MASTER TIMETABLE — CSPIT CSE Sem-3 Div-1
// ═══════════════════════════════════════════════════════════════
const SLOT = {
  S1: '09:10 AM - 10:10 AM',
  S2: '10:10 AM - 11:10 AM',
  S3: '11:10 AM - 12:10 PM',
  // S4 = Lunch (12:10 - 01:10) — no entries
  S5: '01:10 PM - 02:10 PM',
  // S6 = Break (02:10 - 02:20) — no entries
  S7: '02:20 PM - 03:20 PM',
  S8: '03:20 PM - 04:20 PM',
};

const TIMETABLE_ENTRIES = [
  // ─── MONDAY ────────────────────────────────────────────────
  { day: 'Monday', slotTime: SLOT.S1, courseCode: 'CSUC201', courseName: 'Fundamentals of Data Structure and Algorithm', facultyName: 'Dr. Amit Thakkar',       facultyCode: 'ART', roomId: '506',      batch: 'Division-1' },
  { day: 'Monday', slotTime: SLOT.S2, courseCode: 'ITUC201', courseName: 'Fundamentals of Computer Networks',            facultyName: 'Prof. Siddharth Shah',    facultyCode: 'SSS', roomId: '506',      batch: 'Division-1' },
  { day: 'Monday', slotTime: SLOT.S3, courseCode: 'MSUD203', courseName: 'Discrete Mathematics',                         facultyName: 'Prof. Pragnesh Makwana',  facultyCode: 'PM',  roomId: '506',      batch: 'Division-1' },
  { day: 'Monday', slotTime: SLOT.S5, courseCode: 'ITUE204', courseName: 'Web Development Frameworks',                   facultyName: 'Prof. Vidisha Pradhan',   facultyCode: 'VMP', roomId: '506',      batch: 'Division-1' },
  // Lab slots Mon 02:20-04:20
  { day: 'Monday', slotTime: SLOT.S7, courseCode: 'ITUE204', courseName: 'Web Development Frameworks Lab',               facultyName: 'Prof. Srushti Gajjar',    facultyCode: 'SRG', roomId: 'Lab 631',  batch: 'A1' },
  { day: 'Monday', slotTime: SLOT.S8, courseCode: 'ITUE204', courseName: 'Web Development Frameworks Lab',               facultyName: 'Prof. Srushti Gajjar',    facultyCode: 'SRG', roomId: 'Lab 631',  batch: 'A1' },
  { day: 'Monday', slotTime: SLOT.S7, courseCode: 'CEUE203', courseName: 'Object Oriented Programming Lab',              facultyName: 'Prof. Brinda Patel',      facultyCode: 'BPP', roomId: 'Lab 634',  batch: 'B1' },
  { day: 'Monday', slotTime: SLOT.S8, courseCode: 'CEUE203', courseName: 'Object Oriented Programming Lab',              facultyName: 'Prof. Brinda Patel',      facultyCode: 'BPP', roomId: 'Lab 634',  batch: 'B1' },

  // ─── TUESDAY ───────────────────────────────────────────────
  { day: 'Tuesday', slotTime: SLOT.S1, courseCode: 'CEUE203', courseName: 'Object Oriented Programming',                 facultyName: 'Prof. Dhara Solanki',     facultyCode: 'DSS', roomId: '506',      batch: 'Division-1' },
  { day: 'Tuesday', slotTime: SLOT.S2, courseCode: 'ITUE204', courseName: 'Web Development Frameworks',                  facultyName: 'Prof. Vidisha Pradhan',   facultyCode: 'VMP', roomId: '506',      batch: 'Division-1' },
  { day: 'Tuesday', slotTime: SLOT.S3, courseCode: 'ITUC201', courseName: 'Fundamentals of Computer Networks',           facultyName: 'Prof. Siddharth Shah',    facultyCode: 'SSS', roomId: '506',      batch: 'Division-1' },
  { day: 'Tuesday', slotTime: SLOT.S5, courseCode: 'CSUC201', courseName: 'Fundamentals of Data Structure and Algorithm',facultyName: 'Dr. Amit Thakkar',        facultyCode: 'ART', roomId: '506',      batch: 'Division-1' },
  // Lab slots Tue 02:20-04:20
  { day: 'Tuesday', slotTime: SLOT.S7, courseCode: 'CSUC201', courseName: 'FDSA Lab',                                    facultyName: 'Prof. Avani Khokhariya', facultyCode: 'AVK', roomId: 'Lab 634',  batch: 'A1' },
  { day: 'Tuesday', slotTime: SLOT.S8, courseCode: 'CSUC201', courseName: 'FDSA Lab',                                    facultyName: 'Prof. Avani Khokhariya', facultyCode: 'AVK', roomId: 'Lab 634',  batch: 'A1' },
  { day: 'Tuesday', slotTime: SLOT.S7, courseCode: 'ITUE204', courseName: 'WDF Lab',                                     facultyName: 'Prof. Vaibhavi Patel',   facultyCode: 'VYP', roomId: 'Lab 632',  batch: 'B1' },
  { day: 'Tuesday', slotTime: SLOT.S8, courseCode: 'ITUE204', courseName: 'WDF Lab',                                     facultyName: 'Prof. Vaibhavi Patel',   facultyCode: 'VYP', roomId: 'Lab 632',  batch: 'B1' },
  { day: 'Tuesday', slotTime: SLOT.S7, courseCode: 'ITUC201', courseName: 'FCN Lab',                                     facultyName: 'Prof. Harshal Yagnik',   facultyCode: 'HYY', roomId: 'Lab 633',  batch: 'C1' },
  { day: 'Tuesday', slotTime: SLOT.S8, courseCode: 'ITUC201', courseName: 'FCN Lab',                                     facultyName: 'Prof. Harshal Yagnik',   facultyCode: 'HYY', roomId: 'Lab 633',  batch: 'C1' },

  // ─── WEDNESDAY ─────────────────────────────────────────────
  { day: 'Wednesday', slotTime: SLOT.S1, courseCode: 'MSUD203', courseName: 'Discrete Mathematics',                       facultyName: 'Prof. Pragnesh Makwana',  facultyCode: 'PM',  roomId: '506',      batch: 'Division-1' },
  { day: 'Wednesday', slotTime: SLOT.S2, courseCode: 'CSUC201', courseName: 'Fundamentals of Data Structure and Algorithm',facultyName: 'Dr. Amit Thakkar',        facultyCode: 'ART', roomId: '506',      batch: 'Division-1' },
  { day: 'Wednesday', slotTime: SLOT.S3, courseCode: 'CEUE203', courseName: 'Object Oriented Programming',                facultyName: 'Prof. Dhara Solanki',     facultyCode: 'DSS', roomId: '506',      batch: 'Division-1' },
  { day: 'Wednesday', slotTime: SLOT.S5, courseCode: 'ITUC201', courseName: 'Fundamentals of Computer Networks',           facultyName: 'Prof. Siddharth Shah',    facultyCode: 'SSS', roomId: '506',      batch: 'Division-1' },
  // Lab slots Wed 02:20-04:20
  { day: 'Wednesday', slotTime: SLOT.S7, courseCode: 'HSUV201', courseName: 'Creativity, Problem Solving & Innovation',   facultyName: 'Prof. Akshita Kadam',    facultyCode: 'ADK', roomId: 'MMLAB',    batch: 'A1' },
  { day: 'Wednesday', slotTime: SLOT.S8, courseCode: 'HSUV201', courseName: 'Creativity, Problem Solving & Innovation',   facultyName: 'Prof. Akshita Kadam',    facultyCode: 'ADK', roomId: 'MMLAB',    batch: 'A1' },
  { day: 'Wednesday', slotTime: SLOT.S7, courseCode: 'CSUC201', courseName: 'FDSA Lab',                                   facultyName: 'Prof. Gayatree Parbat',  facultyCode: 'GP',  roomId: 'Lab 634',  batch: 'B1' },
  { day: 'Wednesday', slotTime: SLOT.S8, courseCode: 'CSUC201', courseName: 'FDSA Lab',                                   facultyName: 'Prof. Gayatree Parbat',  facultyCode: 'GP',  roomId: 'Lab 634',  batch: 'B1' },
  { day: 'Wednesday', slotTime: SLOT.S7, courseCode: 'ITUE204', courseName: 'WDF Lab',                                    facultyName: 'Prof. Srushti Gajjar',   facultyCode: 'SRG', roomId: 'Lab 631',  batch: 'C1' },
  { day: 'Wednesday', slotTime: SLOT.S8, courseCode: 'ITUE204', courseName: 'WDF Lab',                                    facultyName: 'Prof. Srushti Gajjar',   facultyCode: 'SRG', roomId: 'Lab 631',  batch: 'C1' },

  // ─── THURSDAY ──────────────────────────────────────────────
  { day: 'Thursday', slotTime: SLOT.S1, courseCode: 'ITUE204', courseName: 'Web Development Frameworks',                  facultyName: 'Prof. Vidisha Pradhan',   facultyCode: 'VMP', roomId: '506',      batch: 'Division-1' },
  { day: 'Thursday', slotTime: SLOT.S2, courseCode: 'MSUD203', courseName: 'Discrete Mathematics',                        facultyName: 'Prof. Pragnesh Makwana',  facultyCode: 'PM',  roomId: '506',      batch: 'Division-1' },
  { day: 'Thursday', slotTime: SLOT.S3, courseCode: 'ITUC201', courseName: 'Fundamentals of Computer Networks',            facultyName: 'Prof. Siddharth Shah',    facultyCode: 'SSS', roomId: '506',      batch: 'Division-1' },
  { day: 'Thursday', slotTime: SLOT.S5, courseCode: 'CEUE203', courseName: 'Object Oriented Programming',                 facultyName: 'Prof. Dhara Solanki',     facultyCode: 'DSS', roomId: '506',      batch: 'Division-1' },
  // Lab slots Thu 02:20-04:20
  { day: 'Thursday', slotTime: SLOT.S7, courseCode: 'ITUC201', courseName: 'FCN Lab',                                     facultyName: 'Prof. Harshal Yagnik',   facultyCode: 'HYY', roomId: 'Lab 633',  batch: 'A1' },
  { day: 'Thursday', slotTime: SLOT.S8, courseCode: 'ITUC201', courseName: 'FCN Lab',                                     facultyName: 'Prof. Harshal Yagnik',   facultyCode: 'HYY', roomId: 'Lab 633',  batch: 'A1' },
  { day: 'Thursday', slotTime: SLOT.S7, courseCode: 'HSUV201', courseName: 'Creativity, Problem Solving & Innovation',    facultyName: 'Prof. Akshita Kadam',    facultyCode: 'ADK', roomId: 'MMLAB',    batch: 'B1' },
  { day: 'Thursday', slotTime: SLOT.S8, courseCode: 'HSUV201', courseName: 'Creativity, Problem Solving & Innovation',    facultyName: 'Prof. Akshita Kadam',    facultyCode: 'ADK', roomId: 'MMLAB',    batch: 'B1' },
  { day: 'Thursday', slotTime: SLOT.S7, courseCode: 'CSUC201', courseName: 'FDSA Lab',                                    facultyName: 'Prof. Avani Khokhariya', facultyCode: 'AVK', roomId: 'Lab 634',  batch: 'C1' },
  { day: 'Thursday', slotTime: SLOT.S8, courseCode: 'CSUC201', courseName: 'FDSA Lab',                                    facultyName: 'Prof. Avani Khokhariya', facultyCode: 'AVK', roomId: 'Lab 634',  batch: 'C1' },

  // ─── FRIDAY ────────────────────────────────────────────────
  { day: 'Friday', slotTime: SLOT.S1, courseCode: 'ITUC201', courseName: 'Fundamentals of Computer Networks',              facultyName: 'Prof. Siddharth Shah',    facultyCode: 'SSS', roomId: '506',      batch: 'Division-1' },
  { day: 'Friday', slotTime: SLOT.S2, courseCode: 'CEUE203', courseName: 'Object Oriented Programming',                   facultyName: 'Prof. Dhara Solanki',     facultyCode: 'DSS', roomId: '506',      batch: 'Division-1' },
  { day: 'Friday', slotTime: SLOT.S3, courseCode: 'ITUE204', courseName: 'Web Development Frameworks',                    facultyName: 'Prof. Vidisha Pradhan',   facultyCode: 'VMP', roomId: '506',      batch: 'Division-1' },
  { day: 'Friday', slotTime: SLOT.S5, courseCode: 'MSUD203', courseName: 'Discrete Mathematics',                           facultyName: 'Prof. Pragnesh Makwana',  facultyCode: 'PM',  roomId: '506',      batch: 'Division-1' },
  // Lab slots Fri 02:20-04:20
  { day: 'Friday', slotTime: SLOT.S7, courseCode: 'CEUE203', courseName: 'OOP Lab',                                       facultyName: 'Prof. Akshita Kadam',    facultyCode: 'ADK', roomId: 'Lab 634',  batch: 'A1' },
  { day: 'Friday', slotTime: SLOT.S8, courseCode: 'CEUE203', courseName: 'OOP Lab',                                       facultyName: 'Prof. Akshita Kadam',    facultyCode: 'ADK', roomId: 'Lab 634',  batch: 'A1' },
  { day: 'Friday', slotTime: SLOT.S7, courseCode: 'ITUC201', courseName: 'FCN Lab',                                       facultyName: 'Prof. Harshal Yagnik',   facultyCode: 'HYY', roomId: 'Lab 633',  batch: 'B1' },
  { day: 'Friday', slotTime: SLOT.S8, courseCode: 'ITUC201', courseName: 'FCN Lab',                                       facultyName: 'Prof. Harshal Yagnik',   facultyCode: 'HYY', roomId: 'Lab 633',  batch: 'B1' },
  { day: 'Friday', slotTime: SLOT.S7, courseCode: 'ITUE204', courseName: 'WDF Lab',                                       facultyName: 'Prof. Vaibhavi Patel',   facultyCode: 'VYP', roomId: 'Lab 631',  batch: 'C1' },
  { day: 'Friday', slotTime: SLOT.S8, courseCode: 'ITUE204', courseName: 'WDF Lab',                                       facultyName: 'Prof. Vaibhavi Patel',   facultyCode: 'VYP', roomId: 'Lab 631',  batch: 'C1' },

  // ─── SATURDAY ──────────────────────────────────────────────
  { day: 'Saturday', slotTime: SLOT.S1, courseCode: 'CSUC201', courseName: 'Fundamentals of Data Structure and Algorithm', facultyName: 'Dr. Amit Thakkar',        facultyCode: 'ART', roomId: '506',      batch: 'Division-1' },
  { day: 'Saturday', slotTime: SLOT.S2, courseCode: 'MSUD203', courseName: 'Discrete Mathematics',                         facultyName: 'Prof. Pragnesh Makwana',  facultyCode: 'PM',  roomId: '506',      batch: 'Division-1' },
  { day: 'Saturday', slotTime: SLOT.S3, courseCode: 'ITUE204', courseName: 'Web Development Frameworks',                   facultyName: 'Prof. Vidisha Pradhan',   facultyCode: 'VMP', roomId: '506',      batch: 'Division-1' },
  // Sat Lab slots
  { day: 'Saturday', slotTime: SLOT.S7, courseCode: 'HSUV201', courseName: 'Creativity, Problem Solving & Innovation',    facultyName: 'Prof. Vaibhavi Patel',   facultyCode: 'VYP', roomId: 'MMLAB',    batch: 'A1' },
  { day: 'Saturday', slotTime: SLOT.S8, courseCode: 'HSUV201', courseName: 'Creativity, Problem Solving & Innovation',    facultyName: 'Prof. Vaibhavi Patel',   facultyCode: 'VYP', roomId: 'MMLAB',    batch: 'A1' },
  { day: 'Saturday', slotTime: SLOT.S7, courseCode: 'CEUE203', courseName: 'OOP Lab',                                     facultyName: 'Prof. Akshita Kadam',    facultyCode: 'ADK', roomId: 'Lab 634',  batch: 'B1' },
  { day: 'Saturday', slotTime: SLOT.S8, courseCode: 'CEUE203', courseName: 'OOP Lab',                                     facultyName: 'Prof. Akshita Kadam',    facultyCode: 'ADK', roomId: 'Lab 634',  batch: 'B1' },
  { day: 'Saturday', slotTime: SLOT.S5, courseCode: 'CEUE203', courseName: 'OOP Lab',                                     facultyName: 'Prof. Brinda Patel',     facultyCode: 'BPP', roomId: 'Lab 634',  batch: 'C1' },
];

// ═══════════════════════════════════════════════════════════════
// 4. SAMPLE BOOKINGS
// ═══════════════════════════════════════════════════════════════
function getSampleBookings(adminId) {
  const today = new Date();
  const nextMonday = new Date(today);
  nextMonday.setDate(today.getDate() + ((8 - today.getDay()) % 7 || 7));

  return [
    { date: nextMonday, timeDuration: '02:20 PM - 04:20 PM', purpose: 'Club Activity',  clubName: 'CyberKavach',         notes: 'CTF Workshop Session',               status: 'Confirmed', bookedBy: adminId },
    { date: nextMonday, timeDuration: '09:10 AM - 10:10 AM', purpose: 'Guest Lecture',   clubName: '',                    notes: 'Industry Expert Talk: Cloud Native', status: 'Confirmed', bookedBy: adminId },
    { date: new Date(nextMonday.getTime() + 86400000), timeDuration: '01:10 PM - 02:10 PM', purpose: 'Extra Lecture', clubName: '', notes: 'Backlog clearing — FDSA',       status: 'Confirmed', bookedBy: adminId },
    { date: new Date(nextMonday.getTime() + 2*86400000), timeDuration: '02:20 PM - 04:20 PM', purpose: 'Workshop',    clubName: 'AWS Cloud Club CHARUSAT', notes: 'AWS Solutions Architect Prep', status: 'Confirmed', bookedBy: adminId },
    { date: new Date(today.getTime() - 7*86400000), timeDuration: '02:20 PM - 04:20 PM', purpose: 'Club Activity', clubName: 'Club Gamma', notes: 'Competitive Coding Marathon', status: 'Completed', bookedBy: adminId },
    { date: new Date(today.getTime() - 3*86400000), timeDuration: '01:10 PM - 02:10 PM', purpose: 'Exam',          clubName: '',           notes: 'Mid-Sem Re-Test — FCN',      status: 'Completed', bookedBy: adminId },
  ];
}

// ═══════════════════════════════════════════════════════════════
// MAIN SEEDER FUNCTION
// ═══════════════════════════════════════════════════════════════
async function seedData(isStandalone = true) {
  try {
    if (isStandalone) {
      const uri = process.env.MONGO_URI;
      if (!uri) throw new Error('MONGO_URI not found in .env');

      console.log('🔗  Connecting to MongoDB...');
      await mongoose.connect(uri);
      console.log('✅  Connected to MongoDB\n');
    }

    // ── Drop existing data ──────────────────────────────────
    console.log('🗑️   Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Room.deleteMany({}),
      Timetable.deleteMany({}),
      Booking.deleteMany({}),
    ]);
    console.log('   → Collections cleared\n');

    // ── Seed Users ──────────────────────────────────────────
    console.log('👤  Seeding users...');
    const createdUsers = await User.create(USERS);
    console.log(`   → ${createdUsers.length} users created`);

    // ── Seed Rooms ──────────────────────────────────────────
    console.log('🏛️   Seeding facilities & labs...');
    const createdRooms = await Room.create(ROOMS);
    console.log(`   → ${createdRooms.length} rooms/labs/venues created`);

    // ── Seed Timetable ──────────────────────────────────────
    console.log('📅  Seeding master timetable...');
    const createdEntries = await Timetable.insertMany(TIMETABLE_ENTRIES);
    console.log(`   → ${createdEntries.length} timetable entries created`);

    // ── Seed sample bookings ────────────────────────────────
    const admin = createdUsers.find(u => u.role === 'admin');
    const audRoom = createdRooms.find(r => r.roomId === 'AUD');
    const lab631  = createdRooms.find(r => r.roomId === 'Lab 631');
    const room506 = createdRooms.find(r => r.roomId === '506');
    const lab634  = createdRooms.find(r => r.roomId === 'Lab 634');

    if (admin && audRoom && lab631) {
      console.log('📋  Seeding sample bookings...');
      const bookingData = getSampleBookings(admin._id);
      const rooms = [lab631, audRoom, room506, lab634, lab631, room506];
      const bookingsToInsert = bookingData.map((b, i) => ({
        ...b,
        room: rooms[i % rooms.length]._id,
      }));
      const createdBookings = await Booking.create(bookingsToInsert);
      console.log(`   → ${createdBookings.length} sample bookings created\n`);
    }

    console.log('═══════════════════════════════════════════════');
    console.log('  ✅  DATABASE SEEDED SUCCESSFULLY');
    console.log('═══════════════════════════════════════════════');
    console.log(`  Users:      ${createdUsers.length}`);
    console.log(`  Rooms:      ${createdRooms.length}`);
    console.log(`  Timetable:  ${createdEntries.length} entries`);
    console.log(`  Admin ID:   ${USERS[0].userId} / ${USERS[0].password}`);
    console.log(`  Student PW: Student@123`);
    console.log('═══════════════════════════════════════════════\n');

    if (isStandalone) {
      await mongoose.disconnect();
      console.log('🔌  MongoDB connection closed');
      process.exit(0);
    }
    return { success: true, users: createdUsers.length, rooms: createdRooms.length, entries: createdEntries.length };
  } catch (err) {
    console.error('\n❌  Seeding failed:', err.message);
    if (isStandalone) {
      await mongoose.disconnect();
      process.exit(1);
    }
    throw err;
  }
}

if (require.main === module) {
  seedData(true);
}

module.exports = { seedData, USERS, ROOMS, TIMETABLE_ENTRIES };
