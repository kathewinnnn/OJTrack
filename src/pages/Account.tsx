import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonIcon, IonBadge } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import {
  personOutline, mailOutline, schoolOutline, calendarOutline,
  settingsOutline, helpCircleOutline, shieldCheckmarkOutline,
  logOutOutline, notificationsOutline, lockClosedOutline,
  documentTextOutline, createOutline, chevronForwardOutline,
} from 'ionicons/icons';
import BottomNav from '../components/BottomNav';
import LogoutModal from '../components/LogoutModal';

// ─── Same durable key used by EditAccount ─────────────────────────────────────
const STUDENT_PROFILE_KEY = 'studentProfile';

interface User {
  name: string; email: string; role: string;
  program: string; year: string; studentId: string;
  profilePhoto?: string | null;
}

// ── Load: durable key first, then seed from users[] ────────────────────────────
const loadUser = (): User => {
  try {
    const saved = localStorage.getItem(STUDENT_PROFILE_KEY);
    if (saved) {
      const p = JSON.parse(saved);
      return {
        name: p.name ?? 'Student', email: p.email ?? '',
        role: 'Student Trainee',
        program: p.program ?? '', year: p.year ?? '',
        studentId: p.studentId ?? '', profilePhoto: p.profilePhoto ?? null,
      };
    }

    // Seed on first visit (before EditAccount has run)
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
    if (src) {
      return {
        name:         `${src.firstName ?? ''} ${src.lastName ?? ''}`.trim() || 'Student',
        email:        src.email      ?? '',
        role:         'Student Trainee',
        program:      src.program    ?? '',
        year:         src.year       ?? '',
        studentId:    src.studentId  ?? '',
        profilePhoto: src.profilePhoto ?? null,
      };
    }
  } catch (e) { console.error('Account load error:', e); }

  return {
    name: 'Katherine Guzman', email: 'kathewinnnn@gmail.com',
    role: 'Student Trainee',
    program: 'Bachelor of Science in Information Technology',
    year: '3rd Year', studentId: 'A23-00502', profilePhoto: null,
  };
};

const Account: React.FC = () => {
  const history = useHistory();
  const [user, setUser]                         = useState<User>(loadUser);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showLogoutModal, setShowLogoutModal]   = useState(false);
  const [isLoggingOut, setIsLoggingOut]         = useState(false);

  // Refresh whenever the component mounts (i.e. after returning from EditAccount)
  useEffect(() => { setUser(loadUser()); }, []);

  const menuItems = [
    { icon: settingsOutline,      title: 'Account Settings',  subtitle: 'Manage your preferences',  badge: null,                               badgeColor: '' },
    { icon: notificationsOutline, title: 'Notifications',     subtitle: 'Configure alert settings', badge: notificationsEnabled ? 'On' : 'Off', badgeColor: notificationsEnabled ? 'success' : 'medium' },
    { icon: lockClosedOutline,    title: 'Privacy & Security',subtitle: 'Control your data',        badge: null,                               badgeColor: '' },
    { icon: documentTextOutline,  title: 'Terms of Service',  subtitle: 'Read our policies',        badge: null,                               badgeColor: '' },
    { icon: helpCircleOutline,    title: 'Help & Support',    subtitle: 'Get assistance',           badge: null,                               badgeColor: '' },
  ];

  const confirmLogout     = () => { setIsLoggingOut(true); };
  // NOTE: studentProfile and users[] are NOT cleared — edits survive re-login
  const handleLogoutComplete = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    sessionStorage.clear();
  };

  const details = [
    { icon: mailOutline,            label: 'Email Address',    value: user.email     },
    { icon: schoolOutline,          label: 'Academic Program', value: user.program   },
    { icon: calendarOutline,        label: 'Year Level',       value: user.year      },
    { icon: shieldCheckmarkOutline, label: 'Student ID',       value: user.studentId },
  ];

  return (
    <IonPage>
      <IonContent fullscreen className="acc-content" scrollY={!showLogoutModal}>
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

          {/* Settings */}
          <div className="acc-section-card">
            <div className="acc-section-header">
              <span className="acc-section-title">Settings &amp; Support</span>
            </div>
            <div className="acc-menu-list">
              {menuItems.map((item, i) => (
                <button key={i} className="acc-menu-item">
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
    </IonPage>
  );
};

export default Account;