import React, { useState } from 'react';
import { useIonRouter } from '@ionic/react';
import LogoutModal from '../../components/LogoutModal';

const AdminTrainees: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const ionRouter = useIonRouter();

  const handleLogoutTrigger = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleConfirm = () => {
    // Handle logout logic here
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    ionRouter.push('/login');
  };

  const handleModalClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowModal(false);
    }
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
  --warn:         #8a3a00;
  --warn-bg:      #fde9d4;
  --warn-ring:    #fbc49a;

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

/* ─── SHELL ─────────────────────────────── */
.shell {
  display: flex;
  min-height: 100vh;
}

/* ─── SIDEBAR ────────────────────────────── */
.sidebar {
  width: var(--sidebar-w);
  flex-shrink: 0;
  background: var(--brand-dark);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  z-index: 10;
}

.sidebar-logo {
  padding: 28px 24px 20px;
  border-bottom: 1px solid rgba(255,255,255,.08);
}
.sidebar-logo-mark {
  display: flex;
  align-items: center;
  gap: 10px;
}
.sidebar-logo-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, var(--brand-mid), #c752f0);
  border-radius: var(--r-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.sidebar-logo-icon svg { stroke: #fff; }
.sidebar-logo-text {
  font-family: 'Syne', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: .01em;
  line-height: 1.2;
}
.sidebar-logo-sub {
  font-size: .7rem;
  color: rgba(255,255,255,.45);
  font-weight: 400;
  letter-spacing: .04em;
  text-transform: uppercase;
}

/* profile */
.sidebar-profile {
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid rgba(255,255,255,.08);
}
.sidebar-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--brand-mid) 0%, #c752f0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-family: 'Syne', sans-serif;
  font-size: .95rem;
  font-weight: 700;
  color: #fff;
}
.sidebar-profile-info { min-width: 0; }
.sidebar-profile-name {
  font-size: .9rem;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.sidebar-profile-role {
  font-size: .75rem;
  color: rgba(255,255,255,.45);
}

/* nav */
.sidebar-nav { flex: 1; padding: 16px 12px; }
.nav-section-label {
  font-size: .65rem;
  font-weight: 700;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: rgba(255,255,255,.3);
  padding: 8px 12px 6px;
}
.sidebar-nav ul { list-style: none; display: flex; flex-direction: column; gap: 2px; }
.sidebar-nav a {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: var(--r-md);
  color: rgba(255,255,255,.6);
  text-decoration: none;
  font-size: .875rem;
  font-weight: 500;
  transition: all .18s var(--ease);
}
.sidebar-nav a:hover { background: rgba(255,255,255,.08); color: #fff; }
.sidebar-nav a.active {
  background: rgba(255,255,255,.13);
  color: #fff;
  font-weight: 600;
}
.sidebar-nav a.active .nav-icon { opacity: 1; }
.nav-icon {
  width: 18px;
  height: 18px;
  opacity: .6;
  flex-shrink: 0;
}

.sidebar-footer {
  padding: 12px;
  border-top: 1px solid rgba(255,255,255,.08);
}
.sidebar-footer a {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: var(--r-md);
  color: rgba(255,255,255,.5);
  text-decoration: none;
  font-size: .875rem;
  font-weight: 500;
  transition: all .18s var(--ease);
}
.sidebar-footer a:hover { background: rgba(0,0,0,.12); color: #ff7070; }

/* ─── MAIN ───────────────────────────────── */
.main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

/* topbar */
.topbar {
  height: 60px;
  background: var(--surface);
  border-bottom: 1px solid var(--rule);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  position: sticky;
  top: 0;
  z-index: 5;
  box-shadow: var(--sh-sm);
}
.topbar-breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: .85rem;
  color: var(--ink-3);
}
.topbar-breadcrumb .crumb-active { color: var(--ink); font-weight: 600; }
.topbar-breadcrumb svg { width: 14px; height: 14px; stroke: var(--ink-3); }

.topbar-right { display: flex; align-items: center; gap: 12px; }
.topbar-btn {
  width: 36px; height: 36px;
  border-radius: var(--r-md);
  border: 1px solid var(--rule);
  background: var(--bg);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: all .18s var(--ease);
  color: var(--ink-2);
}
.topbar-btn:hover { background: var(--brand-soft); border-color: var(--brand-glow); color: var(--brand); }
.topbar-btn svg { width: 18px; height: 18px; stroke: currentColor; }

/* page content */
.page-content { padding: 28px 32px 48px; flex: 1; }

/* page header */
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 28px;
}
.page-header-title {
  font-family: 'Syne', sans-serif;
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--ink);
  letter-spacing: -.02em;
  line-height: 1.1;
}
.page-header-sub {
  margin-top: 5px;
  font-size: .875rem;
  color: var(--ink-3);
  font-weight: 400;
}
.header-actions { display: flex; gap: 10px; align-items: center; }

