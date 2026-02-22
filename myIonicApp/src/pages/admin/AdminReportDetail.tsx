import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import LogoutModal from '../../components/LogoutModal';

/* ─── shared interface — also imported by AdminReports ─── */
export interface ReportRecord {
  id: string;
  name: string;
  initials: string;
  avatarGradient?: string;
  course: string;
  date: string;
  timeIn: string;
  timeOut: string;
  status: 'pending' | 'approved' | 'declined';
  description: string;
  attachment: string;
}

/* ─────────────────────────────────────────────────────────── */

const AdminReportDetail: React.FC = () => {
  const history  = useHistory();
  const location = useLocation<{ record: ReportRecord }>();
  const record   = location.state?.record;

  const [showModal,   setShowModal]   = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  /* local decision state so approve/decline works without leaving the page */
  const [status, setStatus] = useState<ReportRecord['status']>(record?.status ?? 'pending');

  /* guard — redirect if no record was passed */
  if (!record) {
    history.replace('/admin-reports');
    return null;
  }

  /* ── logout helpers ── */
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

  /* ── status colour map ── */
  const STATUS_CFG = {
    pending:  { label: 'Pending',  color: '#8a5a00', bg: '#fef3c7', ring: '#fcd34d', icon: '⏳' },
    approved: { label: 'Approved', color: '#0d7a55', bg: '#d6f4e9', ring: '#9de8cb', icon: '✓'  },
    declined: { label: 'Declined', color: '#c0303b', bg: '#fee2e2', ring: '#fca5a5', icon: '✕'  },
  } as const;
  const cfg = STATUS_CFG[status];

  /* ── styles ── */
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
  --sh-md: 0 4px 12px rgba(0,0,0,.09);
  --sh-lg: 0 12px 32px rgba(0,0,0,.11);
  --sidebar-w: 252px;
  --ease: cubic-bezier(.4,0,.2,1);
}

/* ── RESET & BASE ── */
html { height: 100%; }
body { height: 100%; font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--ink); overflow: hidden; }

/* ── SHELL: full-viewport flex container, no overflow ── */
.shell {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* ── SCROLLBAR STYLING (webkit) ── */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(95,0,118,.22); border-radius: 99px; }
::-webkit-scrollbar-thumb:hover { background: rgba(95,0,118,.4); }

/* Firefox */
* { scrollbar-width: thin; scrollbar-color: rgba(95,0,118,.22) transparent; }

