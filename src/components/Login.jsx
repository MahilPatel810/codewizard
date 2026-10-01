import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, Shield, Eye, EyeOff, ArrowRight, Zap, CheckCircle, RefreshCw } from 'lucide-react'
import { useAuth, useTheme } from '../App'

// ── Animated grid background ──────────────────────────────────────
function GridBg({ accentColor }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="lgrid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke={accentColor} strokeWidth="0.8"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#lgrid)" />
      </svg>
      {/* Floating orbs */}
      <motion.div
        animate={{ x:[0,50,0], y:[0,-40,0], scale:[1,1.15,1] }}
        transition={{ duration:14, repeat:Infinity, ease:'easeInOut' }}
        className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full blur-3xl opacity-20"
        style={{ background: accentColor }}
      />
      <motion.div
        animate={{ x:[0,-40,0], y:[0,35,0], scale:[1,1.2,1] }}
        transition={{ duration:18, repeat:Infinity, ease:'easeInOut', delay:3 }}
        className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full blur-3xl opacity-15"
        style={{ background: accentColor }}
      />
      {/* Particle dots */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full opacity-40"
          style={{ background: accentColor, left:`${15+i*14}%`, top:`${20+i*10}%` }}
          animate={{ y:[0,-20,0], opacity:[0.4,0.8,0.4] }}
          transition={{ duration: 3+i, repeat:Infinity, ease:'easeInOut', delay:i*0.5 }}
        />
      ))}
    </div>
  )
}

