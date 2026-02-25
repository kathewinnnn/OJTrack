import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import LogoutModal from '../../components/LogoutModal';
import { SUPERVISOR_NAV_KEY, SupervisorNavIntent } from './AdminSupervisors';

interface SupervisorData {
  fullName: string;
  birthday: string;
  email: string;
  contact: string;
  address: string;
  office: string;
  status: 'Active' | 'Inactive';
}

const STORAGE_KEY = 'supervisor_SUP00101';

const defaultData: SupervisorData = {
  fullName: 'Juan Dela Cruz',
  birthday: '1980-05-15',
  email: 'juan.delacruz@example.com',
  contact: '09123456789',
  address: 'Candon City, Ilocos Sur',
  office: 'LTO Office — Candon City',
  status: 'Active',
};

const AdminSupervisorDetail: React.FC = () => {
  const history = useHistory();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // ── Persistent data ───────────────────────────────────────────────────────
  const [data, setData] = useState<SupervisorData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...defaultData, ...JSON.parse(saved) } : defaultData;
    } catch { return defaultData; }
  });
  const [draft, setDraft] = useState<SupervisorData>(data);
  useEffect(() => { setDraft({ ...data }); }, [data]);

  // ── Edit state ───────────────────────────────────────────────────────────
  const [isEditing, setIsEditing]   = useState(false);
  const [isSaving, setIsSaving]     = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // ── Delete state ─────────────────────────────────────────────────────────
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting]           = useState(false);
  const [deleteComplete, setDeleteComplete]   = useState(false);

  // ── Read & consume nav intent written by AdminSupervisors ─────────────────
  // Runs once on mount. Clears the flag immediately so back-navigation won't
  // re-trigger the same action.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SUPERVISOR_NAV_KEY);
      if (!raw) return;
      localStorage.removeItem(SUPERVISOR_NAV_KEY); // consume

      const intent: SupervisorNavIntent = JSON.parse(raw);

      if (intent.action === 'edit') {
        setDraft({ ...data });
        setIsEditing(true);
        setSaveSuccess(false);
        // Small delay so the page has rendered before scrolling
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 80);
      } else if (intent.action === 'delete') {
        setShowDeleteModal(true);
      }
    } catch {
      localStorage.removeItem(SUPERVISOR_NAV_KEY);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty — run once on mount only

  // ── Edit handlers ─────────────────────────────────────────────────────────
  const startEdit  = () => { setDraft({ ...data }); setIsEditing(true); setSaveSuccess(false); };
  const cancelEdit = () => { setDraft({ ...data }); setIsEditing(false); };
  const handleChange = (field: keyof SupervisorData, value: string) =>
    setDraft(prev => ({ ...prev, [field]: value }));

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
      setData({ ...draft });
      setIsEditing(false);
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 800);
  };

  // ── Delete handlers ───────────────────────────────────────────────────────
  const handleDeleteConfirm = () => {
    setIsDeleting(true);
    setTimeout(() => {
      localStorage.removeItem(STORAGE_KEY);
      setIsDeleting(false);
      setDeleteComplete(true);
      setTimeout(() => history.push('/admin-supervisors'), 1200);
    }, 1000);
  };

  // ── Logout ────────────────────────────────────────────────────────────────
  const handleLogoutConfirm = () => {
    setIsLoggingOut(true);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    history.push('/login');
  };
  const handleLogoutCancel   = () => setShowLogoutModal(false);
  const handleLogoutComplete = () => setIsLoggingOut(false);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const initials = data.fullName.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
  const formatBirthday = (iso: string) => {
    if (!iso) return '—';
    const d = new Date(iso + 'T00:00:00');
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const age = new Date().getFullYear() - d.getFullYear();
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} · ${age} years old`;
  };

  return (
    <AdminLayout activeMenu="supervisors">
      <style>{`
/* ── The .main wrapper from AdminLayout scrolls independently ── */
.main { overflow-y: auto; height: 100vh; }

