# 🎓 CHARUSAT Smart Classroom & Timetable Scheduler (EduSync AI)

A production-grade, highly responsive web application built with **React 18**, **Vite 5**, **Tailwind CSS 3**, and **Framer Motion 11**. Tailored specifically for Charotar University of Science and Technology (**CHARUSAT**) and Chandubhai S. Patel Institute of Technology (**CSPIT**) Computer Science & Engineering (B.Tech CSE Semester-3, Division-1).

🔗 **GitHub Repository:** [https://github.com/MahilPatel810/codewizard](https://github.com/MahilPatel810/codewizard)

---

## 🌟 Key Features

### 1. 🔐 Role-Based Access Control & Interactive CAPTCHA
* **Dual Roles**: Seamless toggle between **Student Portal** (Sapphire Blue) and **Admin Console** (Amethyst Purple).
* **Bot Protection**: Modern, interactive CAPTCHA checkbox (*"I'm not a robot"*) with animated spinner and spring-animated checkmark verification before unlocking login.
* **Instant Demo Access**: Any email + password + verified CAPTCHA unlocks the portal.

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

---

### 4. 🏢 Vacant Space & Lab Finder with Direct Booking
* **Two Operational Views**:
  * **Timetable Rooms**: Live status of classrooms (e.g. Room 506) and labs (AI Lab 631, Mac Lab 632, Database Lab 633, OS Lab 634, Security Lab 638, AR/VR Lab, Multimedia Lab).
  * **Campus-Wide Spaces**: High-capacity venues including the 1,000-seat University Central Auditorium, 400-seat Knowledge Resource Center (Central Library), and MTIN Auditorium.
* **Admin Direct Booking**:
  * Prominent **"Book Now"** button on vacant cards for Admin accounts (hidden for students).
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
* **Smart Capacity Logic**: Searching for 450+ attendees automatically recommends the **1,000-seater Central Auditorium** over standard 100-seater classrooms.
* **Club Integration**: Official club tagging for:
  * *Technical*: CyberKavach, Club Gamma, Data Science Club, Code For Cause, Grow With Git, Innovators Club, House of Innovation, Networking & RedHat Academy, AWS Cloud Club CHARUSAT.
  * *Social / Cultural*: Rotaract Club of CHARUSAT, The Cultural Club, University Sports & Fitness Center.

---

### 8. 🤖 Persistent AI Copilot
* Anchored strictly to the **bottom-right corner** (`fixed bottom-6 right-6 z-50`).
* Features a continuous idle pulsing orb animation with concentric ripples.
* Answers complex schedule inquiries (*"Where is Batch A1 on Thursday at 1:10 PM?"*, *"Is Mac Lab 632 free?"*, *"Who teaches Discrete Maths?"*, campus lunch recess policy).

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | Modular UI component architecture |
| **Vite 5** | High-performance build tool & HMR server |
| **Tailwind CSS 3** | Utility-first styling with dark/light theming |
| **Framer Motion 11** | Fluid spring physics, layout animations & modals |
| **Lucide React** | Clean, modern iconography |
| **Recharts 2** | Institutional space utilization and foot-traffic analytics |

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18.0.0 or higher)
* [Git](https://git-scm.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/MahilPatel810/codewizard.git
   cd codewizard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173/](http://localhost:5173/) in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```
   The compiled assets will be output to the `dist/` directory.

---

## 📁 Project Structure

```
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── src/
    ├── App.jsx                       # Context providers (Theme, Auth, Institute, Booking)
    ├── main.jsx                      # React DOM mounting
    ├── index.css                     # Tailwind layers & custom animations
    ├── data/
    │   ├── cspit.js                  # Timetable schedule, courses, faculty, rooms
    │   └── charusat.js               # University macro stats, institutes, spaces, clubs
    └── components/
        ├── AICopilot.jsx             # Bottom-right floating AI Copilot
        ├── Analytics.jsx             # Space utilization charts (Recharts)
        ├── BookingHistory.jsx        # Admin booking audit & CSV exporter
        ├── Dashboard.jsx             # Welcome overview & current class status
        ├── DashboardLayout.jsx       # Floating dynamic dock & topbar
        ├── EventClubBooking.jsx      # Venue capacity matcher & club directory
        ├── InstituteSelector.jsx     # 9-institute CHARUSAT selection gateway
        ├── Login.jsx                 # Student/Admin role switcher & CAPTCHA
        ├── MasterScheduleEditor.jsx  # Admin drag/edit schedule builder
        ├── PeerSync.jsx              # 3CS student batch synchronizer
        ├── SettingsPanel.jsx         # Notifications, preferences & data exports
        └── TimetableGrid.jsx         # Full weekly color-coded schedule
```

---

## 📜 License
Developed for academic scheduling and institutional asset management at **Charotar University of Science and Technology (CHARUSAT)**.
