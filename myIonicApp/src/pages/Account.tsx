import React, { useState } from 'react';
import { IonPage, IonContent, IonIcon, IonBadge } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { personOutline, mailOutline, schoolOutline, calendarOutline, settingsOutline, helpCircleOutline, shieldCheckmarkOutline, logOutOutline, notificationsOutline, lockClosedOutline, documentTextOutline, createOutline, chevronForwardOutline } from 'ionicons/icons';
import BottomNav from '../components/BottomNav';
import LogoutModal from '../components/LogoutModal';

interface User {
  name: string;
  email: string;
  role: string;
  program: string;
  year: string;
  studentId: string;
}

const Account: React.FC = () => {
  const history = useHistory();
  const [user] = useState<User>({
    name: 'Katherine Guzman',
    email: 'kathewinnnn@gmail.com',
    role: 'Student Trainee',
    program: 'Bachelor of Science in Information Technology',
    year: '3rd Year',
    studentId: 'A23-00502',
  });

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const menuItems = [
    { icon: settingsOutline,       title: 'Account Settings',  subtitle: 'Manage your preferences',      badge: null, badgeColor: '' },
    { icon: notificationsOutline,  title: 'Notifications',     subtitle: 'Configure alert settings',     badge: notificationsEnabled ? 'On' : 'Off', badgeColor: notificationsEnabled ? 'success' : 'medium' },
    { icon: lockClosedOutline,     title: 'Privacy & Security',subtitle: 'Control your data',            badge: null, badgeColor: '' },
    { icon: documentTextOutline,   title: 'Terms of Service',  subtitle: 'Read our policies',            badge: null, badgeColor: '' },
    { icon: helpCircleOutline,     title: 'Help & Support',    subtitle: 'Get assistance',               badge: null, badgeColor: '' },
  ];

  const confirmLogout = () => {
    setIsLoggingOut(true);
  };

  const handleLogoutComplete = () => {
    localStorage.removeItem('isLoggedIn');
    sessionStorage.clear();
  };

  const details = [
    { icon: mailOutline,           label: 'Email Address',    value: user.email },
    { icon: schoolOutline,         label: 'Academic Program', value: user.program },
    { icon: calendarOutline,       label: 'Year Level',       value: user.year },
    { icon: shieldCheckmarkOutline,label: 'Student ID',       value: user.studentId },
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
                <div className="acc-avatar">
                  <IonIcon icon={personOutline} />
                </div>
                <button className="acc-avatar-edit"><IonIcon icon={createOutline} /></button>
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
              {/* Navigate to EditAccount page */}
              <button
                className="acc-edit-btn"
                onClick={() => history.push('/edit-account')}
              >
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
              <span className="acc-section-title">Settings & Support</span>
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
            <IonIcon icon={logOutOutline} />
            <span>Log Out</span>
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