/* ─── TOPBAR ─────────────────────── */
.topbar { height: 60px; background: var(--surface); border-bottom: 1px solid var(--rule); display: flex; align-items: center; justify-content: space-between; padding: 0 32px; position: sticky; top: 0; z-index: 5; box-shadow: var(--sh-sm); flex-shrink: 0; }
.topbar-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: .85rem; color: var(--ink-3); }
.topbar-breadcrumb .crumb-active { color: var(--ink); font-weight: 600; }
.topbar-breadcrumb svg { width: 14px; height: 14px; stroke: var(--ink-3); fill: none; stroke-width: 2; stroke-linecap: round; }
.bc-link { color: var(--ink-3); cursor: pointer; background: none; border: none; font-size: .85rem; font-family: 'DM Sans', sans-serif; transition: color .15s; padding: 0; }
.bc-link:hover { color: var(--brand); }
.topbar-right { display: flex; align-items: center; gap: 12px; }
.topbar-date { font-size: .8125rem; font-weight: 600; color: var(--brand); background: var(--brand-soft); padding: 6px 14px; border-radius: var(--r-full); border: 1px solid rgba(95,0,118,.12); }
.topbar-btn { width: 36px; height: 36px; border-radius: var(--r-md); border: 1px solid var(--rule); background: var(--bg); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .18s var(--ease); }
.topbar-btn:hover { background: var(--brand-soft); border-color: var(--brand-glow); }
.topbar-btn svg { width: 18px; height: 18px; stroke: var(--ink-2); fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

/* ─── PAGE ───────────────────────── */
.page-content { padding: 28px 32px 48px; flex: 1; }
.back-link { display: inline-flex; align-items: center; gap: 7px; color: var(--ink-3); font-size: .85rem; font-weight: 500; padding: 6px 12px 6px 8px; border-radius: var(--r-md); border: 1px solid var(--rule); background: var(--surface); transition: all .18s var(--ease); margin-bottom: 24px; box-shadow: var(--sh-sm); cursor: pointer; font-family: 'DM Sans', sans-serif; }
.back-link:hover { background: var(--brand-soft); border-color: var(--brand-glow); color: var(--brand); transform: translateX(-2px); }
.back-link svg { width: 14px; height: 14px; stroke: currentColor; fill: none; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }

/* ─── BANNERS ────────────────────── */
.banner { display: flex; align-items: center; gap: 10px; border-radius: var(--r-md); padding: 11px 16px; margin-bottom: 20px; font-size: .85rem; font-weight: 500; animation: fadeUp .2s var(--ease) both; }
.banner svg { width: 16px; height: 16px; fill: none; stroke-width: 2; stroke-linecap: round; flex-shrink: 0; }
.banner-edit    { background: #fef9ec; border: 1px solid #fde68a; color: #78530a; }
.banner-edit svg { stroke: #d97706; }
.banner-success { background: #d6f4e9; border: 1px solid #9de8cb; color: #0d7a55; }
.banner-success svg { stroke: #0d7a55; }

/* ─── PROFILE HEADER ─────────────── */
.profile-header { background: var(--surface); border: 1px solid var(--rule); border-radius: var(--r-xl); padding: 28px 32px; margin-bottom: 24px; box-shadow: var(--sh-sm); display: flex; align-items: center; justify-content: space-between; gap: 24px; position: relative; overflow: hidden; animation: fadeUp .3s var(--ease) both; }
.profile-header::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, var(--brand) 0%, #c752f0 100%); }
.profile-left { display: flex; align-items: center; gap: 20px; }
.profile-avatar { width: 72px; height: 72px; border-radius: 50%; background: linear-gradient(135deg, var(--brand) 0%, var(--brand-mid) 100%); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-family: 'Syne', sans-serif; font-size: 1.5rem; font-weight: 800; color: #fff; box-shadow: 0 4px 16px var(--brand-glow); }
.profile-name { font-family: 'Syne', sans-serif; font-size: 1.6rem; font-weight: 800; color: var(--ink); letter-spacing: -.02em; line-height: 1.1; margin-bottom: 6px; }
.profile-meta { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.profile-id { font-size: .8rem; font-weight: 600; color: var(--ink-3); background: var(--bg); padding: 4px 10px; border-radius: var(--r-full); border: 1px solid var(--rule); }
.status-pill { display: inline-flex; align-items: center; gap: 5px; padding: 4px 12px; border-radius: var(--r-full); font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; }
.status-pill::before { content: ''; width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.status-active { background: #d6f4e9; color: #0d7a55; }
.status-active::before { background: #0d7a55; }
.status-inactive { background: #fde9d4; color: #8a3a00; }
.status-inactive::before { background: #d97706; }

.profile-actions { display: flex; gap: 10px; flex-shrink: 0; }
.btn-edit, .btn-del, .btn-save, .btn-cancel-edit {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 9px 18px; border-radius: var(--r-md); border: none;
  font-size: .85rem; font-weight: 600; cursor: pointer;
  transition: all .18s var(--ease); font-family: 'DM Sans', sans-serif;
}
.btn-edit { background: var(--bg); color: var(--ink-2); border: 1px solid var(--rule); }
.btn-edit:hover { background: var(--brand-soft); color: var(--brand); border-color: var(--brand-glow); transform: translateY(-1px); }
.btn-del { background: #fee2e2; color: #c0303b; border: 1px solid #fecaca; }
.btn-del:hover { background: #c0303b; color: #fff; transform: translateY(-1px); }
.btn-save { background: var(--brand); color: #fff; box-shadow: 0 2px 8px rgba(95,0,118,.3); }
.btn-save:hover:not(:disabled) { background: var(--brand-dark); transform: translateY(-1px); }
.btn-save:disabled { opacity: .65; cursor: not-allowed; transform: none; }
.btn-cancel-edit { background: var(--bg); color: var(--ink-2); border: 1px solid var(--rule); }
.btn-cancel-edit:hover { background: var(--surface); border-color: var(--ink-3); }
.btn-edit svg, .btn-del svg, .btn-save svg, .btn-cancel-edit svg { width: 14px; height: 14px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

/* ─── LAYOUT ─────────────────────── */
.detail-layout { display: grid; grid-template-columns: 1fr 340px; gap: 20px; animation: fadeUp .3s .08s var(--ease) both; }

/* ─── CARDS ──────────────────────── */
.card { background: var(--surface); border: 1px solid var(--rule); border-radius: var(--r-xl); box-shadow: var(--sh-sm); overflow: hidden; transition: border-color .2s, box-shadow .2s; }
.card.editing { border-color: rgba(95,0,118,.28); box-shadow: 0 0 0 3px rgba(95,0,118,.08), var(--sh-sm); }
.card-head { display: flex; align-items: center; gap: 10px; padding: 18px 24px; border-bottom: 1px solid var(--rule); }
.card-accent { width: 3px; height: 18px; background: var(--brand); border-radius: 2px; flex-shrink: 0; }
.card-title { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700; color: var(--ink); }
.card-body { padding: 24px; }

/* ─── INFO GRID ──────────────────── */
.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.info-item { display: flex; flex-direction: column; gap: 6px; }
.info-item.span-full { grid-column: 1 / -1; }
.info-label { font-size: .68rem; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--ink-3); }
.info-value { font-size: .9375rem; font-weight: 500; color: var(--ink); line-height: 1.4; }
.info-link { color: var(--brand); text-decoration: none; font-weight: 600; }
.info-link:hover { text-decoration: underline; }

/* ─── FORM FIELDS ────────────────── */
.field-input, .field-select { width: 100%; padding: 9px 12px; border: 1.5px solid var(--rule); border-radius: var(--r-md); font-size: .9rem; font-family: 'DM Sans', sans-serif; color: var(--ink); background: var(--bg); transition: all .18s var(--ease); outline: none; }
.field-input:focus, .field-select:focus { border-color: var(--brand); background: #fff; box-shadow: 0 0 0 3px var(--brand-glow); }
.field-input::placeholder { color: var(--ink-3); }
.field-select { cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237b6e89' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; padding-right: 30px; }

/* ─── TRAINEE LIST ───────────────── */
.trainee-list { display: flex; flex-direction: column; gap: 10px; }
.trainee-row { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: var(--r-md); border: 1px solid var(--rule); background: var(--bg); transition: all .18s var(--ease); cursor: pointer; }
.trainee-row:hover { background: var(--brand-soft); border-color: var(--brand-glow); transform: translateX(2px); }
.trainee-row-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, var(--brand), var(--brand-mid)); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-family: 'Syne', sans-serif; font-size: .72rem; font-weight: 700; color: #fff; box-shadow: 0 2px 6px var(--brand-glow); }
.trainee-row-info { flex: 1; min-width: 0; }
.trainee-row-name { font-size: .875rem; font-weight: 600; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.trainee-row-id { font-size: .75rem; color: var(--ink-3); font-weight: 500; }

/* ─── STATS MINI ─────────────────── */
.stats-mini { display: flex; flex-direction: column; gap: 10px; }
.stat-mini-item { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-radius: var(--r-md); background: var(--bg); border: 1px solid var(--rule); }
.stat-mini-label { font-size: .8rem; color: var(--ink-3); font-weight: 500; }
.stat-mini-val { font-family: 'Syne', sans-serif; font-size: 1.1rem; font-weight: 700; color: var(--brand); }

/* ─── DELETE MODAL ───────────────── */
.modal-overlay { position: fixed; inset: 0; background: rgba(26,16,37,.55); backdrop-filter: blur(4px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px; animation: overlayIn .2s var(--ease) both; }
@keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }
.modal-box { background: var(--surface); border-radius: var(--r-xl); box-shadow: 0 24px 64px rgba(0,0,0,.22); width: 100%; max-width: 440px; overflow: hidden; animation: modalIn .25s var(--ease) both; }
@keyframes modalIn { from { opacity: 0; transform: translateY(16px) scale(.97); } to { opacity: 1; transform: none; } }
.modal-header { padding: 28px 28px 0; display: flex; flex-direction: column; align-items: center; text-align: center; }
.modal-icon-wrap { width: 64px; height: 64px; border-radius: 50%; background: #fee2e2; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
.modal-icon-wrap svg { width: 28px; height: 28px; stroke: #c0303b; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.modal-title { font-family: 'Syne', sans-serif; font-size: 1.3rem; font-weight: 800; color: var(--ink); margin-bottom: 4px; }
.modal-body { padding: 12px 28px 0; text-align: center; }
.modal-desc { font-size: .9rem; color: var(--ink-3); line-height: 1.6; }
.modal-desc strong { color: var(--ink); font-weight: 700; }
.modal-warning { display: flex; align-items: flex-start; gap: 8px; background: #fff8f0; border: 1px solid #fde68a; border-radius: var(--r-md); padding: 10px 14px; margin-top: 14px; text-align: left; }
.modal-warning svg { width: 16px; height: 16px; stroke: #d97706; fill: none; stroke-width: 2; stroke-linecap: round; flex-shrink: 0; margin-top: 1px; }
.modal-warning span { font-size: .8rem; color: #78530a; font-weight: 500; line-height: 1.4; }
.modal-footer { display: flex; gap: 10px; padding: 20px 28px 28px; }
.modal-btn-cancel { flex: 1; padding: 11px; border-radius: var(--r-md); border: 1.5px solid var(--rule); background: var(--bg); color: var(--ink-2); font-size: .9rem; font-weight: 600; cursor: pointer; transition: all .18s var(--ease); font-family: 'DM Sans', sans-serif; }
.modal-btn-cancel:hover:not(:disabled) { background: var(--surface); border-color: var(--ink-3); }
.modal-btn-cancel:disabled { opacity: .6; cursor: not-allowed; }
.modal-btn-delete { flex: 1; padding: 11px; border-radius: var(--r-md); border: none; background: #c0303b; color: #fff; font-size: .9rem; font-weight: 600; cursor: pointer; transition: all .18s var(--ease); font-family: 'DM Sans', sans-serif; display: flex; align-items: center; justify-content: center; gap: 8px; }
.modal-btn-delete:hover:not(:disabled) { background: #a02530; transform: translateY(-1px); }
.modal-btn-delete:disabled { opacity: .65; cursor: not-allowed; transform: none; }
.modal-btn-delete svg { width: 15px; height: 15px; stroke: #fff; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.modal-success { display: flex; flex-direction: column; align-items: center; padding: 40px 28px; text-align: center; }
.modal-success-icon { width: 64px; height: 64px; border-radius: 50%; background: #d6f4e9; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; animation: popIn .35s var(--ease) both; }
@keyframes popIn { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
.modal-success-icon svg { width: 28px; height: 28px; stroke: #0d7a55; fill: none; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
.modal-success-title { font-family: 'Syne', sans-serif; font-size: 1.2rem; font-weight: 800; color: var(--ink); margin-bottom: 6px; }
.modal-success-sub { font-size: .875rem; color: var(--ink-3); }

.spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,.35); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; flex-shrink: 0; }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }

@media (max-width: 1024px) { .detail-layout { grid-template-columns: 1fr; } }
@media (max-width: 840px) { .page-content { padding: 20px 16px 40px; } .topbar { padding: 0 16px; } }
@media (max-width: 640px) {
  .profile-header { flex-direction: column; align-items: flex-start; }
  .profile-actions { width: 100%; }
  .btn-edit, .btn-del, .btn-save, .btn-cancel-edit { flex: 1; justify-content: center; }
  .info-grid { grid-template-columns: 1fr; }
  .page-content { padding: 16px; }
  .modal-footer { flex-direction: column; }
}
      `}</style>

      {/* ─── TOPBAR ─────────────────────────── */}
      <div className="topbar">
        <div className="topbar-breadcrumb">
          <button className="bc-link" onClick={() => history.push('/admin-dashboard')}>Admin</button>
          <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
          <button className="bc-link" onClick={() => history.push('/admin-supervisors')}>Supervisors</button>
          <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
          <span className="crumb-active">{data.fullName}</span>
        </div>
        <div className="topbar-right">
          <span className="topbar-date">Feb 17, 2026</span>
          <button className="topbar-btn" title="Notifications">
            <svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          </button>
        </div>
      </div>

      <div className="page-content">

        <button type="button" onClick={() => history.push('/admin-supervisors')} className="back-link">
          <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
          Back to Supervisors
        </button>

        {/* Save success banner */}
        {saveSuccess && (
          <div className="banner banner-success">
            <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
            Changes saved successfully — details will persist across sessions.
          </div>
        )}

        {/* Edit mode banner */}
        {isEditing && (
          <div className="banner banner-edit">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            You are editing this supervisor's details. Click&nbsp;<strong>Save Changes</strong>&nbsp;to apply or&nbsp;<strong>Cancel</strong>&nbsp;to discard.
          </div>
        )}

        {/* ─── Profile Header ──────────────────── */}
        <div className="profile-header">
          <div className="profile-left">
            <div className="profile-avatar">{initials}</div>
            <div>
              <div className="profile-name">{data.fullName}</div>
              <div className="profile-meta">
                <span className="profile-id">{data.office}</span>
                <span className={`status-pill ${data.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                  {data.status}
                </span>
              </div>
            </div>
          </div>
          <div className="profile-actions">
            {!isEditing ? (
              <>
                <button className="btn-edit" onClick={startEdit}>
                  <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Edit
                </button>
                <button className="btn-del" onClick={() => setShowDeleteModal(true)}>
                  <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
                  Delete
                </button>
              </>
            ) : (
              <>
                <button className="btn-cancel-edit" onClick={cancelEdit} disabled={isSaving}>
                  <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  Cancel
                </button>
                <button className="btn-save" onClick={handleSave} disabled={isSaving}>
                  {isSaving
                    ? <><div className="spinner"></div>Saving…</>
                    : <><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Save Changes</>
                  }
                </button>
              </>
            )}
          </div>
        </div>

        {/* ─── Two-column layout ───────────────── */}
        <div className="detail-layout">

          {/* Left */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            <div className={`card${isEditing ? ' editing' : ''}`}>
              <div className="card-head">
                <div className="card-accent"></div>
                <div className="card-title">Personal Information</div>
              </div>
              <div className="card-body">
                <div className="info-grid">

                  <div className="info-item">
                    <span className="info-label">Full Name{isEditing && <span style={{color:'var(--brand)',marginLeft:'2px'}}>*</span>}</span>
                    {isEditing
                      ? <input className="field-input" value={draft.fullName} onChange={e => handleChange('fullName', e.target.value)} placeholder="Full name" />
                      : <span className="info-value">{data.fullName}</span>}
                  </div>

                  <div className="info-item">
                    <span className="info-label">Birthday</span>
                    {isEditing
                      ? <input className="field-input" type="date" value={draft.birthday} onChange={e => handleChange('birthday', e.target.value)} />
                      : <span className="info-value">{formatBirthday(data.birthday)}</span>}
                  </div>

                  <div className="info-item">
                    <span className="info-label">Email{isEditing && <span style={{color:'var(--brand)',marginLeft:'2px'}}>*</span>}</span>
                    {isEditing
                      ? <input className="field-input" type="email" value={draft.email} onChange={e => handleChange('email', e.target.value)} placeholder="Email address" />
                      : <a href={`mailto:${data.email}`} className="info-value info-link">{data.email}</a>}
                  </div>

                  <div className="info-item">
                    <span className="info-label">Contact Number</span>
                    {isEditing
                      ? <input className="field-input" value={draft.contact} onChange={e => handleChange('contact', e.target.value)} placeholder="Contact number" />
                      : <a href={`tel:${data.contact}`} className="info-value info-link">{data.contact}</a>}
                  </div>

                  <div className="info-item span-full">
                    <span className="info-label">Address</span>
                    {isEditing
                      ? <input className="field-input" value={draft.address} onChange={e => handleChange('address', e.target.value)} placeholder="Address" />
                      : <span className="info-value">{data.address}</span>}
                  </div>

                </div>
              </div>
            </div>

            <div className={`card${isEditing ? ' editing' : ''}`}>
              <div className="card-head">
                <div className="card-accent"></div>
                <div className="card-title">Office Assignment</div>
              </div>
              <div className="card-body">
                <div className="info-grid">
                  <div className="info-item span-full">
                    <span className="info-label">Office{isEditing && <span style={{color:'var(--brand)',marginLeft:'2px'}}>*</span>}</span>
                    {isEditing
                      ? (
                        <select className="field-select" value={draft.office} onChange={e => handleChange('office', e.target.value)}>
                          <option>LTO Office — Candon City</option>
                          <option>DepEd Office — Candon City</option>
                          <option>Municipal Hall — Candon City</option>
                          <option>BIR Office — Ilocos Sur</option>
                          <option>DOLE Office — Ilocos Sur</option>
                        </select>
                      )
                      : <span className="info-value">{data.office}</span>}
                  </div>
                  {isEditing && (
                    <div className="info-item span-full">
                      <span className="info-label">Status</span>
                      <select className="field-select" value={draft.status} onChange={e => handleChange('status', e.target.value as 'Active' | 'Inactive')}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Right */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            <div className="card">
              <div className="card-head">
                <div className="card-accent"></div>
                <div className="card-title">Quick Stats</div>
              </div>
              <div className="card-body">
                <div className="stats-mini">
                  <div className="stat-mini-item">
                    <span className="stat-mini-label">Assigned Trainees</span>
                    <span className="stat-mini-val">1</span>
                  </div>
                  <div className="stat-mini-item">
                    <span className="stat-mini-label">Years of Service</span>
                    <span className="stat-mini-val">12 yrs</span>
                  </div>
                  <div className="stat-mini-item">
                    <span className="stat-mini-label">Status</span>
                    <span className="stat-mini-val" style={{ color: data.status === 'Active' ? '#0d7a55' : '#d97706', fontSize: '.85rem' }}>
                      {data.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-head">
                <div className="card-accent"></div>
                <div className="card-title">Assigned Trainees</div>
              </div>
              <div className="card-body">
                <div className="trainee-list">
                  <div className="trainee-row" onClick={() => history.push('/admin-trainee-detail')}>
                    <div className="trainee-row-avatar">KG</div>
                    <div className="trainee-row-info">
                      <div className="trainee-row-name">Katherine Mae Guzman</div>
                      <div className="trainee-row-id">A23-00502</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ─── DELETE MODAL ───────────────────────── */}
      {showDeleteModal && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isDeleting && !deleteComplete)
              setShowDeleteModal(false);
          }}
        >
          <div className="modal-box">
            {!deleteComplete ? (
              <>
                <div className="modal-header">
                  <div className="modal-icon-wrap">
                    <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                  </div>
                  <div className="modal-title">Delete Supervisor</div>
                </div>
                <div className="modal-body">
                  <p className="modal-desc">
                    Are you sure you want to delete <strong>{data.fullName}</strong>? This action cannot be undone.
                  </p>
                  <div className="modal-warning">
                    <svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    <span>All trainees assigned to this supervisor will be unlinked. This cannot be reversed.</span>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="modal-btn-cancel" onClick={() => setShowDeleteModal(false)} disabled={isDeleting}>
                    Cancel
                  </button>
                  <button className="modal-btn-delete" onClick={handleDeleteConfirm} disabled={isDeleting}>
                    {isDeleting
                      ? <><div className="spinner"></div>Deleting…</>
                      : <><svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>Delete Supervisor</>
                    }
                  </button>
                </div>
              </>
            ) : (
              <div className="modal-success">
                <div className="modal-success-icon">
                  <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div className="modal-success-title">Supervisor Deleted</div>
                <div className="modal-success-sub">Redirecting to supervisors list…</div>
              </div>
            )}
          </div>
        </div>
      )}

      <LogoutModal
        isOpen={showLogoutModal}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
        isLoading={isLoggingOut}
        onComplete={handleLogoutComplete}
      />
    </AdminLayout>
  );
};

export default AdminSupervisorDetail;