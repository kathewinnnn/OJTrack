import React, { useState } from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonMenuButton, IonText, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon } from '@ionic/react';
import { peopleOutline, documentTextOutline, personOutline, timeOutline, businessOutline } from 'ionicons/icons';
import AdminSideMenu from '../../components/AdminSideMenu';
import './admin.css';

interface AdminDashboardProps {}

const AdminDashboard: React.FC<AdminDashboardProps> = () => {
  const [totalSupervisors] = useState<number>(10);
  const [totalTrainees] = useState<number>(150);
  const [activeSessions] = useState<number>(45);
  const [pendingReports] = useState<number>(12);
  const [averageProgress] = useState<number>(68); // Percentage

  return (
    <>
      <AdminSideMenu />
      <IonPage id="admin-content">
        <IonHeader>
          <IonToolbar>
            <IonMenuButton slot="start" />
            <IonTitle>Dashboard</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen className="dashboard-content">
        <div className="dashboard-container">
          {/* Welcome Message */}
          <div className="welcome-section">
            <IonText>
              <h1 className="welcome-title">Welcome, Admin!</h1>
              <p className="welcome-subtitle">Here's your system overview</p>
            </IonText>
          </div>

          {/* Overview Statistics Cards */}
          <div className="stats-grid">
            <div className="stat-card supervisors">
              <div className="stat-icon">
                <IonIcon icon={businessOutline} />
              </div>
              <div className="stat-info">
                <IonText className="stat-value">{totalSupervisors}</IonText>
                <IonText className="stat-label">Total Supervisors</IonText>
              </div>
            </div>

            <div className="stat-card trainees">
              <div className="stat-icon">
                <IonIcon icon={peopleOutline} />
              </div>
              <div className="stat-info">
                <IonText className="stat-value">{totalTrainees}</IonText>
                <IonText className="stat-label">Total Trainees</IonText>
              </div>
            </div>

            <div className="stat-card active">
              <div className="stat-icon">
                <IonIcon icon={personOutline} />
              </div>
              <div className="stat-info">
                <IonText className="stat-value">{activeSessions}</IonText>
                <IonText className="stat-label">Active Sessions</IonText>
              </div>
            </div>

            <div className="stat-card pending">
              <div className="stat-icon">
                <IonIcon icon={documentTextOutline} />
              </div>
              <div className="stat-info">
                <IonText className="stat-value">{pendingReports}</IonText>
                <IonText className="stat-label">Pending Reports</IonText>
              </div>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="progress-card">
            <div className="progress-header">
              <IonText>
                <h2 className="card-title">Overall Progress</h2>
              </IonText>
              <IonText className="progress-percentage">
                {averageProgress}%
              </IonText>
            </div>

            {/* Progress Bar */}
            <div className="progress-bar-container">
              <div className="progress-bar-background">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${averageProgress}%` }}
                ></div>
              </div>
            </div>

            <IonText className="progress-label">Average trainee progress across all supervisors</IonText>
          </div>

          {/* Quick System Summary */}
          <div className="progress-card">
            <div className="progress-header">
              <IonText>
                <h2 className="card-title" style={{marginBottom: '5px'}}>
                  <IonIcon icon={timeOutline} style={{marginRight: '5px'}} />
                  Quick System Summary
                </h2>
              </IonText>
            </div>
            <IonText>
              <p>Total active sessions: {activeSessions}</p>
              <p>Reports submitted this week: 28</p>
              <p>Supervisors logged in today: 8</p>
            </IonText>
          </div>
        </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default AdminDashboard;