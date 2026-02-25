import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import LogoutModal from '../../components/LogoutModal';

// Supervisor data type
interface Supervisor {
  id: string;
  name: string;
  initials: string;
  office: string;
}

// Sample supervisor data
const supervisorData: Supervisor[] = [
  { id: 'SUP-00101', name: 'William Shakespear', initials: 'WS', office: 'LTO Office – Candon City' },
];

// ── Shared intent key — imported by AdminSupervisorDetail ──────────────────
export const SUPERVISOR_NAV_KEY = 'supervisor_nav_intent';
export type SupervisorNavIntent = { action: 'edit' | 'delete'; supervisorId: string };

const AdminSupervisors: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const history = useHistory();

  const handleConfirm = () => {
    setIsLoggingOut(true);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    history.push('/login');
  };
  const handleCancel = () => setShowModal(false);
  const handleLogoutComplete = () => setIsLoggingOut(false);

  // Export to CSV function
  const handleExport = () => {
    const headers = ['ID', 'Name', 'Office'];
    const csvContent = [
      headers.join(','),
      ...supervisorData.map(s => [
        s.id,
        `"${s.name}"`,
        `"${s.office}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `supervisors_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // ── Navigation helpers ────────────────────────────────────────────────────
  const goView = (id: string) => {
    history.push('/admin-supervisor-detail');
  };
  const goEdit = (id: string) => {
    const intent: SupervisorNavIntent = { action: 'edit', supervisorId: id };
    localStorage.setItem(SUPERVISOR_NAV_KEY, JSON.stringify(intent));
    history.push('/admin-supervisor-detail');
  };
  const goDelete = (id: string) => {
    const intent: SupervisorNavIntent = { action: 'delete', supervisorId: id };
    localStorage.setItem(SUPERVISOR_NAV_KEY, JSON.stringify(intent));
    history.push('/admin-supervisor-detail');
  };

  const css = `*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --brand:        #5f0076;
  --brand-dark:   #3d004c;
  --brand-mid:    #7a1896;
  --brand-soft:   #f3e6f8;
  --brand-glow:   rgba(95,0,118,.15);
  --ink:          #1a1025;
  --ink-2:        #3d3049;
  --ink-3:        #7b6e89;
  --rule:         #ede6f2;
  --bg:           #f7f4fb;
  --surface:      #ffffff;
  --blue:         #1456cc;
  --orange:       #d95b00;
  --red:          #c0303b;
  --r-sm:  6px;
  --r-md:  10px;
  --r-lg:  16px;
  --r-xl:  22px;
  --r-full:9999px;
  --sh-sm:  0 1px 3px rgba(0,0,0,.06);
  --sh-md:  0 4px 12px rgba(0,0,0,.08);
  --sh-lg:  0 12px 32px rgba(0,0,0,.10);
  --sidebar-w: 252px;
  --ease: cubic-bezier(.4,0,.2,1);
}

html, body { height: 100%; font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--ink); }

/* ─── TOPBAR ─────────────────────────────── */
.topbar {
  height: 60px;
  background: var(--surface);
  border-bottom: 1px solid var(--rule);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 32px;
  position: sticky; top: 0; z-index: 5;
  box-shadow: var(--sh-sm);
}
.topbar-breadcrumb {
  display: flex; align-items: center; gap: 8px;
  font-size: .85rem; color: var(--ink-3);
}
.topbar-breadcrumb .crumb-active { color: var(--ink); font-weight: 600; }
.topbar-breadcrumb svg { width: 14px; height: 14px; stroke: var(--ink-3); fill: none; stroke-width: 2; stroke-linecap: round; }
.topbar-right { display: flex; align-items: center; gap: 12px; }
.topbar-btn {
  width: 36px; height: 36px;
  border-radius: var(--r-md);
  border: 1px solid var(--rule);
  background: var(--bg);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all .18s var(--ease); color: var(--ink-2);
}
.topbar-btn:hover { background: var(--brand-soft); border-color: var(--brand-glow); color: var(--brand); }
.topbar-btn svg { width: 18px; height: 18px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

/* ─── PAGE CONTENT ───────────────────────── */
.page-content { padding: 28px 32px 48px; flex: 1; }

.page-header {
  display: flex; align-items: flex-start;
  justify-content: space-between; gap: 16px;
  margin-bottom: 28px;
}
.page-header-title {
  font-family: 'Syne', sans-serif;
  font-size: 1.6rem; font-weight: 800; color: var(--ink);
  letter-spacing: -.02em; line-height: 1.1;
}
.page-header-sub {
  margin-top: 5px; font-size: .875rem;
  color: var(--ink-3); font-weight: 400;
}
.header-actions { display: flex; gap: 10px; align-items: center; }

.btn-primary {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 10px 20px;
  background: var(--brand); color: #fff;
  border: none; border-radius: var(--r-md);
  font-size: .875rem; font-weight: 600;
  cursor: pointer; transition: all .2s var(--ease);
  box-shadow: 0 2px 8px rgba(95,0,118,.3);
  font-family: 'DM Sans', sans-serif;
}
.btn-primary:hover { background: var(--brand-dark); transform: translateY(-1px); box-shadow: 0 4px 14px rgba(95,0,118,.35); }
.btn-primary:active { transform: none; }
.btn-primary svg { width: 16px; height: 16px; stroke: currentColor; fill: none; stroke-width: 2.5; stroke-linecap: round; }

.btn-ghost {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 8px 14px;
  background: var(--bg); color: var(--ink-2);
  border: 1px solid var(--rule); border-radius: var(--r-md);
  font-size: .8rem; font-weight: 500;
  cursor: pointer; transition: all .2s var(--ease);
  font-family: 'DM Sans', sans-serif;
}
.btn-ghost:hover { background: var(--brand-soft); border-color: var(--brand-glow); color: var(--brand); }
.btn-ghost svg { width: 14px; height: 14px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; }

/* ─── FILTERS ────────────────────────────── */
.filters-bar {
  display: flex; align-items: center; gap: 12px;
  margin-bottom: 20px;
  background: var(--surface);
  border: 1px solid var(--rule);
  border-radius: var(--r-lg);
  padding: 14px 20px;
  box-shadow: var(--sh-sm);
}
.search-wrap { position: relative; flex: 1; max-width: 420px; }
.search-wrap svg {
  position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
  width: 16px; height: 16px; stroke: var(--ink-3); fill: none; stroke-width: 2; stroke-linecap: round; pointer-events: none;
}
.search-input {
  width: 100%;
  padding: 9px 12px 9px 36px;
  border: 1.5px solid var(--rule);
  border-radius: var(--r-full);
  font-size: .875rem; color: var(--ink);
  background: var(--bg);
  font-family: 'DM Sans', sans-serif;
  transition: all .18s var(--ease); outline: none;
}
.search-input::placeholder { color: var(--ink-3); }
.search-input:focus { border-color: var(--brand); background: #fff; box-shadow: 0 0 0 3px var(--brand-glow); }
.filter-sep { width: 1px; height: 28px; background: var(--rule); flex-shrink: 0; }
.filter-label { font-size: .8rem; font-weight: 600; color: var(--ink-3); white-space: nowrap; }
.filter-select {
  padding: 8px 32px 8px 12px;
  border: 1.5px solid var(--rule); border-radius: var(--r-md);
  font-size: .875rem; color: var(--ink); background: var(--bg);
  cursor: pointer; font-family: 'DM Sans', sans-serif;
  outline: none; appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237b6e89' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 10px center;
  transition: all .18s var(--ease);
}
.filter-select:focus { border-color: var(--brand); box-shadow: 0 0 0 3px var(--brand-glow); }

/* ─── SUPERVISORS SECTION ────────────────── */
.supervisors-section {
  background: var(--surface);
  border: 1px solid var(--rule);
  border-radius: var(--r-xl);
  box-shadow: var(--sh-sm);
  overflow: hidden;
}
.section-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 24px;
  border-bottom: 1px solid var(--rule);
}
.section-head-title {
  font-family: 'Syne', sans-serif;
  font-size: 1rem; font-weight: 700; color: var(--ink);
  display: flex; align-items: center; gap: 10px;
}
.count-badge {
  font-family: 'DM Sans', sans-serif;
  font-size: .72rem; font-weight: 700;
  background: var(--brand-soft); color: var(--brand);
  padding: 3px 10px; border-radius: var(--r-full);
  border: 1px solid rgba(95,0,118,.12);
}

.list-col-header {
  display: grid;
  grid-template-columns: 1fr 1fr 100px;
  padding: 10px 24px;
  background: var(--bg);
  border-bottom: 1px solid var(--rule);
}
.col-label {
  font-size: .7rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: .07em; color: var(--ink-3);
}

.supervisors-list { display: flex; flex-direction: column; }

.supervisor-row {
  display: grid;
  grid-template-columns: 1fr 1fr 100px;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid var(--rule);
  transition: background .15s var(--ease);
  animation: rowIn .3s var(--ease) both;
}
.supervisor-row:nth-child(1) { animation-delay: .05s; }
.supervisor-row:nth-child(2) { animation-delay: .10s; }
.supervisor-row:nth-child(3) { animation-delay: .15s; }
.supervisor-row:last-child { border-bottom: none; }
.supervisor-row:hover { background: var(--brand-soft); }

@keyframes rowIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: none; }
}

.supervisor-identity {
  display: flex; align-items: center; gap: 14px; min-width: 0;
}
.supervisor-avatar {
  width: 42px; height: 42px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--brand) 0%, var(--brand-mid) 100%);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  font-family: 'Syne', sans-serif;
  font-size: .85rem; font-weight: 700; color: #fff;
  box-shadow: 0 2px 8px rgba(95,0,118,.25);
}
.supervisor-info { min-width: 0; }
.supervisor-name {
  font-size: .9375rem; font-weight: 700; color: var(--ink);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  text-decoration: none;
  transition: color .15s var(--ease);
  cursor: pointer;
  background: none; border: none; padding: 0; font-family: 'DM Sans', sans-serif;
}
.supervisor-name:hover { color: var(--brand); }
.supervisor-id {
  font-size: .72rem; color: var(--ink-3); margin-top: 1px; font-weight: 500;
}

.supervisor-office {
  display: flex; align-items: center; gap: 8px; min-width: 0;
}
.supervisor-office svg { width: 14px; height: 14px; stroke: var(--ink-3); fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; flex-shrink: 0; }
.office-name {
  font-size: .8125rem; color: var(--ink-2);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

.supervisor-actions { display: flex; align-items: center; gap: 6px; }
.action-btn {
  width: 34px; height: 34px;
  border: none; border-radius: var(--r-md);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all .18s var(--ease);
}
.action-btn svg { width: 16px; height: 16px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.action-view   { background: #dbeafe; color: var(--blue); }
.action-view:hover  { background: var(--blue); color: #fff; transform: scale(1.1); }
.action-edit   { background: #ffedd5; color: var(--orange); }
.action-edit:hover  { background: var(--orange); color: #fff; transform: scale(1.1); }
.action-delete { background: #fee2e2; color: var(--red); }
.action-delete:hover { background: var(--red); color: #fff; transform: scale(1.1); }

/* ─── TOOLTIP ───────────────────────────── */
.action-btn { position: relative; }
.action-btn[title]:hover::after {
  content: attr(title);
  position: absolute; bottom: calc(100% + 6px); left: 50%; transform: translateX(-50%);
  background: var(--ink); color: #fff;
  font-size: .72rem; font-weight: 600; white-space: nowrap;
  padding: 4px 8px; border-radius: var(--r-sm);
  pointer-events: none; z-index: 20;
}

@media (max-width: 840px) {
  .page-content { padding: 20px 16px 40px; }
  .list-col-header { grid-template-columns: 1fr 1fr 80px; }
  .supervisor-row { grid-template-columns: 1fr 1fr 80px; }
}
@media (max-width: 640px) {
  .page-header { flex-direction: column; gap: 12px; }
  .filters-bar { flex-wrap: wrap; }
  .search-wrap { max-width: 100%; }
  .list-col-header { display: none; }
  .supervisor-row { grid-template-columns: 1fr; gap: 10px; }
  .supervisor-actions { justify-content: flex-start; }
}`;

  return (
    <AdminLayout activeMenu="supervisors">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* ─── TOPBAR ─────────────────────────── */}
      <div className="topbar">
        <div className="topbar-breadcrumb">
          <span>Admin</span>
          <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
          <span className="crumb-active">Supervisors</span>
        </div>
        <div className="topbar-right">
          <button className="topbar-btn" title="Notifications">
            <svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          </button>
          <button className="topbar-btn" title="Print" onClick={() => window.print()}>
            <svg viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          </button>
        </div>
      </div>

      <div className="page-content">

        {/* page header */}
        <div className="page-header">
          <div>
            <div className="page-header-title">Supervisor Management</div>
            <div className="page-header-sub">Manage and monitor assigned supervisors and their offices</div>
          </div>
          <div className="header-actions">
            <button className="btn-ghost" onClick={handleExport}>
              <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Export
            </button>
            <button className="btn-primary" onClick={() => history.push('/admin-add-supervisor')}>
              <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Supervisor
            </button>
          </div>
        </div>

        {/* filters */}
        <div className="filters-bar">
          <div className="search-wrap">
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input className="search-input" type="text" placeholder="Search by name or office…" />
          </div>
          <div className="filter-sep"></div>
          <label className="filter-label" htmlFor="of">Office</label>
          <select className="filter-select" id="of">
            <option value="all">All Offices</option>
            <option value="lto">LTO Office</option>
            <option value="deped">DepEd Office</option>
            <option value="mun">Municipal Hall</option>
          </select>
        </div>

        {/* supervisors list */}
        <div className="supervisors-section">
          <div className="section-head">
            <div className="section-head-title">
              Supervisors Directory
              <span className="count-badge">1 entry</span>
            </div>
            <button className="btn-ghost">
              <svg viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
              View All
            </button>
          </div>

          <div className="list-col-header">
            <div className="col-label">Supervisor</div>
            <div className="col-label">Assigned Office</div>
            <div className="col-label">Actions</div>
          </div>

          <div className="supervisors-list">

            {/* ── Row: William Shakespear / SUP-00101 ── */}
            <div className="supervisor-row">
              <div className="supervisor-identity">
                <div className="supervisor-avatar">WS</div>
                <div className="supervisor-info">
                  <button
                    className="supervisor-name"
                    onClick={() => goView('SUP-00101')}
                  >
                    William Shakespear
                  </button>
                  <div className="supervisor-id">SUP-00101</div>
                </div>
              </div>

              <div className="supervisor-office">
                <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                <span className="office-name">LTO Office – Candon City</span>
              </div>

              <div className="supervisor-actions">
                {/* View */}
                <button
                  className="action-btn action-view"
                  title="View"
                  onClick={() => goView('SUP-00101')}
                >
                  <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>

                {/* Edit → navigates to detail with edit intent */}
                <button
                  className="action-btn action-edit"
                  title="Edit"
                  onClick={() => goEdit('SUP-00101')}
                >
                  <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>

                {/* Delete → navigates to detail with delete intent */}
                <button
                  className="action-btn action-delete"
                  title="Delete"
                  onClick={() => goDelete('SUP-00101')}
                >
                  <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      <LogoutModal
        isOpen={showModal}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        isLoading={isLoggingOut}
        onComplete={handleLogoutComplete}
      />
    </AdminLayout>
  );
};

export default AdminSupervisors;