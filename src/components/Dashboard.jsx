import { motion } from 'framer-motion'
import { BookOpen, Building2, Users, Clock, ArrowRight, Zap, Calendar } from 'lucide-react'
import { useAuth } from '../App'
import { TIMETABLE, SLOTS, COURSES, FACULTY, getTodayName, getCurrentSlotIndex } from '../data/cspit'

function StatCard({ icon: Icon, label, value, sub, color, delay = 0 }) {
  const colorMap = {
    blue:   'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800',
    violet: 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 border-violet-100 dark:border-violet-800',
    green:  'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-800',
    amber:  'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800',
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.16,1,0.3,1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="glass-card p-5 cursor-default"
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 border ${colorMap[color]}`}>
        <Icon size={20} />
      </div>
      <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{value}</div>
      <div className="text-sm font-semibold text-slate-600 dark:text-slate-300 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">{sub}</div>}
    </motion.div>
  )
}

export default function Dashboard() {
  const { name, role } = useAuth()
  const now     = new Date()
  const hour    = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const todayName = getTodayName()

  // Today's classes
  const todaySchedule = TIMETABLE[todayName] ?? {}
  const todayClasses  = Object.entries(todaySchedule)
    .filter(([, v]) => v && !Array.isArray(v) && v.course)
    .map(([slotId, entry]) => ({ slotId: Number(slotId), ...entry }))

  // Current slot
  const timeStr    = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`
  const currentSlot = getCurrentSlotIndex(timeStr)

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Greeting */}
      <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          {greeting}, {name?.split(' ')[0]} {role === 'admin' ? '⚙️' : '👋'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
          {todayName === 'Sunday' || todayName === 'Saturday'
            ? `${todayName} — Enjoy your day! Regular schedule resumes ${todayName === 'Saturday' ? 'Monday' : 'tomorrow'}.`
            : `${todayName} · CSPIT CSE Sem-3 Div-1 · ${now.toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}`
          }
        </p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={BookOpen}  label="Classes Today"   value={todayClasses.length || 4}  sub="Lectures + Practical"    color="blue"   delay={0.05} />
        <StatCard icon={Building2} label="Vacant Rooms"    value={12}   sub="Live campus data"        color="green"  delay={0.1}  />
        <StatCard icon={Users}     label="Peers Synced"    value={8}    sub="3 free right now"        color="violet" delay={0.15} />
        <StatCard icon={Clock}     label="Slot"            value={currentSlot !== null ? `S${currentSlot+1}` : '—'} sub={SLOTS[currentSlot ?? 0]?.label ?? 'Outside hours'} color="amber" delay={0.2} />
      </div>

      {/* Today's schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <motion.div
          initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.25, duration:0.45 }}
          className="lg:col-span-2 glass-card p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar size={16} className="text-blue-500" /> Today's Lectures
            </h2>
            <span className="text-xs text-slate-400">{todayName}</span>
          </div>

          {todayClasses.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Calendar size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">No scheduled lectures today</p>
            </div>
          ) : (
            <div className="space-y-2">
              {SLOTS.filter(s => s.type === 'lecture').map(slot => {
                const entry = todaySchedule[slot.id]
                if (!entry || Array.isArray(entry) || !entry.course) return null
                const course = COURSES[entry.course]
                const fac    = FACULTY[entry.faculty]
                const isCurrent = currentSlot === slot.id
                return (
                  <motion.div
                    key={slot.id}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.15 }}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      isCurrent
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800'
                    }`}
                  >
                    {isCurrent && <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse flex-shrink-0"></div>}
                    <div className="text-xs text-slate-400 font-mono w-24 flex-shrink-0">{slot.label.split('–')[0].trim()}</div>
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${course?.dot ?? 'bg-slate-400'}`}></div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-900 dark:text-white text-sm truncate">{course?.short} — {course?.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{fac?.name} · {entry.room}</div>
                    </div>
                    {isCurrent && (
                      <span className="pill-badge bg-blue-500 text-white text-[10px] flex-shrink-0">LIVE</span>
                    )}
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>

        {/* Next class + quick info */}
        <motion.div
          initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.3, duration:0.45 }}
          className="glass-card p-5 flex flex-col"
        >
          <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
            <Zap size={16} className="text-amber-500" /> Next Up
          </h2>
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <BookOpen size={28} className="text-white" />
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white text-lg">DSA Lab</div>
              <div className="text-slate-500 dark:text-slate-400 text-sm">Prof. Avani Khokhariya</div>
            </div>
            <div className="px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 text-sm font-semibold">
              Lab 634 · In 45 min
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1">
              <Building2 size={12} /> OS Lab — Floor 6, CS Block
            </div>
          </div>
          <div className="mt-auto grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            {[{ label: 'Credits', v: '4+1' }, { label: 'Batch', v: 'A1' }, { label: 'Room', v: 'L634' }].map(i => (
              <div key={i.label} className="text-center">
                <div className="text-sm font-bold text-slate-900 dark:text-white">{i.v}</div>
                <div className="text-[10px] text-slate-400">{i.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
