/**
 * ═══════════════════════════════════════════════════════════════
 * CHARUSAT Smart Scheduler — PostgreSQL (Neon) Database Seeder
 * Powered by Prisma ORM
 * Run: npm run seed OR npx prisma db seed
 * ═══════════════════════════════════════════════════════════════
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') });
const bcrypt = require('bcryptjs');
const prisma = require('../lib/prisma');

// ═══════════════════════════════════════════════════════════════
// 1. AUTHENTIC USER ACCOUNTS
// ═══════════════════════════════════════════════════════════════
const SEED_USERS = [
  // ── Admin ──
  { userId: 'ADMIN_CSE', name: 'CSE Department Admin', rawPassword: 'AdminPassword123', role: 'admin', department: 'CSE', batch: '' },

  // ── Authentic CSPIT 3CS Students ──
  { userId: '25CS001',   name: 'ADODARIYA ANSHKUMAR PRAKASHBHAI',    rawPassword: 'Student@123', role: 'student', department: 'CSE', batch: 'A1' },
  { userId: '25CS004',   name: 'CHHATBAR DHWANI MANISHBHAI',         rawPassword: 'Student@123', role: 'student', department: 'CSE', batch: 'A1' },
  { userId: '25CS005',   name: 'CHODVADIYA AYUSHKUMAR RAKESHBHAI',   rawPassword: 'Student@123', role: 'student', department: 'CSE', batch: 'A1' },
  { userId: '25CS036',   name: 'KOTADIYA MAHIL DIVYESHBHAI',         rawPassword: 'Student@123', role: 'student', department: 'CSE', batch: 'A1' },
  { userId: '25CS038',   name: 'PRATYUSH KUMAR',                     rawPassword: 'Student@123', role: 'student', department: 'CSE', batch: 'B1' },
  { userId: '25CS039',   name: 'MANTRAKUMAR VIPULBHAI LADANI',       rawPassword: 'Student@123', role: 'student', department: 'CSE', batch: 'B1' },
  { userId: '25CS043',   name: 'MANGUKIYA NITI BHAVESHBHAI',         rawPassword: 'Student@123', role: 'student', department: 'CSE', batch: 'B1' },
  { userId: '25CS064',   name: 'JAY CHANDRAKANT PATEL',              rawPassword: 'Student@123', role: 'student', department: 'CSE', batch: 'B1' },
  { userId: '25CS100',   name: 'SHAH NAND PANKAJKUMAR',              rawPassword: 'Student@123', role: 'student', department: 'CSE', batch: 'C1' },
  { userId: '25CS102',   name: 'SONI DAKSH RAKESHBHAI',              rawPassword: 'Student@123', role: 'student', department: 'CSE', batch: 'C1' },
  { userId: 'D26CS114',  name: 'TANNA KRISHNA KALPESHBHAI',          rawPassword: 'Student@123', role: 'student', department: 'CSE', batch: 'C1' },
  { userId: 'D26CS122',  name: 'MAKADIYA YUG JIGNESHBHAI',           rawPassword: 'Student@123', role: 'student', department: 'CSE', batch: 'C1' },
];

// ═══════════════════════════════════════════════════════════════
// 2. FACILITIES & LABS
// ═══════════════════════════════════════════════════════════════
const SEED_ROOMS = [
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
// 3. MASTER TIMETABLE SLOTS — CSPIT CSE Sem-3 Div-1
// ═══════════════════════════════════════════════════════════════
const S = {
  S1: '09:10 AM - 10:10 AM',
  S2: '10:10 AM - 11:10 AM',
  S3: '11:10 AM - 12:10 PM',
  S5: '01:10 PM - 02:10 PM',
  S7: '02:20 PM - 03:20 PM',
  S8: '03:20 PM - 04:20 PM',
};

const SEED_TIMETABLE = [
  // ─── MONDAY ────────────────────────────────────────────────
  { day: 'Monday', slotTime: S.S1, courseCode: 'CSUC201', courseName: 'Fundamentals of Data Structure and Algorithm', facultyName: 'Dr. Amit Thakkar',       facultyCode: 'ART', roomId: '506',      batch: 'Division-1' },
  { day: 'Monday', slotTime: S.S2, courseCode: 'ITUC201', courseName: 'Fundamentals of Computer Networks',            facultyName: 'Prof. Siddharth Shah',    facultyCode: 'SSS', roomId: '506',      batch: 'Division-1' },
  { day: 'Monday', slotTime: S.S3, courseCode: 'MSUD203', courseName: 'Discrete Mathematics',                         facultyName: 'Prof. Pragnesh Makwana',  facultyCode: 'PM',  roomId: '506',      batch: 'Division-1' },
  { day: 'Monday', slotTime: S.S5, courseCode: 'ITUE204', courseName: 'Web Development Frameworks',                   facultyName: 'Prof. Vidisha Pradhan',   facultyCode: 'VMP', roomId: '506',      batch: 'Division-1' },
  { day: 'Monday', slotTime: S.S7, courseCode: 'ITUE204', courseName: 'Web Development Frameworks Lab',               facultyName: 'Prof. Srushti Gajjar',    facultyCode: 'SRG', roomId: 'Lab 631',  batch: 'A1' },
  { day: 'Monday', slotTime: S.S8, courseCode: 'ITUE204', courseName: 'Web Development Frameworks Lab',               facultyName: 'Prof. Srushti Gajjar',    facultyCode: 'SRG', roomId: 'Lab 631',  batch: 'A1' },
  { day: 'Monday', slotTime: S.S7, courseCode: 'CEUE203', courseName: 'Object Oriented Programming Lab',              facultyName: 'Prof. Brinda Patel',      facultyCode: 'BPP', roomId: 'Lab 634',  batch: 'B1' },
  { day: 'Monday', slotTime: S.S8, courseCode: 'CEUE203', courseName: 'Object Oriented Programming Lab',              facultyName: 'Prof. Brinda Patel',      facultyCode: 'BPP', roomId: 'Lab 634',  batch: 'B1' },

  // ─── TUESDAY ───────────────────────────────────────────────
  { day: 'Tuesday', slotTime: S.S1, courseCode: 'CEUE203', courseName: 'Object Oriented Programming',                 facultyName: 'Prof. Dhara Solanki',     facultyCode: 'DSS', roomId: '506',      batch: 'Division-1' },
  { day: 'Tuesday', slotTime: S.S2, courseCode: 'ITUE204', courseName: 'Web Development Frameworks',                  facultyName: 'Prof. Vidisha Pradhan',   facultyCode: 'VMP', roomId: '506',      batch: 'Division-1' },
  { day: 'Tuesday', slotTime: S.S3, courseCode: 'ITUC201', courseName: 'Fundamentals of Computer Networks',           facultyName: 'Prof. Siddharth Shah',    facultyCode: 'SSS', roomId: '506',      batch: 'Division-1' },
  { day: 'Tuesday', slotTime: S.S5, courseCode: 'CSUC201', courseName: 'Fundamentals of Data Structure and Algorithm',facultyName: 'Dr. Amit Thakkar',        facultyCode: 'ART', roomId: '506',      batch: 'Division-1' },
  { day: 'Tuesday', slotTime: S.S7, courseCode: 'CSUC201', courseName: 'FDSA Lab',                                    facultyName: 'Prof. Avani Khokhariya', facultyCode: 'AVK', roomId: 'Lab 634',  batch: 'A1' },
  { day: 'Tuesday', slotTime: S.S8, courseCode: 'CSUC201', courseName: 'FDSA Lab',                                    facultyName: 'Prof. Avani Khokhariya', facultyCode: 'AVK', roomId: 'Lab 634',  batch: 'A1' },
  { day: 'Tuesday', slotTime: S.S7, courseCode: 'ITUE204', courseName: 'WDF Lab',                                     facultyName: 'Prof. Vaibhavi Patel',   facultyCode: 'VYP', roomId: 'Lab 632',  batch: 'B1' },
  { day: 'Tuesday', slotTime: S.S8, courseCode: 'ITUE204', courseName: 'WDF Lab',                                     facultyName: 'Prof. Vaibhavi Patel',   facultyCode: 'VYP', roomId: 'Lab 632',  batch: 'B1' },
  { day: 'Tuesday', slotTime: S.S7, courseCode: 'ITUC201', courseName: 'FCN Lab',                                     facultyName: 'Prof. Harshal Yagnik',   facultyCode: 'HYY', roomId: 'Lab 633',  batch: 'C1' },
  { day: 'Tuesday', slotTime: S.S8, courseCode: 'ITUC201', courseName: 'FCN Lab',                                     facultyName: 'Prof. Harshal Yagnik',   facultyCode: 'HYY', roomId: 'Lab 633',  batch: 'C1' },

  // ─── WEDNESDAY ─────────────────────────────────────────────
  { day: 'Wednesday', slotTime: S.S1, courseCode: 'MSUD203', courseName: 'Discrete Mathematics',                       facultyName: 'Prof. Pragnesh Makwana',  facultyCode: 'PM',  roomId: '506',      batch: 'Division-1' },
  { day: 'Wednesday', slotTime: S.S2, courseCode: 'CSUC201', courseName: 'Fundamentals of Data Structure and Algorithm',facultyName: 'Dr. Amit Thakkar',        facultyCode: 'ART', roomId: '506',      batch: 'Division-1' },
  { day: 'Wednesday', slotTime: S.S3, courseCode: 'CEUE203', courseName: 'Object Oriented Programming',                facultyName: 'Prof. Dhara Solanki',     facultyCode: 'DSS', roomId: '506',      batch: 'Division-1' },
  { day: 'Wednesday', slotTime: S.S5, courseCode: 'ITUC201', courseName: 'Fundamentals of Computer Networks',           facultyName: 'Prof. Siddharth Shah',    facultyCode: 'SSS', roomId: '506',      batch: 'Division-1' },
  { day: 'Wednesday', slotTime: S.S7, courseCode: 'HSUV201', courseName: 'Creativity, Problem Solving & Innovation',   facultyName: 'Prof. Akshita Kadam',    facultyCode: 'ADK', roomId: 'MMLAB',    batch: 'A1' },
  { day: 'Wednesday', slotTime: S.S8, courseCode: 'HSUV201', courseName: 'Creativity, Problem Solving & Innovation',   facultyName: 'Prof. Akshita Kadam',    facultyCode: 'ADK', roomId: 'MMLAB',    batch: 'A1' },
  { day: 'Wednesday', slotTime: S.S7, courseCode: 'CSUC201', courseName: 'FDSA Lab',                                   facultyName: 'Prof. Gayatree Parbat',  facultyCode: 'GP',  roomId: 'Lab 634',  batch: 'B1' },
  { day: 'Wednesday', slotTime: S.S8, courseCode: 'CSUC201', courseName: 'FDSA Lab',                                   facultyName: 'Prof. Gayatree Parbat',  facultyCode: 'GP',  roomId: 'Lab 634',  batch: 'B1' },
  { day: 'Wednesday', slotTime: S.S7, courseCode: 'ITUE204', courseName: 'WDF Lab',                                    facultyName: 'Prof. Srushti Gajjar',   facultyCode: 'SRG', roomId: 'Lab 631',  batch: 'C1' },
  { day: 'Wednesday', slotTime: S.S8, courseCode: 'ITUE204', courseName: 'WDF Lab',                                    facultyName: 'Prof. Srushti Gajjar',   facultyCode: 'SRG', roomId: 'Lab 631',  batch: 'C1' },

  // ─── THURSDAY ──────────────────────────────────────────────
  { day: 'Thursday', slotTime: S.S1, courseCode: 'ITUE204', courseName: 'Web Development Frameworks',                  facultyName: 'Prof. Vidisha Pradhan',   facultyCode: 'VMP', roomId: '506',      batch: 'Division-1' },
  { day: 'Thursday', slotTime: S.S2, courseCode: 'MSUD203', courseName: 'Discrete Mathematics',                        facultyName: 'Prof. Pragnesh Makwana',  facultyCode: 'PM',  roomId: '506',      batch: 'Division-1' },
  { day: 'Thursday', slotTime: S.S3, courseCode: 'ITUC201', courseName: 'Fundamentals of Computer Networks',            facultyName: 'Prof. Siddharth Shah',    facultyCode: 'SSS', roomId: '506',      batch: 'Division-1' },
  { day: 'Thursday', slotTime: S.S5, courseCode: 'CEUE203', courseName: 'Object Oriented Programming',                 facultyName: 'Prof. Dhara Solanki',     facultyCode: 'DSS', roomId: '506',      batch: 'Division-1' },
  { day: 'Thursday', slotTime: S.S7, courseCode: 'ITUC201', courseName: 'FCN Lab',                                     facultyName: 'Prof. Harshal Yagnik',   facultyCode: 'HYY', roomId: 'Lab 633',  batch: 'A1' },
  { day: 'Thursday', slotTime: S.S8, courseCode: 'ITUC201', courseName: 'FCN Lab',                                     facultyName: 'Prof. Harshal Yagnik',   facultyCode: 'HYY', roomId: 'Lab 633',  batch: 'A1' },
  { day: 'Thursday', slotTime: S.S7, courseCode: 'HSUV201', courseName: 'Creativity, Problem Solving & Innovation',    facultyName: 'Prof. Akshita Kadam',    facultyCode: 'ADK', roomId: 'MMLAB',    batch: 'B1' },
  { day: 'Thursday', slotTime: S.S8, courseCode: 'HSUV201', courseName: 'Creativity, Problem Solving & Innovation',    facultyName: 'Prof. Akshita Kadam',    facultyCode: 'ADK', roomId: 'MMLAB',    batch: 'B1' },
  { day: 'Thursday', slotTime: S.S7, courseCode: 'CSUC201', courseName: 'FDSA Lab',                                    facultyName: 'Prof. Avani Khokhariya', facultyCode: 'AVK', roomId: 'Lab 634',  batch: 'C1' },
  { day: 'Thursday', slotTime: S.S8, courseCode: 'CSUC201', courseName: 'FDSA Lab',                                    facultyName: 'Prof. Avani Khokhariya', facultyCode: 'AVK', roomId: 'Lab 634',  batch: 'C1' },

  // ─── FRIDAY ────────────────────────────────────────────────
  { day: 'Friday', slotTime: S.S1, courseCode: 'ITUC201', courseName: 'Fundamentals of Computer Networks',              facultyName: 'Prof. Siddharth Shah',    facultyCode: 'SSS', roomId: '506',      batch: 'Division-1' },
  { day: 'Friday', slotTime: S.S2, courseCode: 'CEUE203', courseName: 'Object Oriented Programming',                   facultyName: 'Prof. Dhara Solanki',     facultyCode: 'DSS', roomId: '506',      batch: 'Division-1' },
  { day: 'Friday', slotTime: S.S3, courseCode: 'ITUE204', courseName: 'Web Development Frameworks',                    facultyName: 'Prof. Vidisha Pradhan',   facultyCode: 'VMP', roomId: '506',      batch: 'Division-1' },
  { day: 'Friday', slotTime: S.S5, courseCode: 'MSUD203', courseName: 'Discrete Mathematics',                           facultyName: 'Prof. Pragnesh Makwana',  facultyCode: 'PM',  roomId: '506',      batch: 'Division-1' },
  { day: 'Friday', slotTime: S.S7, courseCode: 'CEUE203', courseName: 'OOP Lab',                                       facultyName: 'Prof. Akshita Kadam',    facultyCode: 'ADK', roomId: 'Lab 634',  batch: 'A1' },
  { day: 'Friday', slotTime: S.S8, courseCode: 'CEUE203', courseName: 'OOP Lab',                                       facultyName: 'Prof. Akshita Kadam',    facultyCode: 'ADK', roomId: 'Lab 634',  batch: 'A1' },
  { day: 'Friday', slotTime: S.S7, courseCode: 'ITUC201', courseName: 'FCN Lab',                                       facultyName: 'Prof. Harshal Yagnik',   facultyCode: 'HYY', roomId: 'Lab 633',  batch: 'B1' },
  { day: 'Friday', slotTime: S.S8, courseCode: 'ITUC201', courseName: 'FCN Lab',                                       facultyName: 'Prof. Harshal Yagnik',   facultyCode: 'HYY', roomId: 'Lab 633',  batch: 'B1' },
  { day: 'Friday', slotTime: S.S7, courseCode: 'ITUE204', courseName: 'WDF Lab',                                       facultyName: 'Prof. Vaibhavi Patel',   facultyCode: 'VYP', roomId: 'Lab 631',  batch: 'C1' },
  { day: 'Friday', slotTime: S.S8, courseCode: 'ITUE204', courseName: 'WDF Lab',                                       facultyName: 'Prof. Vaibhavi Patel',   facultyCode: 'VYP', roomId: 'Lab 631',  batch: 'C1' },

  // ─── SATURDAY ──────────────────────────────────────────────
  { day: 'Saturday', slotTime: S.S1, courseCode: 'CSUC201', courseName: 'Fundamentals of Data Structure and Algorithm', facultyName: 'Dr. Amit Thakkar',        facultyCode: 'ART', roomId: '506',      batch: 'Division-1' },
  { day: 'Saturday', slotTime: S.S2, courseCode: 'MSUD203', courseName: 'Discrete Mathematics',                         facultyName: 'Prof. Pragnesh Makwana',  facultyCode: 'PM',  roomId: '506',      batch: 'Division-1' },
  { day: 'Saturday', slotTime: S.S3, courseCode: 'ITUE204', courseName: 'Web Development Frameworks',                   facultyName: 'Prof. Vidisha Pradhan',   facultyCode: 'VMP', roomId: '506',      batch: 'Division-1' },
  { day: 'Saturday', slotTime: S.S7, courseCode: 'HSUV201', courseName: 'Creativity, Problem Solving & Innovation',    facultyName: 'Prof. Vaibhavi Patel',   facultyCode: 'VYP', roomId: 'MMLAB',    batch: 'A1' },
  { day: 'Saturday', slotTime: S.S8, courseCode: 'HSUV201', courseName: 'Creativity, Problem Solving & Innovation',    facultyName: 'Prof. Vaibhavi Patel',   facultyCode: 'VYP', roomId: 'MMLAB',    batch: 'A1' },
  { day: 'Saturday', slotTime: S.S7, courseCode: 'CEUE203', courseName: 'OOP Lab',                                     facultyName: 'Prof. Akshita Kadam',    facultyCode: 'ADK', roomId: 'Lab 634',  batch: 'B1' },
  { day: 'Saturday', slotTime: S.S8, courseCode: 'CEUE203', courseName: 'OOP Lab',                                     facultyName: 'Prof. Akshita Kadam',    facultyCode: 'ADK', roomId: 'Lab 634',  batch: 'B1' },
  { day: 'Saturday', slotTime: S.S5, courseCode: 'CEUE203', courseName: 'OOP Lab',                                     facultyName: 'Prof. Brinda Patel',     facultyCode: 'BPP', roomId: 'Lab 634',  batch: 'C1' },
];

async function seedDatabase() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('🚀 SEEDING POSTGRESQL (NEON) DATABASE VIA PRISMA ORM');
  console.log('═══════════════════════════════════════════════════════════════\n');

  try {
    // 1. Clean existing records in reverse dependency order
    console.log('🗑️  Clearing existing PostgreSQL tables...');
    await prisma.booking.deleteMany({});
    await prisma.timetable.deleteMany({});
    await prisma.room.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('   → Tables cleared successfully.\n');

    // 2. Seed Users
    console.log('👤 Seeding authentic user accounts...');
    const hashedUsers = await Promise.all(
      SEED_USERS.map(async (u) => ({
        userId: u.userId,
        name: u.name,
        password: await bcrypt.hash(u.rawPassword, 10),
        role: u.role,
        department: u.department,
        batch: u.batch
      }))
    );

    const createdUsers = [];
    for (const u of hashedUsers) {
      const created = await prisma.user.create({ data: u });
      createdUsers.push(created);
    }
    console.log(`   → ${createdUsers.length} users created in PostgreSQL.`);

    // 3. Seed Rooms & Facilities
    console.log('🏛️  Seeding campus facilities and labs...');
    const createdRooms = [];
    for (const r of SEED_ROOMS) {
      const created = await prisma.room.create({ data: r });
      createdRooms.push(created);
    }
    console.log(`   → ${createdRooms.length} rooms and venues created.`);

    // 4. Seed Timetable
    console.log('📅 Seeding master semester timetable...');
    const createdTimetable = await prisma.timetable.createMany({
      data: SEED_TIMETABLE
    });
    console.log(`   → ${createdTimetable.count} timetable slots registered.`);

    // 5. Seed Sample Bookings
    const adminUser = createdUsers.find(u => u.role === 'admin');
    const audRoom = createdRooms.find(r => r.roomId === 'AUD');
    const lab631  = createdRooms.find(r => r.roomId === 'Lab 631');
    const room506 = createdRooms.find(r => r.roomId === '506');
    const lab634  = createdRooms.find(r => r.roomId === 'Lab 634');

    if (adminUser && audRoom && lab631 && room506) {
      console.log('📋 Seeding active bookings & reservations...');
      const today = new Date();
      const nextMonday = new Date(today);
      nextMonday.setDate(today.getDate() + ((8 - today.getDay()) % 7 || 7));

      const sampleBookings = [
        { roomId: lab631.id,  bookedById: adminUser.id, date: nextMonday, timeDuration: '02:20 PM - 04:20 PM', purpose: 'Club Activity',  clubName: 'CyberKavach',         notes: 'CTF Workshop Session',               status: 'Confirmed' },
        { roomId: audRoom.id, bookedById: adminUser.id, date: nextMonday, timeDuration: '09:10 AM - 10:10 AM', purpose: 'Guest Lecture',   clubName: '',                    notes: 'Industry Expert Talk: Cloud Native', status: 'Confirmed' },
        { roomId: room506.id, bookedById: adminUser.id, date: new Date(nextMonday.getTime() + 86400000), timeDuration: '01:10 PM - 02:10 PM', purpose: 'Extra Lecture', clubName: '', notes: 'Backlog clearing — FDSA', status: 'Confirmed' },
        { roomId: lab634.id,  bookedById: adminUser.id, date: new Date(nextMonday.getTime() + 2*86400000), timeDuration: '02:20 PM - 04:20 PM', purpose: 'Workshop',    clubName: 'AWS Cloud Club CHARUSAT', notes: 'AWS Solutions Architect Prep', status: 'Confirmed' },
        { roomId: lab631.id,  bookedById: adminUser.id, date: new Date(today.getTime() - 7*86400000), timeDuration: '02:20 PM - 04:20 PM', purpose: 'Club Activity', clubName: 'Club Gamma', notes: 'Competitive Coding Marathon', status: 'Completed' },
        { roomId: room506.id, bookedById: adminUser.id, date: new Date(today.getTime() - 3*86400000), timeDuration: '01:10 PM - 02:10 PM', purpose: 'Exam',          clubName: '',           notes: 'Mid-Sem Re-Test — FCN',      status: 'Completed' },
      ];

      for (const b of sampleBookings) {
        await prisma.booking.create({ data: b });
      }
      console.log(`   → ${sampleBookings.length} booking records seeded.\n`);
    }

    console.log('═══════════════════════════════════════════════════════════════');
    console.log('✅ NEON POSTGRESQL DATABASE SEEDED SUCCESSFULLY');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`  Database Host: Neon Serverless PostgreSQL`);
    console.log(`  Admin Account: ADMIN_CSE / AdminPassword123`);
    console.log(`  Student Pass:  Student@123`);
    console.log(`  Users Seeded:  ${createdUsers.length}`);
    console.log(`  Rooms Seeded:  ${createdRooms.length}`);
    console.log(`  Timetable:     ${createdTimetable.count} slots`);
    console.log('═══════════════════════════════════════════════════════════════\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Database seeding failed:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
