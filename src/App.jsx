import { useState, useEffect, createContext, useContext } from 'react'
import Login from './components/Login'
import InstituteSelector from './components/InstituteSelector'
import DashboardLayout from './components/DashboardLayout'

// ── Theme context ────────────────────────────────────────────────
export const ThemeContext = createContext({ dark: true, toggleTheme: () => {} })
export const useTheme = () => useContext(ThemeContext)

// ── Auth context ─────────────────────────────────────────────────
export const AuthContext = createContext({ role: null, user: null, login: () => {}, logout: () => {} })
export const useAuth = () => useContext(AuthContext)

// ── Institute context ────────────────────────────────────────────
export const InstituteContext = createContext({ institute: null, setInstitute: () => {} })
export const useInstitute = () => useContext(InstituteContext)

// ── Booking context ──────────────────────────────────────────────
export const BookingContext = createContext({ bookings: [], addBooking: () => {} })
export const useBookings = () => useContext(BookingContext)

import { ADMIN_BOOKINGS_SEED } from './data/charusat'

export default function App() {
  const [dark, setDark]           = useState(true)
  const [auth, setAuth]           = useState(null)        // { role, name, id }
  const [institute, setInstitute] = useState(null)        // selected institute object
  const [bookings, setBookings]   = useState(ADMIN_BOOKINGS_SEED)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  const toggleTheme = () => setDark(d => !d)
  const login       = (role, name, id) => setAuth({ role, name, id })
  const logout      = () => { setAuth(null); setInstitute(null) }
  const addBooking  = (b) => setBookings(prev => [...prev, b])

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme }}>
      <AuthContext.Provider value={{ ...auth, login, logout }}>
        <InstituteContext.Provider value={{ institute, setInstitute }}>
          <BookingContext.Provider value={{ bookings, addBooking }}>
            {!auth
              ? <Login />
              : !institute
                ? <InstituteSelector />
                : <DashboardLayout />
            }
          </BookingContext.Provider>
        </InstituteContext.Provider>
      </AuthContext.Provider>
    </ThemeContext.Provider>
  )
}
