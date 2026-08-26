import { useState, useMemo, useCallback } from 'react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { Users, Plus, RefreshCw, AlertCircle, ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';

import { useUsers } from '../hooks/useUsers';
import { useDebounce } from '../hooks/useDebounce';

import SearchBar from '../components/SearchBar';
import CompanyFilter from '../components/CompanyFilter';
import UserList from '../components/UserList';
import UserForm from '../components/UserForm';
import UserDetailsModal from '../components/UserDetailsModal';
import ConfirmationModal from '../components/ConfirmationModal';

// ── Sorting helpers ─────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { key: null, label: 'Default' },
  { key: 'name', label: 'Name' },
  { key: 'company', label: 'Company' },
];

function sortUsers(users, sortKey, sortDir) {
  if (!sortKey) return users;
  return [...users].sort((a, b) => {
    const aVal = sortKey === 'company' ? a.company?.name || '' : a.name || '';
    const bVal = sortKey === 'company' ? b.company?.name || '' : b.name || '';
    const cmp = aVal.localeCompare(bVal);
    return sortDir === 'asc' ? cmp : -cmp;
  });
}

// ── Modal state keys ─────────────────────────────────────────────────────────
const MODAL = { NONE: null, CREATE: 'create', EDIT: 'edit', DELETE: 'delete', DETAIL: 'detail' };

