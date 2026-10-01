import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PartyPopper, Search, Sliders, CheckCircle, Users,
  Building2, Zap, X, Calendar, Clock, ChevronDown, Star, AlertCircle
} from 'lucide-react'
import { CAMPUS_SPACES, CLUBS, BOOKING_PURPOSES } from '../data/charusat'
import { useAuth, useBookings } from '../App'

// ── Capacity-aware recommendation engine ─────────────────────────
function recommendSpaces(capacity, needsAC) {
  return CAMPUS_SPACES.filter(s => {
    if (!s.available) return false
    if (s.capacity < capacity) return false
    if (needsAC && !s.ac) return false
    return true
  }).sort((a, b) => {
    // prefer smallest that fits (least waste)
    const wasteA = a.capacity - capacity
    const wasteB = b.capacity - capacity
    return wasteA - wasteB
  })
}

// ── All clubs flat list ────────────────────────────────────────────
const ALL_CLUBS = [
  { id: '__none', name: '— No club (personal/dept booking)', category: '' },
  ...CLUBS.technical.map(c => ({ ...c, category: 'Technical' })),
  ...CLUBS.social.map(c => ({ ...c, category: 'Social / Cultural' })),
]

// ── Space result card ─────────────────────────────────────────────
function SpaceCard({ space, rank, onSelect, selected }) {
  const isTop = rank === 0
  return (
    <motion.button
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.07, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.02, y: -3 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(space)}
      className={`text-left w-full p-4 rounded-2xl border-2 transition-all duration-200 ${
        selected?.id === space.id
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : isTop
            ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/10'
            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131B2E] hover:border-slate-300 dark:hover:border-slate-600'
      }`}
    >
      {isTop && (
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-green-700 dark:text-green-400 mb-2">
          <Star size={11} fill="currentColor" /> Best Match
        </div>
      )}
      <div className="flex items-start justify-between gap-2">
        <div className="font-bold text-slate-900 dark:text-white text-sm leading-snug">{space.name}</div>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
          selected?.id === space.id
            ? 'bg-blue-500 text-white'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
        }`}>
          {space.capacity.toLocaleString()} seats
        </span>
      </div>
      <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
        <span>{space.ac ? '❄️ AC' : '🌀 Fan'}</span>
        <span className="capitalize">{space.type}</span>
        {space.cost && <span className="text-amber-600 dark:text-amber-400 font-medium">{space.cost.split(' ').slice(0,2).join(' ')}</span>}
      </div>
      <div className="flex flex-wrap gap-1 mt-2">
        {space.features.slice(0, 3).map(f => (
          <span key={f} className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400">{f}</span>
        ))}
      </div>
    </motion.button>
  )
}

// ── Booking confirmation card ─────────────────────────────────────
function BookingForm({ space, onClose, onConfirm }) {
  const [purpose,       setPurpose]       = useState('Club Activity')
  const [clubId,        setClubId]        = useState('__none')
  const [date,          setDate]          = useState(new Date().toISOString().split('T')[0])
  const [startTime,     setStartTime]     = useState('16:30')
  const [endTime,       setEndTime]       = useState('20:00')
  const [headCount,     setHeadCount]     = useState('')
  const [confirmed,     setConfirmed]     = useState(false)
  const [conflictError, setConflictError] = useState(null)

  function handleSubmit(e) {
    e.preventDefault()
    setConflictError(null)
    const club = ALL_CLUBS.find(c => c.id === clubId)
    const result = onConfirm({
      space: space.id,
      spaceName: space.name,
      purpose,
      club: club?.name ?? null,
      date,
      startTime,
      endTime,
      timeDuration: `${startTime} - ${endTime}`,
      headCount
    })

    if (result && result.success === false) {
      setConflictError({
        title: result.error || 'Slot Already Booked',
        message: result.message || 'This time slot has already been booked by another faculty. Please select another available slot.',
        conflict: result.conflict
      })
      return
    }

    setConfirmed(true)
    setTimeout(onClose, 1400)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5 mt-4 border-2 border-blue-200 dark:border-blue-800"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
          <Calendar size={15} className="text-blue-500" /> Complete Your Booking
        </h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="p-3 mb-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-sm">
        <span className="font-bold text-blue-700 dark:text-blue-300">{space.name}</span>
        <span className="text-slate-500 dark:text-slate-400"> · {space.capacity.toLocaleString()} seats · {space.ac ? 'AC' : 'Open'}</span>
      </div>

      {confirmed ? (
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-3 py-6 text-center"
        >
          <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle size={28} className="text-green-500" />
          </div>
          <p className="font-bold text-slate-900 dark:text-white">Booking Confirmed!</p>
          <p className="text-xs text-slate-400">Your event has been scheduled successfully.</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Purpose</label>
              <select value={purpose} onChange={e => setPurpose(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                {BOOKING_PURPOSES.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Expected Headcount</label>
              <input type="number" value={headCount} onChange={e => setHeadCount(e.target.value)}
                placeholder="e.g. 450" min={1} max={space.capacity}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
            </div>
          </div>

          {/* Club dropdown */}
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Club / Organisation</label>
            <select value={clubId} onChange={e => setClubId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
              {ALL_CLUBS.map(c => (
                <option key={c.id} value={c.id}>
                  {c.category ? `[${c.category}] ` : ''}{c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-3 sm:col-span-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Date</label>
              <input type="date" value={date} onChange={e => { setDate(e.target.value); setConflictError(null); }}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Start</label>
              <input type="time" value={startTime} onChange={e => { setStartTime(e.target.value); setConflictError(null); }}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">End</label>
              <input type="time" value={endTime} onChange={e => { setEndTime(e.target.value); setConflictError(null); }}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
            </div>
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

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            className="btn-primary w-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/25 py-3 rounded-xl"
          >
            <CheckCircle size={15} /> Confirm Event Booking
          </motion.button>
        </form>
      )}
    </motion.div>
  )
}

// ── Main component ────────────────────────────────────────────────
export default function EventClubBooking() {
  const { role }              = useAuth()
  const { addBooking }        = useBookings()
  const isAdmin               = role === 'admin'

  const [capacity,    setCapacity]   = useState('')
  const [needsAC,     setNeedsAC]    = useState(true)
  const [searched,    setSearched]   = useState(false)
  const [results,     setResults]    = useState([])
  const [selected,    setSelected]   = useState(null)
  const [showForm,    setShowForm]   = useState(false)

  function handleSearch() {
    const cap = parseInt(capacity, 10)
    if (!cap || cap < 1) return
    const recs = recommendSpaces(cap, needsAC)
    setResults(recs)
    setSearched(true)
    setSelected(null)
    setShowForm(false)
  }

  function handleSelectSpace(space) {
    setSelected(space)
    setShowForm(true)
  }

  // ── Smart advice logic ──────────────────────────────────────────
  const smartHint = useMemo(() => {
    const cap = parseInt(capacity, 10)
    if (!cap) return null
    if (cap > 500)  return { icon:'🏟️', msg:`${cap} attendees → Recommending the 1,000-seat University Auditorium.`  }
    if (cap > 150)  return { icon:'🎤', msg:`${cap} attendees → Standard classrooms (100 seats) won't fit. Checking seminar halls & auditorium.` }
    if (cap > 100)  return { icon:'🏛️', msg:`${cap} attendees → Looking at CSPIT Seminar Hall (150-seat) or MTIN Auditorium (200-seat).` }
    if (cap <= 30)  return { icon:'💻', msg:`${cap} attendees → Labs (Mac Lab, AI Lab, VR Lab) are ideal.`           }
    return { icon:'📚', msg:`${cap} attendees → Standard 100-seat smart classrooms available across CSPIT/DEPSTAR.` }
  }, [capacity])

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <PartyPopper size={22} className="text-blue-500" /> Event & Club Activity Booking
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
          Smart capacity matching — CHARUSAT campus spaces
        </p>
      </div>

      {/* Smart Capacity Filter */}
      <div className="glass-card p-5 space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
          <Zap size={15} className="text-amber-500" /> Smart Venue Finder
        </h3>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Users size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="number"
              min={1} max={1000}
              value={capacity}
              onChange={e => { setCapacity(e.target.value); setSearched(false) }}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Expected attendees (e.g. 450)"
              className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-slate-400"
            />
          </div>

          {/* AC toggle */}
          <button
            onClick={() => setNeedsAC(p => !p)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${
              needsAC
                ? 'bg-cyan-50 dark:bg-cyan-900/20 border-cyan-300 dark:border-cyan-700 text-cyan-700 dark:text-cyan-400'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
            }`}
          >
            ❄️ AC Required {needsAC ? '✓' : '✗'}
          </button>

          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={handleSearch}
            disabled={!capacity}
            className="btn-primary bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md shadow-blue-500/25 px-6 py-3 rounded-xl disabled:opacity-50"
          >
            <Search size={15} /> Find Venues
          </motion.button>
        </div>

        {/* Smart hint */}
        <AnimatePresence>
          {smartHint && capacity && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/15 border border-amber-100 dark:border-amber-800"
            >
              <span className="text-xl flex-shrink-0">{smartHint.icon}</span>
              <p className="text-xs text-amber-800 dark:text-amber-300 font-medium leading-relaxed">{smartHint.msg}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {searched && (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {results.length === 0 ? (
              <div className="text-center py-12 text-slate-400 glass-card">
                <Building2 size={36} className="mx-auto mb-3 opacity-30" />
                <p className="font-semibold">No venues match your requirements</p>
                <p className="text-xs mt-1">Try reducing headcount or disabling AC filter</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle size={15} className="text-green-500" />
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {results.length} venue{results.length !== 1 ? 's' : ''} found for {parseInt(capacity).toLocaleString()} attendees
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {results.map((space, i) => (
                    <SpaceCard
                      key={space.id}
                      space={space}
                      rank={i}
                      onSelect={handleSelectSpace}
                      selected={selected}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking form */}
      <AnimatePresence>
        {showForm && selected && (
          <BookingForm
            key={selected.id}
            space={selected}
            onClose={() => { setShowForm(false); setSelected(null) }}
            onConfirm={(details) => {
              return addBooking({ id: `EVT${Date.now()}`, bookedBy: role, ...details })
            }}
          />
        )}
      </AnimatePresence>

      {/* Club directory */}
      <div className="glass-card p-5">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-4">🎓 CHARUSAT Official Clubs & Chapters</h3>
        <div className="space-y-4">
          {[
            { label: '⚙️ Technical Clubs', items: CLUBS.technical },
            { label: '🎭 Social & Cultural', items: CLUBS.social  },
          ].map(section => (
            <div key={section.label}>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">{section.label}</p>
              <div className="flex flex-wrap gap-2">
                {section.items.map(club => (
                  <motion.div
                    key={club.id}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-default"
                  >
                    <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">{club.name}</div>
                      <div className="text-[10px] text-slate-400">{club.domain}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
