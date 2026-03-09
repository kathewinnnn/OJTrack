import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonIcon, IonBadge } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import {
  personOutline, mailOutline, schoolOutline, calendarOutline,
  settingsOutline, helpCircleOutline, shieldCheckmarkOutline,
  logOutOutline, notificationsOutline, lockClosedOutline,
  documentTextOutline, createOutline, chevronForwardOutline,
  transgenderOutline, personCircleOutline, eyeOutline, eyeOffOutline,
} from 'ionicons/icons';
import BottomNav from '../components/BottomNav';
import LogoutModal from '../components/LogoutModal';
import TermsModal from '../components/TermsModal';

const STUDENT_PROFILE_KEY = 'studentProfile';

interface User {
  name: string; email: string; role: string;
  program: string; year: string; studentId: string;
  profilePhoto?: string | null;
  username?: string;
  gender?: string;
  birthday?: string;
}

const loadUser = (): User => {
  try {
    const saved = localStorage.getItem(STUDENT_PROFILE_KEY);
    const username = localStorage.getItem('loggedInUsername');

    const getSrc = () => {
      const cu = localStorage.getItem('currentUser');
      if (cu) return JSON.parse(cu);
      if (username) {
        const users: any[] = JSON.parse(localStorage.getItem('users') || '[]');
        return users.find(u => u.username === username) ?? null;
      }
      return null;
    };
    const src = getSrc();

    if (saved) {
      const p = JSON.parse(saved);
      return {
        name:         p.name         ?? 'Student',
        email:        p.email        ?? '',
        role:         'Student Trainee',
        program:      p.program      ?? '',
        year:         p.year         ?? '',
        studentId:    p.studentId    ?? '',
        profilePhoto: p.profilePhoto ?? null,
        username:     p.username     ?? src?.username ?? username ?? '',
        gender:       p.gender       ?? src?.gender   ?? '',
        birthday:     p.birthday     ?? src?.birthday ?? '',
      };
    }

    if (src) {
      return {
        name:         `${src.firstName ?? ''} ${src.lastName ?? ''}`.trim() || 'Student',
        email:        src.email        ?? '',
        role:         'Student Trainee',
        program:      src.program      ?? '',
        year:         src.year         ?? '',
        studentId:    src.studentId    ?? '',
        profilePhoto: src.profilePhoto ?? null,
        username:     src.username     ?? username ?? '',
        gender:       src.gender       ?? '',
        birthday:     src.birthday     ?? '',
      };
    }
  } catch (e) { console.error('Account load error:', e); }

  return {
    name: 'Katherine Guzman', email: 'kathewinnnn@gmail.com',
    role: 'Student Trainee',
    program: 'Bachelor of Science in Information Technology',
    year: '3rd Year', studentId: 'A23-00502', profilePhoto: null,
    username: 'katheguzman', gender: '', birthday: '',
  };
};