export default function UsersPage() {
  const { users, loading, error, retry, addUser, editUser, removeUser } = useUsers();

  // Search & filter
  const [searchInput, setSearchInput] = useState('');
  const [company, setCompany] = useState('');
  const debouncedSearch = useDebounce(searchInput, 350);

  // Sorting
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  // Pagination
  const PAGE_SIZE = 9;
  const [page, setPage] = useState(1);

  // Modal
  const [modal, setModal] = useState(MODAL.NONE);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // ── Derived data ────────────────────────────────────────────────────────────
  const companies = useMemo(
    () => [...new Set(users.map((u) => u.company?.name).filter(Boolean))].sort(),
    [users]
  );

  const filteredUsers = useMemo(() => {
    const q = debouncedSearch.toLowerCase().trim();
    let result = users.filter((u) => {
      const matchesSearch =
        !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      const matchesCompany = !company || u.company?.name === company;
      return matchesSearch && matchesCompany;
    });
    return sortUsers(result, sortKey, sortDir);
  }, [users, debouncedSearch, company, sortKey, sortDir]);

  const paginatedUsers = useMemo(
    () => filteredUsers.slice(0, page * PAGE_SIZE),
    [filteredUsers, page]
  );
  const hasMore = paginatedUsers.length < filteredUsers.length;

  // ── Sort toggle ──────────────────────────────────────────────────────────────
  const toggleSort = useCallback((key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(1);
  }, [sortKey]);

  // ── Modal openers ─────────────────────────────────────────────────────────
  const openCreate = useCallback(() => { setSelectedUser(null); setModal(MODAL.CREATE); }, []);
  const openEdit   = useCallback((u) => { setSelectedUser(u);    setModal(MODAL.EDIT);   }, []);
  const openDetail = useCallback((u) => { setSelectedUser(u);    setModal(MODAL.DETAIL); }, []);
  const openDelete = useCallback((u) => { setSelectedUser(u);    setModal(MODAL.DELETE); }, []);
  const closeModal = useCallback(() => { setModal(MODAL.NONE); setSelectedUser(null); }, []);

  // ── CRUD handlers ─────────────────────────────────────────────────────────
  const handleCreate = useCallback(async (data) => {
    setActionLoading(true);
    try {
      await addUser(data);
      toast.success('User created successfully');
      closeModal();
      setPage(1);
    } catch {
      toast.error('Failed to create user. Please try again.');
    } finally {
      setActionLoading(false);
    }
  }, [addUser, closeModal]);

  const handleEdit = useCallback(async (data) => {
    if (!selectedUser) return;
    setActionLoading(true);
    try {
      await editUser(selectedUser.id, data);
      toast.success('User updated successfully');
      closeModal();
    } catch {
      toast.error('Failed to update user. Please try again.');
    } finally {
      setActionLoading(false);
    }
  }, [selectedUser, editUser, closeModal]);

  const handleDelete = useCallback(async (id) => {
    setActionLoading(true);
    try {
      await removeUser(id);
      toast.success('User deleted successfully');
      closeModal();
    } catch {
      toast.error('Failed to delete user. Please try again.');
    } finally {
      setActionLoading(false);
    }
  }, [removeUser, closeModal]);

  // When Edit is triggered from details modal
  const handleEditFromDetail = useCallback((u) => {
    setSelectedUser(u);
    setModal(MODAL.EDIT);
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster
        position="top-right"
        toastOptions={{
          style: { fontSize: '13px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
          success: { iconTheme: { primary: '#2563eb', secondary: '#fff' } },
        }}
      />

      {/* ── Top Nav ── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Users size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-slate-800 leading-none">UserHub</h1>
              <p className="text-[11px] text-gray-400 mt-0.5">User Management Dashboard</p>
            </div>
          </div>
          <button
            id="create-user-btn"
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white
                       bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
          >
            <Plus size={15} />
            <span className="hidden sm:inline">Add User</span>
          </button>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Page title + stats */}
        <div className="mb-6 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">All Users</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              {loading ? 'Loading…' : `${filteredUsers.length} user${filteredUsers.length !== 1 ? 's' : ''} found`}
            </p>
          </div>

          {/* Sort buttons */}
          {!loading && !error && users.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-medium">Sort by:</span>
              {SORT_OPTIONS.filter((o) => o.key).map((opt) => {
                const active = sortKey === opt.key;
                return (
                  <button
                    key={opt.key}
                    onClick={() => toggleSort(opt.key)}
                    aria-label={`Sort by ${opt.label}`}
                    className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors
                      ${active
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-white border border-gray-200 text-slate-600 hover:bg-gray-50'}`}
                  >
                    {opt.label}
                    {active
                      ? sortDir === 'asc'
                        ? <ChevronUp size={12} />
                        : <ChevronDown size={12} />
                      : <ArrowUpDown size={12} className="text-gray-300" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Search & Filter */}
        {!error && (
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <SearchBar value={searchInput} onChange={(v) => { setSearchInput(v); setPage(1); }} />
            <CompanyFilter
              companies={companies}
              value={company}
              onChange={(v) => { setCompany(v); setPage(1); }}
            />
            {(searchInput || company) && (
              <button
                onClick={() => { setSearchInput(''); setCompany(''); setPage(1); }}
                className="text-xs font-medium text-gray-400 hover:text-gray-600 px-3 py-2 rounded-lg
                           bg-white border border-gray-200 hover:bg-gray-50 transition-colors flex-shrink-0"
              >
                Clear
              </button>
            )}
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
              <AlertCircle size={28} className="text-red-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-700 mb-1">Failed to load users</h3>
              <p className="text-sm text-gray-400">{error}</p>
            </div>
            <button
              onClick={retry}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white
                         bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        )}

        {/* User grid */}
        {!error && (
          <>
            <UserList
              users={paginatedUsers}
              loading={loading}
              onView={openDetail}
              onEdit={openEdit}
              onDelete={openDelete}
            />

            {/* Load more */}
            {!loading && hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="px-6 py-2.5 text-sm font-medium text-blue-600 border border-blue-200
                             bg-white hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Load more ({filteredUsers.length - paginatedUsers.length} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* ── Modals ── */}
      {(modal === MODAL.CREATE) && (
        <UserForm
          user={null}
          loading={actionLoading}
          onSubmit={handleCreate}
          onCancel={closeModal}
        />
      )}

      {modal === MODAL.EDIT && selectedUser && (
        <UserForm
          user={selectedUser}
          loading={actionLoading}
          onSubmit={handleEdit}
          onCancel={closeModal}
        />
      )}

      {modal === MODAL.DETAIL && selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={closeModal}
          onEdit={handleEditFromDetail}
        />
      )}

      {modal === MODAL.DELETE && selectedUser && (
        <ConfirmationModal
          user={selectedUser}
          loading={actionLoading}
          onConfirm={handleDelete}
          onCancel={closeModal}
        />
      )}
    </div>
  );
}
