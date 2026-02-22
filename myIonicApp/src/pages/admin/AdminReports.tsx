import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import LogoutModal from '../../components/LogoutModal';
import { ReportRecord } from './AdminReportDetail';

const REPORTS_DATA: ReportRecord[] = [
  {
    id: 'A23-00502',
    name: 'Katherine Mae Guzman',
    initials: 'KG',
    course: 'BS Information Technology – 3A',
    date: 'Feb 15, 2026',
    timeIn: '7:30 AM',
    timeOut: '5:00 PM',
    status: 'pending',
    description: 'Completed internship tasks for the day including documentation and testing.',
    attachment: 'report.pdf',
  },
  {
    id: 'A23-00503',
    name: 'Samantha Nicole Lumpaodan',
    initials: 'SR',
    avatarGradient: 'linear-gradient(135deg,#d97706,#f59e0b)',
    course: 'BS Information Technology – 3A',
    date: 'Feb 15, 2026',
    timeIn: '8:30 AM',
    timeOut: '5:00 PM',
    status: 'approved',
    description: 'Assisted with UI design updates and attended team stand-up.',
    attachment: 'daily-report-02-15.pdf',
  },
  {
    id: 'A23-00504',
    name: 'Raffy Romero',
    initials: 'RR',
    avatarGradient: 'linear-gradient(135deg,#c0303b,#f87171)',
    course: 'BS Information Technology – 3B',
    date: 'Feb 14, 2026',
    timeIn: '7:30 AM',
    timeOut: '5:00 PM',
    status: 'declined',
    description: 'Report content was incomplete. Missing task summary and supervisor signature.',
    attachment: 'report-feb14.pdf',
  },
];

/* ── icon SVG per status ── */
const STATUS_ICON: Record<string, React.ReactNode> = {
  pending: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="7" x2="12" y2="12"/>
      <circle cx="12" cy="15.5" r="1" fill="#fff" stroke="none"/>
    </svg>
  ),
  approved: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  declined: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
};

const GRID_COLS = 'minmax(200px,2fr) 160px 148px 148px 176px';