.btn-primary {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 10px 20px;
  background: var(--brand);
  color: #fff;
  border: none; border-radius: var(--r-md);
  font-size: .875rem; font-weight: 600;
  cursor: pointer;
  transition: all .2s var(--ease);
  box-shadow: 0 2px 8px rgba(95,0,118,.3);
  font-family: 'DM Sans', sans-serif;
}
.btn-primary:hover { background: var(--brand-dark); transform: translateY(-1px); box-shadow: 0 4px 14px rgba(95,0,118,.35); }
.btn-primary:active { transform: none; }
.btn-primary svg { width: 16px; height: 16px; stroke: currentColor; }

.btn-ghost {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 10px 16px;
  background: var(--surface);
  color: var(--ink-2);
  border: 1px solid var(--rule); border-radius: var(--r-md);
  font-size: .875rem; font-weight: 500;
  cursor: pointer;
  transition: all .2s var(--ease);
  font-family: 'DM Sans', sans-serif;
}
.btn-ghost:hover { background: var(--bg); border-color: var(--brand-glow); color: var(--brand); }
.btn-ghost svg { width: 16px; height: 16px; stroke: currentColor; }

/* ─── STATS ──────────────────────────────── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}
.stat-card {
  background: var(--surface);
  border: 1px solid var(--rule);
  border-radius: var(--r-lg);
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: var(--sh-sm);
  transition: all .22s var(--ease);
  cursor: default;
}
.stat-card:hover { transform: translateY(-2px); box-shadow: var(--sh-md); border-color: var(--brand-glow); }
.stat-icon-wrap {
  width: 48px; height: 48px;
  border-radius: var(--r-md);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.stat-icon-wrap svg { width: 24px; height: 24px; stroke: #fff; }
.ic-total   { background: linear-gradient(135deg,#667eea,#764ba2); }
.ic-active  { background: linear-gradient(135deg,#0d7a55,#22c78a); }
.ic-offices { background: linear-gradient(135deg,#d0569b,#f5576c); }
.ic-rate    { background: linear-gradient(135deg,#1a80e5,#2dd4f5); }
.stat-label {
  font-size: .72rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: .07em; color: var(--ink-3);
}
.stat-val {
  font-family: 'Syne', sans-serif;
  font-size: 1.8rem; font-weight: 800; color: var(--ink); line-height: 1.1;
}

/* ─── FILTERS ────────────────────────────── */
.filters-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  background: var(--surface);
  border: 1px solid var(--rule);
  border-radius: var(--r-lg);
  padding: 14px 20px;
  box-shadow: var(--sh-sm);
}
.search-wrap {
  position: relative;
  flex: 1;
  max-width: 420px;
}
.search-wrap svg {
  position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
  width: 16px; height: 16px; stroke: var(--ink-3); pointer-events: none;
}
.search-input {
  width: 100%;
  padding: 9px 12px 9px 36px;
  border: 1.5px solid var(--rule);
  border-radius: var(--r-full);
  font-size: .875rem;
  color: var(--ink);
  background: var(--bg);
  font-family: 'DM Sans', sans-serif;
  transition: all .18s var(--ease);
  outline: none;
}
.search-input::placeholder { color: var(--ink-3); }
.search-input:focus { border-color: var(--brand); background: #fff; box-shadow: 0 0 0 3px var(--brand-glow); }

.filter-sep { width: 1px; height: 28px; background: var(--rule); flex-shrink: 0; }

.filter-label { font-size: .8rem; font-weight: 600; color: var(--ink-3); white-space: nowrap; }
.filter-select {
  padding: 8px 32px 8px 12px;
  border: 1.5px solid var(--rule);
  border-radius: var(--r-md);
  font-size: .875rem;
  color: var(--ink);
  background: var(--bg);
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237b6e89' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  transition: all .18s var(--ease);
}
.filter-select:focus { border-color: var(--brand); box-shadow: 0 0 0 3px var(--brand-glow); }

/* ─── TRAINEES SECTION ───────────────────── */
.trainees-section {
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
  background: var(--brand-soft);
  color: var(--brand);
  padding: 3px 10px;
  border-radius: var(--r-full);
  border: 1px solid rgba(95,0,118,.12);
}

/* column header */
.list-col-header {
  display: grid;
  grid-template-columns: 1fr 220px 130px 100px;
  gap: 0;
  padding: 10px 24px;
  background: var(--bg);
  border-bottom: 1px solid var(--rule);
}
.col-label {
  font-size: .7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .07em;
  color: var(--ink-3);
}

/* trainee rows */
.trainees-list { display: flex; flex-direction: column; }

.trainee-row {
  display: grid;
  grid-template-columns: 1fr 220px 130px 100px;
  align-items: center;
  gap: 0;
  padding: 16px 24px;
  border-bottom: 1px solid var(--rule);
  transition: background .15s var(--ease);
  animation: rowIn .3s var(--ease) both;
}
@keyframes rowIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: none; }
}
.trainee-row:last-child { border-bottom: none; }
.trainee-row:hover { background: var(--brand-soft); }

