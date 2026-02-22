import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

export interface AttendanceRecord {
  id: string;
  name: string;
  initials: string;
  avatarGradient?: string;
  status: 'present' | 'late' | 'absent';
  timeIn: string;
  timeOut: string;
  date: string;
  department?: string;
  supervisor?: string;
  hoursRendered?: string;
  remarks?: string;
}

const AdminAttendanceDetail: React.FC = () => {
  const history = useHistory();
  const location = useLocation<{ record: AttendanceRecord }>();
  const record = location.state?.record;

  if (!record) {
    history.replace('/admin-attendance');
    return null;
  }

  const statusConfig = {
    present: {
      label: 'Present',
      color: '#0d7a55',
      bg: '#d6f4e9',
      ring: '#9de8cb',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      ),
    },
    late: {
      label: 'Late',
      color: '#8a5a00',
      bg: '#fef3c7',
      ring: '#fcd34d',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
    },
    absent: {
      label: 'Absent',
      color: '#c0303b',
      bg: '#fee2e2',
      ring: '#fca5a5',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
      ),
    },
  };

  const cfg = statusConfig[record.status];

  const css = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

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
  --sh-sm:  0 1px 3px rgba(0,0,0,.06);
  --sh-md:  0 4px 12px rgba(0,0,0,.08);
  --sh-lg:  0 12px 32px rgba(0,0,0,.10);
  --r-sm:   6px;
  --r-md:   10px;
  --r-lg:   16px;
  --r-xl:   22px;
  --r-full: 9999px;
  --ease:   cubic-bezier(.4,0,.2,1);
  --sidebar-w: 252px;
}

html, body { height: 100%; font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--ink); }

/* ── SHELL ─────────────── */
.shell { display: flex; min-height: 100vh; }

