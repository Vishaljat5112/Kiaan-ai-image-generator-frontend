import React, { useEffect, useState, useCallback } from 'react'
import {
  Users,
  Search,
  Shield,
  Coins,
  Ban,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Pencil
} from 'lucide-react'
import { api } from '../../services/api'
import { formatNumber, formatDateTime } from '../../utils/format'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { FieldLabel, lightInputClass, Toast } from '../../components/studio/StudioUI'

export function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 })
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // Modals state
  const [selectedUser, setSelectedUser] = useState(null)
  const [creditModalOpen, setCreditModalOpen] = useState(false)
  const [creditAmount, setCreditAmount] = useState('')
  const [creditReason, setCreditReason] = useState('')
  const [creditSubmitting, setCreditSubmitting] = useState(false)

  // Edit User Modal state
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [editFullName, setEditFullName] = useState('')
  const [editRole, setEditRole] = useState('CREATOR')
  const [editStatus, setEditStatus] = useState('ACTIVE')
  const [editCreditDelta, setEditCreditDelta] = useState('')
  const [editReason, setEditReason] = useState('')
  const [editSubmitting, setEditSubmitting] = useState(false)

  const [toast, setToast] = useState(null)
  const closeToast = useCallback(() => setToast(null), [])

  const fetchUsers = useCallback(async (page = 1) => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      params.append('page', page)
      params.append('limit', '10')
      if (search.trim()) params.append('search', search.trim())
      if (roleFilter) params.append('role', roleFilter)
      if (statusFilter) params.append('status', statusFilter)

      const res = await api.get(`/admin/users?${params.toString()}`)
      if (res.data?.data) {
        setUsers(res.data.data.users || [])
        setPagination(res.data.data.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 })
      }
    } catch (err) {
      setToast({ message: err.response?.data?.error?.message || 'Failed to fetch users', tone: 'danger', type: 'error' })
    } finally {
      setLoading(false)
    }
  }, [search, roleFilter, statusFilter])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [fetchUsers])

  const openEditModal = (u) => {
    setEditingUser(u)
    setEditFullName(u.fullName || '')
    setEditRole(u.role || 'CREATOR')
    setEditStatus(u.status || 'ACTIVE')
    setEditCreditDelta('')
    setEditReason('')
    setEditModalOpen(true)
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!editingUser) return
    try {
      setEditSubmitting(true)
      await api.patch(`/admin/users/${editingUser.id}`, {
        fullName: editFullName.trim(),
        role: editRole,
        status: editStatus,
        creditDelta: editCreditDelta.trim() ? parseInt(editCreditDelta, 10) : undefined,
        reason: editReason.trim() || `Admin updated account (status: ${editStatus})`
      })
      setToast({ message: `User ${editingUser.email} updated successfully`, tone: 'success' })
      setEditModalOpen(false)
      setEditingUser(null)
      setEditCreditDelta('')
      fetchUsers(pagination.page)
    } catch (err) {
      setToast({ message: err.response?.data?.error?.message || 'Failed to update user', tone: 'danger', type: 'error' })
    } finally {
      setEditSubmitting(false)
    }
  }

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await api.patch(`/admin/users/${userId}/status`, {
        status: newStatus,
        reason: `Admin updated status to ${newStatus}`
      })
      setToast({ message: `User status changed to ${newStatus}`, tone: 'success' })
      fetchUsers(pagination.page)
    } catch (err) {
      setToast({ message: err.response?.data?.error?.message || 'Status change failed', tone: 'danger', type: 'error' })
    }
  }

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.patch(`/admin/users/${userId}/role`, {
        role: newRole,
        reason: `Admin assigned role ${newRole}`
      })
      setToast({ message: `User role changed to ${newRole}`, tone: 'success' })
      fetchUsers(pagination.page)
    } catch (err) {
      setToast({ message: err.response?.data?.error?.message || 'Role change failed', tone: 'danger', type: 'error' })
    }
  }

  const handleCreditSubmit = async (e) => {
    e.preventDefault()
    if (!selectedUser || !creditAmount) return
    try {
      setCreditSubmitting(true)
      await api.post(`/admin/users/${selectedUser.id}/credits`, {
        amount: parseInt(creditAmount, 10),
        reason: creditReason.trim() || 'Admin credit adjustment'
      })
      setToast({ message: `Adjusted credits for ${selectedUser.email}`, tone: 'success' })
      setCreditModalOpen(false)
      setSelectedUser(null)
      setCreditAmount('')
      setCreditReason('')
      fetchUsers(pagination.page)
    } catch (err) {
      setToast({ message: err.response?.data?.error?.message || 'Credit adjustment failed', tone: 'danger', type: 'error' })
    } finally {
      setCreditSubmitting(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pt-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400">
              <Users className="w-3.5 h-3.5" />
              User Governance
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">User Accounts & RBAC</h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Manage customer permissions, account security statuses, and credit grants with complete audit logging.
          </p>
        </div>

        <button
          onClick={() => fetchUsers(pagination.page)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-neutral-900 border border-neutral-700 hover:border-neutral-600 text-neutral-300 hover:text-white transition-colors cursor-pointer self-start sm:self-auto shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-[#0D111C]/90 border border-neutral-800/80 shadow-md flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search email, full name..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-1/2 sm:w-auto px-3 py-2 rounded-xl bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-cyan-500/50 cursor-pointer"
          >
            <option value="">All Roles</option>
            <option value="CREATOR">Creator</option>
            <option value="ADMIN">Admin</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-1/2 sm:w-auto px-3 py-2 rounded-xl bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-cyan-500/50 cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="BANNED">Banned</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-neutral-800/80 bg-[#0D111C]/90 shadow-xl overflow-hidden">
        <div className="overflow-x-auto min-w-full">
          <table className="w-full text-left text-xs min-w-[760px]">
            <thead className="border-b border-neutral-800/80 bg-neutral-900/40 text-neutral-400 font-semibold select-none">
              <tr>
                <th className="py-3.5 px-4 w-[28%] min-w-[220px]">User</th>
                <th className="py-3.5 px-4 w-[12%] min-w-[110px]">Role</th>
                <th className="py-3.5 px-4 w-[12%] min-w-[100px]">Status</th>
                <th className="py-3.5 px-4 w-[14%] min-w-[110px]">Active Plan</th>
                <th className="py-3.5 px-4 w-[14%] min-w-[120px]">Credit Balance</th>
                <th className="py-3.5 px-4 w-[12%] min-w-[110px]">Joined</th>
                <th className="py-3.5 px-4 text-right whitespace-nowrap w-[8%] min-w-[70px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {loading && users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-neutral-400">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-neutral-400">
                    No users matching criteria.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-neutral-900/40 transition-colors">
                    <td className="py-3.5 px-4 max-w-[240px] sm:max-w-[280px]">
                      <div className="font-semibold text-neutral-200 truncate">{u.fullName || 'No Name'}</div>
                      <div className="text-[11px] text-neutral-300/80 truncate mt-0.5" title={u.email}>{u.email}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${
                          u.role === 'SUPER_ADMIN'
                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                            : u.role === 'ADMIN'
                            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                            : 'bg-neutral-800 text-neutral-300 border border-neutral-700'
                        }`}
                      >
                        <Shield className="w-2.5 h-2.5 shrink-0" />
                        <span>{u.role}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${
                          u.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : u.status === 'SUSPENDED'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-300 whitespace-nowrap">{u.activePlan || 'Free Tier'}</td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-semibold text-cyan-400 flex items-center gap-1.5">
                        <Coins className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{formatNumber(u.creditBalance)}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-400 whitespace-nowrap">{formatDateTime(u.createdAt)}</td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end">
                        {/* Edit Button (Icon Only) */}
                        <button
                          type="button"
                          onClick={() => openEditModal(u)}
                          title="Edit User Account"
                          aria-label="Edit User"
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-cyan-400 hover:text-cyan-300 border border-neutral-700 hover:border-cyan-500/40 transition-all cursor-pointer flex items-center justify-center shadow-2xs"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-3.5 border-t border-neutral-800/80 bg-neutral-900/40 flex items-center justify-between text-xs text-neutral-400 select-none">
          <div className="font-medium">
            Showing {users.length} of {pagination.total} users
          </div>
          <div className="flex items-center gap-1.5">
            <button
              disabled={pagination.page <= 1}
              onClick={() => fetchUsers(pagination.page - 1)}
              className="p-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed text-neutral-300 transition-colors cursor-pointer"
              title="Previous page"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2.5 py-0.5 text-neutral-300 font-medium">
              Page {pagination.page} of {pagination.totalPages || 1}
            </span>
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => fetchUsers(pagination.page + 1)}
              className="p-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed text-neutral-300 transition-colors cursor-pointer"
              title="Next page"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      <Modal
        theme="dark"
        isOpen={editModalOpen}
        onClose={() => {
          if (!editSubmitting) {
            setEditModalOpen(false)
            setEditingUser(null)
          }
        }}
        title={`Edit User: ${editingUser?.email || ''}`}
        description="Update user full name, RBAC privileges, and account status."
        className="max-w-md bg-[#0D111C] text-neutral-100 border-neutral-800"
      >
        {editingUser && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <FieldLabel htmlFor="e-email">User Email</FieldLabel>
              <input
                id="e-email"
                type="text"
                disabled
                value={editingUser.email}
                className="w-full px-3 py-2 rounded-xl bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-400 cursor-not-allowed"
              />
            </div>

            <div>
              <FieldLabel htmlFor="e-name">Full Name</FieldLabel>
              <input
                id="e-name"
                type="text"
                value={editFullName}
                onChange={(e) => setEditFullName(e.target.value)}
                placeholder="e.g. John Doe"
                className={lightInputClass}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel>Role & Promotion</FieldLabel>
                {editingUser.role === 'SUPER_ADMIN' ? (
                  <div className="w-full px-3 py-2 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <Shield className="w-3.5 h-3.5 text-purple-400" />
                      SUPER_ADMIN
                    </span>
                    <span className="text-[10px] text-neutral-400">Protected Root</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setEditRole(editRole === 'ADMIN' ? 'CREATOR' : 'ADMIN')}
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                      editRole === 'ADMIN'
                        ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20'
                        : 'bg-neutral-900 border-neutral-700/80 text-neutral-300 hover:bg-neutral-800'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{editRole === 'ADMIN' ? 'Role: ADMIN' : 'Role: CREATOR'}</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-800 border border-neutral-700 text-cyan-300 hover:text-white">
                      {editRole === 'ADMIN' ? 'Demote' : 'Promote to Admin'}
                    </span>
                  </button>
                )}
              </div>

              <div>
                <FieldLabel htmlFor="e-status">Account Status</FieldLabel>
                <select
                  id="e-status"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-neutral-700/80 text-xs text-neutral-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                  <option value="BANNED">BANNED</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <FieldLabel htmlFor="e-credits">Adjust Wallet Credits</FieldLabel>
                <span className="text-[11px] text-cyan-400 font-semibold flex items-center gap-1">
                  <Coins className="w-3 h-3 text-cyan-400" />
                  Current: {formatNumber(editingUser.creditBalance)} credits
                </span>
              </div>
              <input
                id="e-credits"
                type="number"
                value={editCreditDelta}
                onChange={(e) => setEditCreditDelta(e.target.value)}
                placeholder="Enter amount to add or deduct, e.g. 50 or -25 (leave blank for no change)"
                className={lightInputClass}
              />
            </div>

            <div>
              <FieldLabel htmlFor="e-reason">Administrative Reason (Optional)</FieldLabel>
              <input
                id="e-reason"
                type="text"
                value={editReason}
                onChange={(e) => setEditReason(e.target.value)}
                placeholder="e.g. Profile update, Account sanction, or Policy review"
                className={lightInputClass}
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
              <Button
                variant="outline"
                size="sm"
                type="button"
                disabled={editSubmitting}
                onClick={() => {
                  setEditModalOpen(false)
                  setEditingUser(null)
                }}
                className="text-neutral-300 border-neutral-700 hover:bg-neutral-800 hover:text-white"
              >
                Cancel
              </Button>
              <Button variant="gradient" size="sm" type="submit" disabled={editSubmitting}>
                {editSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Credit Adjustment Modal */}
      <Modal
        theme="dark"
        isOpen={creditModalOpen}
        onClose={() => setCreditModalOpen(false)}
        title={`Adjust Credits for ${selectedUser?.email || ''}`}
        description="Enter a positive integer to grant bonus credits, or a negative integer to deduct credits."
        className="max-w-md bg-[#0D111C] text-neutral-100 border-neutral-800"
      >
        <form onSubmit={handleCreditSubmit} className="space-y-4">
          <div>
            <FieldLabel htmlFor="c-amount">Credit Delta *</FieldLabel>
            <input
              id="c-amount"
              type="number"
              required
              value={creditAmount}
              onChange={(e) => setCreditAmount(e.target.value)}
              placeholder="e.g. 100 or -25"
              className={lightInputClass}
            />
          </div>

          <div>
            <FieldLabel htmlFor="c-reason">Administrative Reason *</FieldLabel>
            <input
              id="c-reason"
              type="text"
              required
              value={creditReason}
              onChange={(e) => setCreditReason(e.target.value)}
              placeholder="e.g. Compensation for cluster downtime"
              className={lightInputClass}
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => setCreditModalOpen(false)}
              className="text-neutral-300 border-neutral-700 hover:bg-neutral-800 hover:text-white"
            >
              Cancel
            </Button>
            <Button variant="gradient" size="sm" type="submit" disabled={creditSubmitting}>
              {creditSubmitting ? 'Adjusting...' : 'Confirm Adjustment'}
            </Button>
          </div>
        </form>
      </Modal>

      <Toast toast={toast} onClose={closeToast} />
    </div>
  )
}

export default AdminUsersPage
