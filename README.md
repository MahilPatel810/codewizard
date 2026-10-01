# 🎓 CHARUSAT Smart Classroom & Timetable Scheduler (EduSync AI)

A production-grade, highly responsive full-stack web application with a modern **React 18** client and a scalable **Node.js / Express.js / PostgreSQL (Neon) / Prisma ORM** backend. Specifically engineered for Charotar University of Science and Technology (**CHARUSAT**) and Chandubhai S. Patel Institute of Technology (**CSPIT**) Computer Science & Engineering (B.Tech CSE Semester-3, Division-1).

🔗 **GitHub Repository:** [https://github.com/MahilPatel810/codewizard](https://github.com/MahilPatel810/codewizard)

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            FRONTEND (Vite / React 18)                       │
│  • Tailwind CSS 3 (Dark/Light Modes)  • Framer Motion 11  • Lucide React    │
│  • Dynamic Floating Glass Dock        • Bottom-Right AI Assistant Orb       │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTP / REST / JWT Bearer
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            BACKEND (Node.js / Express)                      │
│  • JWT Auth & bcryptjs (salt 10)      • In-Memory & DB Clash Detection      │
│  • Role-Based Access Control (Admin)  • Centralized Error & Exception Hooks │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ Prisma Client (ORM)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     DATABASE (Neon Serverless PostgreSQL)                    │
│  • Relational Tables: Users, Rooms, Timetables, Bookings                    │
│  • ESR Hardware-Level Unique Compound Index: [roomId, day, slotTime]        │
│  • Faculty Availability Index: [facultyCode, day, slotTime]                 │
│  • Vacancy Computation Index: [roomId, date, status]                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🌟 Key Features

### 1. 🔐 Role-Based Access Control & Interactive CAPTCHA
* **Dual Roles**: Seamless toggle between **Student Portal** (Sapphire Blue) and **Admin Console** (Amethyst Purple).
* **Bot Protection**: Interactive CAPTCHA checkbox (*"I'm not a robot"*) with animated spinner and spring-animated checkmark verification before unlocking login.
* **Backend Security**: Passwords hashed with `bcryptjs` (salt factor 10), signed JSON Web Tokens (JWT) with user role and department payload.

### 2. 🏛️ Multi-Institute Selection Gateway
Interactive visual grid covering all 9 constituent CHARUSAT colleges:
1. **CSPIT** — Chandubhai S. Patel Institute of Technology (Engineering)
2. **DEPSTAR** — Devang Patel Institute of Advance Technology and Research (Advanced Computing)
3. **PDPIAS** — P D Patel Institute of Applied Sciences (Pure & Applied Sciences)
4. **RPCP** — Ramanbhai Patel College of Pharmacy (Pharmacy)
5. **ARIP** — Ashok & Rita Patel Institute of Physiotherapy (Physiotherapy & MARL)
6. **CMPICA** — C M Patel Institute of Computer Applications (MCA / BCA)
7. **I2IM** — Indukaka Ipcowala Institute of Management (MBA / Management)
8. **MTIN** — Manikaka Topawala Institute of Nursing (B.Sc. Nursing & 150-bed Hospital)
9. **BDIAS** — Bhaikaka Department of Allied Healthcare Sciences

Includes live campus macro metrics: 125-acre campus, 10,000+ daily student density, 3,350 hostel beds, and 1,800 Mbps Wi-Fi infrastructure.

---

### 3. 📅 Interactive Semester Timetable & Master Schedule Editor
* **Semester Timetable Matrix (`TimetableGrid.jsx`)**:
  * Real-time CSPIT CSE Sem-3 Div-1 academic schedule (Monday to Saturday, 09:10 AM – 04:20 PM).
  * Color-coded course pills with hover elevations and modal details.
  * Cohort batch filtering (**A1**, **B1**, **C1**).
* **Admin Master Schedule Editor (`MasterScheduleEditor.jsx`)**:
  * Admin-exclusive visual editor to modify, overwrite, or rebuild weekly timetable slots.
  * Cell editor modal with batch toggle, course selector, faculty assignment, room/lab selector, and lab session toggle.
  * **"Save & Publish"** updates state instantly with interactive live preview mode.
* **Backend Clash Detection Engine**:
  * Enforces that no two entries share `[roomId, day, slotTime]` (room clash) or `[facultyCode, day, slotTime]` (faculty clash).
  * Executes atomic Prisma transactions (`prisma.$transaction`) to overwrite schedules cleanly.

---

### 4. 🏢 Vacant Space & Lab Finder with Direct Booking
* **Two Operational Views**:
  * **Timetable Rooms**: Live status of classrooms (e.g. Room 506) and labs (AI Lab 631, Mac Lab 632, Database Lab 633, OS Lab 634, Security Lab 638, AR/VR Lab, Multimedia Lab).
  * **Campus-Wide Spaces**: High-capacity venues including the 1,000-seat University Central Auditorium, 400-seat Knowledge Resource Center, and MTIN Auditorium.
* **Admin Direct Booking**:
  * Prominent **"Book Now"** button on vacant cards for Admin accounts.
  * Modal with booking purpose (*Extra Lecture, Lab Session, Exam, Club Activity, Guest Lecture, Seminar, Hackathon*), date picker, and duration.

---

### 5. 📋 Admin Booking History & Audit Dashboard
* **Audit Registry (`BookingHistory.jsx`)**:
  * Tabular display of all booked and upcoming allocations with Room ID, Purpose, Duration, Booked By/Club, and Status (`Confirmed` vs `Completed`).
  * Real-time keyword search and status filter tabs.
  * **"Generate Weekly Report"**: Compiles all admin bookings and downloads a `.csv` file directly to the client.

---

### 6. 🤝 Peer Free-Slot Synchronizer (Authentic 3CS Batch)
* Seeded exclusively with official CSPIT 3CS student enrollment records:
  * `25CS036` — KOTADIYA MAHIL DIVYESHBHAI
  * `25CS039` — MANTRAKUMAR VIPULBHAI LADANI
  * `25CS004` — CHHATBAR DHWANI MANISHBHAI
  * `25CS102` — SONI DAKSH RAKESHBHAI
  * `25CS005` — CHODVADIYA AYUSHKUMAR RAKESHBHAI
  * `25CS038` — PRATYUSH KUMAR
  * `25CS001` — ADODARIYA ANSHKUMAR PRAKASHBHAI
  * `25CS043` — MANGUKIYA NITI BHAVESHBHAI
  * `25CS064` — JAY CHANDRAKANT PATEL
  * `25CS100` — SHAH NAND PANKAJKUMAR
  * `D26CS114` — TANNA KRISHNA KALPESHBHAI
  * `D26CS122` — MAKADIYA YUG JIGNESHBHAI
* Instant mutual free-slot calculation across batches for study sessions and hackathons.

---

### 7. 🎪 Event & Club Capacity Matcher
* **Smart Capacity Logic**: Searching for 400+ attendees automatically recommends the **1,000-seater Central Auditorium** over standard 100-seater classrooms.
* **Club Integration**: Official club tagging for *CyberKavach*, *Club Gamma*, *Data Science Club*, *Code For Cause*, *Grow With Git*, *AWS Cloud Club CHARUSAT*, *Rotaract*, and *The Cultural Club*.

---

### 8. 🤖 Persistent AI Copilot
* Anchored strictly to the **bottom-right corner** (`fixed bottom-6 right-6 z-50`).
* Features a continuous idle pulsing orb animation with concentric ripples.
* Answers complex schedule inquiries (*"Where is Batch A1 on Thursday at 1:10 PM?"*, *"Is Mac Lab 632 free?"*, *"Who teaches Discrete Maths?"*, campus lunch recess policy).

---

## 🛠️ Full Tech Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend Framework** | **React 18** | Modular component hierarchy & Context providers |
| **Frontend Tooling** | **Vite 5** | High-performance dev server with fast HMR |
| **Styling** | **Tailwind CSS 3** | Utility-first styling with dark/light mode classes |
| **Animations** | **Framer Motion 11** | Spring-physics transitions and micro-interactions |
| **Icons & Charts** | **Lucide React & Recharts 2** | Iconography and campus space analytics |
| **Backend Framework** | **Node.js & Express.js** | RESTful API server with route modularity |
| **ORM** | **Prisma ORM 5** | Type-safe database queries, migrations, and seeds |
| **Database** | **PostgreSQL (Neon)** | Serverless cloud-hosted PostgreSQL cluster |
| **Auth & Security** | **JWT & bcryptjs** | Signed token validation and salted password hashing |

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18.0.0 or higher)
* [Git](https://git-scm.com/)

---

### 1. Frontend Setup (Port 5173)

```bash
# Clone the repository
git clone https://github.com/MahilPatel810/codewizard.git
cd codewizard

# Install frontend dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5174/](http://localhost:5174/) in your browser.

---

### 2. Backend Setup (Port 5000)

```bash
cd server

# Install backend dependencies
npm install

# Push Prisma schema to Neon PostgreSQL
npx prisma db push

# Seed the database with authentic CSPIT/CHARUSAT records
npm run seed

# Start API server
npm run dev
```

Open [http://localhost:5000/api/health](http://localhost:5000/api/health) to verify database connectivity.

---

## 🔑 Demo Credentials

| Role | User ID | Password | Access Level |
|---|---|---|---|
| **Admin** | `ADMIN_CSE` | `AdminPassword123` | Full timetable builder, booking management, weekly audit exports |
| **Student** | `25CS036` *(or `25CS001`, `25CS004`)* | `Student@123` | Timetable grid, peer sync, vacancy finder, AI copilot |

---

## 📁 Repository Directory Structure

```
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
├── README.md
├── src/                              # Frontend React Source
│   ├── App.jsx                       # Context providers (Theme, Auth, Institute, Booking)
│   ├── main.jsx                      # React DOM entry
│   ├── index.css                     # Tailwind layers & custom animations
│   ├── data/
│   │   ├── cspit.js                  # Timetable matrix, courses, faculty, rooms
│   │   └── charusat.js               # University stats, institutes, spaces, clubs
│   └── components/
│       ├── AICopilot.jsx             # Bottom-right floating AI Assistant
│       ├── Analytics.jsx             # Space utilization charts (Recharts)
│       ├── BookingHistory.jsx        # Admin booking audit & CSV exporter
│       ├── Dashboard.jsx             # Welcome overview & current class status
│       ├── DashboardLayout.jsx       # Floating dynamic dock & topbar
│       ├── EventClubBooking.jsx      # Venue capacity matcher & club directory
│       ├── InstituteSelector.jsx     # 9-institute CHARUSAT selection gateway
│       ├── Login.jsx                 # Student/Admin role switcher & CAPTCHA
│       ├── MasterScheduleEditor.jsx  # Admin drag/edit schedule builder
│       ├── PeerSync.jsx              # 3CS student batch synchronizer
│       ├── SettingsPanel.jsx         # Notifications, preferences & data exports
│       └── TimetableGrid.jsx         # Full weekly color-coded schedule
└── server/                           # Backend Node.js / Express / Prisma Source
    ├── .env                          # Neon PostgreSQL URL & JWT secret
    ├── .env.example                  # Template environment variables
    ├── package.json                  # Backend dependencies and scripts
    ├── server.js                     # Express API entry point
    ├── lib/
    │   └── prisma.js                 # Centralized Prisma client instance
    ├── prisma/
    │   └── schema.prisma             # PostgreSQL schema with User, Room, Timetable, Booking
    ├── middleware/
    │   ├── auth.js                   # JWT Bearer verification
    │   ├── adminOnly.js              # Admin role guard
    │   └── errorHandler.js           # Centralized exception handler
    ├── controllers/
    │   ├── authController.js         # Login, register, profile
    │   ├── timetableController.js    # Timetable view & clash detection engine
    │   ├── roomController.js         # Vacancies, booking, weekly report
    │   ├── eventController.js        # Venue capacity recommendations
    │   └── studentController.js      # Student peer search
    ├── routes/
    │   ├── authRoutes.js             # /api/auth
    │   ├── timetableRoutes.js        # /api/timetable
    │   ├── roomRoutes.js             # /api/rooms
    │   ├── eventRoutes.js            # /api/events
    │   └── studentRoutes.js          # /api/students
    └── seed/
        └── seedDatabase.js           # Database seeder using Prisma
```

---

## 📜 License
Developed for academic scheduling and institutional asset management at **Charotar University of Science and Technology (CHARUSAT)**.
