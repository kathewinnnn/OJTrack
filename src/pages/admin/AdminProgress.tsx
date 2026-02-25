import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import LogoutModal from '../../components/LogoutModal';

// Progress data type
interface ProgressRecord {
  id: string;
  name: string;
  initials: string;
  office: string;
  progress: number;
  status: 'on-track' | 'at-risk' | 'behind';
}

// Sample progress data
const progressData: ProgressRecord[] = [
  { id: 'A23-00502', name: 'Katherine Mae Guzman', initials: 'KG', office: 'ISPSC Sta. Maria – CCS', progress: 70, status: 'on-track' },
  { id: 'A23-00503', name: 'Samantha Lumpaodan', initials: 'SL', office: 'ISPSC Main – Engineering', progress: 50, status: 'on-track' },
  { id: 'A23-00504', name: 'Mark Raffy Romero', initials: 'MR', office: 'ISPSC Alfonso Lista – Business Admin', progress: 40, status: 'at-risk' },
];

/* ── icon SVG per status ── */
const STATUS_ICON: Record<string, React.ReactNode> = {
  'on-track': (
    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  'at-risk': (
    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="7" x2="12" y2="12"/>
      <circle cx="12" cy="15.5" r="1" fill="#fff" stroke="none"/>
    </svg>
  ),
  'behind': (
    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
};

const AdminProgress: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const history = useHistory();

  const handleConfirm = () => {
    setIsLoggingOut(true);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    const loginPath = '/login';
    window.history.pushState({ path: loginPath }, '', loginPath);
    try {
      if (window.self !== window.top) {
        const parentWindow = window.parent;
        if (parentWindow && parentWindow.history) {
          parentWindow.history.pushState({ path: loginPath }, '', loginPath);
        }
      }
    } catch (e) { /* ignore */ }
    history.push('/login');
  };

  const handleCancel = () => setShowModal(false);
  const handleLogoutComplete = () => setIsLoggingOut(false);

  // Export to CSV function
  const handleExport = () => {
    const headers = ['ID', 'Name', 'Office', 'Progress', 'Status'];
    const csvContent = [
      headers.join(','),
      ...progressData.map(p => [
        p.id,
        `"${p.name}"`,
        `"${p.office}"`,
        `${p.progress}%`,
        p.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `progress_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
  --ok:           #0d7a55;
  --ok-bg:        #d6f4e9;
  --ok-ring:      #9de8cb;
  --warn:         #8a5a00;
  --warn-bg:      #fef3c7;
  --warn-ring:    #fcd34d;
  --danger:       #c0303b;
  --danger-bg:    #fee2e2;
  --danger-ring:  #fca5a5;
  --blue:         #1456cc;
  --orange:       #d95b00;
  --red:          #c0303b;
  --r-sm:  6px; --r-md:  10px; --r-lg:  16px; --r-xl:  22px; --r-full:9999px;
  --sh-sm:  0 1px 3px rgba(0,0,0,.06);
  --sh-md:  0 4px 12px rgba(0,0,0,.08);
  --sh-lg:  0 12px 32px rgba(0,0,0,.10);
  --sidebar-w: 252px;
  --ease: cubic-bezier(.4,0,.2,1);
}

html, body { height: 100%; font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--ink); }
.shell { display: flex; min-height: 100vh; }

/* ─── SIDEBAR ─── */
.sidebar {
  width: var(--sidebar-w); flex-shrink: 0; background: var(--brand-dark);
  display: flex; flex-direction: column; position: sticky; top: 0;
  height: 100vh; overflow-y: auto; z-index: 10;
}
.sidebar-logo { padding: 28px 24px 20px; border-bottom: 1px solid rgba(255,255,255,.08); }
.sidebar-logo-mark { display: flex; align-items: center; gap: 10px; }
.sidebar-logo-icon {
  width: 36px; height: 36px; background: linear-gradient(135deg, var(--brand-mid), #c752f0);
  border-radius: var(--r-md); display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.sidebar-logo-icon svg { stroke: #fff; }
.sidebar-logo-text { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700; color: #fff; letter-spacing: .01em; line-height: 1.2; }
.sidebar-logo-sub { font-size: .7rem; color: rgba(255,255,255,.45); font-weight: 400; letter-spacing: .04em; text-transform: uppercase; }
.sidebar-profile { padding: 20px 24px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid rgba(255,255,255,.08); }
.sidebar-avatar {
  width: 42px; height: 42px; border-radius: 50%;
  background: linear-gradient(135deg, var(--brand-mid) 0%, #c752f0 100%);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  font-family: 'Syne', sans-serif; font-size: .95rem; font-weight: 700; color: #fff;
}
.sidebar-profile-info { min-width: 0; }
.sidebar-profile-name { font-size: .9rem; font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sidebar-profile-role { font-size: .75rem; color: rgba(255,255,255,.45); }
.sidebar-nav { flex: 1; padding: 16px 12px; }
.nav-section-label { font-size: .65rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: rgba(255,255,255,.3); padding: 8px 12px 6px; }
.sidebar-nav ul { list-style: none; display: flex; flex-direction: column; gap: 2px; }
.sidebar-nav a {
  display: flex; align-items: center; gap: 10px; padding: 9px 12px;
  border-radius: var(--r-md); color: rgba(255,255,255,.6);
  text-decoration: none; font-size: .875rem; font-weight: 500; transition: all .18s var(--ease);
}
.sidebar-nav a:hover { background: rgba(255,255,255,.08); color: #fff; }
.sidebar-nav a.active { background: rgba(255,255,255,.13); color: #fff; font-weight: 600; }
.sidebar-nav a.active .nav-icon { opacity: 1; }
.nav-icon { width: 18px; height: 18px; opacity: .6; flex-shrink: 0; }
.sidebar-footer { padding: 12px; border-top: 1px solid rgba(255,255,255,.08); }
.sidebar-footer a {
  display: flex; align-items: center; gap: 10px; padding: 9px 12px;
  border-radius: var(--r-md); color: rgba(255,255,255,.5);
  text-decoration: none; font-size: .875rem; font-weight: 500; transition: all .18s var(--ease);
}
.sidebar-footer a:hover { background: rgba(255,0,0,.12); color: #ff7070; }

/* ─── MAIN ─── */
.main { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.topbar {
  height: 60px; background: var(--surface); border-bottom: 1px solid var(--rule);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 32px; position: sticky; top: 0; z-index: 5; box-shadow: var(--sh-sm);
}
.topbar-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: .85rem; color: var(--ink-3); }
.topbar-breadcrumb .crumb-active { color: var(--ink); font-weight: 600; }
.topbar-breadcrumb svg { width: 14px; height: 14px; stroke: var(--ink-3); }
.topbar-right { display: flex; align-items: center; gap: 12px; }
.topbar-btn {
  width: 36px; height: 36px; border-radius: var(--r-md); border: 1px solid var(--rule);
  background: var(--bg); display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all .18s var(--ease); color: var(--ink-2);
}
.topbar-btn:hover { background: var(--brand-soft); border-color: var(--brand-glow); color: var(--brand); }
.topbar-btn svg { width: 18px; height: 18px; stroke: currentColor; }

/* ─── PAGE ─── */
.page-content { padding: 28px 32px 48px; flex: 1; }
.page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 28px; }
.page-header-title { font-family: 'Syne', sans-serif; font-size: 1.6rem; font-weight: 800; color: var(--ink); letter-spacing: -.02em; line-height: 1.1; }
.page-header-sub { margin-top: 5px; font-size: .875rem; color: var(--ink-3); font-weight: 400; }
.header-actions { display: flex; gap: 10px; align-items: center; }
.btn-ghost {
  display: inline-flex; align-items: center; gap: 7px; padding: 10px 16px;
  background: var(--surface); color: var(--ink-2); border: 1px solid var(--rule);
  border-radius: var(--r-md); font-size: .875rem; font-weight: 500; cursor: pointer;
  transition: all .2s var(--ease); font-family: 'DM Sans', sans-serif;
}
.btn-ghost:hover { background: var(--brand-soft); border-color: var(--brand-glow); color: var(--brand); }
.btn-ghost svg { width: 16px; height: 16px; stroke: currentColor; }

/* ─── STATS ─── */
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
.stat-card {
  background: var(--surface); border: 1px solid var(--rule); border-radius: var(--r-lg);
  padding: 20px; display: flex; align-items: center; gap: 16px;
  box-shadow: var(--sh-sm); transition: all .22s var(--ease); cursor: default;
}
.stat-card:hover { transform: translateY(-2px); box-shadow: var(--sh-md); border-color: var(--brand-glow); }
.stat-icon-wrap { width: 48px; height: 48px; border-radius: var(--r-md); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.stat-icon-wrap svg { width: 24px; height: 24px; stroke: #fff; }
.ic-total    { background: linear-gradient(135deg,#667eea,#764ba2); }
.ic-on-track { background: linear-gradient(135deg,#0d7a55,#22c78a); }
.ic-at-risk  { background: linear-gradient(135deg,#d97706,#f59e0b); }
.ic-avg      { background: linear-gradient(135deg,#1a80e5,#2dd4f5); }
.stat-label { font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: var(--ink-3); }
.stat-val { font-family: 'Syne', sans-serif; font-size: 1.8rem; font-weight: 800; color: var(--ink); line-height: 1.1; }

/* ─── FILTERS ─── */
.filters-bar {
  display: flex; align-items: center; gap: 12px; margin-bottom: 20px;
  background: var(--surface); border: 1px solid var(--rule);
  border-radius: var(--r-lg); padding: 14px 20px; box-shadow: var(--sh-sm);
}
.search-wrap { position: relative; flex: 1; max-width: 420px; }
.search-wrap svg { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; stroke: var(--ink-3); pointer-events: none; }
.search-input {
  width: 100%; padding: 9px 12px 9px 36px; border: 1.5px solid var(--rule);
  border-radius: var(--r-full); font-size: .875rem; color: var(--ink); background: var(--bg);
  font-family: 'DM Sans', sans-serif; transition: all .18s var(--ease); outline: none;
}
.search-input::placeholder { color: var(--ink-3); }
.search-input:focus { border-color: var(--brand); background: #fff; box-shadow: 0 0 0 3px var(--brand-glow); }
.filter-sep { width: 1px; height: 28px; background: var(--rule); flex-shrink: 0; }
.filter-label { font-size: .8rem; font-weight: 600; color: var(--ink-3); white-space: nowrap; }
.filter-select {
  padding: 8px 32px 8px 12px; border: 1.5px solid var(--rule); border-radius: var(--r-md);
  font-size: .875rem; color: var(--ink); background: var(--bg); cursor: pointer;
  font-family: 'DM Sans', sans-serif; outline: none; appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237b6e89' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 10px center; transition: all .18s var(--ease);
}
.filter-select:focus { border-color: var(--brand); box-shadow: 0 0 0 3px var(--brand-glow); }

/* ─── PROGRESS SECTION ─── */
.progress-section { background: var(--surface); border: 1px solid var(--rule); border-radius: var(--r-xl); box-shadow: var(--sh-sm); overflow: hidden; }
.section-head { display: flex; align-items: center; justify-content: space-between; padding: 18px 24px; border-bottom: 1px solid var(--rule); }
.section-head-title { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700; color: var(--ink); display: flex; align-items: center; gap: 10px; }
.count-badge { font-family: 'DM Sans', sans-serif; font-size: .72rem; font-weight: 700; background: var(--brand-soft); color: var(--brand); padding: 3px 10px; border-radius: var(--r-full); border: 1px solid rgba(95,0,118,.12); }
.btn-ghost-sm {
  display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px;
  background: var(--bg); color: var(--ink-2); border: 1px solid var(--rule);
  border-radius: var(--r-md); font-size: .8rem; font-weight: 500; cursor: pointer;
  transition: all .2s var(--ease); font-family: 'DM Sans', sans-serif;
}
.btn-ghost-sm:hover { background: var(--brand-soft); border-color: var(--brand-glow); color: var(--brand); }
.btn-ghost-sm svg { width: 14px; height: 14px; stroke: currentColor; }

.list-col-header { display: grid; grid-template-columns: 1fr 80px 1.8fr 130px; padding: 10px 24px; background: var(--bg); border-bottom: 1px solid var(--rule); }
.col-label { font-size: .7rem; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: var(--ink-3); }

.progress-list { display: flex; flex-direction: column; }
.progress-row {
  display: grid; grid-template-columns: 1fr 80px 1.8fr 130px;
  align-items: center; gap: 0; padding: 18px 24px; border-bottom: 1px solid var(--rule);
  transition: background .15s var(--ease); animation: rowIn .35s var(--ease) both;
}
.progress-row:nth-child(1) { animation-delay: .05s; }
.progress-row:nth-child(2) { animation-delay: .12s; }
.progress-row:nth-child(3) { animation-delay: .19s; }
.progress-row:last-child { border-bottom: none; }
.progress-row:hover { background: var(--brand-soft); }
@keyframes rowIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }

.trainee-identity { display: flex; align-items: center; gap: 14px; min-width: 0; }
.trainee-avatar {
  width: 42px; height: 42px; border-radius: 50%;
  background: linear-gradient(135deg, var(--brand) 0%, var(--brand-mid) 100%);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  font-family: 'Syne', sans-serif; font-size: .85rem; font-weight: 700; color: #fff;
  box-shadow: 0 2px 8px rgba(95,0,118,.25);
}
.trainee-info { min-width: 0; }
.trainee-name { font-size: .9375rem; font-weight: 700; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.trainee-id { font-size: .72rem; color: var(--ink-3); margin-top: 1px; font-weight: 500; }

.pct-val { font-family: 'Syne', sans-serif; font-size: 1.1rem; font-weight: 800; color: var(--brand); padding-right: 12px; }

.bar-wrap { padding-right: 24px; }
.bar-track { width: 100%; height: 10px; background: var(--rule); border-radius: var(--r-full); overflow: hidden; }
.bar-fill { height: 100%; border-radius: var(--r-full); transition: width .8s var(--ease); }
.bar-fill.high   { background: linear-gradient(90deg, #0d7a55, #22c78a); }
.bar-fill.mid    { background: linear-gradient(90deg, var(--brand), var(--brand-mid)); }
.bar-fill.low    { background: linear-gradient(90deg, #d97706, #f59e0b); }
.bar-fill.danger { background: linear-gradient(90deg, #c0303b, #f87171); }

/* ── STATUS BADGES — icon-bubble pill (matches all other files) ── */
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
.status-icon svg { width: 10px; height: 10px; }

/* On Track — rich green */
.status-on-track {
  background: linear-gradient(135deg, #d1fae5 0%, #ecfdf5 100%);
  color: #065f46;
  border: 1.5px solid #6ee7b7;
  box-shadow: 0 2px 6px rgba(6,95,70,.12), inset 0 1px 0 rgba(255,255,255,.6);
}
.status-on-track .status-icon {
  background: linear-gradient(135deg, #059669, #10b981);
  box-shadow: 0 1px 4px rgba(5,150,105,.35);
}

/* At Risk — warm amber */
.status-at-risk {
  background: linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%);
  color: #78350f;
  border: 1.5px solid #fcd34d;
  box-shadow: 0 2px 6px rgba(120,53,15,.1), inset 0 1px 0 rgba(255,255,255,.6);
}
.status-at-risk .status-icon {
  background: linear-gradient(135deg, #d97706, #f59e0b);
  box-shadow: 0 1px 4px rgba(217,119,6,.35);
}

/* Behind — vivid red */
.status-behind {
  background: linear-gradient(135deg, #fee2e2 0%, #fff5f5 100%);
  color: #991b1b;
  border: 1.5px solid #fca5a5;
  box-shadow: 0 2px 6px rgba(153,27,27,.1), inset 0 1px 0 rgba(255,255,255,.6);
}
.status-behind .status-icon {
  background: linear-gradient(135deg, #dc2626, #ef4444);
  box-shadow: 0 1px 4px rgba(220,38,38,.35);
}

/* ─── RESPONSIVE ─── */
@media (max-width: 1100px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 840px) {
  :root { --sidebar-w: 60px; }
  .sidebar-logo-text, .sidebar-logo-sub, .sidebar-profile-info,
  .nav-label, .sidebar-footer span, .nav-section-label { display: none; }
  .sidebar-logo { padding: 18px 12px; }
  .sidebar-logo-mark { justify-content: center; }
  .sidebar-profile { padding: 12px; justify-content: center; }
  .sidebar-nav a, .sidebar-footer a { padding: 10px; justify-content: center; gap: 0; }
  .page-content { padding: 20px 16px 40px; }
  .list-col-header { display: none; }
  .progress-row { grid-template-columns: 1fr; gap: 10px; }
  .bar-wrap { padding-right: 0; }
}
@media (max-width: 640px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .page-header { flex-direction: column; gap: 12px; }
  .filters-bar { flex-wrap: wrap; }
  .search-wrap { max-width: 100%; }
}`;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="shell">

        {/* ─── SIDEBAR ─── */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-logo-mark">
              <div className="sidebar-logo-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div>
                <div className="sidebar-logo-text">ISPSC OJT</div>
                <div className="sidebar-logo-sub">Admin Panel</div>
              </div>
            </div>
          </div>

          <div className="sidebar-profile">
            <div className="sidebar-avatar">AU</div>
            <div className="sidebar-profile-info">
              <div className="sidebar-profile-name">Admin User</div>
              <div className="sidebar-profile-role">Administrator</div>
            </div>
          </div>

          <nav className="sidebar-nav">
            <div className="nav-section-label">Main</div>
            <ul>
              <li><a onClick={() => history.push('/admin-dashboard')}>
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                <span className="nav-label">Dashboard</span>
              </a></li>
              <li><a onClick={() => history.push('/admin-trainees')}>
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <span className="nav-label">Trainees</span>
              </a></li>
              <li><a onClick={() => history.push('/admin-supervisors')}>
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
                <span className="nav-label">Supervisors</span>
              </a></li>
              <li><a onClick={() => history.push('/admin-assignment')}>
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2"/>
                  <path d="M10 7H7a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3"/>
                  <path d="M10 3h4v4h-4z"/>
                  <line x1="19" y1="3" x2="19" y2="9"/><line x1="22" y1="6" x2="16" y2="6"/>
                </svg>
                <span className="nav-label">Assignment</span>
              </a></li>
              <li><a onClick={() => history.push('/admin-attendance')}>
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <span className="nav-label">Attendance</span>
              </a></li>
            </ul>
            <div className="nav-section-label" style={{marginTop: '16px'}}>Reports</div>
            <ul>
              <li><a onClick={() => history.push('/admin-reports')}>
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                <span className="nav-label">Reports</span>
              </a></li>
              <li><a href="AdminProgress.html" className="active">
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                <span className="nav-label">Progress</span>
              </a></li>
            </ul>
          </nav>

          <div className="sidebar-footer">
            <a href="#logout" onClick={(e) => { e.preventDefault(); setShowModal(true); }}>
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              <span>Logout</span>
            </a>
          </div>
        </aside>

        {/* ─── MAIN ─── */}
        <div className="main">
          <div className="topbar">
            <div className="topbar-breadcrumb">
              <span>Admin</span>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
              <span className="crumb-active">Progress</span>
            </div>
            <div className="topbar-right">
              <button className="topbar-btn" title="Notifications">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              </button>
              <button className="topbar-btn" title="Print" onClick={() => window.print()}>
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
              </button>
            </div>
          </div>

          <div className="page-content">
            <div className="page-header">
              <div>
                <div className="page-header-title">Trainee Progress</div>
                <div className="page-header-sub">Track OJT completion progress for all active trainees</div>
              </div>
              <div className="header-actions">
              </div>
            </div>

            {/* stats */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon-wrap ic-total">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <div><div className="stat-label">Total Trainees</div><div className="stat-val">3</div></div>
              </div>
              <div className="stat-card">
                <div className="stat-icon-wrap ic-on-track">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                </div>
                <div><div className="stat-label">On Track</div><div className="stat-val">2</div></div>
              </div>
              <div className="stat-card">
                <div className="stat-icon-wrap ic-at-risk">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                </div>
                <div><div className="stat-label">At Risk</div><div className="stat-val">1</div></div>
              </div>
              <div className="stat-card">
                <div className="stat-icon-wrap ic-avg">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                </div>
                <div><div className="stat-label">Avg. Progress</div><div className="stat-val">53%</div></div>
              </div>
            </div>

            {/* filters */}
            <div className="filters-bar">
              <div className="search-wrap">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input className="search-input" type="text" placeholder="Search by name or ID…" />
              </div>
              <div className="filter-sep"></div>
              <label className="filter-label" htmlFor="sf">Status</label>
              <select className="filter-select" id="sf">
                <option value="all">All Status</option>
                <option value="on-track">On Track</option>
                <option value="at-risk">At Risk</option>
                <option value="behind">Behind</option>
              </select>
              <div className="filter-sep"></div>
              <label className="filter-label" htmlFor="of">Office</label>
              <select className="filter-select" id="of">
                <option value="all">All Offices</option>
                <option value="ccs">CCS</option>
                <option value="eng">Engineering</option>
                <option value="bus">Business Admin</option>
              </select>
            </div>

            {/* progress section */}
            <div className="progress-section">
              <div className="section-head">
                <div className="section-head-title">
                  Progress Tracker
                  <span className="count-badge">3 trainees</span>
                </div>
                <button className="btn-ghost-sm" onClick={handleExport}>
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Export CSV
                </button>
              </div>

              <div className="list-col-header">
                <div className="col-label">Trainee</div>
                <div className="col-label">Progress</div>
                <div className="col-label">Completion Bar</div>
                <div className="col-label">Status</div>
              </div>

              <div className="progress-list">

                {/* row 1 – 70% On Track */}
                <div className="progress-row">
                  <div className="trainee-identity">
                    <div className="trainee-avatar">KG</div>
                    <div className="trainee-info">
                      <div className="trainee-name">Katherine Mae Guzman</div>
                      <div className="trainee-id">A23-00502 · ISPSC Sta. Maria – CCS</div>
                    </div>
                  </div>
                  <div className="pct-val">70%</div>
                  <div className="bar-wrap">
                    <div className="bar-track"><div className="bar-fill high" style={{width: '70%'}}></div></div>
                  </div>
                  <div>
                    <span className="status-badge status-on-track">
                      <span className="status-icon">{STATUS_ICON['on-track']}</span>
                      On Track
                    </span>
                  </div>
                </div>

                {/* row 2 – 50% On Track */}
                <div className="progress-row">
                  <div className="trainee-identity">
                    <div className="trainee-avatar" style={{background: 'linear-gradient(135deg,#1456cc,#60a5fa)'}}>SL</div>
                    <div className="trainee-info">
                      <div className="trainee-name">Samantha Lumpaodan</div>
                      <div className="trainee-id">A23-00503 · ISPSC Main – Engineering</div>
                    </div>
                  </div>
                  <div className="pct-val">50%</div>
                  <div className="bar-wrap">
                    <div className="bar-track"><div className="bar-fill mid" style={{width: '50%'}}></div></div>
                  </div>
                  <div>
                    <span className="status-badge status-on-track">
                      <span className="status-icon">{STATUS_ICON['on-track']}</span>
                      On Track
                    </span>
                  </div>
                </div>

                {/* row 3 – 40% At Risk */}
                <div className="progress-row">
                  <div className="trainee-identity">
                    <div className="trainee-avatar" style={{background: 'linear-gradient(135deg,#d97706,#f59e0b)'}}>MR</div>
                    <div className="trainee-info">
                      <div className="trainee-name">Mark Raffy Romero</div>
                      <div className="trainee-id">A23-00504 · ISPSC Alfonso Lista – Business Admin</div>
                    </div>
                  </div>
                  <div className="pct-val" style={{color: '#d97706'}}>40%</div>
                  <div className="bar-wrap">
                    <div className="bar-track"><div className="bar-fill low" style={{width: '40%'}}></div></div>
                  </div>
                  <div>
                    <span className="status-badge status-at-risk">
                      <span className="status-icon">{STATUS_ICON['at-risk']}</span>
                      At Risk
                    </span>
                  </div>
                </div>

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
    </>
  );
};

export default AdminProgress;