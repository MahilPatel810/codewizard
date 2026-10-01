import { useState } from 'react'
import { motion } from 'framer-motion'
import { Info } from 'lucide-react'
import { TIMETABLE, SLOTS, DAYS, DAYS_SHORT, COURSES, FACULTY, ROOMS } from '../data/cspit'

const BATCH_COLORS = {
  A1: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700',
  B1: 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-700',
  C1: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700',
}

function CellContent({ entry }) {
  if (!entry) return <div className="h-full w-full" />

  if (entry.special) {
    const isLunch  = entry.special.includes('Lunch')
    const isBreak  = entry.special.includes('Break')
    const isLibrary = entry.special.includes('Library')
    if (isLunch) return (
      <div className="flex items-center justify-center h-full">
        <span className="text-[10px] text-slate-400 font-medium">🍽️ Lunch</span>
      </div>
    )
    if (isBreak) return (
      <div className="flex items-center justify-center h-full">
        <span className="text-[10px] text-slate-400 font-medium">☕ Break</span>
      </div>
    )
    if (isLibrary) return (
      <div className="h-full flex items-center justify-center">
        <span className={`text-[10px] font-semibold pill-badge border ${BATCH_COLORS[entry.batch] ?? ''}`}>
          {entry.batch} 📚 Lib
        </span>
      </div>
    )
  }

  if (!entry.course) return null
  const course = COURSES[entry.course]
  const fac    = FACULTY[entry.faculty]
  const room   = ROOMS.find(r => r.id === entry.room)

  if (!course) return null

  return (
    <div className={`tt-cell h-full p-1.5 rounded-xl border ${course.bg} ${course.border} relative overflow-hidden`}>
      <div className={`w-1.5 h-1.5 rounded-full ${course.dot} mb-1`}></div>
      <div className={`text-[11px] font-bold leading-tight ${course.text}`}>{course.short}</div>
      <div className="tt-detail">
        <div className="text-[9px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
          {fac?.code}<br/>
          {room?.name ?? entry.room}
        </div>
      </div>
      {entry.batch && entry.batch !== 'ALL' && (
        <span className={`absolute top-1 right-1 text-[8px] font-bold px-1 py-0.5 rounded ${BATCH_COLORS[entry.batch]} border`}>
          {entry.batch}
        </span>
      )}
    </div>
  )
}

function BatchCell({ entries, slotId }) {
  // Render multiple batch rows in one cell
  return (
    <div className="flex flex-col gap-1 h-full">
      {entries.map((e, i) => (
        <div key={i} className="flex-1">
          <CellContent entry={e} />
        </div>
      ))}
    </div>
  )
}

