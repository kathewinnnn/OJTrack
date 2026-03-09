import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonIcon } from '@ionic/react';
import {
  personCircleOutline, mailOutline, businessOutline, settingsOutline,
  cameraOutline, logOutOutline, lockClosedOutline, notificationsOutline,
  chevronForwardOutline, createOutline, documentTextOutline, eyeOutline, eyeOffOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import SupervisorBottomNav from '../../components/SupervisorBottomNav';
import LogoutModal from '../../components/LogoutModal';
import TermsModal from '../../components/TermsModal';
import './supervisor.css';

const PROFILE_KEY = 'supervisorProfile';

interface ProfileData {
  fullName: string; email: string; employeeId: string;
  department: string; role: string; profilePhoto: string | null;
}

const DEFAULT_PROFILE: ProfileData = {
  fullName:     'Dr. Mingyu Kim',
  email:        'mingyu@university.edu',
  employeeId:   'UIP-2024-001',
  department:   'Information Technology Department',
  role:         'Senior IT Supervisor',
  profilePhoto: null,
};

const loadProfile = (): ProfileData => {
  try {
    const saved = localStorage.getItem(PROFILE_KEY);
    if (saved) return JSON.parse(saved);

    const username = localStorage.getItem('loggedInUsername');
    if (username) {
      const users: any[] = JSON.parse(localStorage.getItem('users') || '[]');
      const found = users.find(u => u.username === username);
      if (found) {
        const seeded: ProfileData = {
          fullName:     `${found.firstName ?? ''} ${found.lastName ?? ''}`.trim() || DEFAULT_PROFILE.fullName,
          email:        found.email      ?? DEFAULT_PROFILE.email,
          employeeId:   found.employeeId ?? DEFAULT_PROFILE.employeeId,
          department:   found.department ?? DEFAULT_PROFILE.department,
          role:         DEFAULT_PROFILE.role,
          profilePhoto: found.profilePhoto ?? null,
        };
        localStorage.setItem(PROFILE_KEY, JSON.stringify(seeded));
        return seeded;
      }
    }
  } catch (e) { console.error('Profile load error:', e); }
  return { ...DEFAULT_PROFILE };
};

// ── Change Password Modal ─────────────────────────────────────────────────────
interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword]   = useState('');
  const [newPassword, setNewPassword]           = useState('');
  const [confirmPassword, setConfirmPassword]   = useState('');
  const [showCurrent, setShowCurrent]           = useState(false);
  const [showNew, setShowNew]                   = useState(false);
  const [showConfirm, setShowConfirm]           = useState(false);
  const [error, setError]                       = useState('');
  const [success, setSuccess]                   = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
      setShowCurrent(false); setShowNew(false); setShowConfirm(false);
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
        {/* Header */}
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

        {/* Fields */}
        {[
          { label: 'Current Password', val: currentPassword, set: setCurrentPassword, show: showCurrent, toggle: () => setShowCurrent(p => !p) },
          { label: 'New Password',     val: newPassword,     set: setNewPassword,     show: showNew,     toggle: () => setShowNew(p => !p)     },
          { label: 'Confirm Password', val: confirmPassword, set: setConfirmPassword, show: showConfirm, toggle: () => setShowConfirm(p => !p) },
        ].map((field, i) => (
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

        {/* Error / Success */}
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

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '13px 0', borderRadius: 12,
            border: '1.5px solid #e4dcea', background: '#f7f5f9',
            fontSize: 14, fontWeight: 600, color: '#6b5f77', cursor: 'pointer',
          }}>
            Cancel
          </button>
          <button onClick={handleSubmit} style={{
            flex: 1, padding: '13px 0', borderRadius: 12,
            border: 'none', background: 'linear-gradient(135deg, #5f0076, #9e00c2)',
            fontSize: 14, fontWeight: 600, color: '#fff', cursor: 'pointer',
          }}>
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

const Profile: React.FC = () => {
  const history = useHistory();
  const [showLogoutModal, setShowLogoutModal]         = useState(false);
  const [isLoggingOut, setIsLoggingOut]               = useState(false);
  const [profile, setProfile]                         = useState<ProfileData>(loadProfile);
  const [showChangePassword, setShowChangePassword]   = useState(false);
  const [showTermsModal, setShowTermsModal]           = useState(false);

  useEffect(() => { setProfile(loadProfile()); }, []);

  const stats = [
    { val: '3',   lbl: 'Years Exp.' },
    { val: '25',  lbl: 'Trainees'   },
    { val: '98%', lbl: 'Success'    },
    { val: '4.9', lbl: 'Rating'     },
  ];

  const infoItems = [
    { icon: personCircleOutline, label: 'Full Name',   value: profile.fullName   },
    { icon: mailOutline,         label: 'Email',       value: profile.email      },
    { icon: businessOutline,     label: 'Employee ID', value: profile.employeeId },
    { icon: settingsOutline,     label: 'Role',        value: profile.role       },
  ];

  const menuItems = [
    {
      icon: lockClosedOutline,
      title: 'Change Password',
      sub: 'Update your account password',
      action: 'Change',
      onPress: () => setShowChangePassword(true),
    },
    {
      icon: documentTextOutline,
      title: 'Terms of Service',
      sub: 'Read our policies',
      action: 'View',
      onPress: () => setShowTermsModal(true),
    },
  ];

  const handleLogoutConfirm  = () => { setIsLoggingOut(true); };
  const handleLogoutCancel   = () => { setShowLogoutModal(false); setIsLoggingOut(false); };
  const handleLogoutComplete = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
  };

  return (
    <IonPage>
      <IonContent fullscreen className="sv-content" scrollY={!showLogoutModal && !showChangePassword && !showTermsModal}>

        {/* Profile Hero */}
        <div className="sv-profile-card">
          <div className="sv-profile-cover" />
          <div className="sv-profile-body">
            <div className="sv-profile-av-wrap">
              {profile.profilePhoto ? (
                <div className="sv-profile-av" style={{ overflow: 'hidden', background: 'transparent', padding: 0 }}>
                  <img src={profile.profilePhoto} alt={profile.fullName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', display: 'block' }} />
                </div>
              ) : (
                <div className="sv-profile-av">
                  <IonIcon icon={personCircleOutline} />
                </div>
              )}
              <button className="sv-profile-av-edit" onClick={() => history.push('/edit-profile')}>
                <IonIcon icon={cameraOutline} />
              </button>
            </div>
            <p className="sv-profile-name">{profile.fullName}</p>
            <p className="sv-profile-role">{profile.role}</p>
            <span className="sv-profile-dept-badge">{profile.department}</span>
            <div className="sv-profile-active-row">
              <span className="sv-profile-active-dot" /> Active Supervisor
            </div>
          </div>
        </div>

        <div className="sv-body sv-body-account"><br/>

          {/* Stats */}
          <div className="sv-profile-stats">
            {stats.map((s, i) => (
              <React.Fragment key={i}>
                <div className="sv-profile-stat">
                  <p className="sv-profile-stat-val">{s.val}</p>
                  <p className="sv-profile-stat-lbl">{s.lbl}</p>
                </div>
                {i < stats.length - 1 && <div className="sv-profile-stat-div" />}
              </React.Fragment>
            ))}
          </div>

          {/* Personal Info */}
          <div className="sv-card">
            <div className="sv-card-header">
              <div>
                <p className="sv-card-label">Account</p>
                <h2 className="sv-card-title">Personal Information</h2>
              </div>
              <button className="sv-edit-btn" onClick={() => history.push('/edit-profile')}>
                <IonIcon icon={createOutline} /> Edit
              </button>
            </div>
            <div className="sv-info-list">
              {infoItems.map((item, i) => (
                <div key={i} className="sv-info-item">
                  <div className="sv-info-icon"><IonIcon icon={item.icon} /></div>
                  <div className="sv-info-text">
                    <p className="sv-info-lbl">{item.label}</p>
                    <p className="sv-info-val">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="sv-card">
            <div className="sv-card-header">
              <div>
                <p className="sv-card-label">Preferences</p>
                <h2 className="sv-card-title">Account Settings</h2>
              </div>
            </div>
            <div className="sv-menu-list">
              {menuItems.map((item, i) => (
                <div key={i} className={`sv-menu-item ${i < menuItems.length - 1 ? 'sv-menu-bordered' : ''}`}>
                  <div className="sv-menu-icon"><IonIcon icon={item.icon} /></div>
                  <div className="sv-menu-text">
                    <p className="sv-menu-title">{item.title}</p>
                    <p className="sv-menu-sub">{item.sub}</p>
                  </div>
                  <button className="sv-menu-action-btn" onClick={item.onPress}>{item.action}</button>
                </div>
              ))}
            </div>
          </div>

          {/* Logout */}
          <button className="sv-logout-btn" onClick={() => setShowLogoutModal(true)}>
            <IonIcon icon={logOutOutline} /><span>Log Out</span>
          </button>

        </div>
      </IonContent>

      <SupervisorBottomNav activeTab="profile" />

      <LogoutModal
        isOpen={showLogoutModal}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
        isLoading={isLoggingOut}
        onComplete={handleLogoutComplete}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />

      {/* Terms of Service Modal */}
      {showTermsModal && (
        <TermsModal
          mode="view"
          onClose={() => setShowTermsModal(false)}
        />
      )}
    </IonPage>
  );
};

export default Profile;