import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const history = useHistory();

  const handleLogoutTrigger = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleConfirm = () => {
    // Handle logout logic here
    window.location.href = '#';
  };

  const handleModalClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowModal(false);
    }
  };

  return (
    <>
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
                <a onClick={() => history.push('/admin-dashboard')} className="active">
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
                <a onClick={() => history.push('/admin-trainees')}>
                  <svg className="nav-icon" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  <span className="nav-label">Trainees</span>
                </a>
              </li>
              <li>
                <a onClick={() => history.push('/admin-supervisors')}>
                  <svg className="nav-icon" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
                  <span className="nav-label">Supervisors</span>
                </a>
              </li>
              <li>
                <a onClick={() => history.push('/admin-attendance')}>
                  <svg className="nav-icon" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  <span className="nav-label">Attendance</span>
                </a>
              </li>
            </ul>

            <div className="nav-section-label" style={{ marginTop: '16px' }}>Reports</div>
            <ul>
              <li>
                <a onClick={() => history.push('/admin-reports')}>
                  <svg className="nav-icon" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                  <span className="nav-label">Reports</span>
                </a>
              </li>
              <li>
                <a onClick={() => history.push('/admin-progress')}>
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
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
              <span className="crumb-active">Dashboard</span>
            </div>
            <div className="topbar-right">
              <span className="topbar-date">Feb 17, 2026</span>
              <button className="topbar-btn" title="Notifications">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
              </button>
              <button className="topbar-btn" title="Print" onClick={() => window.print()}>
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 6 2 18 2 18 9"/>
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                  <rect x="6" y="14" width="12" height="8"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="page-content">
            {/* page header */}
            <div className="page-header">
              <div>
                <div className="page-header-title">Welcome back, Admin!</div>
                <div className="page-header-sub">Here's what's happening in your OJT system today.</div>
              </div>
            </div>

            {/* stats */}
            <div className="stats-grid">
              <div className="stat-card stat-card-trainees">
                <div className="stat-icon-wrap ic-trainees">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <div>
                  <div className="stat-label">Total Trainees</div>
                  <div className="stat-val">10</div>
                  <div className="stat-trend trend-up">
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                      <polyline points="17 6 23 6 23 12"/>
                    </svg>
                    +2 this month
                  </div>
                </div>
              </div>

              <div className="stat-card stat-card-reports">
                <div className="stat-icon-wrap ic-reports">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                </div>
                <div>
                  <div className="stat-label">Pending Reports</div>
                  <div className="stat-val">4</div>
                  <div className="stat-trend trend-warn">
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    Needs attention
                  </div>
                </div>
              </div>

              <div className="stat-card stat-card-present">
                <div className="stat-icon-wrap ic-present">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <div>
                  <div className="stat-label">Present Today</div>
                  <div className="stat-val">6</div>
                  <div className="stat-trend trend-up">
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    60% attendance rate
                  </div>
                </div>
              </div>
            </div>

            {/* activity section */}
            <div className="activity-section">
              <div className="section-head">
                <div className="section-head-title">
                  Recent Activity
                  <span className="count-badge">3 entries</span>
                </div>
                <button className="btn-ghost">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                    <polyline points="17 6 23 6 23 12"/>
                  </svg>
                  View All
                </button>
              </div>

              {/* column labels */}
              <div className="list-col-header">
                <div className="col-label">User</div>
                <div className="col-label">Action</div>
                <div className="col-label">Date</div>
              </div>

              <div className="activity-list">
                <div className="activity-row">
                  <div className="row-user">
                    <div className="row-avatar">KG</div>
                    <div className="row-user-name">Katherine Mae Guzman</div>
                  </div>
                  <div className="row-action">
                    <span className="action-pill pill-login">
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                        <polyline points="10 17 15 12 10 7"/>
                        <line x1="15" y1="12" x2="3" y2="12"/>
                      </svg>
                      Logged in
                    </span>
                  </div>
                  <div className="row-date">
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    Feb 15, 2026
                  </div>
                </div>
              </div>
            </div>
          </div>{/* /page-content */}
        </div>{/* /main */}
      </div>{/* /shell */}

      {/* ─── LOGOUT MODAL ─────────────────────── */}
      {showModal && (
        <div className="modal-overlay" id="logout-modal" onClick={handleModalClick}>
          <div className="modal-box">
            <div className="modal-icon">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </div>
            <div className="modal-title">Sign out?</div>
            <div className="modal-msg">You'll need to log back in to access the admin panel.</div>
            <div className="modal-actions">
              <button className="modal-btn modal-btn-cancel" id="modal-cancel" onClick={handleCancel}>Cancel</button>
              <button className="modal-btn modal-btn-confirm" id="modal-confirm" onClick={handleConfirm}>Yes, log out</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;