export default function TimetableGrid() {
  const [activeBatch, setActiveBatch] = useState('ALL') // 'ALL'|'A1'|'B1'|'C1'
  const [tooltip, setTooltip]         = useState(null)  // { entry, day, slotId, x, y }

  // Tooltip details
  function getTooltipContent(entry) {
    if (!entry?.course) return null
    const c = COURSES[entry.course]
    const f = FACULTY[entry.faculty]
    const r = ROOMS.find(rm => rm.id === entry.room)
    return { c, f, r, entry }
  }

  return (
    <div className="space-y-5 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Weekly Timetable</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            CSPIT CSE Sem-3, Division-1 · Mon–Sat · 09:10 AM–04:20 PM
          </p>
        </div>
        {/* Batch filter */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          {['ALL', 'A1', 'B1', 'C1'].map(b => (
            <button
              key={b}
              onClick={() => setActiveBatch(b)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                activeBatch === b
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(COURSES).map(([key, c]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${c.dot}`}></div>
            <span className="text-xs text-slate-500 dark:text-slate-400">{c.short}</span>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <div style={{ minWidth: '720px' }}>
            {/* Day headers */}
            <div className="grid border-b border-slate-200 dark:border-slate-800"
              style={{ gridTemplateColumns: '100px repeat(6, 1fr)' }}>
              <div className="p-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Slot</div>
              {DAYS.map((d, i) => (
                <div key={d} className="p-3 text-center text-xs font-bold text-slate-700 dark:text-slate-300 border-l border-slate-100 dark:border-slate-800">
                  <div>{DAYS_SHORT[i]}</div>
                  <div className="text-[10px] text-slate-400 font-normal">{d}</div>
                </div>
              ))}
            </div>

            {/* Slot rows */}
            {SLOTS.map(slot => {
              const isSpecial = slot.type === 'lunch' || slot.type === 'break'
              return (
                <div key={slot.id}
                  className={`grid border-b border-slate-100 dark:border-slate-800 ${
                    isSpecial ? 'bg-slate-50 dark:bg-slate-800/30' : ''
                  }`}
                  style={{ gridTemplateColumns: '100px repeat(6, 1fr)', minHeight: isSpecial ? 32 : 80 }}
                >
                  {/* Time label */}
                  <div className="p-2 flex flex-col justify-center border-r border-slate-100 dark:border-slate-800">
                    <div className="text-[10px] font-mono font-semibold text-slate-500 dark:text-slate-400 leading-tight">
                      {slot.label}
                    </div>
                    {isSpecial && (
                      <div className="text-[9px] text-slate-400 mt-0.5">{slot.special}</div>
                    )}
                  </div>

                  {/* Day cells */}
                  {DAYS.map(day => {
                    const raw = TIMETABLE[day]?.[slot.id]

                    if (slot.type === 'lunch') {
                      return (
                        <div key={day} className="border-l border-slate-100 dark:border-slate-800 flex items-center justify-center">
                          <span className="text-[10px] text-slate-400">🍽️ Recess</span>
                        </div>
                      )
                    }
                    if (slot.type === 'break') {
                      return (
                        <div key={day} className="border-l border-slate-100 dark:border-slate-800 flex items-center justify-center">
                          <span className="text-[10px] text-slate-400">☕</span>
                        </div>
                      )
                    }

                    if (!raw) {
                      return <div key={day} className="border-l border-slate-100 dark:border-slate-800 p-1" />
                    }

                    const entries = Array.isArray(raw) ? raw : [raw]
                    const filtered = activeBatch === 'ALL'
                      ? entries
                      : entries.filter(e => !e || e.batch === 'ALL' || e.batch === activeBatch)

                    return (
                      <div key={day} className="border-l border-slate-100 dark:border-slate-800 p-1">
                        {filtered.length > 1 ? (
                          <BatchCell entries={filtered} slotId={slot.id} />
                        ) : filtered.length === 1 ? (
                          <CellContent entry={filtered[0]} />
                        ) : (
                          <div className="h-full" />
                        )}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Course reference table */}
      <div className="glass-card p-5">
        <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-sm">Course Reference</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                {['Code','Subject','Short','Credits','Faculty','Type'].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-slate-500 dark:text-slate-400 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(COURSES).map(([key, c]) => {
                const fac = Object.values(FACULTY).find(f => f.courses.includes(key) || f.courses.some(fc => fc.includes(key)))
                return (
                  <tr key={key} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-slate-500 dark:text-slate-400">{c.code}</td>
                    <td className={`py-2.5 px-3 font-semibold ${c.text}`}>{c.name}</td>
                    <td className="py-2.5 px-3">
                      <span className={`pill-badge border ${c.bg} ${c.text} ${c.border}`}>{c.short}</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{c.credits} (T+P)</td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                      {key === 'FDSA' ? 'ART / AVK / GP'
                       : key === 'WDF'  ? 'VMP / SRG / VYP'
                       : key === 'OOP'  ? 'DSS / BPP / ADK'
                       : key === 'FCN'  ? 'SSS / HYY'
                       : key === 'MATHS'? 'PM'
                       : 'ADK / VYP'}
                    </td>
                    <td className="py-2.5 px-3 capitalize text-slate-500 dark:text-slate-400">
                      {c.credits.includes('+0') ? 'Theory only' : 'Theory + Lab'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
