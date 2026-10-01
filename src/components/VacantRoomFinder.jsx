import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Clock, CheckCircle, XCircle, Search, Building2,
  FlaskConical, Mic, X, CalendarDays, BookOpen,
  Download, FileText, CalendarPlus, ShieldAlert, AlertCircle
} from 'lucide-react'
import { ROOMS, SLOTS, DAYS, getVacantRooms, COURSES, FACULTY, getTodayName } from '../data/cspit'
import { CAMPUS_SPACES, ADMIN_BOOKINGS_SEED } from '../data/charusat'
import { useAuth, useBookings } from '../App'
import {
  isSameRoom,
  isSameDateOrDay,
  isTimeOverlapping,
  parseTimeRange,
  CSPIT_SLOT_RANGES
} from '../utils/timeConflict'

const ADMIN_PURPOSES = [
  'Extra Lecture',
  'Lab Session',
  'Exam',
  'Club Activity',
  'Guest Lecture',
  'Seminar / Workshop',
  'Hackathon / Competition',
]

const TYPE_FILTER = [
  { key: 'all',        label: 'All Spaces',    Icon: Building2    },
  { key: 'lecture',    label: 'Classrooms',    Icon: Mic          },
  { key: 'lab',        label: 'Labs',          Icon: FlaskConical },
  { key: 'auditorium', label: 'Auditoriums',   Icon: Mic          },
]

// ── Live pulse dot ────────────────────────────────────────────────
function LiveDot() {
  return (
    <span className="relative inline-flex h-2.5 w-2.5 flex-shrink-0">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
    </span>
  )
}