/* ── SIDEBAR ────────────── */
.sidebar {
  width: var(--sidebar-w); flex-shrink: 0;
  background: var(--brand-dark);
  display: flex; flex-direction: column;
  position: sticky; top: 0; height: 100vh;
  overflow-y: auto; z-index: 10;
}
.sidebar-logo { padding: 28px 24px 20px; border-bottom: 1px solid rgba(255,255,255,.08); }
.sidebar-logo-mark { display: flex; align-items: center; gap: 10px; }
.sidebar-logo-icon {
  width: 36px; height: 36px;
  background: linear-gradient(135deg, var(--brand-mid), #c752f0);
  border-radius: var(--r-md);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
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
.sidebar-profile-name { font-size: .9rem; font-weight: 600; color: #fff; }
.sidebar-profile-role { font-size: .75rem; color: rgba(255,255,255,.45); }
.sidebar-nav { flex: 1; padding: 16px 12px; }
.nav-section-label { font-size: .65rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: rgba(255,255,255,.3); padding: 8px 12px 6px; }
.sidebar-nav ul { list-style: none; display: flex; flex-direction: column; gap: 2px; }
.sidebar-nav a {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 12px; border-radius: var(--r-md);
  color: rgba(255,255,255,.6); text-decoration: none;
  font-size: .875rem; font-weight: 500; cursor: pointer;
  transition: all .18s var(--ease);
}
.sidebar-nav a:hover { background: rgba(255,255,255,.08); color: #fff; }
.sidebar-nav a.active { background: rgba(255,255,255,.13); color: #fff; font-weight: 600; }
.nav-icon { width: 18px; height: 18px; opacity: .6; flex-shrink: 0; }
.sidebar-footer { padding: 12px; border-top: 1px solid rgba(255,255,255,.08); }
.sidebar-footer a { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: var(--r-md); color: rgba(255,255,255,.5); text-decoration: none; font-size: .875rem; font-weight: 500; transition: all .18s var(--ease); }
.sidebar-footer a:hover { background: rgba(255,0,0,.12); color: #ff7070; }

/* ── MAIN ──────────────── */
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

/* ── PAGE CONTENT ──────── */
.page-content { padding: 28px 32px 48px; flex: 1; }

/* back button */
.btn-back {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 9px 16px; background: var(--surface); color: var(--ink-2);
  border: 1px solid var(--rule); border-radius: var(--r-md);
  font-size: .875rem; font-weight: 500; cursor: pointer;
  transition: all .2s var(--ease); font-family: 'DM Sans', sans-serif;
  margin-bottom: 24px; text-decoration: none;
}
.btn-back:hover { background: var(--brand-soft); border-color: var(--brand-glow); color: var(--brand); }
.btn-back svg { width: 16px; height: 16px; stroke: currentColor; }

/* ── DETAIL CARD ─────────────────────── */
.detail-wrapper {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 20px;
  animation: fadeUp .35s var(--ease) both;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: none; }
}

/* left – profile card */
.profile-card {
  background: var(--surface); border: 1px solid var(--rule);
  border-radius: var(--r-xl); box-shadow: var(--sh-sm); overflow: hidden;
}
.profile-card-banner {
  height: 90px;
  background: linear-gradient(135deg, var(--brand-dark) 0%, var(--brand-mid) 60%, #c752f0 100%);
  position: relative;
}
.profile-card-banner::after {
  content: '';
  position: absolute; inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}
.profile-avatar-wrap {
  position: relative; padding: 0 28px;
  margin-top: -36px; margin-bottom: 16px;
}
.profile-avatar-lg {
  width: 72px; height: 72px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Syne', sans-serif; font-size: 1.4rem; font-weight: 800; color: #fff;
  border: 4px solid var(--surface);
  box-shadow: 0 4px 16px rgba(95,0,118,.3);
}
.profile-body { padding: 0 28px 28px; }
.profile-name { font-family: 'Syne', sans-serif; font-size: 1.25rem; font-weight: 800; color: var(--ink); line-height: 1.2; }
.profile-trainee-id { font-size: .78rem; color: var(--ink-3); margin-top: 3px; font-weight: 500; }
.profile-status-wrap { margin: 16px 0; }
.profile-status-badge {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 7px 16px; border-radius: var(--r-full);
  font-size: .8rem; font-weight: 700; border: 1.5px solid;
}
.profile-divider { height: 1px; background: var(--rule); margin: 20px 0; }
.profile-meta { display: flex; flex-direction: column; gap: 14px; }
.meta-row { display: flex; align-items: flex-start; gap: 12px; }
.meta-icon-wrap {
  width: 34px; height: 34px; border-radius: var(--r-md);
  background: var(--brand-soft);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.meta-icon-wrap svg { width: 15px; height: 15px; stroke: var(--brand); }
.meta-label { font-size: .7rem; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: var(--ink-3); }
.meta-val { font-size: .875rem; font-weight: 600; color: var(--ink); margin-top: 1px; }

/* right – details */
.details-col { display: flex; flex-direction: column; gap: 20px; }

.detail-card {
  background: var(--surface); border: 1px solid var(--rule);
  border-radius: var(--r-xl); box-shadow: var(--sh-sm); overflow: hidden;
}
.detail-card-head {
  padding: 16px 24px; border-bottom: 1px solid var(--rule);
  display: flex; align-items: center; gap: 10px;
}
.detail-card-head-icon {
  width: 32px; height: 32px; border-radius: var(--r-md);
  background: var(--brand-soft);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.detail-card-head-icon svg { width: 15px; height: 15px; stroke: var(--brand); }
.detail-card-head-title { font-family: 'Syne', sans-serif; font-size: .9rem; font-weight: 700; color: var(--ink); }
.detail-card-body { padding: 20px 24px; }

/* time grid */
.time-grid { display: grid; grid-template-columns: 1fr 40px 1fr; align-items: center; gap: 0; }
.time-block { text-align: center; }
.time-block-label { font-size: .68rem; font-weight: 700; text-transform: uppercase; letter-spacing: .09em; color: var(--ink-3); margin-bottom: 8px; }
.time-block-value {
  font-family: 'Syne', sans-serif; font-size: 1.9rem; font-weight: 800; color: var(--ink);
  line-height: 1;
}
.time-block-value.absent-val { font-size: 1.1rem; color: var(--ink-3); font-style: italic; font-family: 'DM Sans', sans-serif; font-weight: 400; }
.time-block-sub { font-size: .72rem; color: var(--ink-3); margin-top: 4px; }
.time-arrow { display: flex; align-items: center; justify-content: center; }
.time-arrow svg { width: 20px; height: 20px; stroke: var(--ink-3); }

/* hours rendered */
.hours-bar-wrap { margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--rule); }
.hours-bar-label { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.hours-bar-text { font-size: .78rem; font-weight: 600; color: var(--ink-2); }
.hours-bar-val { font-size: .78rem; font-weight: 700; color: var(--brand); }
.hours-bar-track { height: 8px; background: var(--rule); border-radius: var(--r-full); overflow: hidden; }
.hours-bar-fill { height: 100%; background: linear-gradient(90deg, var(--brand), #c752f0); border-radius: var(--r-full); transition: width .6s var(--ease); }

/* remarks */
.remarks-box {
  background: var(--bg); border: 1.5px solid var(--rule);
  border-radius: var(--r-lg); padding: 16px;
  font-size: .875rem; color: var(--ink-2); line-height: 1.6;
  font-style: italic;
}
.remarks-box.no-remarks { color: var(--ink-3); font-style: italic; text-align: center; padding: 24px; }

/* timeline */
.timeline { display: flex; flex-direction: column; gap: 0; }
.timeline-item { display: flex; gap: 16px; position: relative; }
.timeline-item:not(:last-child)::before {
  content: ''; position: absolute; left: 15px; top: 32px;
  width: 2px; height: calc(100% - 8px);
  background: var(--rule);
}
.timeline-dot {
  width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  border: 2px solid var(--rule); background: var(--surface); z-index: 1;
}
.timeline-dot svg { width: 14px; height: 14px; }
.timeline-dot.dot-in  { border-color: #9de8cb; background: #d6f4e9; }
.timeline-dot.dot-in svg { stroke: #0d7a55; }
.timeline-dot.dot-out { border-color: #bfdbfe; background: #dbeafe; }
.timeline-dot.dot-out svg { stroke: #1456cc; }
.timeline-dot.dot-none { border-color: var(--rule); background: var(--bg); }
.timeline-dot.dot-none svg { stroke: var(--ink-3); }
.timeline-content { padding-bottom: 24px; flex: 1; }
.timeline-time { font-family: 'Syne', sans-serif; font-size: .875rem; font-weight: 700; color: var(--ink); }
.timeline-desc { font-size: .78rem; color: var(--ink-3); margin-top: 2px; }

/* action buttons */
.detail-actions { display: flex; gap: 10px; }
.btn-primary {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 10px 20px; background: var(--brand); color: #fff;
  border: none; border-radius: var(--r-md);
  font-size: .875rem; font-weight: 600; cursor: pointer;
  transition: all .2s var(--ease);
  box-shadow: 0 2px 8px rgba(95,0,118,.3);
  font-family: 'DM Sans', sans-serif;
}
.btn-primary:hover { background: var(--brand-dark); transform: translateY(-1px); }
.btn-primary svg { width: 16px; height: 16px; stroke: currentColor; }
.btn-ghost {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 10px 16px; background: var(--surface); color: var(--ink-2);
  border: 1px solid var(--rule); border-radius: var(--r-md);
  font-size: .875rem; font-weight: 500; cursor: pointer;
  transition: all .2s var(--ease); font-family: 'DM Sans', sans-serif;
}
.btn-ghost:hover { background: var(--brand-soft); border-color: var(--brand-glow); color: var(--brand); }
.btn-ghost svg { width: 16px; height: 16px; stroke: currentColor; }

/* ── RESPONSIVE ─────────── */
@media (max-width: 1100px) {
  .detail-wrapper { grid-template-columns: 1fr; }
}
@media (max-width: 840px) {
  :root { --sidebar-w: 60px; }
  .sidebar-logo-text, .sidebar-logo-sub, .sidebar-profile-info, .nav-label, .sidebar-footer span, .nav-section-label { display: none; }
  .sidebar-logo { padding: 18px 12px; }
  .sidebar-logo-mark { justify-content: center; }
  .sidebar-profile { padding: 12px; justify-content: center; }
  .sidebar-nav a, .sidebar-footer a { padding: 10px; justify-content: center; gap: 0; }
  .page-content { padding: 20px 16px 40px; }
}
@media (max-width: 480px) {
  .time-block-value { font-size: 1.4rem; }
}

/* ── PRINT STYLES ─────── */
@media print {
  .sidebar, .topbar, .btn-back, .detail-actions {
    display: none !important;
  }
  .shell {
    display: block;
    min-height: auto;
  }
  .main {
    padding: 0;
    margin: 0;
  }
  .page-content {
    padding: 0;
    margin: 0;
  }
  .detail-wrapper {
    display: block;
  }
  .profile-card {
    margin-bottom: 20px;
    border: 1px solid #ccc;
    page-break-inside: avoid;
  }
  .detail-card {
    border: 1px solid #ccc;
    page-break-inside: avoid;
  }
  body {
    background: white;
    color: black;
  }
}
  `;

  const hoursRendered = record.hoursRendered ?? (record.status === 'absent' ? '0h 00m' : '9h 30m');
  const hoursPercent = record.status === 'absent' ? 0 : record.status === 'late' ? 72 : 100;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="shell">

        {/* ── SIDEBAR ─────────────────────────── */}
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
              <li>
                <a onClick={() => history.push('/admin-dashboard')}>
                  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                  <span className="nav-label">Dashboard</span>
                </a>
              </li>
              <li>
                <a onClick={() => history.push('/admin-trainees')}>
                  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  <span className="nav-label">Trainees</span>
                </a>
              </li>
              <li>
                <a onClick={() => history.push('/admin-supervisors')}>
                  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <span className="nav-label">Supervisors</span>
                </a>
              </li>
              <li>
                <a onClick={() => history.push('/admin-attendance')} className="active">
                  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  <span className="nav-label">Attendance</span>
                </a>
              </li>
            </ul>

            <div className="nav-section-label" style={{ marginTop: '16px' }}>Reports</div>
            <ul>
              <li>
                <a onClick={() => history.push('/admin-reports')}>
                  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  <span className="nav-label">Reports</span>
                </a>
              </li>
              <li>
                <a href="AdminProgress.html">
                  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                  <span className="nav-label">Progress</span>
                </a>
              </li>
            </ul>
          </nav>

          <div className="sidebar-footer">
            <a href="#logout">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              <span>Logout</span>
            </a>
          </div>
        </aside>

        {/* ── MAIN ─────────────────────────────── */}
        <div className="main">
          <div className="topbar">
            <div className="topbar-breadcrumb">
              <span>Admin</span>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
              <span style={{ cursor: 'pointer' }} onClick={() => history.push('/admin-attendance')}>Attendance</span>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
              <span className="crumb-active">{record.name}</span>
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
            {/* back */}
            <button className="btn-back" onClick={() => history.push('/admin-attendance')}>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              Back to Attendance
            </button>

            <div className="detail-wrapper">

              {/* ── LEFT: profile card ── */}
              <div className="profile-card">
                <div className="profile-card-banner" />
                <div className="profile-avatar-wrap">
                  <div
                    className="profile-avatar-lg"
                    style={{ background: record.avatarGradient ?? 'linear-gradient(135deg,#5f0076,#7a1896)' }}
                  >
                    {record.initials}
                  </div>
                </div>
                <div className="profile-body">
                  <div className="profile-name">{record.name}</div>
                  <div className="profile-trainee-id">{record.id}</div>

                  <div className="profile-status-wrap">
                    <span
                      className="profile-status-badge"
                      style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.ring }}
                    >
                      {cfg.icon}
                      {cfg.label}
                    </span>
                  </div>

                  <div className="profile-divider" />

                  <div className="profile-meta">
                    <div className="meta-row">
                      <div className="meta-icon-wrap">
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      </div>
                      <div>
                        <div className="meta-label">Date</div>
                        <div className="meta-val">{record.date}</div>
                      </div>
                    </div>

                    <div className="meta-row">
                      <div className="meta-icon-wrap">
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                      </div>
                      <div>
                        <div className="meta-label">Department</div>
                        <div className="meta-val">{record.department ?? 'Information Technology'}</div>
                      </div>
                    </div>

                    <div className="meta-row">
                      <div className="meta-icon-wrap">
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      </div>
                      <div>
                        <div className="meta-label">Supervisor</div>
                        <div className="meta-val">{record.supervisor ?? 'Dr. Maria Santos'}</div>
                      </div>
                    </div>
                  </div>

                  <div className="profile-divider" />

                  <div className="detail-actions">
                    <button className="btn-ghost" onClick={() => window.print()}>
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                      Print
                    </button>
                  </div>
                </div>
              </div>

              {/* ── RIGHT: details col ── */}
              <div className="details-col">

                {/* Time In / Out card */}
                <div className="detail-card">
                  <div className="detail-card-head">
                    <div className="detail-card-head-icon">
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    </div>
                    <div className="detail-card-head-title">Time Record</div>
                  </div>
                  <div className="detail-card-body">
                    <div className="time-grid">
                      <div className="time-block">
                        <div className="time-block-label">Time In</div>
                        {record.status !== 'absent'
                          ? <div className="time-block-value">{record.timeIn}</div>
                          : <div className="time-block-value absent-val">No record</div>
                        }
                        {record.status !== 'absent' && (
                          <div className="time-block-sub">
                            {record.status === 'late' ? '⚠ 30 min late' : '✓ On time'}
                          </div>
                        )}
                      </div>
                      <div className="time-arrow">
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                      </div>
                      <div className="time-block">
                        <div className="time-block-label">Time Out</div>
                        {record.status !== 'absent'
                          ? <div className="time-block-value">{record.timeOut}</div>
                          : <div className="time-block-value absent-val">No record</div>
                        }
                        {record.status !== 'absent' && (
                          <div className="time-block-sub">Regular dismissal</div>
                        )}
                      </div>
                    </div>

                    <div className="hours-bar-wrap">
                      <div className="hours-bar-label">
                        <span className="hours-bar-text">Hours Rendered</span>
                        <span className="hours-bar-val">{hoursRendered}</span>
                      </div>
                      <div className="hours-bar-track">
                        <div className="hours-bar-fill" style={{ width: `${hoursPercent}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Activity Timeline */}
                <div className="detail-card">
                  <div className="detail-card-head">
                    <div className="detail-card-head-icon">
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                    </div>
                    <div className="detail-card-head-title">Activity Timeline</div>
                  </div>
                  <div className="detail-card-body">
                    <div className="timeline">
                      {record.status !== 'absent' ? (
                        <>
                          <div className="timeline-item">
                            <div className="timeline-dot dot-in">
                              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            </div>
                            <div className="timeline-content">
                              <div className="timeline-time">Clocked In — {record.timeIn}</div>
                              <div className="timeline-desc">{record.status === 'late' ? 'Arrived late — 30 minutes past expected time' : 'Arrived on time'}</div>
                            </div>
                          </div>
                          <div className="timeline-item">
                            <div className="timeline-dot dot-out">
                              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                            </div>
                            <div className="timeline-content">
                              <div className="timeline-time">Clocked Out — {record.timeOut}</div>
                              <div className="timeline-desc">Regular dismissal time</div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="timeline-item">
                          <div className="timeline-dot dot-none">
                            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                          </div>
                          <div className="timeline-content">
                            <div className="timeline-time">No Record</div>
                            <div className="timeline-desc">Trainee did not report for duty on this date</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Remarks */}
                <div className="detail-card">
                  <div className="detail-card-head">
                    <div className="detail-card-head-icon">
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    </div>
                    <div className="detail-card-head-title">Remarks</div>
                  </div>
                  <div className="detail-card-body">
                    {record.remarks
                      ? <div className="remarks-box">{record.remarks}</div>
                      : <div className="remarks-box no-remarks">No remarks recorded for this attendance entry.</div>
                    }
                  </div>
                </div>

              </div>{/* /details-col */}
            </div>{/* /detail-wrapper */}
          </div>{/* /page-content */}
        </div>{/* /main */}
      </div>
    </>
  );
};

export default AdminAttendanceDetail;