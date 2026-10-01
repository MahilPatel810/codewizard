import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Save, Eye, Plus, Trash2, GripVertical, ChevronDown,
  CheckCircle, AlertCircle, RotateCcw, Layers, BookOpen,
  FlaskConical, Clock, Edit3, X
} from 'lucide-react'
import { SLOTS, DAYS, COURSES, FACULTY, ROOMS, TIMETABLE as ORIGINAL_TT } from '../data/cspit'

// ── Deep-clone the original timetable into editable state ────────
function cloneTimetable(tt) {
  return JSON.parse(JSON.stringify(tt))
}

// ── Course color map for pills ────────────────────────────────────
const COURSE_COLORS = {
  FDSA:  { bg: 'bg-indigo-100 dark:bg-indigo-900/60 border-indigo-300 dark:border-indigo-700', text: 'text-indigo-800 dark:text-indigo-200' },
  WDF:   { bg: 'bg-cyan-100 dark:bg-cyan-900/60 border-cyan-300 dark:border-cyan-700',       text: 'text-cyan-800 dark:text-cyan-200'     },
  OOP:   { bg: 'bg-violet-100 dark:bg-violet-900/60 border-violet-300 dark:border-violet-700',text: 'text-violet-800 dark:text-violet-200' },
  FCN:   { bg: 'bg-sky-100 dark:bg-sky-900/60 border-sky-300 dark:border-sky-700',           text: 'text-sky-800 dark:text-sky-200'       },
  MATHS: { bg: 'bg-amber-100 dark:bg-amber-900/60 border-amber-300 dark:border-amber-700',   text: 'text-amber-800 dark:text-amber-200'   },
  HS:    { bg: 'bg-rose-100 dark:bg-rose-900/60 border-rose-300 dark:border-rose-700',       text: 'text-rose-800 dark:text-rose-200'     },
  null:  { bg: 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700',      text: 'text-slate-500 dark:text-slate-400'   },
}

const BATCHES = ['ALL', 'A1', 'B1', 'C1']
const COURSE_KEYS = Object.keys(COURSES)
const FACULTY_KEYS = Object.keys(FACULTY)
const ROOM_IDS = ROOMS.map(r => r.id)

// ── Cell Edit Modal ───────────────────────────────────────────────
function CellEditor({ cell, day, slotId, batchIndex, onSave, onClose, onClear }) {
  const isNew = !cell || (!cell.course && !cell.special)
  const [batch,   setBatch]   = useState(cell?.batch   ?? 'ALL')
  const [course,  setCourse]  = useState(cell?.course  ?? '')
  const [faculty, setFaculty] = useState(cell?.faculty ?? '')
  const [room,    setRoom]    = useState(cell?.room    ?? 'R506')
  const [isLab,   setIsLab]   = useState(cell?.isLab   ?? false)
  const [special, setSpecial] = useState(cell?.special ?? '')

  function handleSave() {
    onSave({
      batch,
      course:  course  || null,
      faculty: faculty || null,
      room:    room    || 'R506',
      isLab,
      special: special || undefined,
    })
  }

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.9, y: 16, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        className="relative z-10 w-full max-w-sm bg-white dark:bg-[#131B2E] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
      >
        <div className="h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600" />
        <div className="p-5 space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-1.5">
                <Edit3 size={16} className="text-blue-500" /> Edit Cell
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {day} · {SLOTS.find(s => s.id === slotId)?.label}
              </p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-rose-400 transition-colors">
              <X size={14} />
            </button>
          </div>

          {/* Batch */}
          <div>
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 block uppercase tracking-wider">Batch</label>
            <div className="flex gap-1.5">
              {BATCHES.map(b => (
                <button key={b} onClick={() => setBatch(b)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    batch === b
                      ? b === 'A1' ? 'bg-blue-500 text-white'
                        : b === 'B1' ? 'bg-violet-500 text-white'
                        : b === 'C1' ? 'bg-green-500 text-white'
                        : 'bg-indigo-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Course */}
          <div>
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 block uppercase tracking-wider">Course</label>
            <select value={course} onChange={e => setCourse(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
              <option value="">— No Course (Free / Library) —</option>
              {COURSE_KEYS.map(k => (
                <option key={k} value={k}>{k} — {COURSES[k].name}</option>
              ))}
            </select>
          </div>

          {/* Faculty */}
          <div>
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 block uppercase tracking-wider">Faculty</label>
            <select value={faculty} onChange={e => setFaculty(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
              <option value="">— No Faculty —</option>
              {FACULTY_KEYS.map(k => (
                <option key={k} value={k}>{k} — {FACULTY[k].name}</option>
              ))}
            </select>
          </div>

          {/* Room + Lab toggle */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 block uppercase tracking-wider">Room / Lab</label>
              <select value={room} onChange={e => setRoom(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                {ROOMS.map(r => <option key={r.id} value={r.id}>{r.id} — {r.name}</option>)}
              </select>
            </div>
            <div className="flex flex-col justify-between">
              <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 block uppercase tracking-wider">Lab Session?</label>
              <button onClick={() => setIsLab(l => !l)}
                className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                  isLab
                    ? 'bg-violet-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}>
                {isLab ? '🧪 Lab ON' : '📖 Theory'}
              </button>
            </div>
          </div>

          {/* Special label (optional) */}
          <div>
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 block uppercase tracking-wider">Special Label (e.g. Library)</label>
            <input type="text" value={special} onChange={e => setSpecial(e.target.value)} placeholder="Optional e.g. Library, HS Activity..."
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-slate-400" />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={handleSave}
              className="btn-primary flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 rounded-xl text-xs font-bold shadow-md">
              <Save size={13} /> Save Cell
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={onClear}
              className="px-4 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-bold transition-all hover:bg-rose-100">
              <Trash2 size={13} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Timetable cell display ────────────────────────────────────────
function Cell({ entry, onClick, slotType }) {
  if (slotType === 'lunch') {
    return (
      <div className="flex items-center justify-center h-14 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 text-[10px] font-bold">
        🍽️ Lunch
      </div>
    )
  }
  if (slotType === 'break') {
    return (
      <div className="flex items-center justify-center h-8 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 text-[9px] font-semibold">
        ☕ Break
      </div>
    )
  }
  if (!entry || (!entry.course && !entry.special)) {
    return (
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.02, borderColor: '#3B82F6' }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center justify-center h-14 w-full rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-600 text-xs font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all group"
      >
        <span className="group-hover:text-blue-400 transition-colors flex items-center gap-1">
          <Plus size={12} /> Add
        </span>
      </motion.button>
    )
  }

  const colors = COURSE_COLORS[entry.course] ?? COURSE_COLORS.null
  const batchLabel = entry.batch !== 'ALL' ? entry.batch : null

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.97 }}
      className={`relative h-14 w-full rounded-xl border text-left px-2.5 py-1.5 transition-all hover:shadow-md group ${colors.bg}`}
    >
      {batchLabel && (
        <span className={`absolute top-1 right-1.5 text-[8px] font-extrabold px-1 py-0.5 rounded ${
          batchLabel === 'A1' ? 'bg-blue-500 text-white'
          : batchLabel === 'B1' ? 'bg-violet-500 text-white'
          : 'bg-green-500 text-white'
        }`}>{batchLabel}</span>
      )}
      <div className={`text-[11px] font-extrabold leading-tight ${colors.text}`}>
        {entry.course ? COURSES[entry.course]?.short ?? entry.course : entry.special ?? '—'}
      </div>
      {entry.faculty && (
        <div className="text-[9px] text-slate-500 dark:text-slate-400 truncate">{entry.faculty}</div>
      )}
      {entry.room && (
        <div className="text-[9px] text-slate-400 dark:text-slate-500">{entry.room}</div>
      )}
      <div className="absolute top-1 left-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <Edit3 size={9} className="text-blue-500" />
      </div>
    </motion.button>
  )
}

// ── Preview: read-only published timetable ────────────────────────
function PublishedPreview({ schedule, onBack }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs font-bold mb-2">
            <CheckCircle size={12} /> Published Successfully
          </div>
          <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
            Master Timetable — Live View
          </h3>
          <p className="text-slate-400 text-xs mt-0.5">This is the timetable now visible to students and staff</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
        >
          <Edit3 size={13} /> Continue Editing
        </motion.button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs min-w-[700px]">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-800">
              <th className="py-2.5 px-3 text-left text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider rounded-tl-xl">
                Time Slot
              </th>
              {DAYS.map(d => (
                <th key={d} className="py-2.5 px-3 text-left text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {d.slice(0, 3)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {SLOTS.map(slot => (
              <tr key={slot.id} className={slot.type === 'lunch' ? 'bg-amber-50/50 dark:bg-amber-900/10' : slot.type === 'break' ? 'bg-slate-50 dark:bg-slate-800/40' : ''}>
                <td className="py-2 px-3 whitespace-nowrap">
                  <div className="font-mono text-[10px] text-slate-600 dark:text-slate-400">{slot.label}</div>
                  {slot.special && <div className="text-[9px] text-amber-500 font-semibold">{slot.special}</div>}
                </td>
                {DAYS.map(day => {
                  const slotData = schedule[day]?.[slot.id]
                  if (slot.type === 'lunch') return <td key={day} className="py-2 px-3 text-center text-amber-500 text-[10px] font-bold">🍽️</td>
                  if (slot.type === 'break') return <td key={day} className="py-2 px-3 text-center text-slate-400 text-[9px]">☕</td>
                  if (!slotData) return <td key={day} className="py-2 px-3 text-slate-300 dark:text-slate-600 text-[10px]">—</td>

                  const entries = Array.isArray(slotData) ? slotData : [slotData]
                  return (
                    <td key={day} className="py-1.5 px-2">
                      <div className="flex flex-col gap-1">
                        {entries.map((e, i) => {
                          if (!e || (!e.course && !e.special)) return <div key={i} className="text-[9px] text-slate-300">—</div>
                          const colors = COURSE_COLORS[e.course] ?? COURSE_COLORS.null
                          return (
                            <div key={i} className={`px-1.5 py-1 rounded-lg border text-[10px] ${colors.bg} ${colors.text}`}>
                              <div className="font-extrabold">{e.course ? COURSES[e.course]?.short : e.special}</div>
                              {e.faculty && <div className="text-[9px] opacity-70">{e.faculty}</div>}
                              {e.batch !== 'ALL' && <div className="text-[8px] font-bold opacity-70">{e.batch}</div>}
                            </div>
                          )
                        })}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

// ── Main component ────────────────────────────────────────────────
export default function MasterScheduleEditor() {
  const [schedule, setSchedule]     = useState(() => cloneTimetable(ORIGINAL_TT))
  const [published, setPublished]   = useState(null)       // saved snapshot
  const [showPreview, setShowPreview] = useState(false)     // show published view
  const [editTarget, setEditTarget] = useState(null)        // { day, slotId, batchIndex, cell }
  const [savedToast, setSavedToast] = useState(false)
  const [activeDay, setActiveDay]   = useState(DAYS[0])

  // ── Save + Publish ────────────────────────────────────────────
  function handleSavePublish() {
    const snapshot = cloneTimetable(schedule)
    setPublished(snapshot)
    setSavedToast(true)
    setTimeout(() => setSavedToast(false), 3000)
    setTimeout(() => setShowPreview(true), 400)
  }

  // ── Reset to original ─────────────────────────────────────────
  function handleReset() {
    if (window.confirm('Reset entire timetable to the original seed data?')) {
      setSchedule(cloneTimetable(ORIGINAL_TT))
    }
  }

  // ── Open editor for a cell ────────────────────────────────────
  function openEdit(day, slotId, batchIndex = null) {
    const slotData = schedule[day]?.[slotId]
    let cell = null
    if (slotData) {
      if (Array.isArray(slotData)) {
        cell = batchIndex !== null ? slotData[batchIndex] : null
      } else {
        cell = slotData
      }
    }
    setEditTarget({ day, slotId, batchIndex, cell })
  }

  // ── Save a cell edit ──────────────────────────────────────────
  function handleCellSave(data) {
    const { day, slotId, batchIndex } = editTarget
    setSchedule(prev => {
      const next = cloneTimetable(prev)
      if (!next[day]) next[day] = {}
      const existing = next[day][slotId]

      if (Array.isArray(existing) && batchIndex !== null) {
        next[day][slotId][batchIndex] = data
      } else if (Array.isArray(existing) && batchIndex === null) {
        // Replace whole slot with single entry
        next[day][slotId] = data
      } else {
        next[day][slotId] = data
      }
      return next
    })
    setEditTarget(null)
  }

  // ── Clear a cell ──────────────────────────────────────────────
  function handleCellClear() {
    const { day, slotId, batchIndex } = editTarget
    setSchedule(prev => {
      const next = cloneTimetable(prev)
      if (!next[day]) return next
      const existing = next[day][slotId]
      if (Array.isArray(existing) && batchIndex !== null) {
        next[day][slotId][batchIndex] = { batch: existing[batchIndex]?.batch ?? 'ALL', course: null, faculty: null, room: 'R506', isLab: false }
      } else {
        next[day][slotId] = null
      }
      return next
    })
    setEditTarget(null)
  }

  // ── Render the per-day editor ─────────────────────────────────
  function renderDayColumn(day) {
    return (
      <div key={day} className="min-w-[160px] flex-1">
        {SLOTS.map(slot => {
          const slotData = schedule[day]?.[slot.id]
          const isLunch = slot.type === 'lunch'
          const isBreak = slot.type === 'break'

          if (isLunch) {
            return (
              <div key={slot.id} className="mb-1.5 flex items-center justify-center h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-500 text-[10px] font-bold">
                🍽️ Lunch Recess
              </div>
            )
          }
          if (isBreak) {
            return (
              <div key={slot.id} className="mb-1.5 h-5 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 text-[9px]">
                ☕ Short Break
              </div>
            )
          }

          const entries = slotData
            ? (Array.isArray(slotData) ? slotData : [slotData])
            : [null]

          return (
            <div key={slot.id} className="mb-1.5 space-y-0.5">
              {entries.map((entry, bi) => (
                <Cell
                  key={bi}
                  entry={entry}
                  slotType={slot.type}
                  onClick={() => openEdit(day, slot.id, Array.isArray(slotData) ? bi : null)}
                />
              ))}
              {/* Add extra batch row */}
              {Array.isArray(slotData) && slotData.length < 3 && (
                <button
                  onClick={() => {
                    const newBatch = ['A1','B1','C1'].find(b => !slotData.some(e => e?.batch === b)) ?? 'A1'
                    setSchedule(prev => {
                      const next = cloneTimetable(prev)
                      next[day][slot.id] = [...next[day][slot.id], { batch: newBatch, course: null, faculty: null, room: 'R506', isLab: false }]
                      return next
                    })
                  }}
                  className="w-full h-5 rounded-lg border border-dashed border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-600 text-[9px] hover:border-blue-400 hover:text-blue-400 transition-all"
                >
                  + batch
                </button>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  // ── If published preview is showing ──────────────────────────
  if (showPreview && published) {
    return (
      <div className="space-y-4 max-w-6xl">
        <PublishedPreview schedule={published} onBack={() => setShowPreview(false)} />
      </div>
    )
  }

  return (
    <div className="space-y-5 max-w-[1100px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 text-xs font-bold mb-1.5">
            <Layers size={12} /> Admin-Exclusive Feature
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen size={21} className="text-indigo-500" /> Master Schedule Editor
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            Drag, edit, or rebuild the entire CSPIT CSE Sem-3 Div-1 timetable — click any cell to modify it.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold transition-all"
          >
            <RotateCcw size={14} /> Reset
          </motion.button>

          {published && (
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-400 text-sm font-semibold transition-all"
            >
              <Eye size={14} /> View Published
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={handleSavePublish}
            className="btn-primary bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 shadow-lg shadow-blue-500/30 px-5 py-2.5 rounded-xl text-sm font-extrabold"
          >
            <Save size={15} /> Save & Publish
          </motion.button>
        </div>
      </div>

      {/* Legend */}
      <div className="glass-card p-3 flex flex-wrap gap-2 items-center">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-2">Courses:</span>
        {COURSE_KEYS.map(k => {
          const c = COURSE_COLORS[k]
          return (
            <span key={k} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-bold ${c.bg} ${c.text}`}>
              {k}
            </span>
          )
        })}
        <span className="ml-2 text-[10px] text-slate-400">| Click any cell to edit · Dashed = empty (click to add)</span>
      </div>

      {/* Day Tabs (mobile convenience) */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 self-center mr-1 flex-shrink-0">Filter Day:</span>
        <button onClick={() => setActiveDay(null)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex-shrink-0 ${
            !activeDay ? 'bg-blue-500 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
          }`}>
          All Days
        </button>
        {DAYS.map(d => (
          <button key={d} onClick={() => setActiveDay(activeDay === d ? null : d)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex-shrink-0 ${
              activeDay === d ? 'bg-blue-500 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
            }`}>
            {d.slice(0, 3)}
          </button>
        ))}
      </div>

      {/* Editor Grid */}
      <div className="glass-card p-4 overflow-x-auto">
        <div className="flex gap-3 min-w-[800px]">
          {/* Time labels */}
          <div className="w-28 flex-shrink-0">
            <div className="h-8" /> {/* Header spacer */}
            {SLOTS.map(slot => (
              <div key={slot.id} className={`mb-1.5 flex flex-col justify-center ${
                slot.type === 'lunch' ? 'h-10'
                : slot.type === 'break' ? 'h-5'
                : 'h-14'
              }`}>
                <div className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400">{slot.label}</div>
                {slot.special && <div className="text-[8px] text-amber-500 font-semibold">{slot.special}</div>}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {(activeDay ? [activeDay] : DAYS).map(day => (
            <div key={day} className="flex-1 min-w-[150px]">
              {/* Day header */}
              <div className="h-8 flex items-center justify-center mb-0">
                <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">
                  {day}
                </span>
              </div>
              {renderDayColumn(day)}
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/15 border border-blue-100 dark:border-blue-800 text-xs text-blue-700 dark:text-blue-300">
        <strong>How to edit:</strong> Click any cell to open the editor → change course, faculty, room, or batch → Save Cell.
        When done, click <strong>Save & Publish</strong> to push the new timetable live. Use <strong>View Published</strong> to verify the result.
      </div>

      {/* Cell Editor Modal */}
      <AnimatePresence>
        {editTarget && (
          <CellEditor
            cell={editTarget.cell}
            day={editTarget.day}
            slotId={editTarget.slotId}
            batchIndex={editTarget.batchIndex}
            onSave={handleCellSave}
            onClose={() => setEditTarget(null)}
            onClear={handleCellClear}
          />
        )}
      </AnimatePresence>

      {/* Save toast */}
      <AnimatePresence>
        {savedToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-2xl shadow-2xl text-sm font-semibold"
          >
            <CheckCircle size={16} className="text-green-400" />
            Timetable saved & published successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
