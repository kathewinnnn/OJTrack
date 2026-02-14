import React from 'react';
import { IonPage, IonContent, IonText, IonButton, IonIcon, IonCard, IonCardContent } from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import { arrowBackOutline, calendarOutline, documentTextOutline, barChartOutline } from 'ionicons/icons';
import SupervisorBottomNav from '../../components/SupervisorBottomNav';
import './supervisor.css';

interface Trainee {
  id: number;
  name: string;
  course: string;
  school: string;
  status: string;
  progress: number;
  email: string;
  phone: string;
  startDate: string;
  supervisorNotes: string;
  birthday: string;
  age: number;
  address: string;
  section: string;
  profilePicture: string;
}

const TraineeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  // Mock data - in real app, fetch from API based on id
  const trainees: Trainee[] = [
    { id: 1, name: 'Katherine Guzman', course: 'BSIT', school: 'ISPSC', status: 'Active', progress: 80, email: 'kathewinnnn@gmail.com', phone: '123-456-7890', startDate: '2026-01-15', supervisorNotes: 'Excellent performance in web development tasks.', birthday: '2005-04-05', age: 20, address: 'Pilar, Abra', section: 'A', profilePicture: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Samantha Lumpaodan', course: 'BSIT', school: 'ISPSC', status: 'Active', progress: 65, email: 'samantha@gmail.com', phone: '123-456-7891', startDate: '2026-01-15', supervisorNotes: 'Needs improvement in database design.', birthday: '2005-10-06', age: 20, address: 'Sta Maria', section: 'A', profilePicture: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Raffy Romero', course: 'BSIT', school: 'ISPSC', status: 'Active', progress: 50, email: 'raffy@gmail.com', phone: '123-456-7892', startDate: '2026-01-15', supervisorNotes: 'Excellent performance in IoT tasks.', birthday: '2005-12-10', age: 20, address: 'Sta Maria', section: 'A', profilePicture: 'https://via.placeholder.com/150' },
  ];

  const trainee = trainees.find(t => t.id === parseInt(id));

  if (!trainee) {
    return (
      <IonPage>
        <IonContent>
          <div className="dashboard-container">
            <IonText>Trainee not found</IonText>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="dashboard-container">
          <div className="welcome-section"><br /><br /><br />
            <button className="back-button" onClick={() => history.goBack()}>
              <IonIcon icon={arrowBackOutline} slot="start" />
              Back
            </button>
            <IonText>
              <h1 className="welcome-title">Trainee Details</h1>
              <p className="welcome-subtitle">Detailed information about {trainee.name}</p>
            </IonText>
          </div>

          <div className="progress-card">
            <div className="progress-header">
              <IonText>
                <h2 className="card-title">Student Details</h2>
              </IonText>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
              <img src={trainee.profilePicture} alt="Profile" style={{ width: '80px', height: '80px', borderRadius: '50%', marginRight: '1rem', border: '3px solid #4f46e5' }} />
              <div>
                <h3 style={{ margin: '0', color: '#1f2937', fontSize: '1.25rem' }}>{trainee.name}</h3>
                <p style={{ margin: '0.25rem 0', color: '#6b7280' }}>{trainee.course} - {trainee.section}</p>
                <p style={{ margin: '0', color: trainee.status === 'Active' ? '#10b981' : '#6b7280' }}>{trainee.status}</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '3fr 0fr', gap: '1rem' }}>
              <div>
                <p><strong>Birthday:</strong> {trainee.birthday}</p>
                <p><strong>Age:</strong> {trainee.age} years old</p>
                <p><strong>Email:</strong> {trainee.email}</p>
                <p><strong>Contact Number:</strong> {trainee.phone}</p>
                <p><strong>School:</strong> {trainee.school}</p>
                <p><strong>Address:</strong> {trainee.address}</p>
              </div>
            </div>
          </div>

          <div className="progress-card">
            <div className="progress-header">
              <IonText>
                <h2 className="card-title">Progress Overview</h2>
              </IonText>
              <IonText className="progress-percentage">
                {trainee.progress}%
              </IonText>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-background">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${trainee.progress}%` }}
                ></div>
              </div>
            </div>
            <IonText className="progress-label">Overall training progress</IonText>
          </div>

          <div className="progress-card">
            <div className="progress-header">
              <IonText>
                <h2 className="card-title">Supervisor Actions</h2>
              </IonText>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <IonCard>
                <IonCardContent>
                  <button color="primary" className="action-button action-button-primary" onClick={() => history.push('/attendance')}>
                    <IonIcon icon={calendarOutline} />
                    <span>View Attendance</span>
                  </button>
                </IonCardContent>
              </IonCard>
              <IonCard>
                <IonCardContent>
                  <button color="secondary" className="action-button action-button-secondary" onClick={() => history.push('/supervisor-reports')}>
                    <IonIcon icon={documentTextOutline} />
                    <span>Check Reports</span>
                  </button>
                </IonCardContent>
              </IonCard>
            </div>
          </div>
        </div>
      </IonContent>
      <SupervisorBottomNav activeTab="trainees" />
    </IonPage>
  );
};

export default TraineeDetail;