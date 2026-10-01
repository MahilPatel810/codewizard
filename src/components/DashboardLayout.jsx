import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Calendar, Building2, Users,
  BarChart3, Settings, LogOut, Sun, Moon, PartyPopper,
  ClipboardList, X, TableProperties
} from 'lucide-react'
import { useAuth, useTheme, useInstitute } from '../App'
import TimetableGrid     from './TimetableGrid'
import VacantRoomFinder  from './VacantRoomFinder'
import PeerSync          from './PeerSync'
import Analytics         from './Analytics'
import SettingsPanel     from './SettingsPanel'
import AICopilot         from './AICopilot'
import Dashboard         from './Dashboard'
import EventClubBooking  from './EventClubBooking'
import BookingHistory    from './BookingHistory'
import MasterScheduleEditor from './MasterScheduleEditor'

// ── Floating Dynamic Dock — Strictly NO moving rectangle ─────────
function FloatingDock({ active, setActive, isAdmin }) {
  // Base navigation
  const navItems = [
    { id: 'dashboard',  label: 'Dashboard',    Icon: LayoutDashboard },
    { id: 'timetable',  label: 'Timetable',    Icon: Calendar        },
    { id: 'vacant',     label: 'Vacant Rooms', Icon: Building2       },
    { id: 'peers',      label: 'Peer Sync',    Icon: Users           },
    { id: 'events',     label: 'Events & Clubs', Icon: PartyPopper   },
    ...(isAdmin ? [
      { id: 'schedule-editor', label: 'Schedule Editor', Icon: TableProperties },
      { id: 'booking-history', label: 'Booking Logs',    Icon: ClipboardList   },
    ] : []),
    { id: 'analytics',  label: 'Analytics',    Icon: BarChart3       },
    { id: 'settings',   label: 'Settings',     Icon: Settings        },
  ]

  return (
    <>
      {/* Desktop vertical floating dynamic dock */}
      <div className="hidden md:flex fixed left-4 top-1/2 -translate-y-1/2 z-40">
        <motion.nav
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-1.5 p-2 rounded-2xl glass shadow-2xl border border-white/20 dark:border-slate-800"
        >
          {navItems.map(({ id, label, Icon }) => {
            const isActive = active === id
            return (
              <div key={id} className="relative group">
                <motion.button
                  onClick={() => setActive(id)}
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.92 }}
                  animate={{
                    // Clean color and background shift only — NO sliding rectangle indicator
                    backgroundColor: isActive
                      ? 'rgba(59, 130, 246, 0.18)'
                      : 'transparent',
                    color: isActive ? '#3B82F6' : '#94A3B8',
                  }}
                  transition={{ duration: 0.18 }}
                  className="w-11 h-11 rounded-xl flex items-center justify-center transition-colors relative"
                  title={label}
                  aria-label={label}
                >
                  <Icon size={19} strokeWidth={isActive ? 2.3 : 1.7} />
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 absolute bottom-1"></span>
                  )}
                </motion.button>

                {/* Tooltip on right */}
                <div className="absolute left-14 top-1/2 -translate-y-1/2 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-150 translate-x-1 group-hover:translate-x-0">
                  <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold px-3 py-1.5 rounded-xl shadow-2xl whitespace-nowrap">
                    {label}
                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-900 dark:bg-white rotate-45" />
                  </div>
                </div>
              </div>
            )
          })}
        </motion.nav>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-white/20 dark:border-slate-800 px-1 py-2 pb-safe">
        <div className="flex items-center justify-around">
          {navItems.slice(0, 6).map(({ id, label, Icon }) => {
            const isActive = active === id
            return (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-blue-500'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.3 : 1.7} />
                <span className="text-[9px] font-semibold">{label.split(' ')[0]}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </>
  )
}

// ── Top Bar ──────────────────────────────────────────────────────
function TopBar({ activeLabel }) {
  const { name, role, logout }      = useAuth()
  const { dark, toggleTheme }       = useTheme()
  const { institute, setInstitute } = useInstitute()
  const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-5 py-3 flex items-center gap-3">
      {/* Institute Badge / Switcher */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setInstitute(null)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-white text-xs font-bold shadow-md bg-gradient-to-r ${institute?.color ?? 'from-blue-500 to-indigo-600'} hover:shadow-lg transition-all`}
        title="Switch Institute"
      >
        <span>{institute?.icon}</span>
        <span>{institute?.name}</span>
        <X size={12} className="opacity-70 ml-0.5" />
      </motion.button>

      <div className="hidden sm:block">
        <h1 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">{activeLabel}</h1>
        <p className="text-[11px] text-slate-400">{institute?.full}</p>
      </div>

      <div className="ml-auto flex items-center gap-2.5">
        {/* Live clock */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-xs font-mono font-semibold">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> {now}
        </div>

        {/* Role badge */}
        <span className={`pill-badge ${
          role === 'admin'
            ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800'
            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
        }`}>
          {role === 'admin' ? '⚙️ Admin Console' : '🎓 Student Portal'}
        </span>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:scale-105 active:scale-95 transition-all"
          title="Toggle Light/Dark Mode"
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* User profile & Logout */}
        <button
          onClick={logout}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all group"
          title="Sign out"
        >
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}&backgroundColor=b6e3f4`}
            className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700"
            alt={name}
          />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 hidden sm:inline">
            {name?.split(' ')[0]}
          </span>
          <LogOut size={14} className="text-slate-400 group-hover:text-rose-500 transition-colors" />
        </button>
      </div>
    </header>
  )
}

export default function DashboardLayout() {
  const { role } = useAuth()
  const isAdmin = role === 'admin'

  const [active, setActive] = useState('dashboard')

  const labelMap = {
    dashboard:         'Dashboard Overview',
    timetable:         'Semester Timetable Matrix',
    vacant:            'Vacant Spaces & Lab Finder',
    peers:             'Peer Free-Slot Sync',
    events:            'Events & Club Bookings',
    'schedule-editor': 'Master Schedule Editor',
    'booking-history': 'Admin Booking Logs & Audit',
    analytics:         'Institutional Analytics',
    settings:          'System Preferences & Export',
  }

  const activeLabel = labelMap[active] || 'Dashboard'

  // Section map
  const SECTIONS = {
    dashboard:         <Dashboard />,
    timetable:         <TimetableGrid />,
    vacant:            <VacantRoomFinder />,
    peers:             <PeerSync />,
    events:            <EventClubBooking />,
    'schedule-editor': <MasterScheduleEditor />,
    'booking-history': <BookingHistory />,
    analytics:         <Analytics />,
    settings:          <SettingsPanel />,
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] transition-colors duration-300">
      <FloatingDock active={active} setActive={setActive} isAdmin={isAdmin} />

      <div className="md:pl-[72px]">
        <TopBar activeLabel={activeLabel} />

        <main className="p-4 sm:p-6 pb-28 md:pb-8 max-w-6xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              {SECTIONS[active] || <Dashboard />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* AI Copilot strictly anchored to bottom-right corner */}
      <AICopilot />
    </div>
  )
}