const AdminReports: React.FC = () => {
  const [showModal,    setShowModal]    = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [reports,      setReports]      = useState<ReportRecord[]>(REPORTS_DATA);
  const history = useHistory();

  const handleConfirm = () => {
    setIsLoggingOut(true);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    const p = '/login';
    window.history.pushState({ path: p }, '', p);
    try {
      if (window.self !== window.top && window.parent?.history)
        window.parent.history.pushState({ path: p }, '', p);
    } catch (_) { /* cross-origin */ }
    history.push('/login');
  };
  const handleCancel         = () => setShowModal(false);
  const handleLogoutComplete = () => setIsLoggingOut(false);

  // Export to CSV function
  const handleExport = () => {
    const headers = ['ID', 'Name', 'Course', 'Date', 'Time In', 'Time Out', 'Status', 'Description'];
    const csvContent = [
      headers.join(','),
      ...reports.map(r => [
        r.id,
        `"${r.name}"`,
        `"${r.course}"`,
        r.date,
        r.timeIn,
        r.timeOut,
        r.status,
        `"${r.description.replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reports_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleApprove = (id: string) =>
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
  const handleDecline = (id: string) =>
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'declined' } : r));
  const handleView = (record: ReportRecord) =>
    history.push('/admin-report-detail', { record });

  const pendingCount  = reports.filter(r => r.status === 'pending').length;
  const approvedCount = reports.filter(r => r.status === 'approved').length;
  const declinedCount = reports.filter(r => r.status === 'declined').length;

  const css = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --brand:       #5f0076;
  --brand-dark:  #3d004c;
  --brand-mid:   #7a1896;
  --brand-soft:  #f3e6f8;
  --brand-glow:  rgba(95,0,118,.15);
  --ink:         #1a1025;
  --ink-2:       #3d3049;
  --ink-3:       #7b6e89;
  --rule:        #ede6f2;
  --bg:          #f7f4fb;
  --surface:     #ffffff;
  --ok:          #0d7a55;
  --ok-bg:       #d6f4e9;
  --ok-ring:     #9de8cb;
  --warn:        #8a5a00;
  --warn-bg:     #fef3c7;
  --warn-ring:   #fcd34d;
  --danger:      #c0303b;
  --danger-bg:   #fee2e2;
  --danger-ring: #fca5a5;
  --blue:        #1456cc;
  --r-sm: 6px; --r-md: 10px; --r-lg: 16px; --r-xl: 22px; --r-full: 9999px;
  --sh-sm: 0 1px 3px rgba(0,0,0,.06);
  --sh-md: 0 4px 12px rgba(0,0,0,.08);
  --sidebar-w: 252px;
  --ease: cubic-bezier(.4,0,.2,1);
}

html, body { height: 100%; font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--ink); }
.shell { display: flex; min-height: 100vh; }

/* ── SIDEBAR ── */
.sidebar {
  width: var(--sidebar-w); flex-shrink: 0; background: var(--brand-dark);
  display: flex; flex-direction: column; position: sticky; top: 0;
  height: 100vh; overflow-y: auto; z-index: 10;
}
.sidebar-logo { padding: 28px 24px 20px; border-bottom: 1px solid rgba(255,255,255,.08); }
.sidebar-logo-mark { display: flex; align-items: center; gap: 10px; }
.sidebar-logo-icon {
  width: 36px; height: 36px;
  background: linear-gradient(135deg, var(--brand-mid), #c752f0);
  border-radius: var(--r-md); display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.sidebar-logo-icon svg { stroke: #fff; }
.sidebar-logo-text { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700; color: #fff; letter-spacing: .01em; line-height: 1.2; }
.sidebar-logo-sub  { font-size: .7rem; color: rgba(255,255,255,.45); letter-spacing: .04em; text-transform: uppercase; }
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
  text-decoration: none; font-size: .875rem; font-weight: 500; cursor: pointer;
  transition: all .18s var(--ease);
}
.sidebar-nav a:hover  { background: rgba(255,255,255,.08); color: #fff; }
.sidebar-nav a.active { background: rgba(255,255,255,.13); color: #fff; font-weight: 600; }
.nav-icon { width: 18px; height: 18px; opacity: .6; flex-shrink: 0; }
.sidebar-footer { padding: 12px; border-top: 1px solid rgba(255,255,255,.08); }
.sidebar-footer a {
  display: flex; align-items: center; gap: 10px; padding: 9px 12px;
  border-radius: var(--r-md); color: rgba(255,255,255,.5);
  text-decoration: none; font-size: .875rem; font-weight: 500;
  transition: all .18s var(--ease);
}
.sidebar-footer a:hover { background: rgba(255,0,0,.12); color: #ff7070; }

/* ── MAIN ── */
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
  width: 36px; height: 36px; border-radius: var(--r-md);
  border: 1px solid var(--rule); background: var(--bg);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all .18s var(--ease); color: var(--ink-2);
}
.topbar-btn:hover { background: var(--brand-soft); border-color: var(--brand-glow); color: var(--brand); }
.topbar-btn svg { width: 18px; height: 18px; stroke: currentColor; }

/* ── PAGE ── */
.page-content { padding: 28px 32px 48px; flex: 1; }
.page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 28px; }
.page-header-title { font-family: 'Syne', sans-serif; font-size: 1.6rem; font-weight: 800; color: var(--ink); letter-spacing: -.02em; line-height: 1.1; }
.page-header-sub { margin-top: 5px; font-size: .875rem; color: var(--ink-3); }
.header-actions { display: flex; gap: 10px; align-items: center; flex-shrink: 0; }

.btn-primary {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 10px 20px; background: var(--brand); color: #fff;
  border: none; border-radius: var(--r-md); font-size: .875rem; font-weight: 600;
  cursor: pointer; transition: all .2s var(--ease);
  box-shadow: 0 2px 8px rgba(95,0,118,.3); font-family: 'DM Sans', sans-serif; white-space: nowrap;
}
.btn-primary:hover { background: var(--brand-dark); transform: translateY(-1px); }
.btn-primary svg { width: 16px; height: 16px; stroke: currentColor; }
.btn-ghost {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 10px 16px; background: var(--surface); color: var(--ink-2);
  border: 1px solid var(--rule); border-radius: var(--r-md);
  font-size: .875rem; font-weight: 500; cursor: pointer;
  transition: all .2s var(--ease); font-family: 'DM Sans', sans-serif; white-space: nowrap;
}
.btn-ghost:hover { background: var(--brand-soft); border-color: var(--brand-glow); color: var(--brand); }
.btn-ghost svg { width: 16px; height: 16px; stroke: currentColor; }

/* ── STATS ── */
.stats-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; margin-bottom: 24px; }
.stat-card {
  background: var(--surface); border: 1px solid var(--rule); border-radius: var(--r-lg);
  padding: 20px; display: flex; align-items: center; gap: 16px;
  box-shadow: var(--sh-sm); transition: all .22s var(--ease);
}
.stat-card:hover { transform: translateY(-2px); box-shadow: var(--sh-md); border-color: var(--brand-glow); }
.stat-icon-wrap { width: 48px; height: 48px; border-radius: var(--r-md); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.stat-icon-wrap svg { width: 24px; height: 24px; stroke: #fff; }
.ic-pending  { background: linear-gradient(135deg,#d97706,#f59e0b); }
.ic-approved { background: linear-gradient(135deg,#0d7a55,#22c78a); }
.ic-declined { background: linear-gradient(135deg,#c0303b,#f87171); }
.stat-label { font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: var(--ink-3); }
.stat-val { font-family: 'Syne', sans-serif; font-size: 1.8rem; font-weight: 800; color: var(--ink); line-height: 1.1; }

/* ── FILTERS ── */
.filters-bar {
  display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
  margin-bottom: 20px; background: var(--surface); border: 1px solid var(--rule);
  border-radius: var(--r-lg); padding: 14px 20px; box-shadow: var(--sh-sm);
}
.search-wrap { position: relative; flex: 1; min-width: 180px; max-width: 360px; }
.search-wrap svg { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; stroke: var(--ink-3); pointer-events: none; }
.search-input {
  width: 100%; padding: 9px 12px 9px 36px;
  border: 1.5px solid var(--rule); border-radius: var(--r-full);
  font-size: .875rem; color: var(--ink); background: var(--bg);
  font-family: 'DM Sans', sans-serif; transition: all .18s var(--ease); outline: none;
}
.search-input::placeholder { color: var(--ink-3); }
.search-input:focus { border-color: var(--brand); background: #fff; box-shadow: 0 0 0 3px var(--brand-glow); }
.filter-sep { width: 1px; height: 28px; background: var(--rule); flex-shrink: 0; }
.filter-label { font-size: .8rem; font-weight: 600; color: var(--ink-3); white-space: nowrap; }
.filter-select, .date-input {
  padding: 8px 12px; border: 1.5px solid var(--rule); border-radius: var(--r-md);
  font-size: .875rem; color: var(--ink); background: var(--bg);
  cursor: pointer; font-family: 'DM Sans', sans-serif;
  transition: all .18s var(--ease); outline: none;
}
.filter-select {
  padding-right: 32px; appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237b6e89' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 10px center;
}
.filter-select:focus, .date-input:focus { border-color: var(--brand); box-shadow: 0 0 0 3px var(--brand-glow); }

/* ── TABLE ── */
.reports-section {
  background: var(--surface); border: 1px solid var(--rule);
  border-radius: var(--r-xl); box-shadow: var(--sh-sm); overflow: hidden;
}
.section-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 24px; border-bottom: 1px solid var(--rule);
}
.section-head-title {
  font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700; color: var(--ink);
  display: flex; align-items: center; gap: 10px;
}
.count-badge {
  font-family: 'DM Sans', sans-serif; font-size: .72rem; font-weight: 700;
  background: var(--brand-soft); color: var(--brand);
  padding: 3px 10px; border-radius: var(--r-full); border: 1px solid rgba(95,0,118,.12);
}
.btn-ghost-sm {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 14px; background: var(--bg); color: var(--ink-2);
  border: 1px solid var(--rule); border-radius: var(--r-md);
  font-size: .8rem; font-weight: 500; cursor: pointer;
  transition: all .2s var(--ease); font-family: 'DM Sans', sans-serif; white-space: nowrap;
}
.btn-ghost-sm:hover { background: var(--brand-soft); border-color: var(--brand-glow); color: var(--brand); }
.btn-ghost-sm svg { width: 14px; height: 14px; stroke: currentColor; }

.list-col-header {
  display: grid; grid-template-columns: ${GRID_COLS};
  gap: 16px; padding: 10px 24px;
  background: var(--bg); border-bottom: 1px solid var(--rule); align-items: center;
}
.col-label { font-size: .7rem; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: var(--ink-3); white-space: nowrap; }

.reports-list { display: flex; flex-direction: column; }
.report-row {
  display: grid; grid-template-columns: ${GRID_COLS};
  gap: 16px; padding: 16px 24px; align-items: center;
  border-bottom: 1px solid var(--rule);
  transition: background .15s var(--ease);
  animation: rowIn .3s var(--ease) both;
}
.report-row:nth-child(1) { animation-delay: .05s; }
.report-row:nth-child(2) { animation-delay: .10s; }
.report-row:nth-child(3) { animation-delay: .15s; }
.report-row:last-child   { border-bottom: none; }
.report-row:hover        { background: var(--brand-soft); }
@keyframes rowIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }

.trainee-identity { display: flex; align-items: center; gap: 12px; min-width: 0; }
.trainee-avatar {
  width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Syne', sans-serif; font-size: .8rem; font-weight: 700; color: #fff;
  box-shadow: 0 2px 8px rgba(95,0,118,.25);
}
.trainee-info   { min-width: 0; }
.trainee-name   { font-size: .875rem; font-weight: 700; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.trainee-id     { font-size: .72rem; color: var(--ink-3); margin-top: 1px; font-weight: 500; }
.trainee-course { font-size: .72rem; color: var(--ink-3); margin-top: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.desc-text {
  font-size: .72rem; color: var(--ink-3); line-height: 1.45; margin-top: 4px;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}

.cell-datetime  { display: flex; flex-direction: column; gap: 5px; }
.cell-date-line { display: flex; align-items: center; gap: 5px; font-size: .8rem; font-weight: 600; color: var(--ink-2); white-space: nowrap; }
.cell-date-line svg { width: 12px; height: 12px; stroke: var(--ink-3); flex-shrink: 0; }
.cell-time-line { display: flex; align-items: center; gap: 5px; font-size: .78rem; color: var(--ink-3); font-weight: 500; white-space: nowrap; }
.cell-time-line svg { width: 12px; height: 12px; stroke: var(--ink-3); flex-shrink: 0; }

/* ── STATUS BADGES — icon-bubble pill (matches AdminTrainees / AdminAttendance) ── */
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

/* Pending — warm amber */
.status-pending {
  background: linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%);
  color: #78350f;
  border: 1.5px solid #fcd34d;
  box-shadow: 0 2px 6px rgba(120,53,15,.1), inset 0 1px 0 rgba(255,255,255,.6);
}
.status-pending .status-icon {
  background: linear-gradient(135deg, #d97706, #f59e0b);
  box-shadow: 0 1px 4px rgba(217,119,6,.35);
}

/* Approved — rich green */
.status-approved {
  background: linear-gradient(135deg, #d1fae5 0%, #ecfdf5 100%);
  color: #065f46;
  border: 1.5px solid #6ee7b7;
  box-shadow: 0 2px 6px rgba(6,95,70,.12), inset 0 1px 0 rgba(255,255,255,.6);
}
.status-approved .status-icon {
  background: linear-gradient(135deg, #059669, #10b981);
  box-shadow: 0 1px 4px rgba(5,150,105,.35);
}

/* Declined — vivid red */
.status-declined {
  background: linear-gradient(135deg, #fee2e2 0%, #fff5f5 100%);
  color: #991b1b;
  border: 1.5px solid #fca5a5;
  box-shadow: 0 2px 6px rgba(153,27,27,.1), inset 0 1px 0 rgba(255,255,255,.6);
}
.status-declined .status-icon {
  background: linear-gradient(135deg, #dc2626, #ef4444);
  box-shadow: 0 1px 4px rgba(220,38,38,.35);
}

.attach-link {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: .8rem; font-weight: 600; color: var(--blue);
  text-decoration: none; padding: 6px 11px;
  background: #dbeafe; border-radius: var(--r-md); border: 1px solid #bfdbfe;
  transition: all .15s var(--ease);
  max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.attach-link:hover { background: var(--blue); color: #fff; border-color: var(--blue); }
.attach-link svg { width: 13px; height: 13px; stroke: currentColor; flex-shrink: 0; }

.actions-wrap { display: flex; flex-direction: column; gap: 6px; width: 100%; }
.action-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  height: 32px; padding: 0 12px; width: 100%;
  border: 1px solid transparent; border-radius: var(--r-md);
  font-size: .78rem; font-weight: 600; cursor: pointer;
  font-family: 'DM Sans', sans-serif; transition: all .18s var(--ease); white-space: nowrap;
}
.action-btn svg { width: 13px; height: 13px; stroke: currentColor; flex-shrink: 0; }
.btn-approve { background: var(--ok-bg);     color: var(--ok);     border-color: var(--ok-ring);     }
.btn-approve:hover { background: var(--ok);     color: #fff; border-color: var(--ok);     }
.btn-decline { background: var(--danger-bg); color: var(--danger); border-color: var(--danger-ring); }
.btn-decline:hover { background: var(--danger); color: #fff; border-color: var(--danger); }
.btn-view    { background: #dbeafe; color: var(--blue); border-color: #bfdbfe; }
.btn-view:hover { background: var(--blue); color: #fff; border-color: var(--blue); }

.resolved-tag {
  display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  height: 32px; padding: 0 12px; width: 100%;
  border-radius: var(--r-md); font-size: .78rem; font-weight: 600; white-space: nowrap;
}
.resolved-tag svg { width: 13px; height: 13px; stroke: currentColor; flex-shrink: 0; }
.resolved-approved { background: var(--ok-bg);     color: var(--ok);     border: 1px solid var(--ok-ring);     }
.resolved-declined { background: var(--danger-bg); color: var(--danger); border: 1px solid var(--danger-ring); }

@media (max-width: 1100px) {
  .list-col-header, .report-row { grid-template-columns: minmax(180px,2fr) 148px 136px 132px 160px; gap: 12px; padding-left: 18px; padding-right: 18px; }
}
@media (max-width: 920px) {
  .list-col-header, .report-row { grid-template-columns: minmax(160px,2fr) 134px 124px 120px 144px; gap: 10px; padding-left: 14px; padding-right: 14px; }
}
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
  .report-row { grid-template-columns: 1fr; gap: 12px; align-items: start; padding: 16px; }
  .actions-wrap { flex-direction: row; flex-wrap: wrap; }
  .action-btn, .resolved-tag { width: auto; flex: 1; min-width: 80px; }
}
@media (max-width: 640px) {
  .stats-grid { grid-template-columns: 1fr; }
  .page-header { flex-direction: column; gap: 12px; }
  .filters-bar { flex-direction: column; align-items: stretch; }
  .search-wrap { max-width: 100%; }
  .filter-sep { display: none; }
}`;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="shell">

        {/* ── SIDEBAR ── */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-logo-mark">
              <div className="sidebar-logo-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
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
              <li><a onClick={() => history.push('/admin-attendance')}>
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <span className="nav-label">Attendance</span>
              </a></li>
            </ul>
            <div className="nav-section-label" style={{ marginTop: 16 }}>Reports</div>
            <ul>
              <li><a onClick={() => history.push('/admin-reports')} className="active">
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                <span className="nav-label">Reports</span>
              </a></li>
              <li><a onClick={() => history.push('/admin-progress')}>
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                <span className="nav-label">Progress</span>
              </a></li>
            </ul>
          </nav>
          <div className="sidebar-footer">
            <a href="#logout" onClick={e => { e.preventDefault(); setShowModal(true); }}>
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              <span>Logout</span>
            </a>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <div className="main">
          <div className="topbar">
            <div className="topbar-breadcrumb">
              <span>Admin</span>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
              <span className="crumb-active">Reports</span>
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
                <div className="page-header-title">Reports Overview</div>
                <div className="page-header-sub">Review, approve, or decline trainee daily report submissions — Feb 17, 2026</div>
              </div>
              <div className="header-actions">
                <button className="btn-primary">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Approve All
                </button>
              </div>
            </div>

            {/* stats */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon-wrap ic-pending"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
                <div><div className="stat-label">Pending Reports</div><div className="stat-val">{pendingCount}</div></div>
              </div>
              <div className="stat-card">
                <div className="stat-icon-wrap ic-approved"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
                <div><div className="stat-label">Approved Reports</div><div className="stat-val">{approvedCount}</div></div>
              </div>
              <div className="stat-card">
                <div className="stat-icon-wrap ic-declined"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></div>
                <div><div className="stat-label">Declined Reports</div><div className="stat-val">{declinedCount}</div></div>
              </div>
            </div>

            {/* filters */}
            <div className="filters-bar">
              <div className="search-wrap">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input className="search-input" type="text" placeholder="Search by name or ID…" />
              </div>
              <div className="filter-sep" />
              <label className="filter-label" htmlFor="sf">Status</label>
              <select className="filter-select" id="sf">
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="declined">Declined</option>
              </select>
              <div className="filter-sep" />
              <label className="filter-label" htmlFor="df">Date</label>
              <input className="date-input" type="date" id="df" defaultValue="2026-02-15" />
            </div>

            {/* table */}
            <div className="reports-section">
              <div className="section-head">
                <div className="section-head-title">
                  Trainee Reports Review
                  <span className="count-badge">{reports.length} reports</span>
                </div>
                <button className="btn-ghost-sm" onClick={handleExport}>
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Export CSV
                </button>
              </div>

              <div className="list-col-header">
                <div className="col-label">Student</div>
                <div className="col-label">Date / Time</div>
                <div className="col-label">Status</div>
                <div className="col-label">Attachment</div>
                <div className="col-label">Actions</div>
              </div>

              <div className="reports-list">
                {reports.map((report) => (
                  <div className="report-row" key={report.id}>

                    {/* col 1 — Student */}
                    <div className="trainee-identity">
                      <div className="trainee-avatar" style={{ background: report.avatarGradient ?? 'linear-gradient(135deg,#5f0076,#7a1896)' }}>
                        {report.initials}
                      </div>
                      <div className="trainee-info">
                        <div className="trainee-name">{report.name}</div>
                        <div className="trainee-id">{report.id}</div>
                        <div className="trainee-course">{report.course}</div>
                        <div className="desc-text">{report.description}</div>
                      </div>
                    </div>

                    {/* col 2 — Date / Time */}
                    <div className="cell-datetime">
                      <div className="cell-date-line">
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        {report.date}
                      </div>
                      <div className="cell-time-line">
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        {report.timeIn} → {report.timeOut}
                      </div>
                    </div>

                    {/* col 3 — Status (icon-bubble pill) */}
                    <div>
                      <span className={`status-badge status-${report.status}`}>
                        <span className="status-icon">
                          {STATUS_ICON[report.status]}
                        </span>
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </span>
                    </div>

                    {/* col 4 — Attachment */}
                    <div>
                      <a href="#" className="attach-link" title={report.attachment}>
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                        {report.attachment}
                      </a>
                    </div>

                    {/* col 5 — Actions */}
                    <div>
                      {report.status === 'pending' ? (
                        <div className="actions-wrap">
                          <button className="action-btn btn-approve" onClick={() => handleApprove(report.id)}>
                            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                            Approve
                          </button>
                          <button className="action-btn btn-decline" onClick={() => handleDecline(report.id)}>
                            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            Decline
                          </button>
                          <button className="action-btn btn-view" onClick={() => handleView(report)}>
                            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            View
                          </button>
                        </div>
                      ) : (
                        <div className="actions-wrap">
                          <span className={`resolved-tag ${report.status === 'approved' ? 'resolved-approved' : 'resolved-declined'}`}>
                            {report.status === 'approved' ? (
                              <><svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>Approved</>
                            ) : (
                              <><svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>Declined</>
                            )}
                          </span>
                          <button className="action-btn btn-view" onClick={() => handleView(report)}>
                            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            View
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                ))}
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

export default AdminReports;