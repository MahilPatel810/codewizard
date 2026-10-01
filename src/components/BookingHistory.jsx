import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ClipboardList, Search, Download, CheckCircle, Clock,
  Building2, Calendar, Filter, XCircle, AlertCircle, RefreshCw, FileText
} from 'lucide-react'
import { useBookings, useAuth } from '../App'

export default function BookingHistory() {
  const { bookings, addBooking } = useBookings()
  const { role } = useAuth()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL') // 'ALL' | 'Confirmed' | 'Completed'
  const [purposeFilter, setPurposeFilter] = useState('ALL')
  const [toastMessage, setToastMessage] = useState('')

  // Filtered booking records
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchSearch =
        search === '' ||
        b.space?.toLowerCase().includes(search.toLowerCase()) ||
        b.spaceName?.toLowerCase().includes(search.toLowerCase()) ||
        b.purpose?.toLowerCase().includes(search.toLowerCase()) ||
        b.bookedBy?.toLowerCase().includes(search.toLowerCase()) ||
        (b.club && b.club.toLowerCase().includes(search.toLowerCase()))

      const matchStatus = statusFilter === 'ALL' || (b.status || 'Confirmed') === statusFilter
      const matchPurpose = purposeFilter === 'ALL' || b.purpose === purposeFilter

      return matchSearch && matchStatus && matchPurpose
    })
  }, [bookings, search, statusFilter, purposeFilter])

  // Metrics
  const totalCount = bookings.length
  const confirmedCount = bookings.filter(b => (b.status || 'Confirmed') === 'Confirmed').length
  const completedCount = bookings.filter(b => b.status === 'Completed').length

  // CSV Generator & Downloader
  function exportCSV() {
    const headers = ['Booking ID', 'Date', 'Time Duration', 'Space ID', 'Space Name', 'Purpose', 'Club / Association', 'Booked By', 'Status']
    const rows = filteredBookings.map(b => [
      `"${b.id || ''}"`,
      `"${b.date || ''}"`,
      `"${b.startTime || ''} - ${b.endTime || ''}"`,
      `"${b.space || ''}"`,
      `"${b.spaceName || b.space || ''}"`,
      `"${b.purpose || ''}"`,
      `"${b.club || 'N/A'}"`,
      `"${b.bookedBy || 'Admin'}"`,
      `"${b.status || 'Confirmed'}"`
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `CHARUSAT_Weekly_Booking_Report_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setToastMessage('Weekly Booking Report CSV downloaded successfully!')
    setTimeout(() => setToastMessage(''), 3000)
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <ClipboardList size={22} className="text-violet-500" /> Admin Booking History & Audit Logs
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            Real-time registry of all institutional room, lab, and auditorium allocations
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={exportCSV}
          className="btn-primary bg-gradient-to-r from-violet-600 to-indigo-600 shadow-md shadow-violet-500/25 px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 self-start sm:self-auto"
        >
          <Download size={15} /> Generate Weekly Report
        </motion.button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Bookings</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 flex items-center justify-center">
              <Calendar size={16} />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">{totalCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Recorded academic allocations</div>
        </div>

        <div className="glass-card p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active / Confirmed</span>
            <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-500 flex items-center justify-center">
              <CheckCircle size={16} />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-green-600 dark:text-green-400 mt-2">{confirmedCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Upcoming scheduled sessions</div>
        </div>

        <div className="glass-card p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Completed Sessions</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center">
              <Clock size={16} />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-2">{completedCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Past verified activities</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by space, purpose, faculty..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
          />
        </div>

        {/* Status Toggle Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-full md:w-auto overflow-x-auto">
          {['ALL', 'Confirmed', 'Completed'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              {status === 'ALL' ? 'All Records' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="glass-card overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Time Duration</th>
                <th className="py-3 px-4">Room / Lab ID</th>
                <th className="py-3 px-4">Purpose</th>
                <th className="py-3 px-4">Affiliated Club / Faculty</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredBookings.map((b, idx) => {
                const isConfirmed = (b.status || 'Confirmed') === 'Confirmed'
                return (
                  <motion.tr
                    key={b.id || idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.03 }}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Date */}
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {b.date}
                    </td>

                    {/* Time Duration */}
                    <td className="py-3.5 px-4 font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
                        <Clock size={11} className="text-slate-400" />
                        <span>{b.startTime} - {b.endTime}</span>
                      </div>
                    </td>

                    {/* Room / Lab ID */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Building2 size={13} className="text-indigo-500 flex-shrink-0" />
                        <span>{b.space}</span>
                      </div>
                      {b.spaceName && (
                        <div className="text-[11px] text-slate-400 truncate max-w-xs">{b.spaceName}</div>
                      )}
                    </td>

                    {/* Purpose */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {b.purpose}
                      </span>
                    </td>

                    {/* Club / Booked By */}
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      <div>{b.club || b.bookedBy || 'Administrative Allocation'}</div>
                      {b.club && b.bookedBy && (
                        <div className="text-[10px] text-slate-400">{b.bookedBy}</div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        isConfirmed
                          ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                      }`}>
                        {isConfirmed && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>}
                        {b.status || 'Confirmed'}
                      </span>
                    </td>
                  </motion.tr>
                )
              })}

              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <AlertCircle size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="font-semibold">No booking records found matching your filters</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl shadow-2xl font-semibold text-sm"
          >
            <CheckCircle size={16} className="text-green-500" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
