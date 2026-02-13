import React, { useState } from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonText, IonIcon, IonButton, IonGrid, IonRow, IonCol, IonCard, IonCardContent } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { timeOutline, documentTextOutline, cloudUploadOutline, logInOutline, logOutOutline, arrowForwardOutline, notificationsOutline, settingsOutline, logOutOutline as logOutIcon } from 'ionicons/icons';
import BottomNav from '../components/BottomNav';

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
  const history = useHistory();
  const [requiredHours] = useState<number>(320);
  const [renderedHours] = useState<number>(120);
  
  const remainingHours = requiredHours - renderedHours;
  const progressPercentage = Math.min((renderedHours / requiredHours) * 100, 100);

  const handleLogout = () => {
    history.push('/login');
  };

  return (
    <IonPage>
      <IonContent fullscreen className="dashboard-content">
        <div className="dashboard-container">
          {/* Welcome Message */}
          <div className="welcome-section">
            <IonText>
              <h1 className="welcome-title">Good Morning!</h1>
              <p className="welcome-subtitle">Here's your OJT progress overview</p>
            </IonText>
          </div>

          {/* OJT Progress Card */}
          <div className="progress-card">
            <div className="progress-header">
              <IonText>
                <h2 className="card-title">OJT Progress</h2>
              </IonText>
              <IonText className="progress-percentage">
                {progressPercentage.toFixed(1)}%
              </IonText>
            </div>
            
            {/* Progress Bar */}
            <div className="progress-bar-container">
              <div className="progress-bar-background">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Hours Stats */}
            <div className="hours-stats">
              <div className="hours-card">
                <div className="hours-icon required">
                  <IonIcon icon={timeOutline} />
                </div>
                <div className="hours-info">
                  <IonText className="hours-label">Required</IonText>
                  <IonText className="hours-value">{requiredHours} <span className="hours-unit">hrs</span></IonText>
                </div>
              </div>
              <div className="hours-card">
                <div className="hours-icon rendered">
                  <IonIcon icon={timeOutline} />
                </div>
                <div className="hours-info">
                  <IonText className="hours-label">Rendered</IonText>
                  <IonText className="hours-value">{renderedHours} <span className="hours-unit">hrs</span></IonText>
                </div>
              </div>
              <div className="hours-card">
                <div className="hours-icon remaining">
                  <IonIcon icon={timeOutline} />
                </div>
                <div className="hours-info">
                  <IonText className="hours-label">Remaining</IonText>
                  <IonText className="hours-value">{remainingHours} <span className="hours-unit">hrs</span></IonText>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="activity-card">
            <div className="section-header">
              <IonText>
                <h2 className="section-title">Recent Activity</h2>
              </IonText>
            </div>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon time-in">
                  <IonIcon icon={logInOutline} />
                </div>
                <div className="activity-info">
                  <IonText className="activity-title">Time In</IonText>
                  <IonText className="activity-time">8:00 AM - Today</IonText>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon document">
                  <IonIcon icon={documentTextOutline} />
                </div>
                <div className="activity-info">
                  <IonText className="activity-title">DTR Submitted</IonText>
                  <IonText className="activity-time">Yesterday</IonText>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon report">
                  <IonIcon icon={cloudUploadOutline} />
                </div>
                <div className="activity-info">
                  <IonText className="activity-title">Weekly Report</IonText>
                  <IonText className="activity-time">2 days ago</IonText>
                </div>
              </div>
            </div>
          </div>
        </div>
      </IonContent>

      <BottomNav activeTab="home" />
    </IonPage>
  );
};

export default Dashboard;