// ── Floating label input ─────────────────────────────────────────
function FloatingInput({ label, type='text', value, onChange, accentColor }) {
  const [focused, setFocused] = useState(false)
  const [showPw,  setShowPw]  = useState(false)
  const isUp = focused || value.length > 0
  return (
    <div className="relative">
      <input
        type={type === 'password' ? (showPw ? 'text' : 'password') : type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder=" "
        className="w-full pt-5 pb-2 px-4 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 peer"
        style={{ '--tw-ring-color': accentColor + '60' }}
      />
      <motion.label
        animate={isUp
          ? { top:'0.38rem', fontSize:'0.67rem', fontWeight:700, color: accentColor }
          : { top:'0.8rem',  fontSize:'0.875rem', fontWeight:400, color:'#94a3b8' }}
        transition={{ duration: 0.2 }}
        className="absolute left-4 pointer-events-none"
        style={{ position:'absolute' }}
      >
        {label}
      </motion.label>
      {type === 'password' && (
        <button type="button" onClick={() => setShowPw(p => !p)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
          {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
        </button>
      )}
    </div>
  )
}

// ── CAPTCHA widget ───────────────────────────────────────────────
function CaptchaWidget({ verified, onVerify }) {
  const [checking, setChecking] = useState(false)

  function handleClick() {
    if (verified) return
    setChecking(true)
    setTimeout(() => {
      setChecking(false)
      onVerify(true)
    }, 900)
  }

  return (
    <div
      onClick={handleClick}
      className={`flex items-center gap-4 px-4 py-3.5 rounded-xl border-2 cursor-pointer select-none transition-all duration-300 ${
        verified
          ? 'bg-green-50 dark:bg-green-900/20 border-green-400 dark:border-green-600'
          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
      }`}
    >
      {/* Checkbox area */}
      <div className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 border-2 transition-all duration-300 ${
        verified
          ? 'bg-green-500 border-green-500'
          : checking
            ? 'border-slate-400'
            : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
      }`}>
        <AnimatePresence mode="wait">
          {checking && !verified ? (
            <motion.div key="spin"
              initial={{ opacity:0, scale:0.5 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}>
              <RefreshCw size={13} className="text-slate-400 animate-spin" />
            </motion.div>
          ) : verified ? (
            <motion.div key="check"
              initial={{ scale:0, rotate:-20 }} animate={{ scale:1, rotate:0 }}
              transition={{ type:'spring', stiffness:500, damping:22 }}>
              <CheckCircle size={16} className="text-white" />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="flex-1">
        <p className={`text-sm font-semibold ${verified ? 'text-green-700 dark:text-green-400' : 'text-slate-700 dark:text-slate-300'}`}>
          {verified ? 'Verified — You are human ✓' : 'I\'m not a robot'}
        </p>
        {!verified && (
          <p className="text-xs text-slate-400 mt-0.5">Click to verify</p>
        )}
      </div>

      {/* reCAPTCHA branding lookalike */}
      <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
        <div className="flex gap-px">
          {[...Array(9)].map((_, i) => (
            <div key={i} className={`w-1.5 h-1.5 rounded-sm ${
              [0,3,5,7].includes(i) ? 'bg-slate-300 dark:bg-slate-600'
              : [1,4,8].includes(i) ? 'bg-slate-400 dark:bg-slate-500'
              : 'bg-slate-200 dark:bg-slate-700'
            }`}/>
          ))}
        </div>
        <p className="text-[8px] text-slate-400 font-medium tracking-tight">CHARUSAT<br/>Verify</p>
      </div>
    </div>
  )
}

// ── Login component ───────────────────────────────────────────────
export default function Login() {
  const { login }           = useAuth()
  const { dark, toggleTheme } = useTheme()
  const [role, setRole]     = useState('student')
  const [email, setEmail]   = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [captcha, setCaptcha]   = useState(false)

  const isStudent  = role === 'student'
  const accentHex  = isStudent ? '#3B82F6' : '#8B5CF6'
  const gradFrom   = isStudent ? 'from-blue-600'   : 'from-violet-600'
  const gradTo     = isStudent ? 'to-indigo-600'   : 'to-purple-600'
  const shadowC    = isStudent ? 'shadow-blue-500/30' : 'shadow-violet-500/30'
  const ringCls    = isStudent
    ? 'focus-within:ring-blue-400'
    : 'focus-within:ring-violet-400'

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email || !password)  { setError('Please fill in all fields.'); return }
    if (!captcha)             { setError('Please complete the CAPTCHA.'); return }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      login(role, role === 'admin' ? 'Admin User' : 'Mahil Patel', role === 'admin' ? 'ADM001' : '22CSBT081')
    }, 1500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0B0F19] relative overflow-hidden transition-colors duration-500 p-4">
      <GridBg accentColor={accentHex} />

      {/* Theme toggle */}
      <button onClick={toggleTheme}
        className="fixed top-5 right-5 z-50 w-10 h-10 rounded-xl glass flex items-center justify-center text-slate-600 dark:text-slate-300 hover:scale-110 active:scale-95 transition-all shadow-lg">
        {dark ? '☀️' : '🌙'}
      </button>

      {/* Card */}
      <motion.div
        initial={{ opacity:0, y:28, scale:0.97 }}
        animate={{ opacity:1, y:0,  scale:1 }}
        transition={{ duration:0.6, ease:[0.16,1,0.3,1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white dark:bg-[#131B2E] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">

          {/* Gradient top strip — morphs with role */}
          <motion.div
            animate={{ background: isStudent
              ? 'linear-gradient(135deg,#3B82F6,#6366F1)'
              : 'linear-gradient(135deg,#8B5CF6,#A855F7)' }}
            transition={{ duration:0.5 }}
            className="h-1.5 w-full"
          />

          <div className="p-8 space-y-5">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ background: isStudent
                  ? 'linear-gradient(135deg,#3B82F6,#6366F1)'
                  : 'linear-gradient(135deg,#8B5CF6,#A855F7)' }}
                transition={{ duration:0.5 }}
                className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0"
              >
                <Zap size={22} className="text-white" />
              </motion.div>
              <div>
                <div className="font-extrabold text-slate-900 dark:text-white text-lg leading-tight">
                  CHARUSAT{' '}
                  <motion.span
                    animate={{ color: accentHex }}
                    transition={{ duration:0.5 }}
                    style={{ WebkitBackgroundClip:'text' }}
                  >Smart</motion.span>
                </div>
                <div className="text-slate-500 dark:text-slate-400 text-xs">Scheduler & Booking System</div>
              </div>
            </div>

            {/* Role toggle — pill switcher */}
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl relative">
              {/* sliding bg pill */}
              <motion.div
                className="absolute top-1 bottom-1 rounded-xl"
                animate={{
                  left: isStudent ? '4px' : '50%',
                  width: 'calc(50% - 4px)',
                  background: isStudent
                    ? 'linear-gradient(135deg,#3B82F6,#6366F1)'
                    : 'linear-gradient(135deg,#8B5CF6,#A855F7)',
                }}
                transition={{ type:'spring', stiffness:400, damping:32 }}
              />
              {[
                { key:'student', label:'Login as Student', Icon:GraduationCap },
                { key:'admin',   label:'Login as Admin',  Icon:Shield          },
              ].map(({ key, label, Icon }) => (
                <button
                  key={key}
                  onClick={() => { setRole(key); setError(''); setCaptcha(false) }}
                  className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-300 ${
                    role === key ? 'text-white' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <Icon size={14}/>{label}
                </button>
              ))}
            </div>

            {/* Heading — morphs */}
            <AnimatePresence mode="wait">
              <motion.div key={role}
                initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
                transition={{ duration:0.22 }}>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {isStudent ? 'Welcome back 👋' : 'Admin access 🔐'}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                  {isStudent
                    ? 'Sign in to view your schedule and book spaces'
                    : 'Sign in to manage timetables, rooms & events'}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <FloatingInput
                label={isStudent ? 'Enrollment No. / Email' : 'Admin Email'}
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                accentColor={accentHex}
              />
              <FloatingInput
                label="Password" type="password" value={password}
                onChange={e => setPassword(e.target.value)}
                accentColor={accentHex}
              />

              {/* Forgot + Remember */}
              <div className="flex items-center justify-between text-sm pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div className="relative">
                    <input type="checkbox" className="sr-only peer"/>
                    <div className="w-8 h-4.5 rounded-full bg-slate-200 dark:bg-slate-700 peer-checked:bg-blue-500 transition-colors" style={{ height:'18px' }}></div>
                    <div className="absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-3.5"></div>
                  </div>
                  <span className="text-slate-500 dark:text-slate-400 text-xs">Remember me</span>
                </label>
                <a href="#" style={{ color: accentHex }} className="text-xs font-semibold hover:underline">
                  Forgot password?
                </a>
              </div>

              {/* CAPTCHA */}
              <CaptchaWidget verified={captcha} onVerify={setCaptcha} />

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                    className="text-rose-500 text-sm text-center font-medium"
                  >
                    ⚠️ {error}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading || !captcha}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`btn-primary w-full bg-gradient-to-r ${gradFrom} ${gradTo} shadow-lg ${shadowC} py-3 rounded-xl disabled:opacity-50`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"
                        strokeDasharray="31.4" strokeDashoffset="10" strokeLinecap="round"/>
                    </svg>
                    Authenticating…
                  </span>
                ) : (
                  <><ArrowRight size={16}/> Sign In to CHARUSAT</>
                )}
              </motion.button>

              <p className="text-center text-xs text-slate-400 dark:text-slate-500 pt-1">
                Demo: any email + password + ✅ CAPTCHA to continue
              </p>
            </form>

            {/* Footer */}
            <p className="text-center text-xs text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
              Charotar University of Science and Technology · Changa, Gujarat
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
