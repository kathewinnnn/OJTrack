import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import LogoutModal from './LogoutModal';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeMenu?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeMenu }) => {
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleConfirm = () => {
    setIsLoggingOut(true);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
  };

  const handleCancel = () => setShowModal(false);

  const handleLogoutComplete = () => {
    setIsLoggingOut(false);
    history.replace('/login');
  };

  const navTo = (path: string) => history.push(path);

  return (
    <>
      <style>{`
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --brand: #5f0076; --brand-dark: #3d004c; --brand-mid: #7a1896;
  --brand-soft: #f3e6f8; --brand-glow: rgba(95,0,118,.15);
  --ink: #1a1025; --ink-2: #3d3049; --ink-3: #7b6e89; --rule: #ede6f2;
  --bg: #f7f4fb; --surface: #ffffff;
  --r-md: 10px; --r-lg: 16px; --r-xl: 22px; --r-full: 9999px;
  --sh-sm: 0 1px 3px rgba(0,0,0,.06); --sidebar-w: 252px;
  --ease: cubic-bezier(.4,0,.2,1);
}
html, body { height: 100%; font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--ink); }
.shell { display: flex; min-height: 100vh; }

/* SIDEBAR */
.sidebar { width: var(--sidebar-w); flex-shrink: 0; background: var(--brand-dark); display: flex; flex-direction: column; position: sticky; top: 0; height: 100vh; overflow-y: auto; z-index: 10; }
.sidebar-logo { padding: 28px 24px 20px; border-bottom: 1px solid rgba(255,255,255,.08); }
.sidebar-logo-mark { display: flex; align-items: center; gap: 10px; }
.sidebar-logo-icon { width: 36px; height: 36px; background: linear-gradient(135deg, var(--brand-mid), #c752f0); border-radius: var(--r-md); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.sidebar-logo-icon svg { stroke: #fff; width: 20px; height: 20px; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.sidebar-logo-text { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700; color: #fff; letter-spacing: .01em; line-height: 1.2; }
.sidebar-logo-sub { font-size: .7rem; color: rgba(255,255,255,.45); font-weight: 400; letter-spacing: .04em; text-transform: uppercase; }
.sidebar-profile { padding: 20px 24px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid rgba(255,255,255,.08); }
.sidebar-avatar { width: 42px; height: 42px; border-radius: 50%; background: linear-gradient(135deg, var(--brand-mid), #c752f0); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-family: 'Syne', sans-serif; font-size: .95rem; font-weight: 700; color: #fff; }
.sidebar-profile-name { font-size: .9rem; font-weight: 600; color: #fff; }
.sidebar-profile-role { font-size: .75rem; color: rgba(255,255,255,.45); }
.sidebar-nav { flex: 1; padding: 16px 12px; }
.nav-section-label { font-size: .65rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: rgba(255,255,255,.3); padding: 8px 12px 6px; }
.sidebar-nav ul { list-style: none; display: flex; flex-direction: column; gap: 2px; }
.nav-btn { display: flex; align-items: center; gap: 10px; width: 100%; padding: 9px 12px; border-radius: var(--r-md); background: none; border: none; cursor: pointer; color: rgba(255,255,255,.6); font-size: .875rem; font-weight: 500; font-family: 'DM Sans', sans-serif; text-align: left; transition: all .18s var(--ease); }
.nav-btn:hover { background: rgba(255,255,255,.08); color: #fff; }
.nav-btn.active { background: rgba(255,255,255,.13); color: #fff; font-weight: 600; }
.nav-btn.active .nav-icon { opacity: 1; }
.nav-icon { width: 18px; height: 18px; opacity: .6; flex-shrink: 0; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.sidebar-footer { padding: 12px; border-top: 1px solid rgba(255,255,255,.08); }
.nav-btn-logout { display: flex; align-items: center; gap: 10px; width: 100%; padding: 9px 12px; border-radius: var(--r-md); background: none; border: none; cursor: pointer; color: rgba(255,255,255,.5); font-size: .875rem; font-weight: 500; font-family: 'DM Sans', sans-serif; text-align: left; transition: all .18s var(--ease); }
.nav-btn-logout:hover { background: rgba(0,0,0,.12); color: #ff7070; }

/* MAIN */
.main { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.topbar { height: 60px; background: var(--surface); border-bottom: 1px solid var(--rule); display: flex; align-items: center; justify-content: space-between; padding: 0 32px; position: sticky; top: 0; z-index: 5; box-shadow: var(--sh-sm); }
.topbar-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: .85rem; color: var(--ink-3); }
.topbar-breadcrumb .crumb-active { color: var(--ink); font-weight: 600; }
.topbar-breadcrumb svg { width: 14px; height: 14px; stroke: var(--ink-3); fill: none; stroke-width: 2; stroke-linecap: round; }
.topbar-right { display: flex; align-items: center; gap: 12px; }
.topbar-date { font-size: .8125rem; font-weight: 600; color: var(--brand); background: var(--brand-soft); padding: 6px 14px; border-radius: var(--r-full); border: 1px solid rgba(95,0,118,.12); }
.topbar-btn { width: 36px; height: 36px; border-radius: var(--r-md); border: 1px solid var(--rule); background: var(--bg); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .18s var(--ease); }
.topbar-btn:hover { background: var(--brand-soft); border-color: var(--brand-glow); }
.topbar-btn svg { width: 18px; height: 18px; stroke: var(--ink-2); fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.page-content { padding: 28px 32px 48px; flex: 1; }

/* BACK BUTTON */
.back-link { display: inline-flex; align-items: center; gap: 7px; color: var(--ink-3); font-size: .85rem; font-weight: 500; padding: 6px 12px 6px 8px; border-radius: var(--r-md); border: 1px solid var(--rule); background: var(--surface); transition: all .18s var(--ease); margin-bottom: 24px; box-shadow: var(--sh-sm); cursor: pointer; font-family: 'DM Sans', sans-serif; }
.back-link:hover { background: var(--brand-soft); border-color: var(--brand-glow); color: var(--brand); transform: translateX(-2px); }
.back-link svg { width: 14px; height: 14px; stroke: currentColor; fill: none; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }

/* PAGE HEADER */
.page-header { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 28px; animation: fadeUp .3s var(--ease) both; }
.page-header-title { font-family: 'Syne', sans-serif; font-size: 1.6rem; font-weight: 800; color: var(--ink); letter-spacing: -.02em; line-height: 1.1; }
.page-header-sub { margin-top: 5px; font-size: .875rem; color: var(--ink-3); font-weight: 400; }

/* FORM LAYOUT */
.form-layout { display: grid; grid-template-columns: 1fr 300px; gap: 20px; align-items: start; animation: fadeUp .3s .06s var(--ease) both; }

/* CARDS */
.card { background: var(--surface); border: 1px solid var(--rule); border-radius: var(--r-xl); box-shadow: var(--sh-sm); overflow: hidden; }
.card-head { display: flex; align-items: center; gap: 10px; padding: 18px 24px; border-bottom: 1px solid var(--rule); }
.card-accent { width: 3px; height: 18px; background: var(--brand); border-radius: 2px; flex-shrink: 0; }
.card-title { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700; color: var(--ink); }
.card-body { padding: 24px; }

/* FORM FIELDS */
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group.span-full { grid-column: 1 / -1; }
label { font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: var(--ink-3); }
label span.req { color: var(--brand); margin-left: 2px; }
input[type="text"], input[type="email"], input[type="number"], input[type="date"], input[type="file"], select { width: 100%; padding: 10px 14px; border-radius: var(--r-md); border: 1.5px solid var(--rule); background: var(--bg); font-size: .9rem; font-family: 'DM Sans', sans-serif; color: var(--ink); transition: all .18s var(--ease); outline: none; }
input:focus, select:focus { border-color: var(--brand); background: var(--surface); box-shadow: 0 0 0 3px var(--brand-glow); }
input::placeholder { color: var(--ink-3); }
select { cursor: pointer; }

/* UPLOAD ZONE */
.upload-zone { border: 2px dashed var(--rule); border-radius: var(--r-lg); padding: 28px 20px; text-align: center; cursor: pointer; transition: all .18s var(--ease); background: var(--bg); position: relative; }
.upload-zone:hover { border-color: var(--brand); background: var(--brand-soft); }
.upload-zone input[type="file"] { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
.upload-icon { font-size: 2rem; margin-bottom: 8px; }
.upload-label { font-size: .875rem; font-weight: 600; color: var(--ink-2); margin-bottom: 4px; }
.upload-sub { font-size: .75rem; color: var(--ink-3); }

/* SIDE CARDS */
.summary-avatar { width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, var(--brand), var(--brand-mid)); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-family: 'Syne', sans-serif; font-size: 2rem; font-weight: 800; color: rgba(255,255,255,.4); }
.summary-placeholder { text-align: center; color: var(--ink-3); font-size: .85rem; }
.summary-placeholder strong { display: block; font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700; color: var(--ink); margin-bottom: 4px; }
.tips-list { display: flex; flex-direction: column; gap: 8px; }
.tip-item { display: flex; align-items: flex-start; gap: 10px; padding: 10px 12px; border-radius: var(--r-md); background: var(--bg); border: 1px solid var(--rule); font-size: .8rem; color: var(--ink-3); line-height: 1.4; }
.tip-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--brand); flex-shrink: 0; margin-top: 5px; }

/* FORM ACTIONS */
.form-actions { display: flex; gap: 12px; justify-content: flex-end; padding: 20px 24px; border-top: 1px solid var(--rule); background: var(--bg); }
.btn-cancel { display: inline-flex; align-items: center; gap: 7px; padding: 10px 20px; border-radius: var(--r-md); border: 1.5px solid var(--rule); background: var(--surface); color: var(--ink-2); font-size: .875rem; font-weight: 600; cursor: pointer; transition: all .18s var(--ease); font-family: 'DM Sans', sans-serif; }
.btn-cancel:hover { background: var(--bg); border-color: var(--ink-3); }
.btn-submit { display: inline-flex; align-items: center; gap: 7px; padding: 10px 24px; border-radius: var(--r-md); border: none; background: var(--brand); color: #fff; font-size: .875rem; font-weight: 600; cursor: pointer; transition: all .18s var(--ease); font-family: 'DM Sans', sans-serif; box-shadow: 0 2px 8px var(--brand-glow); }
.btn-submit:hover { background: var(--brand-mid); transform: translateY(-1px); box-shadow: 0 4px 14px var(--brand-glow); }
.btn-submit svg, .btn-cancel svg { width: 14px; height: 14px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

@keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }

/* RESPONSIVE */
@media (max-width: 1100px) { .form-layout { grid-template-columns: 1fr; } }
@media (max-width: 840px) {
  :root { --sidebar-w: 60px; }
  .sidebar-logo-text, .sidebar-logo-sub, .sidebar-profile-name, .sidebar-profile-role, .nav-label, .sidebar-footer span, .nav-section-label { display: none; }
  .sidebar-logo { padding: 18px 12px; }
  .sidebar-logo-mark { justify-content: center; }
  .sidebar-profile { padding: 12px; justify-content: center; }
  .nav-btn, .nav-btn-logout { padding: 10px; justify-content: center; gap: 0; }
  .page-content { padding: 20px 16px 40px; }
}
@media (max-width: 640px) {
  .form-grid { grid-template-columns: 1fr; }
  .form-group.span-full { grid-column: 1; }
  .form-actions { flex-direction: column; }
  .btn-cancel, .btn-submit { justify-content: center; }
  .page-content { padding: 16px; }
}
      `}</style>

      <div className="shell">
        {/* ─── SIDEBAR ─────────────────────────── */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-logo-mark">
              <div className="sidebar-logo-icon">
                <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <div>
                <div className="sidebar-logo-text">ISPSC OJT</div>
                <div className="sidebar-logo-sub">Admin Panel</div>
              </div>
            </div>
          </div>

          <div className="sidebar-profile">
            <div className="sidebar-avatar">AU</div>
            <div>
              <div className="sidebar-profile-name">Admin User</div>
              <div className="sidebar-profile-role">Administrator</div>
            </div>
          </div>

          <nav className="sidebar-nav">
            <div className="nav-section-label">Main</div>
            <ul>
              <li>
                <button className={`nav-btn ${activeMenu === 'dashboard' ? 'active' : ''}`} onClick={() => navTo('/admin-dashboard')}>
                  <svg className="nav-icon" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                  <span className="nav-label">Dashboard</span>
                </button>
              </li>
              <li>
                <button className={`nav-btn ${activeMenu === 'trainees' ? 'active' : ''}`} onClick={() => navTo('/admin-trainees')}>
                  <svg className="nav-icon" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  <span className="nav-label">Trainees</span>
                </button>
              </li>
              <li>
                <button className={`nav-btn ${activeMenu === 'supervisors' ? 'active' : ''}`} onClick={() => navTo('/admin-supervisors')}>
                  <svg className="nav-icon" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
                  <span className="nav-label">Supervisors</span>
                </button>
              </li>
              {/* ── NEW: Assignment menu item ── */}
              <li>
                <button className={`nav-btn ${activeMenu === 'assignment' ? 'active' : ''}`} onClick={() => navTo('/admin-assignment')}>
                  <svg className="nav-icon" viewBox="0 0 24 24">
                    <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2"/>
                    <path d="M10 7H7a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3"/>
                    <path d="M10 3h4v4h-4z"/>
                    <line x1="19" y1="3" x2="19" y2="9"/><line x1="22" y1="6" x2="16" y2="6"/>
                  </svg>
                  <span className="nav-label">Assignment</span>
                </button>
              </li>
              <li>
                <button className={`nav-btn ${activeMenu === 'attendance' ? 'active' : ''}`} onClick={() => navTo('/admin-attendance')}>
                  <svg className="nav-icon" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  <span className="nav-label">Attendance</span>
                </button>
              </li>
            </ul>
            <div className="nav-section-label" style={{ marginTop: '16px' }}>Reports</div>
            <ul>
              <li>
                <button className={`nav-btn ${activeMenu === 'reports' ? 'active' : ''}`} onClick={() => navTo('/admin-reports')}>
                  <svg className="nav-icon" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                  <span className="nav-label">Reports</span>
                </button>
              </li>
              <li>
                <button className={`nav-btn ${activeMenu === 'progress' ? 'active' : ''}`} onClick={() => navTo('/admin-progress')}>
                  <svg className="nav-icon" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                  <span className="nav-label">Progress</span>
                </button>
              </li>
            </ul>
          </nav>

          <div className="sidebar-footer">
            <button className="nav-btn-logout" onClick={() => setShowModal(true)}>
              <svg className="nav-icon" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* ─── MAIN CONTENT ─────────────────────── */}
        <div className="main">
          {children}
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

export default AdminLayout;