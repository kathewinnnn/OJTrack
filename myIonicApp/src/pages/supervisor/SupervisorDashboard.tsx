import React, { useState } from 'react';
import { IonPage, IonContent, IonText, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon } from '@ionic/react';
import { peopleOutline, documentTextOutline, personOutline, timeOutline } from 'ionicons/icons';
import SupervisorBottomNav from '../../components/SupervisorBottomNav';
import './supervisor.css';

interface SupervisorDashboardProps {}

const SupervisorDashboard: React.FC<SupervisorDashboardProps> = () => {
  const [assignedTrainees] = useState<number>(25);
  const [pendingReports] = useState<number>(5);
  const [presentTrainees] = useState<number>(18);
  const [averageProgress] = useState<number>(75); // Percentage

  return (
    <IonPage>
      <IonContent fullscreen className="dashboard-content">
        <div className="dashboard-container">
          {/* Welcome Message */}
          <div className="welcome-section">
            <IonText>
              <h1 className="welcome-title">Welcome, Supervisor!</h1>
              <p className="welcome-subtitle">Here's your supervision overview</p>
            </IonText>
          </div>

          {/* Overview Statistics Cards */}
          <div className="stats-grid">
            <div className="stat-card total">
              <div className="stat-icon">
                <IonIcon icon={peopleOutline} />
              </div>
              <div className="stat-info">
                <IonText className="stat-value">{assignedTrainees}</IonText>
                <IonText className="stat-label">Total students under supervision</IonText>
              </div>
            </div>

            <div className="stat-card pending">
              <div className="stat-icon">
                <IonIcon icon={documentTextOutline} />
              </div>
              <div className="stat-info">
                <IonText className="stat-value">{pendingReports}</IonText>
                <IonText className="stat-label">Reports waiting approval</IonText>
              </div>
            </div>

            <div className="stat-card submitted">
              <div className="stat-icon">
                <IonIcon icon={personOutline} />
              </div>
              <div className="stat-info">
                <IonText className="stat-value">{presentTrainees}</IonText>
                <IonText className="stat-label">Currently logged-in trainees</IonText>
              </div>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="progress-card">
            <div className="progress-header">
              <IonText>
                <h2 className="card-title">Progress Overview</h2>
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

            <IonText className="progress-label">Average trainee progress</IonText>
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
              <p>Total active sessions: {presentTrainees}</p>
              <p>Reports submitted this week: 12</p>
            </IonText>
          </div>
        </div>
      </IonContent>

      <SupervisorBottomNav activeTab="home" />
    </IonPage>
  );
};

export default SupervisorDashboard;