const formatBirthday = (raw: string): string => {
  if (!raw) return '';
  try {
    const d = new Date(raw);
    if (isNaN(d.getTime())) return raw;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch { return raw; }
};

// ── Change Password Modal ──────────────────────────────────────────────────────
interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword]         = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent]         = useState(false);
  const [showNew, setShowNew]                 = useState(false);
  const [showConfirm, setShowConfirm]         = useState(false);
  const [error, setError]                     = useState('');
  const [success, setSuccess]                 = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
      setShowCurrent(false);  setShowNew(false);  setShowConfirm(false);
      setError(''); setSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    setError('');
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields.'); return;
    }
    const username = localStorage.getItem('loggedInUsername');
    const users: any[] = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.username === username);
    if (userIndex === -1) { setError('User not found.'); return; }
    const storedPassword = users[userIndex].password ?? '';
    if (storedPassword !== currentPassword) {
      setError('Current password is incorrect.'); return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.'); return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.'); return;
    }
    if (newPassword === currentPassword) {
      setError('New password must be different from current password.'); return;
    }
    users[userIndex].password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));
    try {
      const cu = localStorage.getItem('currentUser');
      if (cu) {
        const parsed = JSON.parse(cu);
        parsed.password = newPassword;
        localStorage.setItem('currentUser', JSON.stringify(parsed));
      }
    } catch (_) {}
    setSuccess(true);
    setTimeout(() => { onClose(); }, 1800);
  };

  const fieldConfig = [
    { label: 'Current Password', val: currentPassword, set: setCurrentPassword, show: showCurrent, toggle: () => setShowCurrent(p => !p) },
    { label: 'New Password',     val: newPassword,     set: setNewPassword,     show: showNew,     toggle: () => setShowNew(p => !p)     },
    { label: 'Confirm Password', val: confirmPassword, set: setConfirmPassword, show: showConfirm, toggle: () => setShowConfirm(p => !p) },
  ];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '0 20px',
    }}>
      <div style={{
        background: '#fff', borderRadius: 20, padding: '28px 24px',
        width: '100%', maxWidth: 380, boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 22 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: 'linear-gradient(135deg, #5f0076, #9e00c2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginRight: 12,
          }}>
            <IonIcon icon={lockClosedOutline} style={{ color: '#fff', fontSize: 20 }} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#1a1a2e' }}>Change Password</p>
            <p style={{ margin: 0, fontSize: 12, color: '#9e92ab' }}>Keep your account secure</p>
          </div>
        </div>

        {fieldConfig.map((field, i) => (
          <div key={i} style={{ marginBottom: 14 }}>
            <p style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 600, color: '#6b5f77' }}>{field.label}</p>
            <div style={{
              display: 'flex', alignItems: 'center',
              border: '1.5px solid #e4dcea', borderRadius: 12,
              padding: '0 14px', background: '#f7f5f9',
            }}>
              <input
                type={field.show ? 'text' : 'password'}
                value={field.val}
                onChange={e => field.set(e.target.value)}
                placeholder="••••••••"
                style={{
                  flex: 1, border: 'none', background: 'transparent',
                  padding: '12px 0', fontSize: 14, outline: 'none', color: '#1a1a2e',
                }}
              />
              <button onClick={field.toggle} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                <IonIcon icon={field.show ? eyeOffOutline : eyeOutline} style={{ color: '#aaa', fontSize: 18 }} />
              </button>
            </div>
          </div>
        ))}

        {error && (
          <div style={{
            background: '#fff0f0', border: '1px solid #ffc0c0', borderRadius: 10,
            padding: '10px 14px', marginBottom: 14,
          }}>
            <p style={{ margin: 0, fontSize: 13, color: '#d32f2f' }}>{error}</p>
          </div>
        )}
        {success && (
          <div style={{
            background: '#f0fff4', border: '1px solid #a0e0b0', borderRadius: 10,
            padding: '10px 14px', marginBottom: 14,
          }}>
            <p style={{ margin: 0, fontSize: 13, color: '#2e7d32' }}>✓ Password updated successfully!</p>
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '13px 0', borderRadius: 12,
            border: '1.5px solid #e4dcea', background: '#f7f5f9',
            fontSize: 14, fontWeight: 600, color: '#6b5f77', cursor: 'pointer',
            fontFamily: 'inherit',
          }}>
            Cancel
          </button>
          <button onClick={handleSubmit} style={{
            flex: 1, padding: '13px 0', borderRadius: 12,
            border: 'none', background: 'linear-gradient(135deg, #5f0076, #9e00c2)',
            fontSize: 14, fontWeight: 600, color: '#fff', cursor: 'pointer',
            fontFamily: 'inherit',
          }}>
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────
const Account: React.FC = () => {
  const history = useHistory();
  const [user, setUser]                             = useState<User>(loadUser);
  const [showLogoutModal, setShowLogoutModal]       = useState(false);
  const [isLoggingOut, setIsLoggingOut]             = useState(false);
  const [showTermsModal, setShowTermsModal]         = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  // Re-read profile every time the page becomes visible (covers back-nav from EditAccount)
  useEffect(() => {
    const refresh = () => setUser(loadUser());
    refresh();

    // Listen for storage changes from other tabs / same-tab via custom event
    window.addEventListener('storage', refresh);
    window.addEventListener('profileUpdated', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('profileUpdated', refresh);
    };
  }, []);

  // Also refresh whenever this route gains focus (Ionic lifecycle)
  useEffect(() => {
    const handler = () => setUser(loadUser());
    document.addEventListener('ionViewWillEnter', handler);
    return () => document.removeEventListener('ionViewWillEnter', handler);
  }, []);

  const menuItems = [
    {
      icon: lockClosedOutline,
      title: 'Change Password',
      subtitle: 'Update your account password',
      badge: null, badgeColor: '',
      onPress: () => setShowChangePassword(true),
    },
    {
      icon: documentTextOutline,
      title: 'Terms of Service',
      subtitle: 'Read our policies',
      badge: null, badgeColor: '',
      onPress: () => setShowTermsModal(true),
    },
  ];

  const confirmLogout = () => { setIsLoggingOut(true); };
  const handleLogoutComplete = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    // NOTE: We intentionally keep studentProfile and users so data
    // survives logout and is restored when the same user logs back in.
    sessionStorage.clear();
  };

  const details = [
    { icon: personCircleOutline,    label: 'Username',         value: user.username                          || '—' },
    { icon: mailOutline,            label: 'Email Address',    value: user.email                             || '—' },
    { icon: transgenderOutline,     label: 'Gender',           value: user.gender                            || '—' },
    { icon: calendarOutline,        label: 'Birthday',         value: formatBirthday(user.birthday || '')    || '—' },
    { icon: schoolOutline,          label: 'Academic Program', value: user.program                           || '—' },
    { icon: shieldCheckmarkOutline, label: 'Student ID',       value: user.studentId                         || '—' },
  ];

  return (
    <IonPage>
      <IonContent
        fullscreen
        className="acc-content"
        scrollY={!showLogoutModal && !showTermsModal && !showChangePassword}
      >
        <div className="acc-container">

          {/* Profile Hero */}
          <div className="acc-profile-card">
            <div className="acc-cover" />
            <div className="acc-profile-body">
              <div className="acc-avatar-wrap">
                {user.profilePhoto ? (
                  <div className="acc-avatar" style={{ overflow: 'hidden', background: 'transparent', padding: 0 }}>
                    <img src={user.profilePhoto} alt={user.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', display: 'block' }} />
                  </div>
                ) : (
                  <div className="acc-avatar">
                    <IonIcon icon={personOutline} />
                  </div>
                )}
                <button className="acc-avatar-edit" onClick={() => history.push('/edit-account')}>
                  <IonIcon icon={createOutline} />
                </button>
              </div>
              <p className="acc-name">{user.name}</p>
              <p className="acc-role">{user.role}</p>
              <span className="acc-program-badge">{user.program}</span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="acc-stats-card">
            <div className="acc-stat">
              <p className="acc-stat-val">{user.year}</p>
              <p className="acc-stat-lbl">Year Level</p>
            </div>
            <div className="acc-stat-div" />
            <div className="acc-stat">
              <p className="acc-stat-val">{user.studentId}</p>
              <p className="acc-stat-lbl">Student ID</p>
            </div>
            <div className="acc-stat-div" />
            <div className="acc-stat">
              <p className="acc-stat-val">45</p>
              <p className="acc-stat-lbl">Days Active</p>
            </div>
          </div>

          {/* Profile Info */}
          <div className="acc-section-card">
            <div className="acc-section-header">
              <span className="acc-section-title">Profile Information</span>
              <button className="acc-edit-btn" onClick={() => history.push('/edit-account')}>
                <IonIcon icon={createOutline} /> Edit
              </button>
            </div>
            <div className="acc-detail-list">
              {details.map((d, i) => (
                <div key={i} className="acc-detail-item">
                  <div className="acc-detail-icon"><IonIcon icon={d.icon} /></div>
                  <div className="acc-detail-text">
                    <p className="acc-detail-lbl">{d.label}</p>
                    <p className="acc-detail-val">{d.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Settings & Support */}
          <div className="acc-section-card">
            <div className="acc-section-header">
              <span className="acc-section-title">Settings &amp; Support</span>
            </div>
            <div className="acc-menu-list">
              {menuItems.map((item, i) => (
                <button key={i} className="acc-menu-item" onClick={item.onPress}>
                  <div className="acc-menu-icon"><IonIcon icon={item.icon} /></div>
                  <div className="acc-menu-text">
                    <p className="acc-menu-title">{item.title}</p>
                    <p className="acc-menu-sub">{item.subtitle}</p>
                  </div>
                  {item.badge
                    ? <IonBadge className="acc-menu-badge" color={item.badgeColor}>{item.badge}</IonBadge>
                    : <IonIcon icon={chevronForwardOutline} className="acc-menu-arrow" />}
                </button>
              ))}
            </div>
          </div>

          {/* Logout */}
          <button className="acc-logout-btn" onClick={() => setShowLogoutModal(true)}>
            <IonIcon icon={logOutOutline} /><span>Log Out</span>
          </button>

        </div>
      </IonContent>

      <BottomNav activeTab="account" />

      <LogoutModal
        isOpen={showLogoutModal}
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutModal(false)}
        isLoading={isLoggingOut}
        onComplete={handleLogoutComplete}
      />

      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />

      {showTermsModal && (
        <TermsModal
          mode="view"
          onClose={() => setShowTermsModal(false)}
        />
      )}
    </IonPage>
  );
};

export default Account;