// ── Admin Booking Modal ───────────────────────────────────────────
function BookingModal({ space, onClose, onConfirm }) {
  const [purpose,       setPurpose]       = useState(ADMIN_PURPOSES[0])
  const [date,          setDate]          = useState(new Date().toISOString().split('T')[0])
  const [startTime,     setStartTime]     = useState('02:20 PM')
  const [endTime,       setEndTime]       = useState('04:20 PM')
  const [note,          setNote]          = useState('')
  const [saved,         setSaved]         = useState(false)
  const [conflictError, setConflictError] = useState(null)

  function handleConfirm(e) {
    e.preventDefault()
    setConflictError(null)

    const result = onConfirm({
      space: space.id,
      spaceName: space.name,
      purpose,
      date,
      startTime,
      endTime,
      timeDuration: `${startTime} - ${endTime}`,
      note,
      status: 'Confirmed'
    })

    if (result && result.success === false) {
      setConflictError({
        title: result.error || 'Slot Already Booked',
        message: result.message || 'This time slot has already been booked by another faculty. Please select another available slot.',
        conflict: result.conflict
      })
      return
    }

    setSaved(true)
    setTimeout(onClose, 1200)
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.92, y: 12, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        className="relative z-10 w-full max-w-md bg-white dark:bg-[#131B2E] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
      >
        {/* Header gradient */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />

        <div className="p-6 space-y-4">
          {/* Title */}
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Admin Direct Allocation
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg mt-0.5">
                Book {space.name}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <X size={15} />
            </button>
          </div>

          {/* Room info chip */}
          <div className="flex items-center gap-3 p-3 bg-blue-50/80 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
            <Building2 size={16} className="text-blue-500 flex-shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-blue-700 dark:text-blue-300">{space.capacity} seats</span>
              <span className="text-slate-500 dark:text-slate-400">
                {' '}· {space.features ? space.features.join(', ') : `${space.block} Block`}
              </span>
            </div>
          </div>

          <form onSubmit={handleConfirm} className="space-y-3.5">
            {/* Purpose */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                Purpose of Booking
              </label>
              <select
                value={purpose}
                onChange={e => setPurpose(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                {ADMIN_PURPOSES.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Date Picker */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                Date of Allocation
              </label>
              <input
                type="date"
                value={date}
                onChange={e => { setDate(e.target.value); setConflictError(null); }}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            </div>

            {/* Time Duration */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                  Start Time
                </label>
                <input
                  type="text"
                  placeholder="e.g. 02:20 PM"
                  value={startTime}
                  onChange={e => { setStartTime(e.target.value); setConflictError(null); }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                  End Time
                </label>
                <input
                  type="text"
                  placeholder="e.g. 04:20 PM"
                  value={endTime}
                  onChange={e => { setEndTime(e.target.value); setConflictError(null); }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Optional note */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                Additional Instructions / Notes
              </label>
              <textarea
                rows={2}
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="e.g. Remedial lab session for 3CS Batch A1"
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
              />
            </div>

            {/* Conflict Error Alert */}
            <AnimatePresence>
              {conflictError && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs space-y-1.5 shadow-sm"
                >
                  <div className="flex items-center gap-2 font-bold text-rose-700 dark:text-rose-400">
                    <AlertCircle size={16} className="flex-shrink-0 text-rose-600 dark:text-rose-400" />
                    <span className="text-sm">{conflictError.title}</span>
                  </div>
                  <p className="leading-relaxed font-medium">{conflictError.message}</p>
                  {conflictError.conflict && (
                    <div className="mt-1 p-2 rounded-lg bg-rose-100/70 dark:bg-rose-900/30 text-[11px] text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-mono">
                      <div><strong>Slot:</strong> {conflictError.conflict.time || conflictError.conflict.timeDuration || conflictError.conflict.timeSlot}</div>
                      <div><strong>Reserved by:</strong> {conflictError.conflict.bookedBy || 'Another Faculty'}</div>
                      <div><strong>Purpose:</strong> {conflictError.conflict.purpose || 'Institutional Allocation'}</div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Confirm */}
            <AnimatePresence mode="wait">
              {saved ? (
                <motion.div
                  key="saved"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-400 font-semibold text-sm"
                >
                  <CheckCircle size={18} /> Booking Confirmed & Logged!
                </motion.div>
              ) : (
                <motion.button
                  key="confirm"
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-primary w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 shadow-lg shadow-blue-500/25 py-3 rounded-xl text-xs font-bold"
                >
                  <BookOpen size={14} /> Confirm Reservation
                </motion.button>
              )}
            </AnimatePresence>
          </form>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Timetable-based room card ─────────────────────────────────────
function RoomCard({ room, status, occupiedBy, onBook, isAdmin }) {
  const isAvail = status === 'free'
  const isBooked = status === 'booked'
  const course  = occupiedBy?.course ? COURSES[occupiedBy.course] : null
  const fac     = occupiedBy?.faculty ? (FACULTY[occupiedBy.faculty] || { code: occupiedBy.faculty }) : null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      whileHover={{ y: -4 }}
      className={`glass-card p-4 cursor-default flex flex-col justify-between ${
        isAvail
          ? 'ring-1 ring-green-200 dark:ring-green-800/50'
          : isBooked
            ? 'ring-1 ring-amber-300 dark:ring-amber-700/50 bg-amber-50/20 dark:bg-amber-950/10'
            : 'ring-1 ring-slate-200 dark:ring-slate-800'
      }`}
    >
      <div>
        <div className="flex items-start justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            {isAvail ? (
              <LiveDot />
            ) : isBooked ? (
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0" />
            ) : (
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500 flex-shrink-0" />
            )}
            <span
              className={`text-xs font-bold ${
                isAvail
                  ? 'text-green-600 dark:text-green-400'
                  : isBooked
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {isAvail ? 'Available' : isBooked ? 'Booked' : 'Occupied'}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">{room.block} · F{room.floor}</span>
        </div>

        <div className="font-extrabold text-slate-900 dark:text-white text-base">{room.name}</div>
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{room.features[0]}</div>
        <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500 dark:text-slate-400">
          <Building2 size={12} /> {room.capacity} seats
        </div>

        {!isAvail && occupiedBy && (
          <div className={`mt-2.5 p-2 rounded-lg border text-[11px] ${
            isBooked
              ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800'
              : course?.bg ?? 'bg-slate-50 dark:bg-slate-800'
          } ${isBooked ? 'border-amber-200 dark:border-amber-800' : course?.border ?? 'border-slate-200 dark:border-slate-700'}`}>
            <div className={`font-bold ${isBooked ? 'text-amber-700 dark:text-amber-300' : course?.text ?? 'text-slate-700 dark:text-slate-300'}`}>
              {isBooked ? (occupiedBy.special || 'Faculty Allocation') : (course?.short ?? 'In Use')}
            </div>
            {occupiedBy.faculty && (
              <div className="text-slate-500 dark:text-slate-400 text-[10px]">
                {fac?.code || occupiedBy.faculty} {occupiedBy.batch ? `· ${occupiedBy.batch}` : ''}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Conditional Direct Admin Booking Button */}
      {isAdmin && (
        isAvail ? (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onBook(room)}
            className="mt-3 w-full py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 hover:shadow-indigo-500/35 flex items-center justify-center gap-1.5 transition-all"
          >
            <CalendarPlus size={13} /> Book Now
          </motion.button>
        ) : (
          <div
            title="This slot is already booked or occupied"
            className="mt-3 w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700/60 cursor-not-allowed select-none"
          >
            <ShieldAlert size={13} /> Slot Already Booked
          </div>
        )
      )}
    </motion.div>
  )
}

// ── Campus-wide large spaces ──────────────────────────────────────
function CampusSpaceCard({ space, onBook, isAdmin }) {
  const isAvail = space.available && !space.isBooked
  const isBooked = space.isBooked

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`glass-card p-4 flex flex-col justify-between ${
        isAvail
          ? 'ring-1 ring-green-200 dark:ring-green-800/40'
          : isBooked
            ? 'ring-1 ring-amber-300 dark:ring-amber-700/50 bg-amber-50/20 dark:bg-amber-950/10'
            : 'ring-1 ring-slate-200 dark:ring-slate-800'
      }`}
    >
      <div>
        <div className="flex items-start justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            {isAvail ? (
              <LiveDot />
            ) : isBooked ? (
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0" />
            ) : (
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500 flex-shrink-0" />
            )}
            <span
              className={`text-xs font-bold ${
                isAvail
                  ? 'text-green-600 dark:text-green-400'
                  : isBooked
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {isAvail ? 'Available' : isBooked ? 'Booked' : 'In Use'}
            </span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium capitalize">
            {space.type}
          </span>
        </div>

        <div className="font-extrabold text-slate-900 dark:text-white text-sm leading-snug">{space.name}</div>
        {space.cost && <div className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-0.5">{space.cost}</div>}
        <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500 dark:text-slate-400">
          <Building2 size={12} /> {space.capacity.toLocaleString()} seats · {space.ac ? 'AC ✓' : 'Open'}
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {space.features.slice(0, 3).map(f => (
            <span key={f} className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400">
              {f}
            </span>
          ))}
        </div>

        {isBooked && space.bookedInfo && (
          <div className="mt-2.5 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-[11px]">
            <div className="font-bold text-amber-700 dark:text-amber-300">
              {space.bookedInfo.purpose || 'Reserved'}
            </div>
            <div className="text-slate-500 dark:text-slate-400 text-[10px]">
              {space.bookedInfo.bookedBy} · {space.bookedInfo.startTime} - {space.bookedInfo.endTime}
            </div>
          </div>
        )}
      </div>

      {/* Conditional Direct Admin Booking Button */}
      {isAdmin && (
        isAvail ? (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onBook(space)}
            className="mt-3 w-full py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 hover:shadow-indigo-500/35 flex items-center justify-center gap-1.5 transition-all"
          >
            <CalendarPlus size={13} /> Book Now
          </motion.button>
        ) : (
          <div
            title="This space is already booked"
            className="mt-3 w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700/60 cursor-not-allowed select-none"
          >
            <ShieldAlert size={13} /> Slot Already Booked
          </div>
        )
      )}
    </motion.div>
  )
}

// ── Main component ────────────────────────────────────────────────
export default function VacantRoomFinder() {
  const { role } = useAuth()
  const { bookings, addBooking } = useBookings()
  const isAdmin = role === 'admin'

  const today = getTodayName()
  const [selDay,      setSelDay]     = useState(today === 'Sunday' ? 'Monday' : today)
  const [selSlot,     setSelSlot]    = useState(1)
  const [typeFilter,  setTypeFilter] = useState('all')
  const [search,      setSearch]     = useState('')
  const [bookingRoom, setBookingRoom]= useState(null)
  const [view,        setView]       = useState('timetable') // 'timetable' | 'campus'

  // Timetable-based rooms with dynamic bookings integration
  const ttRooms = useMemo(() => {
    const base = getVacantRooms(selDay, selSlot)
    const slotRange = CSPIT_SLOT_RANGES[selSlot]
    return base.map(r => {
      if (r.status === 'occupied') return r

      // Check if dynamically booked
      const conflicting = bookings.find(b => {
        if (b.status && b.status.toLowerCase() === 'cancelled') return false
        if (!isSameRoom(b.space, r.id)) return false
        if (!isSameDateOrDay(b.date, selDay)) return false
        const bRange = parseTimeRange(b.timeDuration, b.startTime, b.endTime)
        return slotRange ? isTimeOverlapping(bRange, slotRange) : true
      })

      if (conflicting) {
        return {
          ...r,
          status: 'booked',
          occupiedBy: {
            course: null,
            special: `Booked: ${conflicting.purpose}`,
            faculty: conflicting.bookedBy,
            batch: conflicting.timeDuration || `${conflicting.startTime || ''} - ${conflicting.endTime || ''}`
          }
        }
      }
      return r
    })
  }, [selDay, selSlot, bookings])

  const filteredTT = useMemo(() =>
    ttRooms.filter(r =>
      (typeFilter === 'all' || r.type === typeFilter) &&
      (!search || r.name.toLowerCase().includes(search.toLowerCase()) || r.features.join(' ').toLowerCase().includes(search.toLowerCase()))
    ), [ttRooms, typeFilter, search])

  // Campus spaces with dynamic bookings integration
  const filteredCampus = useMemo(() => {
    return CAMPUS_SPACES.map(s => {
      const activeBooking = bookings.find(b => {
        if (b.status && b.status.toLowerCase() === 'cancelled') return false
        return isSameRoom(b.space, s.id)
      })
      return {
        ...s,
        available: s.available && !activeBooking,
        isBooked: Boolean(activeBooking),
        bookedInfo: activeBooking
      }
    }).filter(s =>
      (typeFilter === 'all' || s.type === typeFilter) &&
      (!search || s.name.toLowerCase().includes(search.toLowerCase()))
    )
  }, [typeFilter, search, bookings])

  const vacantCount = view === 'timetable'
    ? filteredTT.filter(r => r.status === 'free').length
    : filteredCampus.filter(s => s.available).length

  function handleBook(space) {
    setBookingRoom({ ...space, id: space.id })
  }

  function handleConfirmBooking(details) {
    return addBooking({
      id: `B${Date.now()}`,
      bookedBy: 'Admin Console',
      institute: 'CSPIT',
      ...details
    })
  }

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Vacant Space & Lab Finder</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            Real-time space audit across CSPIT Division-1 classrooms and specialized CHARUSAT laboratories
          </p>
        </div>
      </div>

      {/* View switcher */}
      <div className="flex gap-2">
        {[
          { key: 'timetable', label: '📋 Academic Classrooms & Labs' },
          { key: 'campus',    label: '🏛️ High-Capacity Campus Spaces' },
        ].map(v => (
          <button
            key={v.key}
            onClick={() => setView(v.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              view === v.key
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="glass-card p-4 space-y-3">
        {view === 'timetable' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">
                Target Day
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'].map(d => (
                  <button
                    key={d}
                    onClick={() => setSelDay(d)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      selDay === d
                        ? 'bg-blue-500 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {d.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">
                Timetable Slot
              </label>
              <select
                value={selSlot}
                onChange={e => setSelSlot(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-semibold"
              >
                {SLOTS.map((s, i) => (
                  <option key={s.id} value={s.id}>
                    Slot {i+1}: {s.label} {s.type === 'lunch' ? '(Lunch Recess - All Free)' : s.type === 'break' ? '(Short Break)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto">
            {TYPE_FILTER.map(({ key, label, Icon }) => (
              <button
                key={key}
                onClick={() => setTypeFilter(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex-shrink-0 ${
                  typeFilter === key
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Icon size={12} /> {label}
              </button>
            ))}
          </div>
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by room name, lab type, equipment..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 pill-badge bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-800">
            <CheckCircle size={12} /> {vacantCount} Available
          </div>
          {isAdmin ? (
            <span className="text-xs text-violet-600 dark:text-violet-400 font-semibold bg-violet-50 dark:bg-violet-900/20 px-2.5 py-1 rounded-full border border-violet-100 dark:border-violet-800 flex items-center gap-1">
              ⚡ Admin Mode Active: Direct "Book Now" enabled on vacant rooms
            </span>
          ) : (
            <span className="text-xs text-slate-400">
              Student Mode: Live view only
            </span>
          )}
        </div>
      </div>

      {/* Room grid */}
      <AnimatePresence mode="popLayout">
        <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {view === 'timetable'
            ? filteredTT.map(room => (
                <RoomCard
                  key={room.id}
                  room={room}
                  status={room.status}
                  occupiedBy={room.occupiedBy}
                  onBook={handleBook}
                  isAdmin={isAdmin}
                />
              ))
            : filteredCampus.map(space => (
                <CampusSpaceCard
                  key={space.id}
                  space={space}
                  onBook={handleBook}
                  isAdmin={isAdmin}
                />
              ))
          }
          {(view === 'timetable' ? filteredTT : filteredCampus).length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-16 text-slate-400"
            >
              <Building2 size={36} className="mx-auto mb-3 opacity-30" />
              <p>No rooms match your filter</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Booking modal */}
      <AnimatePresence>
        {bookingRoom && (
          <BookingModal
            space={bookingRoom}
            onClose={() => setBookingRoom(null)}
            onConfirm={handleConfirmBooking}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
