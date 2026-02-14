import React, { useState } from 'react';
import { IonPage, IonContent, IonText, IonCard, IonCardContent, IonIcon, IonRow, IonCol, IonGrid, IonButton } from '@ionic/react';
import { personCircleOutline, mailOutline, callOutline, locationOutline, businessOutline, calendarOutline, settingsOutline, cameraOutline, logOutOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import SupervisorBottomNav from '../../components/SupervisorBottomNav';
import LogoutModal from '../../components/LogoutModal';
import './supervisor.css';

const Profile: React.FC = () => {
  const history = useHistory();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    history.push('/login');
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="dashboard-container">
          <div className="welcome-section">
            <IonText>
              <h1 className="welcome-title">My Profile</h1>
              <p className="welcome-subtitle">Manage your account information and preferences</p>
            </IonText>
          </div>

          {/* Profile Header Card */}
          <div className="progress-card profile-header-card">
            <div className="profile-header">
              <div className="profile-avatar-section">
                <div className="profile-avatar">
                  <IonIcon icon={personCircleOutline} />
                </div>
                <div className="profile-avatar-edit">
                  <button className="profile-edit-button">
                    <IonIcon icon={cameraOutline} />
                  </button>
                </div>
              </div><br /><br />
              <div className="profile-info">
                <h2 className="profile-name">Dr. Kath Montenegro</h2>
                <p className="profile-role">Senior IT Supervisor</p>
                <p className="profile-department">Information Technology Department</p>
                <div className="profile-status">
                  <span className="status-indicator active"></span>
                  Active Supervisor
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="progress-card">
            <div className="progress-header">
              <IonText>
                <h2 className="card-title">Personal Information</h2>
              </IonText>
            </div>
            <div className="profile-info-grid">
              <div className="info-item">
                <IonIcon icon={personCircleOutline} />
                <div>
                  <label>Full Name</label>
                  <p>Dr. Kath Montenegro</p>
                </div>
              </div>
              <div className="info-item">
                <IonIcon icon={mailOutline} />
                <div>
                  <label>Email Address</label>
                  <p>kth.mntngr@university.edu</p>
                </div>
              </div>
              <div className="info-item">
                <IonIcon icon={businessOutline} />
                <div>
                  <label>Employee ID</label>
                  <p>UIP-2024-001</p>
                </div>
              </div>
              <div className="info-item">
                <IonIcon icon={settingsOutline} />
                <div>
                  <label>Role</label>
                  <p>Senior IT Supervisor</p>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="progress-card">
            <div className="progress-header">
              <IonText>
                <h2 className="card-title">Professional Information</h2>
              </IonText>
            </div>
            <IonGrid>
              <IonRow>
                <IonCol size="6">
                  <div className="stat-item">
                    <h3>3</h3>
                    <p>Years Experience</p>
                  </div>
                </IonCol>
                <IonCol size="6">
                  <div className="stat-item">
                    <h3>25</h3>
                    <p>Trainees Supervised</p>
                  </div>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="6">
                  <div className="stat-item">
                    <h3>98%</h3>
                    <p>Success Rate</p>
                  </div>
                </IonCol>
                <IonCol size="6">
                  <div className="stat-item">
                    <h3>4.9</h3>
                    <p>Rating</p>
                  </div>
                </IonCol>
              </IonRow>
            </IonGrid>
          </div>

          {/* Account Settings */}
          <div className="progress-card">
            <div className="progress-header">
              <IonText>
                <h2 className="card-title">Account Settings</h2>
              </IonText>
            </div>
            <div className="settings-list">
              <div className="setting-item">
                <div className="setting-info">
                  <IonIcon icon={settingsOutline} />
                  <div>
                    <h4>Change Password</h4>
                    <p>Update your account password</p>
                  </div>
                </div>
                <button color="primary">Change</button>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <IonIcon icon={mailOutline} />
                  <div>
                    <h4>Notification Preferences</h4>
                    <p>Manage email and push notifications</p>
                  </div>
                </div>
                <button color="primary">Manage</button>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <IonIcon icon={settingsOutline} />
                  <div>
                    <h4>Privacy Settings</h4>
                    <p>Control your data and privacy options</p>
                  </div>
                </div>
                <button color="primary">Settings</button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="progress-card">
            <div className="progress-header">
              <IonText>
                <h2 className="card-title">Quick Actions</h2>
              </IonText>
            </div>
            <div className="quick-actions">
              <button className="action-button-primary" onClick={() => history.push('/edit-profile')}>
                <IonIcon icon={settingsOutline} slot="start" />
                Edit Profile
              </button>
              <button className="action-button-secondary">
                <IonIcon icon={settingsOutline} slot="start" />
                Export Data
              </button>
            </div>
          </div>

          {/* Logout */}
          <div className="progress-card">
            <button className="action-button-secondary logout-button" onClick={handleLogoutClick}>
              <IonIcon icon={logOutOutline} slot="start" />
              Logout
            </button>
          </div>
        </div>
      </IonContent>
      <SupervisorBottomNav activeTab="profile" />
      <LogoutModal
        isOpen={showLogoutModal}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
    </IonPage>
  );
};

export default Profile;