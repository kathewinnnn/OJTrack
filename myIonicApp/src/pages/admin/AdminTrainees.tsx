import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import LogoutModal from '../../components/LogoutModal';

// Trainee data type
interface Trainee {
  id: string;
  name: string;
  initials: string;
  startDate: string;
  office: string;
  status: 'active' | 'inactive';
}

// Sample trainee data
const traineeData: Trainee[] = [
  { id: 'A23-00502', name: 'Katherine Mae Guzman', initials: 'KG', startDate: 'Jan 15, 2024', office: 'ISPSC Sta. Maria – CCS', status: 'active' },
  { id: 'A23-00503', name: 'Mark Raffy D. Romero', initials: 'MR', startDate: 'Feb 10, 2024', office: 'ISPSC Main – Engineering Dept.', status: 'active' },
  { id: 'A23-00504', name: 'Samantha Nicole B. Lumpaodan', initials: 'SL', startDate: 'Nov 20, 2023', office: 'ISPSC Alfonso Lista – Business Admin.', status: 'inactive' },
];

export const TRAINEE_NAV_KEY = 'trainee_nav_intent';
export type TraineeNavIntent = { action: 'edit' | 'delete'; traineeId: string };

const AdminTrainees: React.FC = () => {
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleCancel = () => { setShowModal(false); setIsLoggingOut(false); };
  const handleConfirm = () => { setIsLoggingOut(true); };
  const handleLogoutComplete = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
  };

  // Export to CSV function
  const handleExport = () => {
    const headers = ['ID', 'Name', 'Start Date', 'Office', 'Status'];
    const csvContent = [
      headers.join(','),
      ...traineeData.map(t => [
        t.id,
        `"${t.name}"`,
        t.startDate,
        `"${t.office}"`,
        t.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `trainees_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const goToDetail = (traineeId: string) => { history.push(`/admin-trainee-detail`); };
  const goToEdit = (traineeId: string) => {
    const intent: TraineeNavIntent = { action: 'edit', traineeId };
    localStorage.setItem(TRAINEE_NAV_KEY, JSON.stringify(intent));
    history.push(`/admin-trainee-detail`);
  };
  const goToDelete = (traineeId: string) => {
    const intent: TraineeNavIntent = { action: 'delete', traineeId };
    localStorage.setItem(TRAINEE_NAV_KEY, JSON.stringify(intent));
    history.push(`/admin-trainee-detail`);
  };

  return (
    <AdminLayout activeMenu="trainees">
      <style>{`
.topbar { height: 60px; background: var(--surface); border-bottom: 1px solid var(--rule); display: flex; align-items: center; justify-content: space-between; padding: 0 32px; position: sticky; top: 0; z-index: 5; box-shadow: var(--sh-sm); }
.topbar-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: .85rem; color: var(--ink-3); }
.topbar-breadcrumb .crumb-active { color: var(--ink); font-weight: 600; }
.topbar-breadcrumb svg { width: 14px; height: 14px; stroke: var(--ink-3); fill: none; stroke-width: 2; stroke-linecap: round; }
.topbar-breadcrumb .bc-link { color: var(--ink-3); cursor: pointer; background: none; border: none; font-size: .85rem; font-family: 'DM Sans', sans-serif; transition: color .15s; padding: 0; }
.topbar-breadcrumb .bc-link:hover { color: var(--brand); }
.topbar-right { display: flex; align-items: center; gap: 12px; }
.topbar-btn { width: 36px; height: 36px; border-radius: var(--r-md); border: 1px solid var(--rule); background: var(--bg); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .18s var(--ease); color: var(--ink-2); }
.topbar-btn:hover { background: var(--brand-soft); border-color: var(--brand-glow); color: var(--brand); }
.topbar-btn svg { width: 18px; height: 18px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

.page-content { padding: 28px 32px 48px; flex: 1; }
.page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 28px; }
.page-header-title { font-family: 'Syne', sans-serif; font-size: 1.6rem; font-weight: 800; color: var(--ink); letter-spacing: -.02em; line-height: 1.1; }
.page-header-sub { margin-top: 5px; font-size: .875rem; color: var(--ink-3); font-weight: 400; }
.header-actions { display: flex; gap: 10px; align-items: center; }

.btn-primary { display: inline-flex; align-items: center; gap: 7px; padding: 10px 20px; background: var(--brand); color: #fff; border: none; border-radius: var(--r-md); font-size: .875rem; font-weight: 600; cursor: pointer; transition: all .2s var(--ease); box-shadow: 0 2px 8px rgba(95,0,118,.3); font-family: 'DM Sans', sans-serif; }
.btn-primary:hover { background: var(--brand-dark); transform: translateY(-1px); }
.btn-primary svg { width: 16px; height: 16px; stroke: currentColor; fill: none; stroke-width: 2.5; stroke-linecap: round; }
.btn-ghost { display: inline-flex; align-items: center; gap: 7px; padding: 10px 16px; background: var(--surface); color: var(--ink-2); border: 1px solid var(--rule); border-radius: var(--r-md); font-size: .875rem; font-weight: 500; cursor: pointer; transition: all .2s var(--ease); font-family: 'DM Sans', sans-serif; }
.btn-ghost:hover { background: var(--bg); border-color: var(--brand-glow); color: var(--brand); }
.btn-ghost svg { width: 16px; height: 16px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; }

/* STATS */
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
.stat-card { background: var(--surface); border: 1px solid var(--rule); border-radius: var(--r-lg); padding: 20px; display: flex; align-items: center; gap: 16px; box-shadow: var(--sh-sm); transition: all .22s var(--ease); }
.stat-card:hover { transform: translateY(-2px); box-shadow: var(--sh-md); border-color: var(--brand-glow); }
.stat-icon-wrap { width: 48px; height: 48px; border-radius: var(--r-md); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.stat-icon-wrap svg { width: 24px; height: 24px; stroke: #fff; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.ic-total { background: linear-gradient(135deg,#667eea,#764ba2); }
.ic-active { background: linear-gradient(135deg,#0d7a55,#22c78a); }
.ic-offices { background: linear-gradient(135deg,#d0569b,#f5576c); }
.ic-rate { background: linear-gradient(135deg,#1a80e5,#2dd4f5); }
.stat-label { font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: var(--ink-3); }
.stat-val { font-family: 'Syne', sans-serif; font-size: 1.8rem; font-weight: 800; color: var(--ink); line-height: 1.1; }

/* FILTERS */
.filters-bar { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; background: var(--surface); border: 1px solid var(--rule); border-radius: var(--r-lg); padding: 14px 20px; box-shadow: var(--sh-sm); }
.search-wrap { position: relative; flex: 1; max-width: 420px; }
.search-wrap svg { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; stroke: var(--ink-3); fill: none; stroke-width: 2; stroke-linecap: round; pointer-events: none; }
.search-input { width: 100%; padding: 9px 12px 9px 36px; border: 1.5px solid var(--rule); border-radius: var(--r-full); font-size: .875rem; color: var(--ink); background: var(--bg); font-family: 'DM Sans', sans-serif; transition: all .18s var(--ease); outline: none; }
.search-input::placeholder { color: var(--ink-3); }
.search-input:focus { border-color: var(--brand); background: #fff; box-shadow: 0 0 0 3px var(--brand-glow); }
.filter-sep { width: 1px; height: 28px; background: var(--rule); flex-shrink: 0; }
.filter-label { font-size: .8rem; font-weight: 600; color: var(--ink-3); white-space: nowrap; }
.filter-select { padding: 8px 32px 8px 12px; border: 1.5px solid var(--rule); border-radius: var(--r-md); font-size: .875rem; color: var(--ink); background: var(--bg); cursor: pointer; font-family: 'DM Sans', sans-serif; outline: none; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237b6e89' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; transition: all .18s var(--ease); }
.filter-select:focus { border-color: var(--brand); box-shadow: 0 0 0 3px var(--brand-glow); }

/* TABLE */
.trainees-section { background: var(--surface); border: 1px solid var(--rule); border-radius: var(--r-xl); box-shadow: var(--sh-sm); overflow: hidden; }
.section-head { display: flex; align-items: center; justify-content: space-between; padding: 18px 24px; border-bottom: 1px solid var(--rule); }
.section-head-title { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700; color: var(--ink); display: flex; align-items: center; gap: 10px; }
.count-badge { font-family: 'DM Sans', sans-serif; font-size: .72rem; font-weight: 700; background: var(--brand-soft); color: var(--brand); padding: 3px 10px; border-radius: var(--r-full); border: 1px solid rgba(95,0,118,.12); }

/* ── Grid: wider Office column, Status gets fixed width ── */
.list-col-header { display: grid; grid-template-columns: 1.5fr 1.3fr 150px 100px; gap: 0; padding: 10px 24px; background: var(--bg); border-bottom: 1px solid var(--rule); }
.col-label { font-size: .7rem; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: var(--ink-3); }

.trainees-list { display: flex; flex-direction: column; }
.trainee-row { display: grid; grid-template-columns: 1.5fr 1.3fr 150px 100px; align-items: center; gap: 0; padding: 16px 24px; border-bottom: 1px solid var(--rule); transition: background .15s var(--ease); animation: rowIn .3s var(--ease) both; }
@keyframes rowIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
.trainee-row:last-child { border-bottom: none; }
.trainee-row:hover { background: var(--brand-soft); }

.trainee-identity { display: flex; align-items: center; gap: 14px; min-width: 0; padding-right: 20px; }
.trainee-avatar { width: 42px; height: 42px; border-radius: 50%; background: linear-gradient(135deg, var(--brand) 0%, var(--brand-mid) 100%); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-family: 'Syne', sans-serif; font-size: .85rem; font-weight: 700; color: #fff; box-shadow: 0 2px 8px rgba(95,0,118,.25); }
.trainee-info { min-width: 0; }
.trainee-name { font-size: .9375rem; font-weight: 700; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.trainee-id { font-size: .72rem; color: var(--ink-3); margin-top: 1px; font-weight: 500; }

.trainee-office { display: flex; align-items: center; gap: 8px; min-width: 0; padding-right: 24px; }
.trainee-office svg { width: 14px; height: 14px; stroke: var(--ink-3); fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; flex-shrink: 0; }
.office-name { font-size: .8125rem; color: var(--ink-2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 500; }

/* ── STATUS BADGES — polished pill with icon ── */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 5px 12px 5px 6px;
  border-radius: var(--r-full);
  font-size: .775rem;
  font-weight: 700;
  letter-spacing: .02em;
  white-space: nowrap;
  width: fit-content;
}

.status-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.status-icon svg {
  width: 10px;
  height: 10px;
  fill: none;
  stroke: #fff;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* Active — rich green */
.status-active {
  background: linear-gradient(135deg, #d1fae5 0%, #ecfdf5 100%);
  color: #065f46;
  border: 1.5px solid #6ee7b7;
  box-shadow: 0 2px 6px rgba(6,95,70,.12), inset 0 1px 0 rgba(255,255,255,.6);
}
.status-active .status-icon {
  background: linear-gradient(135deg, #059669, #10b981);
  box-shadow: 0 1px 4px rgba(5,150,105,.35);
}

/* Inactive — warm amber */
.status-inactive {
  background: linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%);
  color: #78350f;
  border: 1.5px solid #fcd34d;
  box-shadow: 0 2px 6px rgba(120,53,15,.1), inset 0 1px 0 rgba(255,255,255,.6);
}
.status-inactive .status-icon {
  background: linear-gradient(135deg, #d97706, #f59e0b);
  box-shadow: 0 1px 4px rgba(217,119,6,.35);
}

.trainee-actions { display: flex; align-items: center; gap: 6px; }
.action-btn { width: 34px; height: 34px; border: none; border-radius: var(--r-md); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .18s var(--ease); }
.action-btn svg { width: 16px; height: 16px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.action-view { background: #dbeafe; color: #1456cc; }
.action-view:hover { background: #1456cc; color: #fff; transform: scale(1.1); }
.action-edit { background: #ffedd5; color: #d95b00; }
.action-edit:hover { background: #d95b00; color: #fff; transform: scale(1.1); }
.action-delete { background: #fee2e2; color: #c0303b; }
.action-delete:hover { background: #c0303b; color: #fff; transform: scale(1.1); }

:root { --ok: #0d7a55; --ok-bg: #d6f4e9; --ok-ring: #9de8cb; --warn: #8a3a00; --warn-bg: #fde9d4; --warn-ring: #fbc49a; --red: #c0303b; }

@media (max-width: 1100px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } .list-col-header, .trainee-row { grid-template-columns: 1.3fr 1.1fr 140px 90px; } }
@media (max-width: 840px) { .list-col-header { display: none; } .trainee-row { grid-template-columns: 1fr; gap: 12px; } .trainee-office { margin-left: 56px; padding-right: 0; } .trainee-actions { margin-left: 56px; } .page-content { padding: 20px 16px 40px; } .topbar { padding: 0 16px; } }
@media (max-width: 600px) { .stats-grid { grid-template-columns: 1fr 1fr; } .filters-bar { flex-wrap: wrap; } .search-wrap { max-width: 100%; } .page-header { flex-direction: column; gap: 12px; } }
      `}</style>

      {/* ─── TOPBAR ─────────────────────────── */}
      <div className="topbar">
        <div className="topbar-breadcrumb">
          <button className="bc-link" onClick={() => history.push('/admin-dashboard')}>Admin</button>
          <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
          <span className="crumb-active">Trainees</span>
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

      {/* ─── PAGE CONTENT ────────────────────── */}
      <div className="page-content">

        <div className="page-header">
          <div>
            <div className="page-header-title">Trainee Management</div>
            <div className="page-header-sub">Oversee and manage trainee information, assignments, and progress tracking</div>
          </div>
          <div className="header-actions">
            <button className="btn-ghost" onClick={handleExport}>
              <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Export
            </button>
            <button className="btn-primary" onClick={() => history.push('/admin-add-trainee')}>
              <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add New Trainee
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon-wrap ic-total">
              <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div><div className="stat-label">Total Trainees</div><div className="stat-val">3</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrap ic-active">
              <svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <div><div className="stat-label">Active Trainees</div><div className="stat-val">2</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrap ic-offices">
              <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <div><div className="stat-label">Partner Offices</div><div className="stat-val">3</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrap ic-rate">
              <svg viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            </div>
            <div><div className="stat-label">Active Rate</div><div className="stat-val">67%</div></div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <div className="search-wrap">
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input className="search-input" type="text" placeholder="Search by name, ID, or office…" />
          </div>
          <div className="filter-sep"></div>
          <label className="filter-label" htmlFor="sf">Status</label>
          <select className="filter-select" id="sf">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Trainees Table */}
        <div className="trainees-section">
          <div className="section-head">
            <div className="section-head-title">
              Trainees Directory
              <span className="count-badge">3 entries</span>
            </div>
          </div>

          <div className="list-col-header">
            <div className="col-label">Trainee</div>
            <div className="col-label">Office</div>
            <div className="col-label">Status</div>
            <div className="col-label">Actions</div>
          </div>

          <div className="trainees-list">

            {/* Row 1 */}
            <div className="trainee-row">
              <div className="trainee-identity">
                <div className="trainee-avatar">KG</div>
                <div className="trainee-info">
                  <div className="trainee-name">Katherine Mae Guzman</div>
                  <div className="trainee-id">A23-00502 &nbsp;·&nbsp;
                    <span style={{display:'inline-flex',alignItems:'center',gap:'4px'}}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      Jan 15, 2024
                    </span>
                  </div>
                </div>
              </div>
              <div className="trainee-office">
                <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                <span className="office-name">ISPSC Sta. Maria – CCS</span>
              </div>
              <div>
                <span className="status-badge status-active">
                  <span className="status-icon">
                    <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                  </span>
                  Active
                </span>
              </div>
              <div className="trainee-actions">
                <button className="action-btn action-view" title="View" onClick={() => goToDetail('A23-00502')}><svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
                <button className="action-btn action-edit" title="Edit" onClick={() => goToEdit('A23-00502')}><svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                <button className="action-btn action-delete" title="Delete" onClick={() => goToDelete('A23-00502')}><svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg></button>
              </div>
            </div>

            {/* Row 2 */}
            <div className="trainee-row">
              <div className="trainee-identity">
                <div className="trainee-avatar">MR</div>
                <div className="trainee-info">
                  <div className="trainee-name">Mark Raffy D. Romero</div>
                  <div className="trainee-id">A23-00503 &nbsp;·&nbsp;
                    <span style={{display:'inline-flex',alignItems:'center',gap:'4px'}}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      Feb 10, 2024
                    </span>
                  </div>
                </div>
              </div>
              <div className="trainee-office">
                <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                <span className="office-name">ISPSC Main – Engineering Dept.</span>
              </div>
              <div>
                <span className="status-badge status-active">
                  <span className="status-icon">
                    <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                  </span>
                  Active
                </span>
              </div>
              <div className="trainee-actions">
                <button className="action-btn action-view" title="View" onClick={() => goToDetail('A23-00503')}><svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
                <button className="action-btn action-edit" title="Edit" onClick={() => goToEdit('A23-00503')}><svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                <button className="action-btn action-delete" title="Delete" onClick={() => goToDelete('A23-00503')}><svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg></button>
              </div>
            </div>

            {/* Row 3 */}
            <div className="trainee-row">
              <div className="trainee-identity">
                <div className="trainee-avatar" style={{background:'linear-gradient(135deg,#8a3a00,#d97706)'}}>SL</div>
                <div className="trainee-info">
                  <div className="trainee-name">Samantha Nicole B. Lumpaodan</div>
                  <div className="trainee-id">A23-00504 &nbsp;·&nbsp;
                    <span style={{display:'inline-flex',alignItems:'center',gap:'4px'}}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      Nov 20, 2023
                    </span>
                  </div>
                </div>
              </div>
              <div className="trainee-office">
                <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                <span className="office-name">ISPSC Alfonso Lista – Business Admin.</span>
              </div>
              <div>
                <span className="status-badge status-inactive">
                  <span className="status-icon">
                    <svg viewBox="0 0 24 24"><line x1="12" y1="8" x2="12" y2="12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/><circle cx="12" cy="15.5" r="1" fill="#fff" stroke="none"/></svg>
                  </span>
                  Inactive
                </span>
              </div>
              <div className="trainee-actions">
                <button className="action-btn action-view" title="View" onClick={() => goToDetail('A23-00504')}><svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
                <button className="action-btn action-edit" title="Edit" onClick={() => goToEdit('A23-00504')}><svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                <button className="action-btn action-delete" title="Delete" onClick={() => goToDelete('A23-00504')}><svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg></button>
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

export default AdminTrainees;