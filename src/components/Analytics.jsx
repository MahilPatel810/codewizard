import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, Legend, LineChart, Line, ReferenceLine
} from 'recharts'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Activity } from 'lucide-react'

// ── Data ─────────────────────────────────────────────────────────
const ROOM_UTILIZATION = [
  { room: 'Room 506', util: 87, sessions: 18, color: '#6366f1' },
  { room: 'Lab 631',  util: 62, sessions: 8,  color: '#22d3ee' },
  { room: 'Lab 632',  util: 45, sessions: 6,  color: '#a855f7' },
  { room: 'Lab 633',  util: 58, sessions: 7,  color: '#3b82f6' },
  { room: 'Lab 634',  util: 75, sessions: 10, color: '#10b981' },
  { room: 'Lab 638',  util: 30, sessions: 4,  color: '#f59e0b' },
  { room: 'MMLAB',    util: 40, sessions: 5,  color: '#ec4899' },
  { room: 'ARVR',     util: 25, sessions: 3,  color: '#8b5cf6' },
]

const HOURLY_FOOTTRAFFIC = [
  { time: '09:10', students: 90,  label: 'FDSA Theory' },
  { time: '10:10', students: 90,  label: 'FCN Theory'  },
  { time: '11:10', students: 90,  label: 'MATHS'       },
  { time: '12:10', students: 20,  label: '🍽️ Lunch'   },
  { time: '13:10', students: 85,  label: 'WDF Theory'  },
  { time: '14:10', students: 30,  label: '☕ Break'    },
  { time: '14:20', students: 90,  label: 'Labs (x3)'   },
  { time: '15:20', students: 90,  label: 'Labs (x3)'   },
  { time: '16:20', students: 5,   label: 'Post hours'  },
]

const WEEKLY_SESSIONS = [
  { day: 'Mon', theory: 4, lab: 2 },
  { day: 'Tue', theory: 4, lab: 2 },
  { day: 'Wed', theory: 4, lab: 2 },
  { day: 'Thu', theory: 4, lab: 2 },
  { day: 'Fri', theory: 4, lab: 2 },
  { day: 'Sat', theory: 3, lab: 2 },
]

// ── Custom tooltip ───────────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 shadow-xl text-xs">
      <p className="font-bold text-slate-900 dark:text-white mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: <strong>{p.value}{typeof p.value === 'number' && p.name.includes('util') ? '%' : ''}</strong>
        </p>
      ))}
    </div>
  )
}

export default function Analytics() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Analytics</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
          CSPIT CSE Sem-3 Div-1 · Room & Lab Usage Insights
        </p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Weekly Sessions',  value: '23',   sub: '6 days active',       color: 'text-blue-500',   bg: 'bg-blue-50 dark:bg-blue-900/20'   },
          { label: 'Room 506 Usage',   value: '87%',  sub: 'Highest utilization', color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20'},
          { label: 'Lab Sessions',     value: '10',   sub: 'Per week (Div-1)',     color: 'text-green-500',  bg: 'bg-green-50 dark:bg-green-900/20'  },
          { label: 'Peak Hour',        value: '9AM',  sub: 'Highest footfall',     color: 'text-amber-500',  bg: 'bg-amber-50 dark:bg-amber-900/20'  },
        ].map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className={`glass-card p-4 ${k.bg}`}
          >
            <div className={`text-2xl font-extrabold ${k.color}`}>{k.value}</div>
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-0.5">{k.label}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{k.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Room utilization bar chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-5"
      >
        <div className="flex items-center gap-2 mb-5">
          <BarChart3 size={16} className="text-indigo-500" />
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Weekly Room Utilization Rate (%)</h3>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={ROOM_UTILIZATION} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}
            barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" vertical={false} />
            <XAxis dataKey="room" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0,100]}
              tickFormatter={v => `${v}%`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="util" name="Utilization %" radius={[6,6,0,0]} maxBarSize={40}>
              {ROOM_UTILIZATION.map((entry, i) => (
                <Cell key={i} fill={entry.color} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Two charts side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Hourly foot-traffic */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity size={16} className="text-cyan-500" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Daily Foot-Traffic Heatmap</h3>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={HOURLY_FOOTTRAFFIC} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0,100]} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={20} stroke="rgba(251,191,36,0.4)" strokeDasharray="4 4" label={{ value:'Lunch', fontSize:9, fill:'#fbbf24' }} />
              <Line
                type="monotone" dataKey="students" name="Students" stroke="#22d3ee" strokeWidth={2.5}
                dot={{ fill: '#22d3ee', r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#22d3ee', stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Weekly sessions stacked bar */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-card p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-violet-500" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Sessions Per Day (Theory vs Lab)</h3>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={WEEKLY_SESSIONS} margin={{ top:0, right:0, bottom:0, left:-20 }} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: 11, paddingTop: '8px' }} />
              <Bar dataKey="theory" name="Theory" stackId="a" fill="#6366f1" fillOpacity={0.85} radius={[0,0,0,0]} maxBarSize={32} />
              <Bar dataKey="lab"    name="Lab"    stackId="a" fill="#22d3ee" fillOpacity={0.85} radius={[6,6,0,0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Conflict log */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-5"
      >
        <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-4">Occupancy Log & Conflict Monitor</h3>
        <div className="space-y-2">
          {[
            { time:'Mon 09:10', room:'Room 506', event:'FDSA Theory — 90 students',   status:'ok'  },
            { time:'Tue 02:20', room:'Lab 632',  event:'WDF Lab Batch B1 — 30 seats', status:'ok'  },
            { time:'Wed 11:10', room:'Room 506', event:'OOP Theory — 90 students',    status:'ok'  },
            { time:'Thu 14:20', room:'Lab 633',  event:'FCN Lab Batch A1',            status:'ok'  },
            { time:'Fri 14:20', room:'Lab 634',  event:'OOP Lab Batch A1 — Full',     status:'warn'},
          ].map((l, i) => (
            <div key={i} className={`flex items-center gap-3 p-3 rounded-xl text-xs transition-colors ${
              l.status === 'warn'
                ? 'bg-amber-50 dark:bg-amber-900/15 border border-amber-200 dark:border-amber-800'
                : 'bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800'
            }`}>
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${l.status === 'warn' ? 'bg-amber-500' : 'bg-green-500'}`}></div>
              <span className="text-slate-400 font-mono w-20 flex-shrink-0">{l.time}</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">{l.room}</span>
              <span className="text-slate-500 dark:text-slate-400 flex-1 truncate">{l.event}</span>
              {l.status === 'warn' && (
                <span className="pill-badge bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 flex-shrink-0">Near Full</span>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
