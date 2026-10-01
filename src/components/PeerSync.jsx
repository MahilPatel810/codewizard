import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserPlus, X, CheckCircle, Clock, Users, GraduationCap, ShieldCheck } from 'lucide-react'
import { TIMETABLE, SLOTS, DAYS } from '../data/cspit'
import { CSPIT_3CS_STUDENTS } from '../data/charusat'

function computeCommonFree(selectedBatches) {
  const results = []
  DAYS.forEach(day => {
    SLOTS.forEach(slot => {
      if (slot.type === 'lunch' || slot.type === 'break') return
      const dayData = TIMETABLE[day]?.[slot.id]
      if (!dayData) {
        results.push({ day, slot, reason: 'No class scheduled' })
        return
      }

      const entries = Array.isArray(dayData) ? dayData : [dayData]
      const allFree = selectedBatches.every(batch => {
        const batchEntry = entries.find(e => e?.batch === batch || e?.batch === 'ALL')
        return !batchEntry?.course
      })
      if (allFree) results.push({ day, slot })
    })
  })
  return results
}

export default function PeerSync() {
  // Initially seeded with authentic 3CS students
  const [peers, setPeers] = useState(CSPIT_3CS_STUDENTS.slice(0, 4))
  const [selectedBatches, setSelBatches] = useState(['A1', 'B1'])
  const [searchVal, setSearchVal] = useState('')

  const allStudents = CSPIT_3CS_STUDENTS

  const searchResults = useMemo(() => {
    if (!searchVal.trim()) return []
    return allStudents.filter(p =>
      !peers.some(active => active.id === p.id) &&
      (p.name.toLowerCase().includes(searchVal.toLowerCase()) ||
       p.roll.toLowerCase().includes(searchVal.toLowerCase()))
    )
  }, [searchVal, peers, allStudents])

  function addPeer(student) {
    setPeers(prev => [...prev, student])
    setSearchVal('')
  }

  function removePeer(id) {
    setPeers(prev => prev.filter(p => p.id !== id))
  }

  function toggleBatch(b) {
    setSelBatches(prev =>
      prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]
    )
  }

  const commonFreeSlots = useMemo(() =>
    computeCommonFree(selectedBatches),
  [selectedBatches])

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-2">
          <GraduationCap size={13} /> CSPIT B.Tech CSE Semester-3 (Batch 3CS)
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Peer Free-Slot Synchronizer</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
          Cross-compare batch schedules (A1 / B1 / C1) and real cohort peers for hackathons and group studies
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left — Peer List & Search */}
        <div className="glass-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <Users size={16} className="text-blue-500" /> Synced 3CS Peers ({peers.length})
            </h3>
            <span className="text-[11px] font-medium text-slate-400">Authentic 3CS Database</span>
          </div>

          {/* Search Input with Autocomplete */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by enrollment ID (e.g. 25CS036) or student name..."
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              className="input-field"
            />
            <AnimatePresence>
              {searchVal.trim() && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute left-0 right-0 top-full mt-1.5 z-30 bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden max-h-64 overflow-y-auto"
                >
                  {searchResults.map(student => (
                    <button
                      key={student.id}
                      onClick={() => addPeer(student)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left border-b border-slate-100 dark:border-slate-800 last:border-0"
                    >
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.seed}&backgroundColor=b6e3f4`}
                        className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex-shrink-0"
                        alt={student.name}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {student.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                          {student.roll} • <span className="font-semibold text-blue-500">Batch {student.batch}</span>
                        </div>
                      </div>
                      <span className="text-xs text-blue-500 font-bold px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                        + Add
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Active Synced Peer Badges */}
          <div className="flex flex-wrap gap-3">
            <AnimatePresence>
              {peers.map(p => (
                <motion.div
                  key={p.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="flex flex-col items-center gap-1.5 group cursor-pointer w-20 text-center"
                >
                  <div className="relative">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.seed}&backgroundColor=b6e3f4`}
                      className={`w-14 h-14 rounded-full border-2 shadow-md transition-transform group-hover:scale-105 bg-slate-100 dark:bg-slate-800 ${
                        p.free ? 'border-green-400' : 'border-slate-300 dark:border-slate-600'
                      }`}
                      alt={p.name}
                    />
                    <div className={`absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${
                      p.free ? 'bg-green-500' : 'bg-slate-400'
                    }`}></div>
                    <button
                      onClick={() => removePeer(p.id)}
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                      title="Remove peer"
                    >
                      <X size={10} />
                    </button>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-900 dark:text-white truncate max-w-[80px]">
                      {p.name.split(' ')[0]}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {p.roll}
                    </div>
                    <div className={`text-[10px] font-semibold ${p.free ? 'text-green-500' : 'text-slate-400'}`}>
                      Batch {p.batch}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Add peer quick button */}
              <motion.button
                onClick={() => document.querySelector('input[placeholder*="Search by enrollment"]')?.focus()}
                className="flex flex-col items-center gap-1.5 w-20 text-center"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-14 h-14 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center hover:border-blue-400 transition-colors">
                  <UserPlus size={18} className="text-slate-400" />
                </div>
                <div className="text-[10px] text-slate-400 font-semibold mt-1">Add 3CS Peer</div>
              </motion.button>
            </AnimatePresence>
          </div>

          {/* Batch Selector */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-semibold">
              Filter Overlapping Batches:
            </p>
            <div className="flex gap-2">
              {['A1', 'B1', 'C1'].map(b => (
                <button
                  key={b}
                  onClick={() => toggleBatch(b)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedBatches.includes(b)
                      ? b === 'A1'
                        ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30'
                        : b === 'B1'
                          ? 'bg-violet-500 text-white shadow-md shadow-violet-500/30'
                          : 'bg-green-500 text-white shadow-md shadow-green-500/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  Batch {b}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Common Free Windows */}
        <div className="glass-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" />
              Common Free Periods
            </h3>
            {selectedBatches.length > 0 && (
              <span className="pill-badge bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800 text-[10px]">
                Batches: {selectedBatches.join(' + ')}
              </span>
            )}
          </div>

          {selectedBatches.length < 2 ? (
            <div className="text-center py-14 text-slate-400">
              <Clock size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">Select at least 2 batches to calculate schedule overlap</p>
            </div>
          ) : commonFreeSlots.length === 0 ? (
            <div className="text-center py-14 text-slate-400">
              <X size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">No simultaneous free periods for selected cohorts</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {commonFreeSlots.map(({ day, slot }, i) => (
                <motion.div
                  key={`${day}-${slot.id}`}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-green-50/70 dark:bg-green-900/15 border border-green-200/80 dark:border-green-800/40 hover:bg-green-100/70 dark:hover:bg-green-900/25 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">{day}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">{slot.label}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="pill-badge bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-[10px] font-semibold">
                      Mutual Free Slot
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
