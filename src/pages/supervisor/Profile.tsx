import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonIcon } from '@ionic/react';
import {
  personCircleOutline, mailOutline, businessOutline, settingsOutline,
  cameraOutline, logOutOutline, lockClosedOutline, notificationsOutline,
  chevronForwardOutline, createOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import SupervisorBottomNav from '../../components/SupervisorBottomNav';
import LogoutModal from '../../components/LogoutModal';
import './supervisor.css';

// ─── Same key used by EditProfile — never wiped at logout ────────────────────
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

// ── Load: durable key first, then seed from users[] on first visit ────────────
const loadProfile = (): ProfileData => {
  try {
    const saved = localStorage.getItem(PROFILE_KEY);
    if (saved) return JSON.parse(saved);

    // Seed from registration data (only runs once, before first save)
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

const Profile: React.FC = () => {
  const history = useHistory();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut]       = useState(false);
  const [profile, setProfile]                 = useState<ProfileData>(loadProfile);

  // Re-read whenever the page becomes active (after returning from EditProfile)
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
    { icon: lockClosedOutline,    title: 'Change Password',          sub: 'Update your account password',        action: 'Change'   },
    { icon: notificationsOutline, title: 'Notification Preferences', sub: 'Manage email and push notifications', action: 'Manage'   },
    { icon: settingsOutline,      title: 'Privacy Settings',         sub: 'Control your data and privacy',       action: 'Settings' },
  ];

  const handleLogoutConfirm  = () => { setIsLoggingOut(true); };
  const handleLogoutCancel   = () => { setShowLogoutModal(false); setIsLoggingOut(false); };
  // NOTE: we do NOT clear supervisorProfile or users[] on logout — only session keys
  const handleLogoutComplete = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    // loggedInUsername is kept so loadProfile can re-seed on next login if needed
  };

  return (
    <IonPage>
      <IonContent fullscreen className="sv-content" scrollY={!showLogoutModal}>

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
                  <button className="sv-menu-action-btn">{item.action}</button>
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
    </IonPage>
  );
};

export default Profile;