import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonIcon, IonBadge } from '@ionic/react';
import { personCircleOutline, mailOutline, businessOutline, settingsOutline, cameraOutline, logOutOutline, lockClosedOutline, notificationsOutline, chevronForwardOutline, createOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import SupervisorBottomNav from '../../components/SupervisorBottomNav';
import LogoutModal from '../../components/LogoutModal';
import './supervisor.css';

const STORAGE_KEY = 'supervisorProfile';

// Default profile data
const defaultProfile = {
  fullName: 'Dr. Kath Montenegro',
  email: 'kth.mntngr@university.edu',
  employeeId: 'UIP-2024-001',
  department: 'Information Technology Department',
  role: 'Senior IT Supervisor',
};

// Load profile from localStorage or return default
const loadProfile = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error loading profile:', e);
  }
  return defaultProfile;
};

const Profile: React.FC = () => {
  const history = useHistory();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [profile, setProfile] = useState(loadProfile);

  // Refresh profile data when component mounts (in case it was updated)
  useEffect(() => {
    setProfile(loadProfile());
  }, []);

  const stats = [
    { val: '3',   lbl: 'Years Exp.' },
    { val: '25',  lbl: 'Trainees' },
    { val: '98%', lbl: 'Success' },
    { val: '4.9', lbl: 'Rating' },
  ];

  const infoItems = [
    { icon: personCircleOutline, label: 'Full Name',    value: profile.fullName },
    { icon: mailOutline,         label: 'Email',        value: profile.email },
    { icon: businessOutline,     label: 'Employee ID',  value: profile.employeeId },
    { icon: settingsOutline,     label: 'Role',         value: profile.role },
  ];

  const menuItems = [
    { icon: lockClosedOutline,    title: 'Change Password',           sub: 'Update your account password',        action: 'Change' },
    { icon: notificationsOutline, title: 'Notification Preferences',  sub: 'Manage email and push notifications', action: 'Manage' },
    { icon: settingsOutline,      title: 'Privacy Settings',          sub: 'Control your data and privacy',       action: 'Settings' },
  ];

  // Handle logout confirmation - starts the loading animation
  const handleLogoutConfirm = () => {
    setIsLoggingOut(true);
  };

  // Handle logout cancellation
  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
    setIsLoggingOut(false);
  };

  // Handle logout complete - cleanup any user session data
  const handleLogoutComplete = () => {
    // Clear any session storage or local storage if needed
    // The navigation to /login will happen in LogoutModal
    console.log('Logout complete, redirecting to login...');
  };

  return (
    <IonPage>
      <IonContent fullscreen className="sv-content" scrollY={!showLogoutModal}>

        {/* Profile Hero */}
        <div className="sv-profile-card">
          <div className="sv-profile-cover" />
          <div className="sv-profile-body">
            <div className="sv-profile-av-wrap">
              <div className="sv-profile-av">
                <IonIcon icon={personCircleOutline} />
              </div>
              <button className="sv-profile-av-edit"><IonIcon icon={cameraOutline} /></button>
            </div>
            <p className="sv-profile-name">{profile.fullName}</p>
            <p className="sv-profile-role">{profile.role}</p>
            <span className="sv-profile-dept-badge">{profile.department}</span>
            <div className="sv-profile-active-row">
              <span className="sv-profile-active-dot" />
              Active Supervisor
            </div>
          </div>
        </div>

        <div className="sv-body sv-body-account">

          {/* Stats Row */}<br/>
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
            <IonIcon icon={logOutOutline} />
            <span>Log Out</span>
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