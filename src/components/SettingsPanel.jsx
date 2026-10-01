import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, Bell, Moon, Shield, Download, User, Check, Save } from 'lucide-react'
import { useAuth, useTheme } from '../App'

function Toggle({ enabled, onChange, color = 'blue' }) {
  const colors = {
    blue:   'bg-blue-500',
    violet: 'bg-violet-500',
    green:  'bg-green-500',
    amber:  'bg-amber-500',
  }
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${enabled ? colors[color] : 'bg-slate-200 dark:bg-slate-700'}`}
    >
      <motion.div
        animate={{ x: enabled ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md"
      />
    </button>
  )
}

function Toast({ message, onDone }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl shadow-2xl font-semibold text-sm"
    >
      <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
        <Check size={12} />
      </div>
      {message}
    </motion.div>
  )
}

function SettingRow({ icon: Icon, label, desc, value, onChange, color = 'blue' }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
          color === 'blue'   ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-500' :
          color === 'violet' ? 'bg-violet-50 dark:bg-violet-900/20 text-violet-500' :
          color === 'green'  ? 'bg-green-50 dark:bg-green-900/20 text-green-500' :
          'bg-amber-50 dark:bg-amber-900/20 text-amber-500'
        }`}>
          <Icon size={16} />
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-900 dark:text-white">{label}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{desc}</div>
        </div>
      </div>
      <Toggle enabled={value} onChange={onChange} color={color} />
    </div>
  )
}

export default function SettingsPanel() {
  const { name, role } = useAuth()
  const { dark, toggleTheme } = useTheme()

  const [settings, setSettings] = useState({
    clashDetection:  true,
    telegramAlerts:  false,
    emailAlerts:     true,
    darkDefault:     dark,
    exportOnSave:    false,
  })
  const [toastMsg, setToastMsg] = useState('')
  const [editName, setEditName] = useState(name ?? '')

  function set(key) {
    return (val) => setSettings(s => ({ ...s, [key]: val }))
  }

  function handleSave() {
    setToastMsg('Settings saved successfully ✓')
    setTimeout(() => setToastMsg(''), 2800)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Settings</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Manage preferences for EduSync AI</p>
      </div>

      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-5"
      >
        <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2 mb-4">
          <User size={15} className="text-blue-500" /> Profile
        </h3>
        <div className="flex items-center gap-4">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}&backgroundColor=b6e3f4`}
            className="w-16 h-16 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-md"
            alt={name}
          />
          <div className="flex-1 space-y-2">
            <input
              type="text"
              value={editName}
              onChange={e => setEditName(e.target.value)}
              className="input-field"
              placeholder="Display name"
            />
            <div className="flex gap-2 text-xs">
              <span className="pill-badge bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                CSPIT CSE Sem-3 Div-1
              </span>
              <span className={`pill-badge ${
                role === 'admin'
                  ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300'
                  : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
              }`}>
                {role === 'admin' ? '⚙️ Admin' : '🎓 Student'}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="glass-card p-5"
      >
        <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2 mb-2">
          <Settings size={15} className="text-slate-500" /> Preferences
        </h3>
        <SettingRow
          icon={Shield} label="Automated Clash Detection"
          desc="Alert when faculty or room double-booking is detected"
          value={settings.clashDetection} onChange={set('clashDetection')} color="violet"
        />
        <SettingRow
          icon={Bell} label="Telegram Alerts"
          desc="Receive daily timetable updates on Telegram"
          value={settings.telegramAlerts} onChange={set('telegramAlerts')} color="blue"
        />
        <SettingRow
          icon={Bell} label="Email Alerts"
          desc="Daily schedule digest and room change notifications"
          value={settings.emailAlerts} onChange={set('emailAlerts')} color="green"
        />
        <SettingRow
          icon={Moon} label="Dark Mode Default"
          desc="Always launch EduSync AI in dark mode"
          value={dark}
          onChange={v => { toggleTheme(); set('darkDefault')(v) }}
          color="violet"
        />
        <SettingRow
          icon={Download} label="Auto Export on Save"
          desc="Generate PDF/CSV timetable when schedule is updated"
          value={settings.exportOnSave} onChange={set('exportOnSave')} color="amber"
        />
      </motion.div>

      {/* Export section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-card p-5"
      >
        <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2 mb-4">
          <Download size={15} className="text-green-500" /> Export Timetable
        </h3>
        <div className="flex flex-wrap gap-3">
          {[
            { label: '📄 Export PDF',   color: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800'   },
            { label: '📊 Export CSV',   color: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800' },
            { label: '📅 Google Calendar (.ics)', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800' },
          ].map(b => (
            <motion.button
              key={b.label}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => { setToastMsg(`${b.label.split(' ').slice(1).join(' ')} generated!`); setTimeout(() => setToastMsg(''), 2500) }}
              className={`px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all hover:shadow-md ${b.color}`}
            >
              {b.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Save button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleSave}
        className="btn-primary w-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/25 py-3"
      >
        <Save size={16} />
        Save All Settings
      </motion.button>

      {/* Toast */}
      <AnimatePresence>
        {toastMsg && <Toast message={toastMsg} />}
      </AnimatePresence>
    </div>
  )
}
