import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import LogoutModal from '../../components/LogoutModal';

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
  const history  = useHistory();
  const location = useLocation<{ record: AttendanceRecord }>();
  const record   = location.state?.record;

  const [showModal,    setShowModal]    = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Step 1 — clear storage and start the modal's loading/animation state
  const handleConfirm = () => {
    setIsLoggingOut(true);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
  };

  const handleCancel = () => setShowModal(false);

  // Step 2 — called by LogoutModal once its animation/delay finishes → navigate now
  const handleLogoutComplete = () => {
    setIsLoggingOut(false);
    history.replace('/login');
  };

  if (!record) {
    history.replace('/admin-attendance');
    return null;
  }

  const navTo = (path: string) => history.replace(path);

  const statusConfig = {
    present: {
      label: 'Present', color: '#0d7a55', bg: '#d6f4e9', ring: '#9de8cb',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      ),
    },
    late: {
      label: 'Late', color: '#8a5a00', bg: '#fef3c7', ring: '#fcd34d',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
    },
    absent: {
      label: 'Absent', color: '#c0303b', bg: '#fee2e2', ring: '#fca5a5',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
      ),
    },
  };

  const cfg           = statusConfig[record.status];
  const hoursRendered = record.hoursRendered ?? (record.status === 'absent' ? '0h 00m' : '9h 30m');
  const hoursPercent  = record.status === 'absent' ? 0 : record.status === 'late' ? 72 : 100;

  return (
    <AdminLayout activeMenu="attendance">
      <style>{`
        /* ── detail-page-only styles ── */
        .detail-topbar {
          height: 60px; background: var(--surface);
          border-bottom: 1px solid var(--rule);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 32px; position: sticky; top: 0; z-index: 5;
          box-shadow: var(--sh-sm); flex-shrink: 0;
        }
        .topbar-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: .85rem; color: var(--ink-3); }
        .topbar-breadcrumb .crumb-active { color: var(--ink); font-weight: 600; }
        .topbar-breadcrumb svg { width: 14px; height: 14px; stroke: var(--ink-3); fill: none; stroke-width: 2; stroke-linecap: round; }
        .topbar-right { display: flex; align-items: center; gap: 12px; }
        .topbar-btn { width: 36px; height: 36px; border-radius: var(--r-md); border: 1px solid var(--rule); background: var(--bg); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .18s var(--ease); }
        .topbar-btn:hover { background: var(--brand-soft); border-color: var(--brand-glow); }
        .topbar-btn svg { width: 18px; height: 18px; stroke: var(--ink-2); fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

        .detail-scroll { flex: 1; overflow-y: auto; overflow-x: hidden; }
        .detail-page-content { padding: 28px 32px 48px; }

        .btn-back { display: inline-flex; align-items: center; gap: 8px; padding: 9px 16px; background: var(--surface); color: var(--ink-2); border: 1px solid var(--rule); border-radius: var(--r-md); font-size: .875rem; font-weight: 500; cursor: pointer; transition: all .2s var(--ease); font-family: 'DM Sans', sans-serif; margin-bottom: 24px; }
        .btn-back:hover { background: var(--brand-soft); border-color: var(--brand-glow); color: var(--brand); }
        .btn-back svg { width: 16px; height: 16px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

        .detail-wrapper { display: grid; grid-template-columns: 340px 1fr; gap: 20px; animation: detailFadeUp .35s var(--ease) both; }
        @keyframes detailFadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }

        /* Profile card */
        .profile-card { background: var(--surface); border: 1px solid var(--rule); border-radius: var(--r-xl); box-shadow: var(--sh-sm); overflow: hidden; }
        .profile-card-banner { height: 90px; background: linear-gradient(135deg, var(--brand-dark) 0%, var(--brand-mid) 60%, #c752f0 100%); position: relative; }
        .profile-card-banner::after { content: ''; position: absolute; inset: 0; background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"); }
        .profile-avatar-wrap { position: relative; padding: 0 28px; margin-top: -36px; margin-bottom: 16px; }
        .profile-avatar-lg { width: 72px; height: 72px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-size: 1.4rem; font-weight: 800; color: #fff; border: 4px solid var(--surface); box-shadow: 0 4px 16px rgba(95,0,118,.3); }
        .profile-body { padding: 0 28px 28px; }
        .profile-name { font-family: 'Syne', sans-serif; font-size: 1.25rem; font-weight: 800; color: var(--ink); line-height: 1.2; }
        .profile-trainee-id { font-size: .78rem; color: var(--ink-3); margin-top: 3px; font-weight: 500; }
        .profile-status-wrap { margin: 16px 0; }
        .profile-status-badge { display: inline-flex; align-items: center; gap: 8px; padding: 7px 16px; border-radius: var(--r-full); font-size: .8rem; font-weight: 700; border: 1.5px solid; }
        .profile-divider { height: 1px; background: var(--rule); margin: 20px 0; }
        .profile-meta { display: flex; flex-direction: column; gap: 14px; }
        .meta-row { display: flex; align-items: flex-start; gap: 12px; }
        .meta-icon-wrap { width: 34px; height: 34px; border-radius: var(--r-md); background: var(--brand-soft); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .meta-icon-wrap svg { width: 15px; height: 15px; stroke: var(--brand); fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
        .meta-label { font-size: .7rem; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: var(--ink-3); }
        .meta-val { font-size: .875rem; font-weight: 600; color: var(--ink); margin-top: 1px; }

        /* Detail cards */
        .details-col { display: flex; flex-direction: column; gap: 20px; }
        .detail-card { background: var(--surface); border: 1px solid var(--rule); border-radius: var(--r-xl); box-shadow: var(--sh-sm); overflow: hidden; }
        .detail-card-head { padding: 16px 24px; border-bottom: 1px solid var(--rule); display: flex; align-items: center; gap: 10px; }
        .detail-card-head-icon { width: 32px; height: 32px; border-radius: var(--r-md); background: var(--brand-soft); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .detail-card-head-icon svg { width: 15px; height: 15px; stroke: var(--brand); fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
        .detail-card-head-title { font-family: 'Syne', sans-serif; font-size: .9rem; font-weight: 700; color: var(--ink); }
        .detail-card-body { padding: 20px 24px; }

        /* Time grid */
        .time-grid { display: grid; grid-template-columns: 1fr 40px 1fr; align-items: center; }
        .time-block { text-align: center; }
        .time-block-label { font-size: .68rem; font-weight: 700; text-transform: uppercase; letter-spacing: .09em; color: var(--ink-3); margin-bottom: 8px; }
        .time-block-value { font-family: 'Syne', sans-serif; font-size: 1.9rem; font-weight: 800; color: var(--ink); line-height: 1; }
        .time-block-value.absent-val { font-size: 1.1rem; color: var(--ink-3); font-style: italic; font-family: 'DM Sans', sans-serif; font-weight: 400; }
        .time-block-sub { font-size: .72rem; color: var(--ink-3); margin-top: 4px; }
        .time-arrow { display: flex; align-items: center; justify-content: center; }
        .time-arrow svg { width: 20px; height: 20px; stroke: var(--ink-3); fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

        /* Hours bar */
        .hours-bar-wrap { margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--rule); }
        .hours-bar-label { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .hours-bar-text { font-size: .78rem; font-weight: 600; color: var(--ink-2); }
        .hours-bar-val { font-size: .78rem; font-weight: 700; color: var(--brand); }
        .hours-bar-track { height: 8px; background: var(--rule); border-radius: var(--r-full); overflow: hidden; }
        .hours-bar-fill { height: 100%; background: linear-gradient(90deg, var(--brand), #c752f0); border-radius: var(--r-full); transition: width .6s var(--ease); }

        /* Remarks */
        .remarks-box { background: var(--bg); border: 1.5px solid var(--rule); border-radius: var(--r-lg); padding: 16px; font-size: .875rem; color: var(--ink-2); line-height: 1.6; font-style: italic; }
        .remarks-box.no-remarks { color: var(--ink-3); font-style: italic; text-align: center; padding: 24px; }

        /* Timeline */
        .timeline { display: flex; flex-direction: column; }
        .timeline-item { display: flex; gap: 16px; position: relative; }
        .timeline-item:not(:last-child)::before { content: ''; position: absolute; left: 15px; top: 32px; width: 2px; height: calc(100% - 8px); background: var(--rule); }
        .timeline-dot { width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; border: 2px solid var(--rule); background: var(--surface); z-index: 1; }
        .timeline-dot svg { width: 14px; height: 14px; fill: none; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
        .timeline-dot.dot-in  { border-color: #9de8cb; background: #d6f4e9; }
        .timeline-dot.dot-in  svg { stroke: #0d7a55; }
        .timeline-dot.dot-out { border-color: #bfdbfe; background: #dbeafe; }
        .timeline-dot.dot-out svg { stroke: #1456cc; }
        .timeline-dot.dot-none { border-color: var(--rule); background: var(--bg); }
        .timeline-dot.dot-none svg { stroke: var(--ink-3); }
        .timeline-content { padding-bottom: 24px; flex: 1; }
        .timeline-time { font-family: 'Syne', sans-serif; font-size: .875rem; font-weight: 700; color: var(--ink); }
        .timeline-desc { font-size: .78rem; color: var(--ink-3); margin-top: 2px; }

        /* Responsive */
        @media (max-width: 1100px) { .detail-wrapper { grid-template-columns: 1fr; } }
        @media (max-width: 840px)  { .detail-page-content { padding: 20px 16px 40px; } .detail-topbar { padding: 0 16px; } }
        @media (max-width: 480px)  { .time-block-value { font-size: 1.4rem; } }
        @media print {
          .detail-topbar, .btn-back { display: none !important; }
          .detail-page-content { padding: 0; }
          .detail-wrapper { display: block; }
          .profile-card, .detail-card { border: 1px solid #ccc; page-break-inside: avoid; margin-bottom: 16px; }
        }
      `}</style>

      {/* Topbar */}
      <div className="detail-topbar">
        <div className="topbar-breadcrumb">
          <span>Admin</span>
          <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
          <span style={{ cursor: 'pointer' }} onClick={() => navTo('/admin-attendance')}>Attendance</span>
          <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
          <span className="crumb-active">{record.name}</span>
        </div>
        <div className="topbar-right">
          <button className="topbar-btn" title="Notifications">
            <svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="detail-scroll">
        <div className="detail-page-content">

          <button className="btn-back" onClick={() => navTo('/admin-attendance')}>
            <svg viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
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
                  <span className="profile-status-badge" style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.ring }}>
                    {cfg.icon}{cfg.label}
                  </span>
                </div>

                <div className="profile-divider" />

                <div className="profile-meta">
                  <div className="meta-row">
                    <div className="meta-icon-wrap">
                      <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    </div>
                    <div>
                      <div className="meta-label">Date</div>
                      <div className="meta-val">{record.date}</div>
                    </div>
                  </div>
                  <div className="meta-row">
                    <div className="meta-icon-wrap">
                      <svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                    </div>
                    <div>
                      <div className="meta-label">Department</div>
                      <div className="meta-val">{record.department ?? 'Information Technology'}</div>
                    </div>
                  </div>
                  <div className="meta-row">
                    <div className="meta-icon-wrap">
                      <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                    <div>
                      <div className="meta-label">Supervisor</div>
                      <div className="meta-val">{record.supervisor ?? 'Dr. Maria Santos'}</div>
                    </div>
                  </div>
                </div>

                <div className="profile-divider" />
              </div>
            </div>

            {/* ── RIGHT: details col ── */}
            <div className="details-col">

              {/* Time Record */}
              <div className="detail-card">
                <div className="detail-card-head">
                  <div className="detail-card-head-icon">
                    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  </div>
                  <div className="detail-card-head-title">Time Record</div>
                </div>
                <div className="detail-card-body">
                  <div className="time-grid">
                    <div className="time-block">
                      <div className="time-block-label">Time In</div>
                      {record.status !== 'absent'
                        ? <div className="time-block-value">{record.timeIn}</div>
                        : <div className="time-block-value absent-val">No record</div>}
                      {record.status !== 'absent' && (
                        <div className="time-block-sub">{record.status === 'late' ? '⚠ 30 min late' : '✓ On time'}</div>
                      )}
                    </div>
                    <div className="time-arrow">
                      <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </div>
                    <div className="time-block">
                      <div className="time-block-label">Time Out</div>
                      {record.status !== 'absent'
                        ? <div className="time-block-value">{record.timeOut}</div>
                        : <div className="time-block-value absent-val">No record</div>}
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
                    <svg viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                  </div>
                  <div className="detail-card-head-title">Activity Timeline</div>
                </div>
                <div className="detail-card-body">
                  <div className="timeline">
                    {record.status !== 'absent' ? (
                      <>
                        <div className="timeline-item">
                          <div className="timeline-dot dot-in">
                            <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                          </div>
                          <div className="timeline-content">
                            <div className="timeline-time">Clocked In — {record.timeIn}</div>
                            <div className="timeline-desc">{record.status === 'late' ? 'Arrived late — 30 minutes past expected time' : 'Arrived on time'}</div>
                          </div>
                        </div>
                        <div className="timeline-item">
                          <div className="timeline-dot dot-out">
                            <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
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
                          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
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
                    <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
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

        </div>{/* /detail-page-content */}
      </div>{/* /detail-scroll */}

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

export default AdminAttendanceDetail;