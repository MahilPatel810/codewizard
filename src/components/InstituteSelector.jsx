import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Building2, Users, FlaskConical, Layers, ChevronRight, MapPin, Wifi } from 'lucide-react'
import { useAuth, useTheme, useInstitute } from '../App'
import { INSTITUTES, CHARUSAT } from '../data/charusat'

// ── Stat pill ────────────────────────────────────────────────────
function StatPill({ icon: Icon, value, label }) {
  return (
    <div className="flex items-center gap-1.5 text-xs">
      <Icon size={11} className="opacity-70 flex-shrink-0" />
      <span className="font-bold">{value}</span>
      <span className="opacity-70">{label}</span>
    </div>
  )
}

// ── Institute card ───────────────────────────────────────────────
function InstituteCard({ inst, index, onSelect }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.button
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.055, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => onSelect(inst)}
      className={`relative text-left p-5 rounded-2xl border-2 transition-all duration-300 overflow-hidden group ${inst.border} bg-white dark:bg-[#131B2E] hover:shadow-xl`}
    >
      {/* Gradient background on hover */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className={`absolute inset-0 bg-gradient-to-br ${inst.lightBg} dark:${inst.darkBg} opacity-0`}
      />

      {/* Top: icon + tag */}
      <div className="relative flex items-start justify-between mb-4">
        <motion.div
          animate={{ scale: hovered ? 1.1 : 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${inst.color} flex items-center justify-center text-xl shadow-lg`}
        >
          {inst.icon}
        </motion.div>
        <span className={`text-[10px] font-bold px-2 py-1 rounded-full bg-gradient-to-r ${inst.color} text-white`}>
          {inst.tag}
        </span>
      </div>

      {/* Name + full name */}
      <div className="relative mb-3">
        <div className="text-lg font-extrabold text-slate-900 dark:text-white">{inst.name}</div>
        <div className="text-xs text-slate-500 dark:text-slate-400 leading-snug mt-0.5 line-clamp-2">{inst.full}</div>
        {inst.special && (
          <div className={`text-[10px] font-semibold mt-1 ${inst.accent}`}>★ {inst.special}</div>
        )}
      </div>

      {/* Stats row */}
      <div className={`relative flex flex-wrap gap-x-4 gap-y-1 ${inst.accent}`}>
        <StatPill icon={Users}       value={inst.students.toLocaleString()} label="students" />
        <StatPill icon={Building2}   value={inst.classrooms}                label="rooms"    />
        <StatPill icon={FlaskConical} value={inst.labs}                     label="labs"     />
      </div>

      {/* Arrow CTA on hover */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -8 }}
        transition={{ duration: 0.2 }}
        className={`relative mt-4 flex items-center gap-1.5 text-xs font-bold ${inst.accent}`}
      >
        Select Institute <ChevronRight size={13} />
      </motion.div>
    </motion.button>
  )
}

export default function InstituteSelector() {
  const { name, role, logout } = useAuth()
  const { dark, toggleTheme }  = useTheme()
  const { setInstitute }       = useInstitute()
  const [search, setSearch]    = useState('')

  const filtered = INSTITUTES.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.full.toLowerCase().includes(search.toLowerCase()) ||
    i.domain.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] transition-colors duration-300">

      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-sm">CU</span>
          </div>
          <div>
            <div className="font-extrabold text-slate-900 dark:text-white text-sm">CHARUSAT Smart</div>
            <div className="text-xs text-slate-500">Select your institute to continue</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggleTheme}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:scale-110 active:scale-95 transition-all">
            {dark ? '☀️' : '🌙'}
          </button>
          <button onClick={logout}
            className="text-xs text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 transition-colors font-medium px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-16">

        {/* Hero heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-4">
            <MapPin size={12} /> Changa, Gujarat · Est. 2009
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Welcome, {name?.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-base">
            Select your institute to access timetables, vacant rooms, and bookings.
          </p>
        </motion.div>

        {/* Campus stats ribbon */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
        >
          {[
            { label: 'Campus Area',   value: '125 acres',    icon: MapPin       },
            { label: 'Daily Students',value: '10,000+',      icon: Users        },
            { label: 'Hostel Beds',   value: '3,350',        icon: Building2    },
            { label: 'Campus Wi-Fi',  value: '1800 Mbps',    icon: Wifi         },
          ].map(({ label, value, icon: Icon }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.12 + i * 0.06 }}
              className="bg-white dark:bg-[#131B2E] rounded-2xl border border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center flex-shrink-0">
                <Icon size={16} className="text-indigo-500" />
              </div>
              <div>
                <div className="font-extrabold text-slate-900 dark:text-white text-sm">{value}</div>
                <div className="text-xs text-slate-400">{label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="relative max-w-md mb-6"
        >
          <input
            type="text"
            placeholder="Search institutes…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-4 pr-4 py-3 rounded-2xl bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all shadow-sm"
          />
        </motion.div>

        {/* Institute grid — 3 cols on md, 2 on sm */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((inst, i) => (
              <InstituteCard
                key={inst.id}
                inst={inst}
                index={i}
                onSelect={setInstitute}
              />
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-16 text-slate-400">
            <Layers size={40} className="mx-auto mb-3 opacity-30" />
            <p>No institutes match "{search}"</p>
          </motion.div>
        )}
      </main>
    </div>
  )
}