/* identity cell */
.trainee-identity {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}
.trainee-avatar {
  width: 42px; height: 42px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--brand) 0%, var(--brand-mid) 100%);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  font-family: 'Syne', sans-serif;
  font-size: .85rem; font-weight: 700; color: #fff;
  box-shadow: 0 2px 8px rgba(95,0,118,.25);
}
.trainee-info { min-width: 0; }
.trainee-name {
  font-size: .9375rem;
  font-weight: 700;
  color: var(--ink);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.trainee-id {
  font-size: .72rem;
  color: var(--ink-3);
  margin-top: 1px;
  font-weight: 500;
}

/* office cell */
.trainee-office {
  display: flex; align-items: center; gap: 8px;
  min-width: 0;
}
.trainee-office svg { width: 14px; height: 14px; stroke: var(--ink-3); flex-shrink: 0; }
.office-name {
  font-size: .8125rem;
  color: var(--ink-2);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

/* status cell */
.status-badge {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 5px 12px;
  border-radius: var(--r-full);
  font-size: .78rem;
  font-weight: 600;
  white-space: nowrap;
}
.status-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}
.status-active  { background: var(--ok-bg);   color: var(--ok);   border: 1px solid var(--ok-ring);   }
.status-active  .status-dot { background: var(--ok); }
.status-inactive{ background: var(--warn-bg);  color: var(--warn); border: 1px solid var(--warn-ring); }
.status-inactive .status-dot { background: var(--warn); }

/* actions cell */
.trainee-actions { display: flex; align-items: center; gap: 6px; }
.action-btn {
  width: 34px; height: 34px;
  border: none; border-radius: var(--r-md);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: all .18s var(--ease);
}
.action-btn svg { width: 16px; height: 16px; stroke: currentColor; }
.action-view   { background: #dbeafe; color: var(--blue); }
.action-view:hover  { background: var(--blue); color: #fff; transform: scale(1.1); }
.action-edit   { background: #ffedd5; color: var(--orange); }
.action-edit:hover  { background: var(--orange); color: #fff; transform: scale(1.1); }
.action-delete { background: #fee2e2; color: var(--red); }
.action-delete:hover{ background: var(--red); color: #fff; transform: scale(1.1); }

/* date col */
.join-date {
  display: flex; align-items: center; gap: 6px;
  font-size: .8rem; color: var(--ink-3); font-weight: 500;
}
.join-date svg { width: 13px; height: 13px; stroke: currentColor; }

/* ─── RESPONSIVE ─────────────────────────── */
@media (max-width: 1100px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .list-col-header,
  .trainee-row { grid-template-columns: 1fr 160px 120px 90px; }
}
@media (max-width: 840px) {
  :root { --sidebar-w: 60px; }
  .sidebar-logo-text, .sidebar-logo-sub,
  .sidebar-profile-info, .nav-label,
  .sidebar-footer span,
  .nav-section-label { display: none; }
  .sidebar-logo { padding: 18px 12px; }
  .sidebar-logo-mark { justify-content: center; }
  .sidebar-profile { padding: 12px; justify-content: center; }
  .sidebar-nav a, .sidebar-footer a { padding: 10px; justify-content: center; gap: 0; }
  .page-content { padding: 20px 16px 40px; }
  .list-col-header { display: none; }
  .trainee-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .trainee-office { margin-left: 56px; }
  .trainee-actions { margin-left: 56px; }
}
@media (max-width: 600px) {
  .stats-grid { grid-template-columns: 1fr 1fr; }
  .filters-bar { flex-wrap: wrap; }
  .search-wrap { max-width: 100%; }
  .page-header { flex-direction: column; gap: 12px; }
}

/* ─── LOGOUT MODAL ───────────────────────── */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(26,16,37,.45);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  z-index: 100;
  animation: fadeIn .2s var(--ease);
}
.modal-box {
  background: var(--surface);
  border-radius: var(--r-xl);
  padding: 32px;
  max-width: 380px; width: 90%;
  box-shadow: var(--sh-lg);
  text-align: center;
  animation: slideUp .25s var(--ease);
}
.modal-icon {
  width: 56px; height: 56px;
  border-radius: 50%;
  background: #fee2e2;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 16px;
}
.modal-icon svg { width: 26px; height: 26px; stroke: var(--red); }
.modal-title {
  font-family: 'Syne', sans-serif;
  font-size: 1.2rem; font-weight: 700; color: var(--ink);
  margin-bottom: 8px;
}
.modal-msg { font-size: .875rem; color: var(--ink-3); margin-bottom: 24px; }
.modal-actions { display: flex; gap: 10px; justify-content: center; }
.modal-btn {
  padding: 10px 22px;
  border: none; border-radius: var(--r-md);
  font-size: .875rem; font-weight: 600;
  cursor: pointer;
  transition: all .18s var(--ease);
  font-family: 'DM Sans', sans-serif;
}
.modal-btn-confirm { background: var(--red); color: #fff; }
.modal-btn-confirm:hover { background: #a02530; transform: translateY(-1px); }
.modal-btn-cancel { background: var(--bg); color: var(--ink-2); border: 1px solid var(--rule); }
.modal-btn-cancel:hover { background: var(--rule); }
@keyframes fadeIn  { from { opacity: 0; }  to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(16px) scale(.97); } to { opacity: 1; transform: none; } }`;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="shell">

        {/* ─── SIDEBAR ─────────────────────────── */}
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
                <a onClick={() => ionRouter.push('/admin-dashboard')}>
                  <svg className="nav-icon" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                    <rect x="3" y="3" width="7" height="7"/>
                    <rect x="14" y="3" width="7" height="7"/>
                    <rect x="14" y="14" width="7" height="7"/>
                    <rect x="3" y="14" width="7" height="7"/>
                  </svg>
                  <span className="nav-label">Dashboard</span>
                </a>
              </li>
              <li>
                <a href="AdminTrainees.html" className="active">
                  <svg className="nav-icon" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  <span className="nav-label">Trainees</span>
                </a>
              </li>
              <li>
                <a onClick={() => ionRouter.push('/admin-supervisors')}>
                  <svg className="nav-icon" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
                  <span className="nav-label">Supervisors</span>
                </a>
              </li>
              <li>
                <a onClick={() => ionRouter.push('/admin-attendance')}>
                  <svg className="nav-icon" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  <span className="nav-label">Attendance</span>
                </a>
              </li>
            </ul>

            <div className="nav-section-label" style={{ marginTop: '16px' }}>Reports</div>
            <ul>
              <li>
                <a onClick={() => ionRouter.push('/admin-reports')}>
                  <svg className="nav-icon" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                  <span className="nav-label">Reports</span>
                </a>
              </li>
              <li>
                <a onClick={() => ionRouter.push('/admin-progress')}>
                  <svg className="nav-icon" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                  <span className="nav-label">Progress</span>
                </a>
              </li>
            </ul>
          </nav>

          <div className="sidebar-footer">
            <a href="#logout" id="logout-trigger" onClick={handleLogoutTrigger}>
              <svg className="nav-icon" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              <span>Logout</span>
            </a>
          </div>
        </aside>

        {/* ─── MAIN CONTENT ─────────────────────── */}
        <div className="main">

          {/* topbar */}
          <div className="topbar">
            <div className="topbar-breadcrumb">
              <span>Admin</span>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
              <span className="crumb-active">Trainees</span>
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

            {/* page header */}
            <div className="page-header">
              <div>
                <div className="page-header-title">Trainee Management</div>
                <div className="page-header-sub">Oversee and manage trainee information, assignments, and progress tracking</div>
              </div>
              <div className="header-actions">
                <button className="btn-ghost">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Export
                </button>
                <button className="btn-primary" onClick={() => ionRouter.push('/admin-add-trainee')}>
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Add New Trainee
                </button>
              </div>
            </div>

            {/* stats */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon-wrap ic-total">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <div>
                  <div className="stat-label">Total Trainees</div>
                  <div className="stat-val">3</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon-wrap ic-active">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <div>
                  <div className="stat-label">Active Trainees</div>
                  <div className="stat-val">2</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon-wrap ic-offices">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                </div>
                <div>
                  <div className="stat-label">Partner Offices</div>
                  <div className="stat-val">3</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon-wrap ic-rate">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                </div>
                <div>
                  <div className="stat-label">Active Rate</div>
                  <div className="stat-val">67%</div>
                </div>
              </div>
            </div>

            {/* filters */}
            <div className="filters-bar">
              <div className="search-wrap">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
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

            {/* trainees section */}
            <div className="trainees-section">
              <div className="section-head">
                <div className="section-head-title">
                  Trainees Directory
                  <span className="count-badge">3 entries</span>
                </div>
              </div>

              {/* column labels */}
              <div className="list-col-header">
                <div className="col-label">Trainee</div>
                <div className="col-label">Office</div>
                <div className="col-label">Status</div>
                <div className="col-label">Actions</div>
              </div>

              {/* rows */}
              <div className="trainees-list">

                {/* row 1 */}
                <div className="trainee-row">
                  <div className="trainee-identity">
                    <div className="trainee-avatar">KG</div>
                    <div className="trainee-info">
                      <div className="trainee-name">Katherine Mae Guzman</div>
                      <div className="trainee-id">A23-00502 &nbsp;·&nbsp;
                        <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                          Jan 15, 2024
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="trainee-office">
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    <span className="office-name">ISPSC Sta. Maria – CCS</span>
                  </div>
                  <div>
                    <span className="status-badge status-active">
                      <span className="status-dot"></span>Active
                    </span>
                  </div>
                  <div className="trainee-actions">
                    <button className="action-btn action-view" title="View">
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                    <button className="action-btn action-edit" title="Edit">
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button className="action-btn action-delete" title="Delete">
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                    </button>
                  </div>
                </div>

                {/* row 2 */}
                <div className="trainee-row">
                  <div className="trainee-identity">
                    <div className="trainee-avatar">MR</div>
                    <div className="trainee-info">
                      <div className="trainee-name">Mark Raffy D. Romero</div>
                      <div className="trainee-id">A23-00503 &nbsp;·&nbsp;
                        <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                          Feb 10, 2024
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="trainee-office">
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    <span className="office-name">ISPSC Main – Engineering Dept.</span>
                  </div>
                  <div>
                    <span className="status-badge status-active">
                      <span className="status-dot"></span>Active
                    </span>
                  </div>
                  <div className="trainee-actions">
                    <button className="action-btn action-view" title="View">
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                    <button className="action-btn action-edit" title="Edit">
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button className="action-btn action-delete" title="Delete">
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                    </button>
                  </div>
                </div>

                {/* row 3 */}
                <div className="trainee-row">
                  <div className="trainee-identity">
                    <div className="trainee-avatar" style={{background: 'linear-gradient(135deg,#8a3a00,#d97706)'}}>SL</div>
                    <div className="trainee-info">
                      <div className="trainee-name">Samantha Nicole B. Lumpaodan</div>
                      <div className="trainee-id">A23-00504 &nbsp;·&nbsp;
                        <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                          Nov 20, 2023
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="trainee-office">
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    <span className="office-name">ISPSC Alfonso Lista – Business Admin.</span>
                  </div>
                  <div>
                    <span className="status-badge status-inactive">
                      <span className="status-dot"></span>Inactive
                    </span>
                  </div>
                  <div className="trainee-actions">
                    <button className="action-btn action-view" title="View">
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                    <button className="action-btn action-edit" title="Edit">
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button className="action-btn action-delete" title="Delete">
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                    </button>
                  </div>
                </div>

              </div>{/* /trainees-list */}
            </div>{/* /trainees-section */}

          </div>{/* /page-content */}
        </div>{/* /main */}

        {/* Trainee Detail Modal */}
        <div id="trainee-modal" className="modal-overlay" style={{display: 'none'}}>
          <div className="modal-container">
            <div className="modal-header">
              <h2>Trainee Details</h2>
              <button className="modal-close">&times;</button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <div className="detail-avatar">
                  <div className="trainee-avatar-large" id="modal-avatar">JD</div>
                </div>
                <div className="detail-info">
                  <h3 id="modal-name">John Doe</h3>
                  <p id="modal-id">ID: A23-00123</p>
                  <p id="modal-email">Email: john.doe@example.com</p>
                  <p id="modal-phone">Phone: +63 912 345 6789</p>
                  <p id="modal-office">Office: ISPSC Main – Computer Science</p>
                  <p id="modal-status">Status: Active</p>
                  <p id="modal-join-date">Join Date: Oct 15, 2023</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── LOGOUT MODAL ─────────────────────── */}
        <LogoutModal
          isOpen={showModal}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />

      </div>{/* /shell */}
    </>
  );
};

export default AdminTrainees;
