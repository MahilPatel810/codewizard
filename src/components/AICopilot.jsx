import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, X, Send, Zap, Mic } from 'lucide-react'
import { getAIResponse } from '../data/cspit'

const QUICK_PROMPTS = [
  { label: '🏫 Vacant rooms now',  q: 'Find me vacant rooms right now'          },
  { label: '📍 Where is Batch A1', q: 'Where is Batch A1 at 1:10 PM on Thursday' },
  { label: '💻 Mac Lab status',    q: 'Find me an empty Mac lab'                 },
  { label: '🍽️ Lunch free rooms',  q: 'What rooms are free during lunch'         },
  { label: '📐 Who teaches MATHS', q: 'Who teaches Discrete Mathematics?'        },
]

function OrbIdle() {
  return (
    <div className="orb-idle w-full h-full flex items-center justify-center relative">
      <div className="absolute inset-0 rounded-full border-2 border-indigo-400/40"></div>
      <div className="w-5 h-5 rounded-full bg-white shadow-inner"></div>
      {/* Scan line */}
      <div className="absolute left-0 right-0 overflow-hidden rounded-full inset-0">
        <div className="absolute left-0 right-0 h-px bg-cyan-400/50" style={{ top: '50%' }}></div>
      </div>
    </div>
  )
}

function OrbThink() {
  return (
    <div className="orb-think w-full h-full flex items-center justify-center relative">
      <div className="absolute inset-0 rounded-full border-2 border-dashed border-indigo-300/60"></div>
      <div className="w-4 h-4 rounded-full bg-white/80"></div>
    </div>
  )
}

function WaveBars() {
  return (
    <div className="flex items-end gap-0.5 h-5">
      {[1,2,3,4,5].map(i => <div key={i} className="wave-bar"></div>)}
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-sm max-w-xs">
      <div className="typing-dot"></div>
      <div className="typing-dot"></div>
      <div className="typing-dot"></div>
    </div>
  )
}

export default function AICopilot() {
  const [open, setOpen]         = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput]       = useState('')
  const [thinking, setThinking] = useState(false)
  const bottomRef               = useRef(null)

  // Welcome message
  useEffect(() => {
    setMessages([{
      id: 'welcome',
      role: 'ai',
      html: `Hi! 👋 I'm your <strong>EduSync AI Copilot</strong> for CSPIT CSE Sem-3.<br/>Ask me anything about your schedule, vacant rooms, faculty, or batch locations!`,
    }])
  }, [])

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinking])

  function sendMessage(text = input.trim()) {
    if (!text || thinking) return
    setInput('')
    const userMsg = { id: Date.now(), role: 'user', text }
    setMessages(prev => [...prev, userMsg])
    setThinking(true)

    setTimeout(() => {
      const resp = getAIResponse(text)
      setThinking(false)
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', html: resp }])
    }, 1500 + Math.random() * 600)
  }

  return (
    <>
      {/* Backdrop (mobile) */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16, x: 16 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="fixed bottom-24 right-5 z-50 w-[340px] sm:w-[380px] bg-white dark:bg-surface border border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            style={{ maxHeight: '520px' }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-indigo-500/5 to-purple-500/5">
              <div className="relative w-10 h-10 rounded-full flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
                <OrbIdle />
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white text-sm">EduSync AI Copilot</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  {thinking ? (
                    <span className="text-[11px] text-indigo-500 dark:text-indigo-400 flex items-center gap-1">
                      Thinking <WaveBars />
                    </span>
                  ) : (
                    <span className="text-[11px] text-green-600 dark:text-green-400">Ready · CSPIT Sem-3</span>
                  )}
                </div>
              </div>
              <button onClick={() => setOpen(false)}
                className="ml-auto text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'items-start gap-2'}`}
                >
                  {msg.role === 'ai' && (
                    <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                  )}
                  {msg.role === 'user' ? (
                    <div className="px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm text-white max-w-[75%]"
                      style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                      {msg.text}
                    </div>
                  ) : (
                    <div
                      className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm rounded-2xl rounded-tl-sm max-w-[78%]"
                      dangerouslySetInnerHTML={{ __html: msg.html }}
                    />
                  )}
                </motion.div>
              ))}

              {/* Typing indicator */}
              <AnimatePresence>
                {thinking && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-start gap-2"
                  >
                    <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                      <div className="w-2 h-2 rounded-full bg-white orb-think"></div>
                    </div>
                    <TypingIndicator />
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={bottomRef} />
            </div>

            {/* Quick prompts */}
            <div className="px-4 pb-2">
              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {QUICK_PROMPTS.map(p => (
                  <button
                    key={p.q}
                    onClick={() => sendMessage(p.q)}
                    disabled={thinking}
                    className="flex-shrink-0 text-[11px] font-semibold px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 transition-all hover:border-indigo-300 dark:hover:border-indigo-700 hover:scale-105 active:scale-95 disabled:opacity-50"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="px-4 pb-4 border-t border-slate-100 dark:border-slate-800 pt-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Ask about schedule, rooms, faculty…"
                  disabled={thinking}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-60"
                />
                <motion.button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || thinking}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.93 }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white disabled:opacity-50 transition-all flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 4px 15px rgba(99,102,241,0.35)' }}
                >
                  <Send size={15} />
                </motion.button>
              </div>
              <p className="text-center text-[10px] text-slate-400 mt-2">
                EduSync AI · CSPIT CSE Sem-3 Data
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB — strictly anchored bottom-right */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full text-white shadow-2xl flex items-center justify-center relative"
        style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 8px 30px rgba(99,102,241,0.5)' }}
      >
        {/* Ripple ring */}
        {!open && (
          <div className="absolute inset-0 rounded-full ripple-ring"
            style={{ background: 'rgba(99,102,241,0.4)' }} />
        )}
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity:0 }} animate={{ rotate:0, opacity:1 }} exit={{ rotate:90, opacity:0 }} transition={{ duration: 0.2 }}>
              <X size={22} />
            </motion.div>
          ) : (
            <motion.div key="bot" initial={{ scale: 0.8, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.8, opacity:0 }} className="orb-idle w-8 h-8">
              <OrbIdle />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  )
}