/* ── SIDEBAR ── */
.sidebar {
  width: var(--sidebar-w);
  flex-shrink: 0;
  background: var(--brand-dark);
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 10;
}
.sidebar-logo { padding: 28px 24px 20px; border-bottom: 1px solid rgba(255,255,255,.08); flex-shrink: 0; }
.sidebar-logo-mark { display: flex; align-items: center; gap: 10px; }
.sidebar-logo-icon {
  width: 36px; height: 36px;
  background: linear-gradient(135deg, var(--brand-mid), #c752f0);
  border-radius: var(--r-md); display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.sidebar-logo-icon svg { stroke: #fff; }
.sidebar-logo-text { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700; color: #fff; letter-spacing: .01em; line-height: 1.2; }
.sidebar-logo-sub  { font-size: .7rem; color: rgba(255,255,255,.45); letter-spacing: .04em; text-transform: uppercase; }
.sidebar-profile { padding: 20px 24px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid rgba(255,255,255,.08); flex-shrink: 0; }
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
.sidebar-footer { padding: 12px; border-top: 1px solid rgba(255,255,255,.08); flex-shrink: 0; }
.sidebar-footer a {
  display: flex; align-items: center; gap: 10px; padding: 9px 12px;
  border-radius: var(--r-md); color: rgba(255,255,255,.5);
  text-decoration: none; font-size: .875rem; font-weight: 500;
  transition: all .18s var(--ease);
}
.sidebar-footer a:hover { background: rgba(255,0,0,.12); color: #ff7070; }

/* ── MAIN: takes remaining width, scrolls vertically ── */
.main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;         /* topbar stays sticky, scroll-area handles content */
}

/* ── TOPBAR: sticky at top of .main ── */
.topbar {
  height: 60px;
  flex-shrink: 0;
  background: var(--surface);
  border-bottom: 1px solid var(--rule);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  z-index: 5;
  box-shadow: var(--sh-sm);
}
.topbar-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: .85rem; color: var(--ink-3); }
.topbar-breadcrumb svg    { width: 14px; height: 14px; stroke: var(--ink-3); }
.crumb-link   { cursor: pointer; transition: color .15s; }
.crumb-link:hover { color: var(--brand); }
.crumb-active { color: var(--ink); font-weight: 600; }
.topbar-right { display: flex; align-items: center; gap: 12px; }
.topbar-btn {
  width: 36px; height: 36px; border-radius: var(--r-md);
  border: 1px solid var(--rule); background: var(--bg);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all .18s var(--ease); color: var(--ink-2);
}
.topbar-btn:hover { background: var(--brand-soft); border-color: var(--brand-glow); color: var(--brand); }
.topbar-btn svg { width: 18px; height: 18px; stroke: currentColor; }

/* ── SCROLL AREA: fills remaining height, scrolls ── */
.scroll-area {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;            /* crucial for flex children to scroll */
}

/* ── PAGE ── */
.page-content { padding: 28px 32px 56px; }

/* back button */
.btn-back {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 9px 16px; background: var(--surface); color: var(--ink-2);
  border: 1px solid var(--rule); border-radius: var(--r-md);
  font-size: .875rem; font-weight: 500; cursor: pointer;
  font-family: 'DM Sans', sans-serif; transition: all .2s var(--ease);
  margin-bottom: 24px;
}
.btn-back:hover { background: var(--brand-soft); border-color: var(--brand-glow); color: var(--brand); }
.btn-back svg { width: 16px; height: 16px; stroke: currentColor; }

/* ── 2-COLUMN DETAIL LAYOUT ── */
.detail-grid {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 22px;
  align-items: start;
  animation: fadeUp .35s var(--ease) both;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: none; }
}

/* ──────────────────────────────────────────
   LEFT — PROFILE CARD
────────────────────────────────────────── */
.profile-card {
  background: var(--surface);
  border: 1px solid var(--rule);
  border-radius: var(--r-xl);
  box-shadow: var(--sh-sm);
  overflow: hidden;
  /* Sticky so it stays visible while scrolling through the right column */
  position: sticky;
  top: 16px;
}
.profile-banner {
  height: 76px;
  background: linear-gradient(135deg, var(--brand-dark) 0%, var(--brand-mid) 55%, #c752f0 100%);
  position: relative;
}
/* subtle dot-grid texture on banner */
.profile-banner::after {
  content: '';
  position: absolute; inset: 0;
  background-image: radial-gradient(circle, rgba(255,255,255,.15) 1px, transparent 1px);
  background-size: 18px 18px;
}
.profile-avatar-wrap {
  padding: 0 22px;
  margin-top: -26px;
  position: relative; z-index: 1;
}
.profile-avatar-lg {
  width: 52px; height: 52px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Syne', sans-serif; font-size: 1.05rem; font-weight: 800; color: #fff;
  border: 3px solid var(--surface);
  box-shadow: 0 4px 14px rgba(95,0,118,.35);
}
.profile-body { padding: 10px 22px 22px; }
.profile-name   { font-family: 'Syne', sans-serif; font-size: 1.05rem; font-weight: 800; color: var(--ink); line-height: 1.25; margin-top: 4px; }
.profile-id     { font-size: .72rem; color: var(--ink-3); margin-top: 2px; font-weight: 600; letter-spacing: .03em; }
.profile-course { font-size: .75rem; color: var(--ink-3); margin-top: 1px; line-height: 1.4; }

.profile-status-row { margin: 14px 0 0; }
.profile-status-badge {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 5px 14px; border-radius: var(--r-full);
  font-size: .78rem; font-weight: 700; border: 1.5px solid;
}
.profile-status-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }

.divider { height: 1px; background: var(--rule); margin: 18px 0; }

/* meta rows inside profile card */
.meta-list { display: flex; flex-direction: column; gap: 14px; }
.meta-item { display: flex; align-items: flex-start; gap: 11px; }
.meta-icon-wrap {
  width: 32px; height: 32px; flex-shrink: 0; border-radius: var(--r-md);
  background: var(--brand-soft);
  display: flex; align-items: center; justify-content: center;
}
.meta-icon-wrap svg { width: 14px; height: 14px; stroke: var(--brand); }
.meta-label { font-size: .67rem; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--ink-3); }
.meta-val   { font-size: .875rem; font-weight: 600; color: var(--ink); margin-top: 2px; }

/* ──────────────────────────────────────────
   RIGHT — DETAIL CARDS
────────────────────────────────────────── */
.detail-col { display: flex; flex-direction: column; gap: 18px; }

.detail-card {
  background: var(--surface);
  border: 1px solid var(--rule);
  border-radius: var(--r-xl);
  box-shadow: var(--sh-sm);
  overflow: hidden;
  transition: box-shadow .22s var(--ease);
}
.detail-card:hover { box-shadow: var(--sh-md); }

.card-head {
  display: flex; align-items: center; gap: 10px;
  padding: 15px 22px; border-bottom: 1px solid var(--rule);
}
.card-head-icon {
  width: 30px; height: 30px; border-radius: var(--r-md);
  background: var(--brand-soft);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.card-head-icon svg { width: 14px; height: 14px; stroke: var(--brand); }
.card-head-title { font-family: 'Syne', sans-serif; font-size: .9rem; font-weight: 700; color: var(--ink); }
.card-body { padding: 20px 22px; }

/* ── TIME BLOCK ── */
.time-row {
  display: grid;
  grid-template-columns: 1fr 40px 1fr;
  align-items: center;
  gap: 8px;
}
.time-block { text-align: center; }
.time-block-label {
  font-size: .65rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: .1em; color: var(--ink-3); margin-bottom: 6px;
}
.time-block-val {
  font-family: 'Syne', sans-serif; font-size: 1.9rem; font-weight: 800;
  color: var(--ink); line-height: 1;
}
.time-block-sub { font-size: .7rem; color: var(--ink-3); margin-top: 5px; }
.time-arrow { display: flex; align-items: center; justify-content: center; }
.time-arrow svg { width: 20px; height: 20px; stroke: var(--ink-3); }

/* ── DESCRIPTION ── */
.desc-box {
  background: var(--bg); border: 1.5px solid var(--rule);
  border-radius: var(--r-lg); padding: 16px 18px;
  font-size: .875rem; color: var(--ink-2); line-height: 1.7;
  /* Allow tall descriptions to show a scrollbar within the box */
  max-height: 260px;
  overflow-y: auto;
  word-break: break-word;
}

/* ── ATTACHMENT ── */
.attach-row {
  display: flex; align-items: center; gap: 14px;
  padding: 14px 16px;
  background: var(--bg); border: 1.5px solid #bfdbfe;
  border-radius: var(--r-lg); text-decoration: none;
  transition: all .18s var(--ease); cursor: pointer;
}
.attach-row:hover { background: #dbeafe; border-color: var(--blue); }
.attach-file-icon {
  width: 44px; height: 44px; flex-shrink: 0; border-radius: var(--r-md);
  background: #dbeafe; display: flex; align-items: center; justify-content: center;
}
.attach-file-icon svg { width: 22px; height: 22px; stroke: var(--blue); }
.attach-info { flex: 1; min-width: 0; }
.attach-name { font-size: .9rem; font-weight: 700; color: var(--blue); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.attach-meta { font-size: .72rem; color: var(--ink-3); margin-top: 2px; }
.attach-dl svg { width: 16px; height: 16px; stroke: var(--blue); opacity: .65; }

/* ── DECISION PANEL ── */
.decision-hint {
  font-size: .85rem; color: var(--ink-3); line-height: 1.55; margin-bottom: 16px;
}
.action-row { display: flex; gap: 10px; flex-wrap: wrap; }

.btn-approve {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 10px 22px; background: var(--ok-bg); color: var(--ok);
  border: 1.5px solid var(--ok-ring); border-radius: var(--r-md);
  font-size: .875rem; font-weight: 600; cursor: pointer;
  font-family: 'DM Sans', sans-serif; transition: all .2s var(--ease); white-space: nowrap;
}
.btn-approve:hover { background: var(--ok); color: #fff; border-color: var(--ok); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(13,122,85,.25); }
.btn-approve svg { width: 15px; height: 15px; stroke: currentColor; }

.btn-decline {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 10px 22px; background: var(--danger-bg); color: var(--danger);
  border: 1.5px solid var(--danger-ring); border-radius: var(--r-md);
  font-size: .875rem; font-weight: 600; cursor: pointer;
  font-family: 'DM Sans', sans-serif; transition: all .2s var(--ease); white-space: nowrap;
}
.btn-decline:hover { background: var(--danger); color: #fff; border-color: var(--danger); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(192,48,59,.25); }
.btn-decline svg { width: 15px; height: 15px; stroke: currentColor; }

.btn-ghost-action {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 10px 16px; background: var(--surface); color: var(--ink-2);
  border: 1px solid var(--rule); border-radius: var(--r-md);
  font-size: .875rem; font-weight: 500; cursor: pointer;
  font-family: 'DM Sans', sans-serif; transition: all .2s var(--ease); white-space: nowrap;
}
.btn-ghost-action:hover { background: var(--brand-soft); border-color: var(--brand-glow); color: var(--brand); }
.btn-ghost-action svg { width: 15px; height: 15px; stroke: currentColor; }

/* resolved banner */
.resolved-banner {
  display: flex; align-items: center; gap: 14px;
  padding: 14px 18px; border-radius: var(--r-lg);
  border: 1.5px solid; margin-bottom: 16px;
}
.resolved-icon {
  width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
.resolved-icon svg { width: 18px; height: 18px; stroke: #fff; stroke-width: 2.5; }
.resolved-title { font-size: .95rem; font-weight: 700; }
.resolved-sub   { font-size: .78rem; margin-top: 2px; opacity: .75; }

/* ── RESPONSIVE ── */
@media (max-width: 1080px) {
  .detail-grid { grid-template-columns: 270px 1fr; }
}
@media (max-width: 860px) {
  .detail-grid { grid-template-columns: 1fr; }
  /* On single-column layout, profile card is no longer sticky */
  .profile-card { position: static; }
}
@media (max-width: 840px) {
  :root { --sidebar-w: 60px; }
  .sidebar-logo-text, .sidebar-logo-sub, .sidebar-profile-info,
  .nav-label, .sidebar-footer span, .nav-section-label { display: none; }
  .sidebar-logo { padding: 18px 12px; }
  .sidebar-logo-mark { justify-content: center; }
  .sidebar-profile { padding: 12px; justify-content: center; }
  .sidebar-nav a, .sidebar-footer a { padding: 10px; justify-content: center; gap: 0; }
  .page-content { padding: 20px 16px 44px; }
  .time-block-val { font-size: 1.4rem; }
}
@media (max-width: 480px) {
  .action-row { flex-direction: column; }
  .btn-approve, .btn-decline, .btn-ghost-action { width: 100%; justify-content: center; }
}

/* ── PRINT STYLES ─────── */
@media print {
  .sidebar, .topbar, .btn-back { display: none !important; }
  .shell { display: block; height: auto; overflow: visible; }
  .main { height: auto; overflow: visible; }
  .scroll-area { overflow: visible; height: auto; }
  .page-content { padding: 0; margin: 0; }
  .detail-grid { display: block; }
  .profile-card { position: static; }
  .profile-card, .detail-card { border: 1px solid #ccc; page-break-inside: avoid; margin-bottom: 20px; }
  .desc-box { max-height: none; overflow: visible; }
  body { background: white; color: black; overflow: visible; }
}
`;

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

          {/* topbar — fixed inside .main, never scrolls away */}
          <div className="topbar">
            <div className="topbar-breadcrumb">
              <span>Admin</span>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
              <span className="crumb-link" onClick={() => history.push('/admin-reports')}>Reports</span>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
              <span className="crumb-active">{record.name}</span>
            </div>
            <div className="topbar-right">
              <button className="topbar-btn" title="Print" onClick={() => window.print()}>
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
              </button>
            </div>
          </div>

          {/* ── SCROLL AREA: only this div scrolls ── */}
          <div className="scroll-area">
            <div className="page-content">

              <button className="btn-back" onClick={() => history.push('/admin-reports')}>
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                Back to Reports
              </button>

              <div className="detail-grid">

                {/* ── LEFT: profile card ── */}
                <div className="profile-card">
                  <div className="profile-banner" />
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
                    <div className="profile-id">{record.id}</div>
                    <div className="profile-course">{record.course}</div>

                    <div className="profile-status-row">
                      <span
                        className="profile-status-badge"
                        style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.ring }}
                      >
                        <span className="profile-status-dot" style={{ background: cfg.color }} />
                        {cfg.label}
                      </span>
                    </div>

                    <div className="divider" />

                    <div className="meta-list">
                      {/* date */}
                      <div className="meta-item">
                        <div className="meta-icon-wrap">
                          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        </div>
                        <div>
                          <div className="meta-label">Report Date</div>
                          <div className="meta-val">{record.date}</div>
                        </div>
                      </div>
                      {/* time */}
                      <div className="meta-item">
                        <div className="meta-icon-wrap">
                          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        </div>
                        <div>
                          <div className="meta-label">Time Rendered</div>
                          <div className="meta-val">{record.timeIn} – {record.timeOut}</div>
                        </div>
                      </div>
                      {/* attachment */}
                      <div className="meta-item">
                        <div className="meta-icon-wrap">
                          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                        </div>
                        <div>
                          <div className="meta-label">Attachment</div>
                          <div className="meta-val">{record.attachment}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── RIGHT: detail cards ── */}
                <div className="detail-col">

                  {/* ── card 1: Time Record ── */}
                  <div className="detail-card">
                    <div className="card-head">
                      <div className="card-head-icon">
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      </div>
                      <div className="card-head-title">Time Record</div>
                    </div>
                    <div className="card-body">
                      <div className="time-row">
                        <div className="time-block">
                          <div className="time-block-label">Time In</div>
                          <div className="time-block-val">{record.timeIn}</div>
                          <div className="time-block-sub">Start of duty</div>
                        </div>
                        <div className="time-arrow">
                          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                        </div>
                        <div className="time-block">
                          <div className="time-block-label">Time Out</div>
                          <div className="time-block-val">{record.timeOut}</div>
                          <div className="time-block-sub">End of duty</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ── card 2: Description ── */}
                  <div className="detail-card">
                    <div className="card-head">
                      <div className="card-head-icon">
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                      </div>
                      <div className="card-head-title">Report Description</div>
                    </div>
                    <div className="card-body">
                      <div className="desc-box">{record.description}</div>
                    </div>
                  </div>

                  {/* ── card 3: Attachment ── */}
                  <div className="detail-card">
                    <div className="card-head">
                      <div className="card-head-icon">
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                      </div>
                      <div className="card-head-title">Submitted Attachment</div>
                    </div>
                    <div className="card-body">
                      <a href="#" className="attach-row">
                        <div className="attach-file-icon">
                          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                        </div>
                        <div className="attach-info">
                          <div className="attach-name">{record.attachment}</div>
                          <div className="attach-meta">PDF Document · Click to download</div>
                        </div>
                        <div className="attach-dl">
                          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        </div>
                      </a>
                    </div>
                  </div>

                  {/* ── card 4: Admin Decision ── */}
                  <div className="detail-card">
                    <div className="card-head">
                      <div className="card-head-icon">
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                      </div>
                      <div className="card-head-title">Admin Decision</div>
                    </div>
                    <div className="card-body">

                      {/* ── PENDING ── */}
                      {status === 'pending' && (
                        <>
                          <p className="decision-hint">
                            This report is awaiting your review. Please approve or decline it below.
                          </p>
                          <div className="action-row">
                            <button className="btn-approve" onClick={() => setStatus('approved')}>
                              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                              Approve Report
                            </button>
                            <button className="btn-decline" onClick={() => setStatus('declined')}>
                              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                              Decline Report
                            </button>
                            <button className="btn-ghost-action" onClick={() => history.push('/admin-reports')}>
                              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                              Back
                            </button>
                          </div>
                        </>
                      )}

                      {/* ── APPROVED ── */}
                      {status === 'approved' && (
                        <>
                          <div
                            className="resolved-banner"
                            style={{ background: 'var(--ok-bg)', borderColor: 'var(--ok-ring)', color: 'var(--ok)' }}
                          >
                            <div className="resolved-icon" style={{ background: 'var(--ok)' }}>
                              <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                            </div>
                            <div>
                              <div className="resolved-title">Report Approved</div>
                              <div className="resolved-sub">This report has been reviewed and approved.</div>
                            </div>
                          </div>
                          <div className="action-row">
                            <button className="btn-decline" onClick={() => setStatus('declined')}>
                              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                              Change to Declined
                            </button>
                            <button className="btn-ghost-action" onClick={() => history.push('/admin-reports')}>
                              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                              Back to Reports
                            </button>
                          </div>
                        </>
                      )}

                      {/* ── DECLINED ── */}
                      {status === 'declined' && (
                        <>
                          <div
                            className="resolved-banner"
                            style={{ background: 'var(--danger-bg)', borderColor: 'var(--danger-ring)', color: 'var(--danger)' }}
                          >
                            <div className="resolved-icon" style={{ background: 'var(--danger)' }}>
                              <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </div>
                            <div>
                              <div className="resolved-title">Report Declined</div>
                              <div className="resolved-sub">This report has been reviewed and declined.</div>
                            </div>
                          </div>
                          <div className="action-row">
                            <button className="btn-approve" onClick={() => setStatus('approved')}>
                              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                              Change to Approved
                            </button>
                            <button className="btn-ghost-action" onClick={() => history.push('/admin-reports')}>
                              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                              Back to Reports
                            </button>
                          </div>
                        </>
                      )}

                    </div>
                  </div>

                </div>{/* /detail-col */}
              </div>{/* /detail-grid */}
            </div>{/* /page-content */}
          </div>{/* /scroll-area */}
        </div>{/* /main */}
      </div>{/* /shell */}

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

export default AdminReportDetail;