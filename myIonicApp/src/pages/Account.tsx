import React, { useState } from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonText, IonIcon, IonButton, IonList, IonItem, IonLabel, IonAvatar, IonBadge } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { arrowBackOutline, personOutline, mailOutline, schoolOutline, calendarOutline, settingsOutline, helpCircleOutline, shieldCheckmarkOutline, logOutOutline, notificationsOutline, lockClosedOutline, documentTextOutline, createOutline, chevronForwardOutline } from 'ionicons/icons';
import BottomNav from '../components/BottomNav';
import LogoutModal from '../components/LogoutModal';

interface AccountProps {}

interface User {
  name: string;
  email: string;
  role: string;
  program: string;
  year: string;
  studentId: string;
  avatar?: string;
}

const Account: React.FC<AccountProps> = () => {
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
    { icon: settingsOutline, title: 'Account Settings', subtitle: 'Manage your account preferences', badge: null },
    { icon: notificationsOutline, title: 'Notifications', subtitle: 'Configure alert settings', badge: notificationsEnabled ? 'On' : 'Off', badgeColor: notificationsEnabled ? 'success' : 'medium' },
    { icon: lockClosedOutline, title: 'Privacy & Security', subtitle: 'Control your data and security', badge: null },
    { icon: documentTextOutline, title: 'Terms of Service', subtitle: 'Read our policies', badge: null },
    { icon: helpCircleOutline, title: 'Help & Support', subtitle: 'Get assistance', badge: null },
  ];

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setIsLoggingOut(true);
    // Simulate logout delay
    setTimeout(() => {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
      // Clear any stored auth data
      localStorage.removeItem('isLoggedIn');
      sessionStorage.clear();
      // Redirect to login page
      history.push('/login');
      // Replace current entry to prevent going back
      window.history.replaceState(null, '', '/login');
    }, 1000);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <IonPage>
      <IonContent fullscreen className="account-content" scrollY={!showLogoutModal}>
        <div className="account-container">
          {/* Profile Section */}
          <div className="profile-section">
            <div className="profile-cover"></div>
            <div className="profile-info">
              <div className="profile-avatar-wrapper">
                <div className="profile-avatar">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} />
                  ) : (
                    <IonIcon icon={personOutline} />
                  )}
                </div>
                <button className="edit-avatar-btn">
                  <IonIcon icon={createOutline} />
                </button>
              </div>
              <IonText className="profile-name">{user.name}</IonText>
              <IonText className="profile-role">{user.role}</IonText>
              <IonBadge className="program-badge">{user.program}</IonBadge>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="quick-stats">
            <div className="stat-item">
              <IonText className="stat-value">{user.year}</IonText>
              <IonText className="stat-label">Year Level</IonText>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <IonText className="stat-value">{user.studentId}</IonText>
              <IonText className="stat-label">Student ID</IonText>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <IonText className="stat-value">45</IonText>
              <IonText className="stat-label">Days Active</IonText>
            </div>
          </div>

          {/* User Details Card */}
          <div className="account-card">
            <div className="card-header">
              <IonText className="card-title">Profile Information</IonText>
              <button className="edit-btn">
                <IonIcon icon={createOutline} />
                <span>Edit</span>
              </button>
            </div>
            
            <div className="detail-list">
              <div className="detail-item">
                <div className="detail-icon">
                  <IonIcon icon={mailOutline} />
                </div>
                <div className="detail-content">
                  <IonText className="detail-label">Email Address</IonText>
                  <IonText className="detail-value">{user.email}</IonText>
                </div>
              </div>
              
              <div className="detail-item">
                <div className="detail-icon">
                  <IonIcon icon={schoolOutline} />
                </div>
                <div className="detail-content">
                  <IonText className="detail-label">Academic Program</IonText>
                  <IonText className="detail-value">{user.program}</IonText>
                </div>
              </div>
              
              <div className="detail-item">
                <div className="detail-icon">
                  <IonIcon icon={calendarOutline} />
                </div>
                <div className="detail-content">
                  <IonText className="detail-label">Year Level</IonText>
                  <IonText className="detail-value">{user.year}</IonText>
                </div>
              </div>
              
              <div className="detail-item">
                <div className="detail-icon">
                  <IonIcon icon={shieldCheckmarkOutline} />
                </div>
                <div className="detail-content">
                  <IonText className="detail-label">Student ID</IonText>
                  <IonText className="detail-value">{user.studentId}</IonText>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="account-card">
            <div className="card-header">
              <IonText className="card-title">Settings & Support</IonText>
            </div>
            
            <div className="menu-list">
              {menuItems.map((item, index) => (
                <button key={index} className="menu-item">
                  <div className="menu-icon-wrapper">
                    <IonIcon icon={item.icon} />
                  </div>
                  <div className="menu-content">
                    <IonText className="menu-title">{item.title}</IonText>
                    <IonText className="menu-subtitle">{item.subtitle}</IonText>
                  </div>
                  {item.badge && (
                    <IonBadge className="menu-badge" color={item.badgeColor}>{item.badge}</IonBadge>
                  )}
                  {!item.badge && (
                    <IonIcon icon={chevronForwardOutline} className="menu-arrow" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Logout Button */}
          <button className="logout-btn" onClick={handleLogout}>
            <IonIcon icon={logOutOutline} />
            <span>Log Out</span>
          </button>
        </div>
      </IonContent>
      <BottomNav activeTab="account" />

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
        isLoading={isLoggingOut}
      />
    </IonPage>
  );
};

export default Account;
